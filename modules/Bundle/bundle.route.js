import  { Router} from 'express';
import { changeActiveStatus, createBundleInDb, getAllBundles, updateBundle,  } from '../Bundle/bundle.controller.js';
import { strictLimiter, generalLimiter,lenientLimiter, strictLimiterIpBased} from "../../middlewares/ratelimiter.middleware.js";
import { upload } from '../../middlewares/upload.middleware.js';
import {  authorizeRoles, protect,  } from '../../middlewares/auth.middleware.js'



const bundleRouter = Router();

//CREATE BUNDLE IN DB

bundleRouter.post('/createBundleInDb',protect, authorizeRoles("admin"), generalLimiter , upload.single('image'),  createBundleInDb )


bundleRouter.patch('/:bundleId/toggle-status',protect,authorizeRoles("admin"), lenientLimiter , changeActiveStatus )

bundleRouter.patch('/:bundleId/update',protect,authorizeRoles("admin"),  lenientLimiter , upload.single('image'), updateBundle )


// // GET BUNDLE TYPES FROM DB
bundleRouter.get('/getBundleFromDb', generalLimiter, getAllBundles )
// bundleRouter.get('/getBundleFromDb',strictLimiterIpBased , getAllBundles )
// bundleRouter.get('/getBundleFromDb',lenientLimiter, getAllBundles )

export default bundleRouter;






