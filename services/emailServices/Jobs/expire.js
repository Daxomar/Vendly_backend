// utils/cronJobs.js
import cron from "node-cron"
import Transaction from "../../../models/transaction.model.js"
import Bundle from "../../../models/bundle.model.js"

// export const expireTransactions = () => {

//   console.log("✅ Cron jobs started")

//   cron.schedule("0 * * * *", async () => {
//     console.log("🕐 Running stale transaction cleanup...")

//     try {
//       const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

//       const staleTransactions = await Transaction.find({
//         status: "pending",
//         createdAt: { $lt: oneHourAgo }
//       })

//       if (staleTransactions.length === 0) {
//         console.log("✅ No stale transactions found")
//         return
//       }

//       for (const transaction of staleTransactions) {
//         // Atomically mark as expired first - prevents double processingn
//         const updated = await Transaction.findOneAndUpdate(
//           { _id: transaction._id, status: "pending" }, // only if still pending
//           { $set: { status: "expired" } },
//           { new: true }
//         )

//         // If null, already processed - skip
//         if (!updated) {
//           console.log(`⚠️ Already processed: ${transaction.reference}`)
//           continue
//         }

//         // Only decrement if reservedStock is above 0
//         await Bundle.findOneAndUpdate(
//           { 
//             _id: transaction.bundleId,
//             reservedStock: { $gt: 0 }  // guard against going negative
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

//   console.log("✅ Cron jobs Ended")
// }






// 1 minute for testing
export const expireTransactions = () => {

  console.log("✅ Cron (1 min) started")

  cron.schedule("* * * * *", async () => {
    console.log("🕐 Running stale transaction cleanup (1 min)...")

    try {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000)

      const staleTransactions = await Transaction.find({
        status: "pending",
        createdAt: { $lt: oneMinuteAgo }
      })

      if (staleTransactions.length === 0) {
        console.log("✅ No stale transactions found")
        return
      }

      for (const transaction of staleTransactions) {
        const updated = await Transaction.findOneAndUpdate(
          { _id: transaction._id, status: "pending" },
          { $set: { status: "expired" } },
          { new: true }
        )

        if (!updated) {
          console.log(`⚠️ Already processed: ${transaction.reference}`)
          continue
        }

        await Bundle.findOneAndUpdate(
          {
            _id: transaction.bundleId,
            reservedStock: { $gt: 0 }
          },
          { $inc: { reservedStock: -1 } }
        )

        console.log(`🔓 Released reservation for: ${transaction.reference}`)
      }

      console.log(`✅ Cleaned up ${staleTransactions.length} stale transactions`)

    } catch (error) {
      console.error("❌ Cron job error:", error)
    }
  })

  console.log("✅ Cron (1 min) registered")
}








// 1 hour, my current standard for expiration
// export const expireTransactions = () => {

//   console.log("✅ Cron (1 hour) started")

//   cron.schedule("0 * * * *", async () => {
//     console.log("🕐 Running stale transaction cleanup (1 hour)...")

//     try {
//       const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

//       const staleTransactions = await Transaction.find({
//         status: "pending",
//         createdAt: { $lt: oneHourAgo }
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

//   console.log("✅ Cron (1 hour) registered")
// }