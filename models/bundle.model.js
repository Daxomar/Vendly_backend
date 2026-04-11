import mongoose from 'mongoose';

const bundleSchema = new mongoose.Schema(
  {
    // ── Identification ──────────────────────────────
    Bundle_id: { type: String, required: true, unique: true }, // JB-MTN-001
    name: { type: String, required: true },               // Amazing Bundle

    // ── Network & Data ──────────────────────────────
    network: { type: String, required: true }, // MTN, Vodafone, AirtelTigo
    Data: { type: String },                 // 1GB, 5GB
    size: { type: String },                 // 1GB, 5GB
    Duration: { type: String },                 // non-expiry

    // ── Pricing ─────────────────────────────────────
    JBCP: { type: Number, required: true }, // cost price  e.g. 20
    JBSP: { type: Number, required: true }, // selling price e.g. 30
    discount: { type: Number, default: 0 },     // percentage e.g. 10 = 10% off
    discountExpiry: { type: Date, default: null },  // when discount ends

    // ── Stock & Availability ─────────────────────────
    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },   // locked by pending payments
    
    isActive: { type: Boolean, default: true, index: true },

    // ── Categorization ───────────────────────────────
    category: { type: String },               // Data, Voice, Combo
    tags: [{ type: String }],             // ["student", "weekend"]
    recommendedRange: { type: String },

    // ── Media ────────────────────────────────────────
    imageUrl: { type: String, default: null },  // primary image
    publicId: { type: String, default: null },  // Cloudinary public ID for primary image
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },  // Cloudinary public ID for this image
        uploadedAt: { type: Date, default: Date.now }
      }
    ],


    // ── Display & Marketing ──────────────────────────
    description: { type: String },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },

    // ── Sales Tracking ───────────────────────────────
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true } // createdAt, updatedAt
);

const Bundle = mongoose.model('Bundle', bundleSchema);
export default Bundle;