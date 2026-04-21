import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';
import Commission from '../models/commission.model.js';
import Bundle from '../models/bundle.model.js';
import { sendTransactionReceiptEmail } from "../services/emailServices/email.service.js";
import { PAYSTACK_SECRET_KEY } from '../config/env.js';


//Very Temporal Paystack call







// Separate async function for processing and Creating Transaction in DB
export async function processWebhookEvent(event) {
    const { reference, status, channel, metadata, paid_at } = event.data;

    // Find the pending transaction
    const transaction = await Transaction.findOne({ reference });

    if (!transaction) {
        console.error('Transaction not found for reference:', reference);
        return;
    }

    // Prevent duplicate processing
    if (transaction.status === 'success' || transaction.status === 'failed') {
        console.log('Transaction already processed:', reference);
        return;
    }






    // Handle expired transactions - this means the user took too long to pay and my cronjon expired the transaction and the reservation was released, but they completed payment after. We should refund and not fulfill since reservation was released and stock may be gone.
    if (transaction.status === 'expired') {
        // ✅ ATOMIC - check and process in one operation
        const bundle = await Bundle.findOneAndUpdate(
            {
                _id: transaction.bundleId,
                // ← ATOMIC: Only if stock > reservedStock
                $expr: { $gt: [{ $subtract: ["$stock", "$reservedStock"] }, 0] }
            },
            {
                $inc: { stock: -1, totalSold: 1 }
            },
            { new: true }
        );

        if (bundle) {
            // ✅ Stock was available AND decremented atomically
            console.log(`✅ Stock available for expired transaction, processing order: ${reference}`);

            transaction.status = status;
            transaction.channel = channel;
            transaction.provider_response = {
                gateway_response: event.data.gateway_response,
                paid_at: event.data.paid_at,
                ip_address: event.data.ip_address
            };

            await transaction.save();

            // Send receipt, commission, etc.
            sendTransactionReceiptEmail({
                to: transaction.email,
                amount: transaction.amount,
                bundleName: transaction.bundleName,
                reference: reference,
                date: paid_at,
                phoneNumber: transaction.metadata.phoneNumberReceivingData,
                paymentMethod: channel,
            }).then(() => console.log('Receipt email sent')).catch(err => console.error('Failed to send receipt email (JS:60 Utils/payhelper):', err));



            if (transaction.resellerCode && transaction.metadata?.resellerProfit) {
                const commissionAmount = transaction.metadata.resellerProfit;


                try {

                    // 1. Create Commission record
                    await Commission.create({
                        reseller: transaction.metadata?.resellerId,
                        resellerName: transaction.metadata?.resellerName,
                        transaction: transaction._id,
                        bundle: transaction.bundleId,
                        amount: commissionAmount,
                        percentage: transaction.metadata?.resellerCommissionPercentage,
                        status: "earned",
                        month: new Date().toISOString().slice(0, 7) // "2025-12"
                    });

                    // 2. Update reseller's total commission (accumulative)
                    await User.findByIdAndUpdate(
                        transaction.metadata?.resellerId,
                        {
                            $inc: {
                                totalCommissionEarned: commissionAmount,
                                totalSales: 1
                            }
                        }
                    );

                    console.log(`✅ Commission: GHS ${commissionAmount} credited to ${transaction.metadata?.resellerName}`);

                } catch (error) {
                    console.error('❌ Error processing commission:', error);
                    // Don't throw - transaction already succeeded
                    // Log for manual review/reconciliation
                }
            }

            console.log('Expired transaction processed (stock available):', reference);
            return;
        }

        // ❌ Stock NOT available (findOneAndUpdate returned null)
        if (!bundle) {
            console.log(`❌ Stock unavailable for expired transaction, refunding: ${reference}`);

            try {
                const refundResponse = await fetch(
                    'https://api.paystack.co/refund',
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            transaction: reference
                        })
                    }
                );

                if (!refundResponse.ok) {
                    throw new Error(`Paystack refund API error: ${refundResponse.status}`);
                }

                const refundData = await refundResponse.json();
                console.log("✅ Refund initiated:", refundData);

                await Transaction.findOneAndUpdate(
                    { reference },
                    {
                        status: 'refunding',
                        refundReference: refundData.data.id
                    }
                );

            } catch (error) {
                console.error("❌ Refund failed:", error.message);
            }
            return; 
        }
    }





    // Handle successful charges
    if (event.event === 'charge.success') {
        transaction.status = status;
        transaction.channel = channel;
        transaction.provider_response = {
            gateway_response: event.data.gateway_response,
            paid_at: event.data.paid_at,
            ip_address: event.data.ip_address
        };

        await transaction.save();

        // ✅ Stock reservation release logic - only after payment confirmed
        await Bundle.findOneAndUpdate(
            {
                _id: transaction.bundleId,
                stock: { $gt: 0 },           // ← GUARD: stock > 0
                reservedStock: { $gt: 0 }    // ← GUARD: reservedStock > 0
            },
            {
                $inc: {
                    stock: -1,
                    reservedStock: -1,
                    totalSold: 1
                }
            }
        );

        //Fire and forget email sending - don't block main flow
        sendTransactionReceiptEmail({
            to: transaction.email,
            amount: transaction.amount,
            bundleName: transaction.bundleName,
            reference: reference,
            date: paid_at,
            phoneNumber: transaction.metadata.phoneNumberReceivingData,
            paymentMethod: channel,
        }).then(() => console.log('Receipt email sent')).catch(err => console.error('Failed to send receipt email (JS:60 Utils/payhelper):', err));


        // ✅ Commission logic - only after payment confirmed
        if (transaction.resellerCode && transaction.metadata?.resellerProfit) {
            const commissionAmount = transaction.metadata.resellerProfit;


            try {

                // 1. Create Commission record
                await Commission.create({
                    reseller: transaction.metadata?.resellerId,
                    resellerName: transaction.metadata?.resellerName,
                    transaction: transaction._id,
                    bundle: transaction.bundleId,
                    amount: commissionAmount,
                    percentage: transaction.metadata?.resellerCommissionPercentage,
                    status: "earned",
                    month: new Date().toISOString().slice(0, 7) // "2025-12"
                });

                // 2. Update reseller's total commission (accumulative)
                await User.findByIdAndUpdate(
                    transaction.metadata?.resellerId,
                    {
                        $inc: {
                            totalCommissionEarned: commissionAmount,
                            totalSales: 1
                        }
                    }
                );

                console.log(`✅ Commission: GHS ${commissionAmount} credited to ${transaction.metadata?.resellerName}`);

            } catch (error) {
                console.error('❌ Error processing commission:', error);
                // Don't throw - transaction already succeeded
                // Log for manual review/reconciliation
            }
        }

        console.log('Transaction completed successfully:', reference);
    }


    // Handle failed charges
    else if (event.event === 'charge.failed') {
        transaction.status = status;
        transaction.provider_response = {
            reason: event.data.gateway_response,
            failed_at: event.data.paid_at || new Date()
        };

        await transaction.save();

        // Just release reservation, real stock was never touched
        await Bundle.findOneAndUpdate(
            {
                _id: transaction.bundleId,
                reservedStock: { $gt: 0 }    // ← GUARD: reservedStock > 0
            },
            { $inc: { reservedStock: -1 } }
        );

        //  No stock decrement, just reservation release
        console.log('Transaction failed, reservation released:', reference)
        //  NO commission for failed payments
        console.log('Transaction failed:', reference);
    }



    //Handle Refund Completion webhook
    else if (event.event === "refund.pending" || event.event === "refund.success" || event.event === "refund.failed") {
        transaction.status = event.event;
        transaction.refundReference = event.data.reference;
        transaction.provider_response.refundCompletionResponse = {
            refundReference: event.data.reference,
            refundStatus: event.data.status,
            processedAt: event.data.processed_at
        };

        await transaction.save();
        console.log('Refund completed for transaction:', reference);
    }


    // Log other events but don't process
    else {
        console.log('Ignoring event:', event.event);
    }
}