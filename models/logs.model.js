import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
        index: true,
    },
    reference: {
        type: String,
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: true,
    },
    error: {
        type: String,
        required: true,
    },

    level: {
        type: String,
        enum: ['info', 'warning', 'error', 'critical'],
        default: 'error',
        index: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'verified', 'failed', 'partial_success', 'db_sync_failed'],
    },
    paymentAmount: {
        type: Number,
    },
    source: {
        type: String,
        default: 'unknown',
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Logs = mongoose.model('Logs', LogSchema);

export default Logs;

