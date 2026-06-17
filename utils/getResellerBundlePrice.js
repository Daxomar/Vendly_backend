import ResellerBundlePrice from '../models/resellerBundlePrice.model.js';
import Bundle from '../models/bundle.model.js';
import mongoose from 'mongoose';
import ReservedProduct from '../models/reservedProduct.model.js';
/**
 * Get reseller's selling price for a specific bundle
 * Returns custom price if set, otherwise returns base price (JBSP)
 */
export const getResellerBundlePrice = async (resellerId, bundleId) => {
  try {
    // Try to get custom price
    const customPrice = await ResellerBundlePrice.findOne({
      resellerId,
      bundleId,
      isActive: true
    });

    if (customPrice) {
      return {
        price: customPrice.customPrice,
        commission: customPrice.commission,
        hasCustomPrice: true
      };
    }

    // Fall back to base price (JBSP)
    const bundle = await Bundle.findById(bundleId);
    if (!bundle) {
      throw new Error('Bundle not found');
    }

    return {
      price: bundle.JBSP, // Use JBSP as base price
      commission: 0,
      hasCustomPrice: false
    };
  } catch (error) {
    console.error('Get reseller bundle price error:', error);
    throw error;
  }
};


// GET PRICES FOR MULTIPLE BUNDLES IN ONE GO - OPTIMIZED FOR CART VALIDATION
export const getResellerCartPrice = async (resellerId, cartItems) => {
  try {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, totalCommission: 0, totalJBProfit: 0 };
    }

    const bundleIds = cartItems.map(item => item.bundleId);

    // Fetch custom prices and all bundle data in parallel
    const [customPrices, bundles] = await Promise.all([
      ResellerBundlePrice.find({ resellerId, bundleId: { $in: bundleIds }, isActive: true }),
      Bundle.find({ _id: { $in: bundleIds } }).select('_id JBSP JBCP')
    ]);

    const customPriceMap = new Map(customPrices.map(cp => [cp.bundleId.toString(), cp]));
    const bundleMap = new Map(bundles.map(b => [b._id.toString(), b]));

    let subtotal = 0;
    let totalCommission = 0;
    let totalJBProfit = 0;

    for (const item of cartItems) {
      const id = item.bundleId.toString();
      const bundle = bundleMap.get(id);
      const custom = customPriceMap.get(id);

      if (!bundle) continue; // or throw, up to you

      const quantity = item.quantity;

      if (custom) {
        // Reseller has a custom price set
        subtotal       += custom.customPrice * quantity;
        totalCommission += custom.commission * quantity;
        totalJBProfit  += (bundle.JBSP - bundle.JBCP) * quantity;
      } else {
        // No custom price — fall back to base JBSP
        subtotal       += bundle.JBSP * quantity;
        totalCommission += 0;
        totalJBProfit  += (bundle.JBSP - bundle.JBCP) * quantity;
      }
    }

    return { subtotal, totalCommission, totalJBProfit };

  } catch (error) {
    console.error('Get reseller cart price error:', error);
    throw error;
  }
};



//ATOMIC FUNCTION TO RESERVE STOCK FOR CART ITEMS - USED IN PAYMENT CONTROLLER
// export const reserveCartStock = async (cartItems) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
 
//   try {

//     if (!Array.isArray(cartItems) || cartItems.length === 0) {
//       throw new Error('Invalid cart items');
//     }

//     cartItems.forEach(item => {
//       if (!item.bundleId || !item.quantity || item.quantity <= 0) {
//         throw new Error('Invalid cart item structure');
//       }
//     });

//     const reservedBundles = [];
 
//     // Try to reserve stock for each item
//     for (const item of cartItems) {
//       const { bundleId, quantity, name } = item;
 
//       const bundle = await Bundle.findOneAndUpdate(
//         {
//           _id: bundleId,
//           isActive: true,
//           $expr: { $gte: [{ $subtract: ["$stock", "$reservedStock"] }, quantity] }
//         },
//         { $inc: { reservedStock: quantity } },
//         { new: true, session } // ✅ Use session for transaction
//       );
 
//       if (!bundle) {
//         // Stock unavailable - rollback entire transaction
//         throw {
//           status: 400,
//           message: `${name} is out of stock or unavailableeeee`,
//           bundleId,
//           quantity
//         };
//       }
 
