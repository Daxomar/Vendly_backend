import  { Router} from 'express';

import  {  authorizeRoles,  protect,   } from '../../middlewares/auth.middleware.js'
import { creatAccountByAdmin, getReseller, getResellers, resellerLink, getResellerCommission, inviteReseller,approveReseller,rejectReseller, approveVendor, getVendors, vendorlink, getResellerDetail} from '../Users/user.controller.js'
import { generalLimiter, strictLimiter } from "../../middlewares/ratelimiter.middleware.js";
import { tenantFilter } from '../../middlewares/tenantFilter.middleware.js';
const userRouter = Router();

// //GET /users - Get all users
// //GET /users/:id - Get a user by ID
// //POST /users - Create a new user
// //PUT /users/:id - Update a user by ID
// //DELETE /users/:id - Delete a user by ID



// //ADMIN ENDPOINT
// // userRouter.get('/', protect, authorizeRoles("admin"),  getResellers);    // I have to later add the admin authorization middleWare over here too later for strict acces
// userRouter.get('/',  getResellers);    // I have to later add the admin authorization middleWare over here too later for strict acces

// // ADMIN ENDPOINT
// userRouter.post('/invite', inviteReseller)


// //USER ENDPOINT
// // userRouter.get('/me', protect, getReseller);  

// //TEST USER ENDPOINT RESELLER
// userRouter.get('/me', getReseller);  

// //CUSTOMER ENDPOINT PUBLIC 
// userRouter.get('/public/commission/:resellerCode', getResellerCommission);


// //RESSELLER LINK ENDPOINT --
// userRouter.get('/reseller-link', resellerLink)

// //ADMIN GET RESELLER ENDPOINT
// userRouter.get('/:id', protect, authorizeRoles("admin"), getReseller);  //I added the right authorization middleware over here



// //ADMIN ENDPOINT
// userRouter.post('/', protect, authorizeRoles("admin"), creatAccountByAdmin);


// //ADMIN ENDPOINT
// // userRouter.put('/:id', (req, res)=> res.send({title: 'Update user by ID endpoint is working!'}));
// // userRouter.put('/:id',protect,  updateUserByAdmin);   // Will define this today


// //ADMIN ENDPOINT
// userRouter.delete('/:id', (req, res)=> res.send({title: 'Delete user by ID endpoint is working!'}));





userRouter.get('/public/commission/:resellerCode', generalLimiter, getResellerCommission);

/* ============================
   ADMIN ROUTES (STRICT)
   ============================ */

// Create reseller account by admin - STRICT (write operation)
userRouter.post(
  '/',
  protect,
  authorizeRoles("admin"),
  strictLimiter,
  creatAccountByAdmin
);

// Get all resellers (admin dashboard) - GENERAL (read-only)
// userRouter.get(
//   '/',
//   protect,
//   authorizeRoles("admin"),
//   generalLimiter,
//   getResellers
// );


userRouter.get(
  "/", 
  protect, 
  authorizeRoles("admin", "vendor"),  // ← Both can access
  tenantFilter,                       // ← Sets filter based on role
  generalLimiter,
  getResellers
)

userRouter.get(
  "/get-vendors", 
  protect, 
  authorizeRoles("admin"),
  generalLimiter,
  getVendors
)

// Invite reseller (admin action) - STRICT (write operation)
userRouter.post(
  '/invite',
  protect,
  authorizeRoles("admin", "vendor"),  // ← Both can access
  strictLimiter,
  inviteReseller
);

/* ============================
   RESELLER ROUTES (AUTHENTICATED)
   ============================ */

// Get logged-in reseller profile - GENERAL (read-only)
userRouter.get(
  '/me',
  protect,
  generalLimiter,
  getReseller
);

// Generate reseller referral link - GENERAL (read-only)
userRouter.get(
  '/reseller-link',
  protect,
  generalLimiter,
  resellerLink
);

userRouter.get(
  '/vendor-link',
  protect,
  generalLimiter,
  vendorlink
)

/* ============================
   ADMIN ROUTES CONTINUED
   ============================ */

// Get reseller by ID (admin only) - GENERAL (read-only)
userRouter.get(
  '/:id',
  protect,
  authorizeRoles("admin", "vendor"),  // ← Both can access
  tenantFilter,                       // ← Sets filter based on role
  generalLimiter,
  getReseller
);

userRouter.get(
  '/reseller/:id',
  protect,
  authorizeRoles("admin", "vendor"),  // ← Both can access
  tenantFilter,                       // ← Sets filter based on role
  generalLimiter,
  getResellerDetail
)

// Approve reseller - STRICT (sensitive admin action)
userRouter.patch(
  '/:userId/approve',
  protect,
  authorizeRoles('admin', 'vendor'), // will change this to allow role vendor-specific approval later
  tenantFilter,                       // Sets filter based on role
  strictLimiter,
  approveReseller
);


//Approve Vendor 
userRouter.patch(
  '/:userId/approve-vendor',
  protect,
  authorizeRoles('admin'),
  strictLimiter,
  approveVendor
)

// Reject user (Admin only) - STRICT (sensitive admin action)
userRouter.patch(
  '/:userId/reject',
  protect,
  authorizeRoles('admin', 'vendor'), // will change this to allow role vendor-specific approval later
  tenantFilter,                       // Sets filter based on role
  strictLimiter,
  rejectReseller
);

// Toggle approval status (Admin only) - Alternative single endpoint
// userRouter.patch(
//   '/:userId/toggle-approval',
//   protect,
//   authorizeRoles('admin'),
//   toggleUserApproval
// );



