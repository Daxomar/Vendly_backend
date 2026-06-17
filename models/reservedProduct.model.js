import mongoose from 'mongoose';

const reservedProductSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['reserved', 'confirmed', 'released', 'expired'],
      default: 'reserved'
    },
    products: [
      {
        bundleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Bundle',
          required: true
        },
        bundleName: String,
        quantity: {
          type: Number,
          required: true
        },
        reservedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    expiresAt: {
      type: Date,
      required: true,
      
    },
    releasedAt: Date,
    confirmedAt: Date,
  },
  {
    timestamps: true
  }
);

// TTL index to automatically delete expired reservations after 30 minutes
reservedProductSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const ReservedProduct =  mongoose.model('ReservedProduct', reservedProductSchema);
export default ReservedProduct;