//       reservedBundles.push({
//         bundleId: bundle._id,
//         bundleName: bundle.name,
//         quantity,
//         network: bundle.network
//       });
//     }
 
//     // All items reserved successfully - commit transaction
//     await session.commitTransaction();
 
//     return {
//       success: true,
//       reservedBundles,
//       message: 'All items reserved successfully'
//     };
//   } catch (error) {
//     // Any error occurred - rollback entire transaction
//     await session.abortTransaction();
    
//     console.error('Reserve cart stock error:', error);
 
//     throw {
//       status: error.status || 400,
//       message: error.message || 'Failed to reserve stock',
//       bundleId: error.bundleId,
//       quantity: error.quantity
//     };
//   } finally {
//     await session.endSession();
//   }
// };

export const reserveCartStock = async (cartItems) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Invalid cart items');
    }

    cartItems.forEach(item => {
      if (!item.bundleId || !item.quantity || item.quantity <= 0) {
        throw new Error('Invalid cart item structure');
      }
    });

    // ✅ First, check all bundles have enough stock
    const bundleIds = cartItems.map(item => new mongoose.Types.ObjectId(item.bundleId));
    const bundles = await Bundle.find(
      { _id: { $in: bundleIds }, isActive: true },
      { _id: 1, name: 1, stock: 1, reservedStock: 1, network: 1 },
      { session }
    );

    // Validate all bundles exist and have stock
    const failedItems = [];
    for (const item of cartItems) {
      const bundle = bundles.find(b => b._id.toString() === item.bundleId.toString());
      
      if (!bundle) {
        failedItems.push({
          name: item.name,
          bundleId: item.bundleId,
          reason: 'not found or inactive'
        });
      } else if ((bundle.stock - bundle.reservedStock) < item.quantity) {
        failedItems.push({
          name: bundle.name,
          bundleId: item.bundleId,
          requested: item.quantity,
          available: bundle.stock - bundle.reservedStock,
          reason: 'out of stock'
        });
      }
    }

    if (failedItems.length > 0) {
      const error = new Error(failedItems[0].name + ' is out of stock or unavailable');
      error.status = 400;
      error.failedItems = failedItems;
      throw error;
    }

    // ✅ Update all bundles at once with updateMany
    const bulkOps = cartItems.map(item => ({
      updateOne: {
        filter: {
          _id: new mongoose.Types.ObjectId(item.bundleId),
          isActive: true
        },
        update: { $inc: { reservedStock: item.quantity } }
      }
    }));

    const result = await Bundle.bulkWrite(bulkOps, { session });

    if (result.modifiedCount !== cartItems.length) {
      throw new Error('Failed to reserve some items');
    }

    // Fetch final state
     const products = cartItems.map(item => {
      const bundle = bundles.find(b => b._id.toString() === item.bundleId.toString());
      return {
        bundleId: bundle._id,
        bundleName: bundle.name,
        quantity: item.quantity
      };
    });

    // ✅ Create ReservedProduct document
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    const reservedProduct = await ReservedProduct.create(
      [{
        status: 'reserved',
        products,
        expiresAt,
        reservedAt: new Date()
      }],
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      reservedProductId: reservedProduct[0]._id,
      reservedProducts: products,
      expiresAt,
      message: 'All items reserved successfully'
    };


  } catch (error) {
    await session.abortTransaction();
    console.error('Reserve cart stock error:', error);

    throw {
      status: error.status || 400,
      message: error.message || 'Failed to reserve stock',
      failedItems: error.failedItems || undefined
    };
  } finally {
    await session.endSession();
  }
};


// Function to release reserved stock - used when payment fails or expires
export const releaseReservedStock = async (reservedBundles) => {
  const session = await mongoose.startSession();
  session.startTransaction();
 
  try {
    if (!reservedBundles || reservedBundles.length === 0) {
      return { success: true, message: 'No bundles to release' };
    }
 
    for (const { bundleId, quantity } of reservedBundles) {
      await Bundle.findByIdAndUpdate(
        bundleId,
        { $inc: { reservedStock: -quantity } },
        { session }
      );
    }
 
    await session.commitTransaction();
 
    return {
      success: true,
      message: 'Stock released successfully',
      count: reservedBundles.length
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Release reserved stock error:', error);
    throw error;
  } finally {
    await session.endSession();
  }
};