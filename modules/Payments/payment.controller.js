import axios from 'axios';
import { createHmac } from 'crypto';
import User from '../../models/user.model.js';
import Bundle from '../../models/bundle.model.js'
import Transaction from '../../models/transaction.model.js';
import ReservedProduct from '../../models/reservedProduct.model.js';
// import { PAYSTACK_SECRET_KEY} from "../config/env.js";
import { processWebhookEvent } from '../../utils/paymentHelper.js';
import { getResellerBundlePrice, getResellerCartPrice, reserveCartStock } from '../../utils/getResellerBundlePrice.js'
import { PAYSTACK_SECRET_KEY } from '../../config/env.js';
import { processPaymentWebhookEvent, processRefundWebhookEvent } from './payment.service.js';
import { logWebhookError } from '../../utils/logError.js';

//CHANGE THIS TO YOUR ACTUAL PAYSTACK SECRET KEY IN PRODUCTION


if (!PAYSTACK_SECRET_KEY) {
  // Fail fast so developers know to set the env var
  throw new Error('PAYSTACK_SECRET_KEY environment variable is required');
}


// Constants
const PAYSTACK_CHARGE_PERCENTAGE = 0.03; // 3%



const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Utility to create a simple unique reference (can be replaced with UUID)
function makeReference(prefix = 'ref') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}





const SYSTEM_RESELLER_CODE = process.env.SYSTEM_RESELLER_CODE; // Example system reseller code

// export async function initializePayment(req, res) {

//     let bundle = null; // Declare here to use in catch block if needed for reservation release

//     try {
//         console.log("Payment Initialzation called")

//         //I will use req.params later when i have a frontend to pass reseller code
//         // const {resellerCode} = req.params

//         const { email, bundleId, phoneNumberReceivingData, resellerCode, callback_url } = req.body || {};


//         console.log("Received bundleID:", bundleId);

//         if (!email || !bundleId || !phoneNumberReceivingData) {
//             return res.status(400).json({
//                 status: false,
//                 message: "email, bundleId and Phone Number receiving data are required"
//             });
//         }

//         // 1. Fetch bundle details from DB
//         bundle = await Bundle.findOneAndUpdate(
//             {

//                 Bundle_id: bundleId,
//                 isActive: true,
//                 $expr: { $gt: [{ $subtract: ["$stock", "$reservedStock"] }, 0] } // availableStock > 0
//             },
//             { $inc: { reservedStock: 1 } }, // reserve atomically
//             { new: true }
//         )

//         console.log("Bundle fetched and stock reserved:", bundle);

//         if (!bundle) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Bundle is out of stock or unavailable"
//             })
//         }



//         let reseller = null;



//         if (resellerCode && resellerCode === SYSTEM_RESELLER_CODE) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'MotherFucker you cannot use the system reseller code here directly via the URL be smarter'
//             });
//         }

//         // Now the FallBack happens when i want it to
//         const codeToUse = resellerCode || SYSTEM_RESELLER_CODE;


//         // Find reseller by code



//         reseller = await User.findOne({
//             resellerCode: codeToUse,
//             role: 'user',
//         });



//         if (!reseller) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Reseller not found, invalid reseller code"
//             })
//         }



//         //RSBP -- ResellerBundlePrice
//         const RSBP = await getResellerBundlePrice(reseller._id, bundle._id)   // me picking up the actual reseller._id = "6322344..." and actual bundle id too as well bundle._id = "66663344..."



//         //Commission Calculation Based on Reseller Rate
//         //    const commissionAmount = bundle.JBSP * (reseller?.commissionRate || 0) / 100;
//         const commissionAmount = RSBP.commission;

//         const finalAmount = bundle.JBSP + commissionAmount + ((bundle.JBSP + commissionAmount) * PAYSTACK_CHARGE_PERCENTAGE);

//         console.log("Commission Amount:", commissionAmount);
//         console.log("Final Amount to charge customer:", finalAmount);


//         //JB Profit Calculation 
//         const JBProfit = bundle.JBSP - bundle.JBCP;
//         console.log("JoyBundle Profit on this sale:", JBProfit);




//         // 2. Build metadata (so I know exactly what bundle they bought)
//         const metadata = {
//             //bundle
//             bundleId: bundle.Bundle_id,
//             bundleName: bundle.name,
//             bundleData: bundle.Data,
//             network: bundle.network,
//             price: finalAmount,

//             ///delivery
//             phoneNumberReceivingData: phoneNumberReceivingData,

//             //reseller
//             resellerCode: codeToUse || null,
//             resellerId: reseller?._id?.toString() || null,
//             resellerName: reseller?.name || null,
//             resellerCommissionPercentage: reseller?.commissionRate || null,
//             resellerProfit: commissionAmount || null
//         };


//         console.log(metadata)


