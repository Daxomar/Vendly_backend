import Transaction from '../models/transaction.model.js';
import BulkExport from '../models/bulkexport.model.js';


/**
 * Webhook handler for Bossu order status updates
 * Called when a bundle order is completed, failed, or cancelled
 * 
 * Expected payload from Bossu:
 * {
 *   "reference": "ORDER_1777865972_4734",
 *   "status": "completed" | "failed" | "cancelled",
 *   "amount": 4.25,
 *   "network": "mtn",
 *   "recipientPhone": "0548477514",
 *   "packageName": "1GB",
 *   "timestamp": "2026-05-04 03:39:35"
 * }
 * 
 */


export const bossuWebhookHandler = async (req, res) => {
  try {
    console.log('📩 Bossu webhook received:', req);
    console.log('📩 Bossu webhook receiveddddd:', req.body);
    const { event, data } = req.body;

    if (!data || !data.reference || !data.status) {
      console.warn('⚠️ Bossu webhook missing required fields:', req.body);
      return res.status(400).json({ success: false, error: 'Missing data, reference or status' });
    }

    console.log(`📩 Bossu webhook received [${event}]: ${data.reference} - Status: ${data.status}`);

    switch (data.status.toLowerCase()) {
      case 'completed':
        return handleOrderCompleted(data, req, res);
      case 'failed':
        return handleOrderFailed(data, req, res);
      case 'cancelled':
        return handleOrderCancelled(data, req, res);
      default:
        console.warn(`⚠️ Unknown status from Bossu: ${data.status}`);
        return res.status(200).json({ received: true, warning: `Unknown status: ${data.status}` });
    }
  } catch (error) {
    console.error('❌ Error in Bossu webhook handler:', error);
    return res.status(200).json({ received: true, error: error.message });
  }
};


async function handleOrderCompleted(data, req, res) {
  const { reference, status, network, package_name, recipient_phone, price } = data;

  try {
    const transaction = await Transaction.findOne({ reference });

    if (!transaction) {
      console.warn(`⚠️ No transaction found for Bossu order: ${reference}`);
      return res.status(200).json({
        received: true,
        message: 'Order completed but no matching transaction found'
      });
    }

    await Transaction.updateOne(
      { _id: transaction._id },
      {
        $set: {
          deliveryStatus: "delivered",
          deliveredAt: new Date()
        }
      }
    );

    if (transaction.exportId) {
      await BulkExport.updateOne(
        { _id: transaction.exportId },
        { $inc: { webhooksReceived: 1 } }
      );
    }

    console.log(`✅ Order completed: ${reference} - Transaction ${transaction._id} marked delivered`);

   console.log(`trasactionnnn:`, transaction)

    return res.status(200).json({
      success: true,
      message: 'Order marked as delivered',
      transactionId: transaction._id,
      reference
    });

  } catch (error) {
    console.error(`❌ Error handling completed order ${reference}:`, error);
    return res.status(200).json({ received: true, error: error.message });
  }
}



/**
 * Handle failed order
 * Mark transaction for retry (reset to pending)
 */
async function handleOrderFailed(data, req, res) {
  const { reference } = data;
  try {
    const transaction = await Transaction.findOne({
      reference: reference
    });

    if (!transaction) {
      console.warn(`⚠️ No transaction found for failed Bossu order: ${reference}`);
      return res.status(200).json({
        received: true,
        message: 'Failed order but no matching transaction found'
      });
    }

    // Reset to pending so next cron cycle can retry
    await Transaction.updateOne(
      { _id: transaction._id },
      {
        deliveryStatus: 'pending',
        bossuStatus: 'failed',
        bossuOrderId: null, // Clear so next attempt gets a new order
        deliveryError: 'Bossu order failed - will retry',
        deliveryAttemptedAt: null
      }
    );



    console.log(`⚠️ Order failed: ${reference} - Transaction ${transaction._id} reset to pending for retry`);

    return res.status(200).json({
      success: true,
      message: 'Failed order marked for retry',
      transactionId: transaction._id,
      reference: reference
    });

  } catch (error) {
    console.error(`❌ Error handling failed order ${reference}:`, error);
    res.status(200).json({
      received: true,
      error: error.message
    });
  }
}

/**
 * Handle cancelled order
 * Similar to failed - mark for retry
 */
async function handleOrderCancelled(data, req, res) {
  const { reference } = data;
  try {
    const transaction = await Transaction.findOne({
      bossuOrderId: reference
    });

    if (!transaction) {
      console.warn(`⚠️ No transaction found for cancelled Bossu order: ${reference}`);
      return res.status(200).json({
        received: true,
        message: 'Cancelled order but no matching transaction found'
      });
    }

    // Reset to pending for retry
    await Transaction.updateOne(
      { _id: transaction._id },
      {
        deliveryStatus: 'pending',
        bossuStatus: 'cancelled',
        bossuOrderId: null,
        deliveryError: 'Bossu order cancelled - will retry',
        deliveryAttemptedAt: null
      }
    );

    console.log(`⚠️ Order cancelled: ${reference} - Transaction ${transaction._id} reset to pending for retry`);

    return res.status(200).json({
      success: true,
      message: 'Cancelled order marked for retry',
      transactionId: transaction._id,
      reference: reference
    });

  } catch (error) {
    console.error(`❌ Error handling cancelled order ${reference}:`, error);
    res.status(200).json({
      received: true,
      error: error.message
    });
  }
}

/**
 * OPTIONAL: Webhook verification endpoint (for testing)
 * GET /webhook/bossu/verify - returns 200 if webhook is working
 */
export const bossuWebhookVerify = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bossu webhook endpoint is active',
    timestamp: new Date()
  });
};