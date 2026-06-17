// ============================================
// RESERVED STOCK MODEL
// ============================================
// File: models/ReservedStock.js
//
// Tracks stock reserved during checkout
// Items in cart = NO reservation (available for others)
// Items in checkout = reserved for 15 minutes
// Auto-cleanup via cron after 15 minutes
 
import mongoose from 'mongoose';
 
const CheckoutItemSchema = new mongoose.Schema({
  _id: false,
  bundleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bundle',
    required: true
  },
  Bundle_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});
 
const reservedStockSchema = new mongoose.Schema(
  {
    // Unique checkout session identifier
    checkoutSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
 
    // User info (optional - for logged in users later)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
 
    // ALL items in this checkout
    items: {
      type: [CheckoutItemSchema],
      required: true,
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'Checkout must have at least one item'
      }
    },
 
    // Total amount for entire checkout
    totalAmount: {
      type: Number,
      required: true
    },
 
    // Checkout expiry
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
 
    // Status: active, expired, completed, cancelled
    status: {
      type: String,
      enum: ['active', 'expired', 'completed', 'cancelled'],
      default: 'active',
      index: true
    },
 
    // If completed (order placed), reference the order
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
 
    // Metadata
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);
 
// ============================================
// INDEXES
// ============================================
 
reservedStockSchema.index({ checkoutSessionId: 1, status: 1 });
reservedStockSchema.index({ expiresAt: 1, status: 1 });
reservedStockSchema.index({ userId: 1, status: 1 });
 