import logs from '../models/logs.model.js';


//WORKING
export const logPaymentError = async (
  transaction,
  
) => {
  const dateTime = new Date().toISOString();
  const logItem = `${dateTime}\t${transaction.reference}\t⚠️⚠️⚠️Payment Error Logged`;
  
  console.log(logItem);

  try {
    await logs.create({
      transactionId: transaction._id,
      reference: transaction.reference,
      message : "Partial Payment Success, but DB Sync Failed",
      error: "Payment Error",
      level : "critical",
      source :"paystackWebhook",
      paymentStatus: "verified",
      paymentAmount: transaction.amount,
      timestamp: new Date(),
    });



  } catch (err) {
    console.error('Error logging payment error:', err);
  }
};