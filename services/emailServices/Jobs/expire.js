import cron from 'node-cron';
import Transaction from '../../../models/transaction.model.js';
import ReservedProduct from '../../../models/reservedProduct.model.js';
import Bundle from '../../../models/bundle.model.js';

// 1 minute for testing
export const expireTransactions = () => {

  console.log("✅ Cron (1 min) started")

  cron.schedule("* * * * *", async () => {
    console.log("🕐 Running stale transaction cleanup (1 min)...")

    try {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000)

      // Find pending transactions that have expired
      const staleTransactions = await Transaction.find({
        status: "pending",
        createdAt: { $lt: oneMinuteAgo }
      })

      if (staleTransactions.length === 0) {
        console.log("✅ No stale transactions found")
        return
      }

      for (const transaction of staleTransactions) {
        // Update transaction status to expired
        const updatedTransaction = await Transaction.findOneAndUpdate(
          { _id: transaction._id, status: "pending" },
          { $set: { status: "expired" } },
          { new: true }
        )

        if (!updatedTransaction) {
          console.log(`⚠️ Already processed: ${transaction.reference}`)
          continue
        }

        // Get the associated reservation
        const reservation = await ReservedProduct.findById(transaction.reservedProductsId)

        if (reservation && reservation.status === 'reserved') {
          // Release stock for all reserved products
          const reservedBundles = reservation.products.map(product => ({
            bundleObjectId: product.bundleId,
            quantity: product.quantity
          }))

          await Promise.all(
            reservedBundles.map(({ bundleObjectId, quantity }) =>
              Bundle.findByIdAndUpdate(
                bundleObjectId,
                { $inc: { reservedStock: -quantity } }
              )
            )
          )

          // Mark reservation as expired
          await ReservedProduct.findByIdAndUpdate(
            reservation._id,
            { 
              status: 'expired',
              releasedAt: new Date()
            }
          )

          console.log(`🔓 Released reservation for: ${transaction.reference}`)
        }
      }

      console.log(`✅ Cleaned up ${staleTransactions.length} stale transactions`)

    } catch (error) {
      console.error("❌ Cron job error:", error)
    }
  })

  console.log("✅ Cron (1 min) registered")
}




// 1 minute for testing
// export const expireTransactions = () => {

//   console.log("✅ Cron (1 min) started")

//   cron.schedule("* * * * *", async () => {
//     console.log("🕐 Running stale transaction cleanup (1 min)...")

//     try {
//       const oneMinuteAgo = new Date(Date.now() - 60 * 1000)

//       const staleTransactions = await Transaction.find({
//         status: "pending",
//         createdAt: { $lt: oneMinuteAgo }
//       })

//       if (staleTransactions.length === 0) {
//         console.log("✅ No stale transactions found")
//         return
//       }

//       for (const transaction of staleTransactions) {
//         const updated = await Transaction.findOneAndUpdate(
//           { _id: transaction._id, status: "pending" },
//           { $set: { status: "expired" } },
//           { new: true }
//         )

//         if (!updated) {
//           console.log(`⚠️ Already processed: ${transaction.reference}`)
//           continue
//         }

//         await Bundle.findOneAndUpdate(
//           {
//             _id: transaction.bundleId,
//             reservedStock: { $gt: 0 }
//           },
//           { $inc: { reservedStock: -1 } }
//         )

//         console.log(`🔓 Released reservation for: ${transaction.reference}`)
//       }

//       console.log(`✅ Cleaned up ${staleTransactions.length} stale transactions`)

//     } catch (error) {
//       console.error("❌ Cron job error:", error)
//     }
//   })

//   console.log("✅ Cron (1 min) registered")
// }