//         //making the reference more unique by adding JBpay
//         const reference = makeReference("JBpay")

//         const transaction = await Transaction.create({
//             email,
//             bundleId: bundle._id,
//             bundleIdName: bundle.Bundle_id,
//             bundleName: bundle.name,
//             JBCP: bundle.JBCP,
//             resellerCode: codeToUse || null,
//             baseCost: bundle.JBSP,
//             amount: finalAmount,
//             JBProfit: JBProfit,
//             currency: 'GHS',
//             reference,
//             status: 'pending',
//             metadata: metadata,
//         })


//         // 3. Convert price into minor currency unit (GHS → pesewas)
//         const amountInPesewas = Math.round(Number(finalAmount) * 100);

//         // 4. Prepare Paystack payload
//         const payload = {
//             email,
//             amount: amountInPesewas,
//             currency: "GHS",
//             metadata,
//             transactionId: transaction._id.toString(),
//             reference: reference
//         };



//         //This automatically appends the reference to the callback url paystack does that naturally for us haha 
//         if (callback_url) payload.callback_url = callback_url;

//         // 5. Initialize payment via Paystack
//         const { data } = await paystack.post('/transaction/initialize', payload);

//         return res.status(200).json({
//             status: true,
//             message: "Payment initialized",
//             data,


//         });

//     } catch (err) {

//         // Release reservation if we reserved but something failed after
//         if (bundle) {
//             await Bundle.findByIdAndUpdate(
//                 bundle._id,
//                 { $inc: { reservedStock: -1 } }
//             )
//         }


//         console.error(err);
//         const status = err.response?.status || 500;
//         const data = err.response?.data || { status: false, message: err.message };
//         return res.status(status).json(data);
//     }
// }


export async function validateCartPrices(req, res) {
  try {
    console.log("Cart Price Validation called")

    const { cartItems, resellerCode } = req.body || {};

    // 1. Basic validation
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "cartItems are required"
      });
    }

    // 2. Reseller lookup
    if (resellerCode && resellerCode === SYSTEM_RESELLER_CODE) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reseller code'
      });
    }

    const codeToUse = resellerCode || SYSTEM_RESELLER_CODE;

    const reseller = await User.findOne({
      resellerCode: codeToUse,
      role: 'user',
    });

    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: "Reseller not found, invalid reseller code"
      });
    }


    // 3. Loop through cartItems and fetch fresh prices
    const updatedItems = [];
    let pricesChanged = false;

    for (const item of cartItems) {
      const { bundleId, quantity, price } = item;

      if (!bundleId || !quantity) {
        return res.status(400).json({
          success: false,
          message: "bundleId and quantity are required for each cart item"
        });
      }

      const bundle = await Bundle.findById(bundleId);

      if (!bundle || !bundle.isActive) {
        return res.status(400).json({
          success: false,
          message: `Bundle ${bundleId} is unavailable`
        });
      }

      const RSBP = await getResellerBundlePrice(reseller._id, bundle._id);

      if (price !== RSBP.price) {
        pricesChanged = true;
      }

      updatedItems.push({
        bundleId,
        freshPrice: RSBP.price,
      });
    }

    return res.status(200).json({
      success: true,
      pricesChanged,
      updatedItems,
    });

  } catch (err) {
    console.error(err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { success: false, message: err.message };
    return res.status(status).json(data);
  }
}













