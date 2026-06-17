// import mongoose from 'mongoose';

// const transactionSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },


//   // this is the actual MongoDB ObjectId reference to the Bundle document
//   bundleId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Bundle',
//     required: true,
//   },

//   //This is the bundleId i created myself to identify different bundles
//   bundleIdName: {
//     type: String,
//     required: true,
//   },

//   JBCP: {
//     type: Number,
//     required: true,
//   },

//   bundleName: {
//     type: String,
//     required: true,
//   },

//   resellerCode: {
//     type: String,
//     // allows multiple nulls
//   },


//   baseCost: {
//     type: Number,
//     required: true,
//   },


//   amount: {
//     type: Number,
//     required: true,
//   },


//   JBProfit: {
//     type: Number,
//     required: true,
//   },

//   currency: {
//     type: String,
//     required: true,
//     enum: ['GHS', 'NGN'],
//   },

//   reference: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true,
//   },

//   status: {
//     type: String,
//     enum: ['pending', 'success', 'failed', 'expired', 'refunding', 'refund_completed'],
//     default: 'pending',
//     index: true
//   },

//  refundReference: {
//   type: String,
//   unique: true,
//   sparse: true
// },


//   channel: {
//     type: String,
//     default: '',
//   },

//   provider_response: {
//     type: Object,
//     default: {},
//   },

//   metadata: {
//     type: Object,
//     default: {},
//   },



//   // NEW: Delivery tracking
//   deliveryStatus: {
//     type: String,
//     enum: ['pending', 'processing', 'delivered', 'failed'],
//     default: 'pending',
//     index: true
//   },
//   deliveredAt: Date,
//   failureReason: String,

//   exportId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ExportJob",
//     index: true
//   }




// }, { timestamps: true });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// export default Transaction;









import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  bundleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bundle',
    required: true,
  },
  bundleName: {
    type: String,
    required: true,
  },
  bundleName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
}, { _id: false });


const transactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  // --- Legacy single-bundle fields (kept to avoid breaking existing records) ---
  bundleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bundle',
  },
  bundleName: {
    type: String,
  },
  bundleName: {
    type: String,
  },
  JBCP: {
    type: Number,
  },
  baseCost: {
    type: Number,
  },
  JBProfit: {
    type: Number,
  },
  // --- End legacy fields ---

  // --- New cart fields ---
  cartItems: {
    type: [cartItemSchema],
    default: undefined,
  },

  deliveryDetails: {
    type: Object,
    default: {},
  },

  parentVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },

  paystackCharge: {
    type: Number,
  },
  // --- End new cart fields ---

  resellerCode: {
    type: String,
  },

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    required: true,
    enum: ['GHS', 'NGN'],
  },

  reference: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'expired', 'refunding', 'refund_completed'],
    default: 'pending',
    index: true
  },

  refundReference: {
    type: String,
    unique: true,
    sparse: true
  },

  channel: {
    type: String,
    default: '',
  },

  provider_response: {
    type: Object,
    default: {},
  },

  metadata: {
    type: Object,
    default: {},
  },

  deliveryStatus: {
    type: String,
    enum: ['pending', 'processing', 'delivered', 'failed'],
    default: 'pending',
    index: true
  },


  deliveryDetails: {
    type: Object,
    default: {},
  },

  shippingMethod: {
    type: Object,
    default: {},
  },

  reservedProductsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReservedProduct',
    index: true
  },


  subtotal: {
    type: Number,
  },

  paystackCharge: {
    type: Number,
  },


  deliveredAt: Date,
  failureReason: String,

  exportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExportJob",
    index: true
  }

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;