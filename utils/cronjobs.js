// utils/cronJobs.js
import cron from "node-cron"
import Transaction from "../models/transaction.model.js"
import Bundle from "../models/bundle.model.js"

export const startCronJobs = () => {

  console.log("✅ Cron jobs started")

  cron.schedule("0 * * * *", async () => {
    console.log("🕐 Running stale transaction cleanup...")

    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

      const staleTransactions = await Transaction.find({
        status: "pending",
        createdAt: { $lt: oneHourAgo }
      })

      if (staleTransactions.length === 0) {
        console.log("✅ No stale transactions found")
        return
      }

      for (const transaction of staleTransactions) {
        // Atomically mark as expired first - prevents double processingn
        const updated = await Transaction.findOneAndUpdate(
          { _id: transaction._id, status: "pending" }, // only if still pending
          { $set: { status: "expired" } },
          { new: true }
        )

        // If null, already processed - skip
        if (!updated) {
          console.log(`⚠️ Already processed: ${transaction.reference}`)
          continue
        }

        // Only decrement if reservedStock is above 0
        await Bundle.findOneAndUpdate(
          { 
            _id: transaction.bundleId,
            reservedStock: { $gt: 0 }  // guard against going negative
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

  console.log("✅ Cron jobs Ended")
}