// Update reseller by ID (admin only – future)
// userRouter.put(
//   '/:id',
//   protect,
//   authorizeRoles("admin"),
//   updateUserByAdmin
// );

// Delete reseller by ID (admin only – future)
// userRouter.delete(
//   '/:id',
//   protect,
//   authorizeRoles("admin"),
//   deleteUserByAdmin
// );

export default userRouter;





// import  { Router} from 'express';

// import  {  authorizeRoles,  protect,   } from '../../middlewares/auth.middleware.js'
// import { 
//   creatAccountByAdmin, 
//   getReseller, 
//   getResellers, 
//   resellerLink, 
//   getResellerCommission, 
//   inviteReseller,
//   approveReseller,
//   rejectReseller, 
//   approveVendor, 
//   getVendors,
//   // vendorGetResellers,
//   // vendorGetResellerById,
//   // vendorInviteReseller,
//   // vendorApproveReseller,
//   // vendorRejectReseller,
//   // vendorGetResellerCommission
// } from '../Users/user.controller.js'
// import { generalLimiter, strictLimiter } from "../../middlewares/ratelimiter.middleware.js";

// const userRouter = Router();

// // ═══════════════════════════════════════════════════════════════
// // PUBLIC ROUTES
// // ═══════════════════════════════════════════════════════════════

// userRouter.get('/public/commission/:resellerCode', generalLimiter, getResellerCommission);

// // ═══════════════════════════════════════════════════════════════
// // ADMIN ROUTES /api/users/*
// // ═══════════════════════════════════════════════════════════════

// // Create reseller account by admin - STRICT (write operation)
// userRouter.post(
//   '/',
//   protect,
//   authorizeRoles("admin"),
//   strictLimiter,
//   creatAccountByAdmin
// );

// // Get all resellers (admin dashboard) - GENERAL (read-only)
// userRouter.get(
//   '/',
//   protect,
//   authorizeRoles("admin"),
//   generalLimiter,
//   getResellers
// );

// userRouter.get(
//   "/get-vendors", 
//   protect, 
//   authorizeRoles("admin"),
//   generalLimiter,
//   getVendors
// )

// // Invite reseller (admin action) - STRICT (write operation)
// userRouter.post(
//   '/invite',
//   protect,
//   authorizeRoles("admin"),
//   strictLimiter,
//   inviteReseller
// );

// // Get reseller by ID (admin only) - GENERAL (read-only)
// userRouter.get(
//   '/:id',
//   protect,
//   authorizeRoles("admin"),
//   generalLimiter,
//   getReseller
// );

// // Approve reseller - STRICT (sensitive admin action)
// userRouter.patch(
//   '/:userId/approve',
//   protect,
//   authorizeRoles('admin'),
//   strictLimiter,
//   approveReseller
// );

// // Approve Vendor 
// userRouter.patch(
//   '/:userId/approve-vendor',
//   protect,
//   authorizeRoles('admin'),
//   strictLimiter,
//   approveVendor
// )

// // Reject user (Admin only) - STRICT (sensitive admin action)
// userRouter.patch(
//   '/:userId/reject',
//   protect,
//   authorizeRoles('admin'),
//   strictLimiter,
//   rejectReseller
// );

// // ═══════════════════════════════════════════════════════════════
// // RESELLER ROUTES (AUTHENTICATED)
// // ═══════════════════════════════════════════════════════════════

// // Get logged-in reseller profile - GENERAL (read-only)
// userRouter.get(
//   '/me',
//   protect,
//   generalLimiter,
//   getReseller
// );

// // Generate reseller referral link - GENERAL (read-only)
// userRouter.get(
//   '/reseller-link',
//   protect,
//   generalLimiter,
//   resellerLink
// );

// // ═══════════════════════════════════════════════════════════════
// // VENDOR ROUTES /api/users/vendor/*
// // ═══════════════════════════════════════════════════════════════

// // // Get all resellers under this vendor - GENERAL (read-only)
// // userRouter.get(
// //   '/vendor/resellers',
// //   protect,
// //   authorizeRoles("vendor"),
// //   generalLimiter,
// //   vendorGetResellers
// // );

// // // Get reseller by ID (vendor only sees their own resellers) - GENERAL (read-only)
// // userRouter.get(
// //   '/vendor/resellers/:id',
// //   protect,
// //   authorizeRoles("vendor"),
// //   generalLimiter,
// //   vendorGetResellerById
// // );

// // // Invite reseller to vendor network - STRICT (write operation)
// // userRouter.post(
// //   '/vendor/invite',
// //   protect,
// //   authorizeRoles("vendor"),
// //   strictLimiter,
// //   vendorInviteReseller
// // );

// // // Approve reseller under this vendor - STRICT (sensitive vendor action)
// // userRouter.patch(
// //   '/vendor/:userId/approve',
// //   protect,
// //   authorizeRoles("vendor"),
// //   strictLimiter,
// //   vendorApproveReseller
// // );

// // // Reject reseller under this vendor - STRICT (sensitive vendor action)
// // userRouter.patch(
// //   '/vendor/:userId/reject',
// //   protect,
// //   authorizeRoles("vendor"),
// //   strictLimiter,
// //   vendorRejectReseller
// // );

// // // Get reseller commission details - GENERAL (read-only)
// // userRouter.get(
// //   '/vendor/resellers/:id/commission',
// //   protect,
// //   authorizeRoles("vendor"),
// //   generalLimiter,
// //   vendorGetResellerCommission
// // );

// export default userRouter;