export async function initializeCartPayment(req, res) {

  let reservationId = null;

  // Utility function to release all reserved stock in case of any failure during the process
  const releaseReservedStock = async () => {
    if (reservationId) {
      // Fetch the reserved products from DB
      const reservation = await ReservedProduct.findById(reservationId);

      if (reservation && reservation.products.length > 0) {
        const reservedProducts  = reservation.products.map(product => ({
          bundleObjectId: product.bundleId,
          quantity: product.quantity
        }));

        await Promise.all(
          reservedProducts.map(({ bundleObjectId, quantity }) =>
            Bundle.findByIdAndUpdate(
              bundleObjectId,
              { $inc: { reservedStock: -quantity } }
            )
          )
        );

        // Mark as released in DB
        await ReservedProduct.findByIdAndUpdate(
          reservationId,
          { status: 'released', releasedAt: new Date() }
        );
      }
    }
  };

  try {
    console.log("Cart Payment Initialization called");

    const { email, cartItems, deliveryDetails, shippingMethod, resellerCode, callback_url, grandTotal } = req.body || {};

    // 1. Basic validation
    if (!email || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "email and cartItems are required"
      });
    }

    if (!deliveryDetails || !shippingMethod) {
      return res.status(400).json({
        success: false,
        message: "deliveryDetails and shippingMethod are required"
      });
    }

    // 2. Reseller lookup
    if (resellerCode && resellerCode === SYSTEM_RESELLER_CODE) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reseller code'
      });
    }

    const codeToUse = resellerCode || SYSTEM_RESELLER_CODE;

    const reseller = await User.findOne({
      resellerCode: codeToUse,
      role: 'user',
    });

    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: "Reseller not found, invalid reseller code"
      });
    }


    const { subtotal: subtotal_from_getResellerCartPrice, totalCommission: totalCommission_from_getResellerCartPrice, totalJBProfit: totalJBProfit_from_getResellerCartPrice } = await getResellerCartPrice(reseller._id, cartItems);
    const { success, message, reservedProducts, reservedProductId} = await reserveCartStock(cartItems);

    // 5. Price verification
    const shippingCost = shippingMethod.price || 0;
    const paystackCharge = (subtotal_from_getResellerCartPrice + shippingCost) * PAYSTACK_CHARGE_PERCENTAGE;
    const calculatedGrandTotal = subtotal_from_getResellerCartPrice + shippingCost + paystackCharge;
    

    const TOLERANCE = 0.01;
    if (Math.abs(calculatedGrandTotal - grandTotal) > TOLERANCE) {
      await releaseReservedStock();
      return res.status(400).json({
        success: false,
        message: "Grand total mismatch, please refresh and try again",
        debug: {
          calculatedGrandTotal,
          frontendGrandTotal: grandTotal,
        }
      });
    }

    // 6. Build reference and create transaction
    const reference = makeReference("VendPay");
    const transaction = await Transaction.create({
      email,
      cartItems: reservedProducts ,
      reservedProductsId,
      deliveryDetails,
      shippingMethod,
      resellerCode: codeToUse,
      subtotal: subtotal_from_getResellerCartPrice,
      paystackCharge,
      amount: calculatedGrandTotal,
      currency: 'GHS',
      reference,
      status: 'pending',
      metadata: {
        resellerId: reseller._id.toString(),
        resellerName: reseller.name,
        resellerCode: codeToUse,
        resellerProfit : totalCommission_from_getResellerCartPrice,
        subtotal:subtotal_from_getResellerCartPrice,
        paystackCharge,
        grandTotal: calculatedGrandTotal,
        JBProfit: totalJBProfit_from_getResellerCartPrice,
      }
    });

    // 7. Initialize payment via Paystack
    const amountInPesewas = Math.round(calculatedGrandTotal * 100);
    const payload = {
      email,
      amount: amountInPesewas,
      currency: "GHS",
      metadata: transaction.metadata,
      transactionId: transaction._id.toString(),
      reference,
    };

    if (callback_url) payload.callback_url = callback_url;
    const { data } = await paystack.post('/transaction/initialize', payload);

    return res.status(200).json({
      status: true,
      message: "Payment initialized",
      data,
    });

  } catch (err) {
    await releaseReservedStock();
    console.error(err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { success: false, message: err.message };
    return res.status(status).json(data);
  }
}





/*
    Controller: verifyPayment
    Query or params: reference (string)
    Example: GET /verify?reference=xxxxx or GET /verify/:reference
*/
export async function verifyPayment(req, res) {
  try {
    const reference = (req.query.reference || req.params.reference || (req.body && req.body.reference));
    if (!reference) {
      return res.status(400).json({ status: false, message: 'reference is required' });
    }

    const { data } = await paystack.get(`/transaction/verify/${encodeURIComponent(reference)}`);
    console.log("✅Verification Successful")
    // data contains status, message, data (transaction object)
    return res.status(200).json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { status: false, message: err.message };
    return res.status(status).json(data);
  }
}











export async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-paystack-signature'];
    if (!signature) {
      return res.status(400).send('Missing signature');
    }

    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const computed = createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');




    if (computed !== signature) {
      return res.status(401).send('Invalid signature');
    }

    // At this point the payload is verified. You can handle events like charge.success
    const event = req.body;
    // Minimal example: log and return 200
    // TODO: replace with your business logic (update DB, fulfill order, etc.)
    console.log('✅Paystack webhook received:', event.event, event.data?.reference);
    console.log('Noiseeeee:', event);



    res.status(200).json({ status: true });



    // Route to appropriate handler based on event type
    if (event.event === 'charge.success' || event.event === 'charge.failed') {
      console.log('✅Paystack 200 response sent back for payment');
      processPaymentWebhookEvent(event).catch(err => {
        logWebhookError(event, err);
      });
    }
    else if (event.event === 'refund.pending' || event.event === 'refund.processed' || event.event === 'refund.failed') {
      console.log('✅Paystack 200 response sent back for refund');
      processRefundWebhookEvent(event).catch(err => {
        logWebhookError(event, err);
      });
    }
    else {
      console.log('Ignoring event:', event.event);
    }

  } catch (err) {
    console.error('Webhook handler error', err);
    return res.status(500).json({ status: false, message: 'server error' });
  }
}









