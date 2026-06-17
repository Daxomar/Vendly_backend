// import  { Router} from 'express';
// import { changeActiveStatus, createBundleInDb, getAllBundles, getFeaturedBundles, updateBundle,deleteBundle, getBestSellingBundles, getBundlesByCategory,toggleFeaturedStatus} from '../Bundle/bundle.controller.js';
// import { strictLimiter, generalLimiter,lenientLimiter, strictLimiterIpBased} from "../../middlewares/ratelimiter.middleware.js";
// import { upload } from '../../middlewares/upload.middleware.js';
// import {  authorizeRoles, protect,  } from '../../middlewares/auth.middleware.js'



// const bundleRouter = Router();

// //CREATE BUNDLE IN DB

// bundleRouter.post('/createBundleInDb',protect, authorizeRoles("admin"), generalLimiter , upload.single('image'),  createBundleInDb )
// bundleRouter.patch('/bundleId/toggle-featured',protect,authorizeRoles("admin"), lenientLimiter , toggleFeaturedStatus)

// bundleRouter.patch('/:bundleId/toggle-status',protect,authorizeRoles("admin"), lenientLimiter , changeActiveStatus )

// bundleRouter.patch('/:bundleId/update',protect,authorizeRoles("admin"),  lenientLimiter , upload.single('image'), updateBundle )

// bundleRouter.delete('/:bundleId/delete',protect,authorizeRoles("admin"),  lenientLimiter, deleteBundle )


// // // GET BUNDLE TYPES FROM DB
// bundleRouter.get("/best-sellers", generalLimiter, getBestSellingBundles);
// bundleRouter.get('/getBundleFromDb', generalLimiter, getAllBundles )
// bundleRouter.get('/featured', generalLimiter, getFeaturedBundles )
// bundleRouter.get('/category/:category', generalLimiter, getBundlesByCategory )

// // bundleRouter.get('/getBundleFromDb',strictLimiterIpBased , getAllBundles )
// // bundleRouter.get('/getBundleFromDb',lenientLimiter, getAllBundles )

// export default bundleRouter;








import { Router } from 'express';
import { 
  changeActiveStatus, 
  createBundleInDb, 
  getAllBundles, 
  getFeaturedBundles, 
  updateBundle, 
  deleteBundle, 
  getBestSellingBundles, 
  getBundlesByCategory, 
  toggleFeaturedStatus 
} from '../Bundle/bundle.controller.js';
// import { 
//   vendorCreateBundle, 
//   vendorUpdateBundle, 
//   vendorDeleteBundle, 
//   vendorToggleFeaturedStatus, 
//   vendorChangeActiveStatus, 
//   vendorGetMyBundles, 
//   vendorGetPublicBundles,
//   vendorGetPublicFeaturedBundles,
//   vendorGetPublicBestSellers
// } from '../Bundle/vendor-bundle.controller.js';
import { strictLimiter, generalLimiter, lenientLimiter, strictLimiterIpBased } from "../../middlewares/ratelimiter.middleware.js";
import { upload } from '../../middlewares/upload.middleware.js';
import { authorizeRoles, protect } from '../../middlewares/auth.middleware.js'

const bundleRouter = Router();

// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES /api/bundles/*
// ═══════════════════════════════════════════════════════════════

bundleRouter.post('/createBundleInDb', protect, authorizeRoles("admin"), generalLimiter, upload.single('image'), createBundleInDb);

bundleRouter.patch('/bundleId/toggle-featured', protect, authorizeRoles("admin"), lenientLimiter, toggleFeaturedStatus);

bundleRouter.patch('/:bundleId/toggle-status', protect, authorizeRoles("admin"), lenientLimiter, changeActiveStatus);

bundleRouter.patch('/:bundleId/update', protect, authorizeRoles("admin"), lenientLimiter, upload.single('image'), updateBundle);

bundleRouter.delete('/:bundleId/delete', protect, authorizeRoles("admin"), lenientLimiter, deleteBundle);

bundleRouter.get("/best-sellers", generalLimiter, getBestSellingBundles);

bundleRouter.get('/getBundleFromDb', generalLimiter, getAllBundles);

bundleRouter.get('/featured', generalLimiter, getFeaturedBundles);

bundleRouter.get('/category/:category', generalLimiter, getBundlesByCategory);

// ═══════════════════════════════════════════════════════════════
// VENDOR ROUTES /api/vendor/bundles/*
// ═══════════════════════════════════════════════════════════════

// bundleRouter.post('/vendor/create', protect, authorizeRoles("vendor"), generalLimiter, upload.single('image'), vendorCreateBundle);

// bundleRouter.patch('/vendor/:bundleId/toggle-featured', protect, authorizeRoles("vendor"), lenientLimiter, vendorToggleFeaturedStatus);

// bundleRouter.patch('/vendor/:bundleId/toggle-status', protect, authorizeRoles("vendor"), lenientLimiter, vendorChangeActiveStatus);

// bundleRouter.patch('/vendor/:bundleId/update', protect, authorizeRoles("vendor"), lenientLimiter, upload.single('image'), vendorUpdateBundle);

// bundleRouter.delete('/vendor/:bundleId/delete', protect, authorizeRoles("vendor"), lenientLimiter, vendorDeleteBundle);

// bundleRouter.get('/vendor/my-bundles', protect, authorizeRoles("vendor"), generalLimiter, vendorGetMyBundles);

// bundleRouter.get('/vendor/public/:vendorCode/all', generalLimiter, vendorGetPublicBundles);

// bundleRouter.get('/vendor/public/:vendorCode/featured', generalLimiter, vendorGetPublicFeaturedBundles);

// bundleRouter.get('/vendor/public/:vendorCode/best-sellers', generalLimiter, vendorGetPublicBestSellers);

export default bundleRouter;