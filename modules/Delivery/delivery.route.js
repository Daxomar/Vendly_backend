// import { Router} from 'express';
// import { createDelivery, getAllDeliveries, updateDelivery, deleteDelivery, toggleDeliveryStatus } from './delivery.controller.js';
// import { strictLimiter, generalLimiter,lenientLimiter, strictLimiterIpBased} from "../../middlewares/ratelimiter.middleware.js";
// import {  authorizeRoles, protect,  } from '../../middlewares/auth.middleware.js'
// const deliveryRouter = Router();


// deliveryRouter.post("/", lenientLimiter,  protect, authorizeRoles("admin"), createDelivery);
// deliveryRouter.get("/", getAllDeliveries);
// deliveryRouter.put("/:id", lenientLimiter, protect, authorizeRoles("admin"), updateDelivery);
// deliveryRouter.delete("/:id", lenientLimiter, protect, authorizeRoles("admin"), deleteDelivery);
// deliveryRouter.patch("/:id/toggle", lenientLimiter, protect, authorizeRoles("admin"), toggleDeliveryStatus);

// export default deliveryRouter;








import { Router} from 'express';
import { 
  createDelivery, 
  getAllDeliveries, 
  // getVendorDeliveries,
  updateDelivery,  
  deleteDelivery, 
  toggleDeliveryStatus
  // vendorCreateDelivery,
  // vendorGetDeliveries,
  // vendorUpdateDelivery,
  // vendorDeleteDelivery,
  // vendorToggleDeliveryStatus
} from './delivery.controller.js';
import { strictLimiter, generalLimiter, lenientLimiter, strictLimiterIpBased} from "../../middlewares/ratelimiter.middleware.js";
import { authorizeRoles, protect } from '../../middlewares/auth.middleware.js'
import { tenantFilter } from '../../middlewares/tenantFilter.middleware.js';

const deliveryRouter = Router();

// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES /api/deliveries/*
// ═══════════════════════════════════════════════════════════════

deliveryRouter.post("/",  protect,lenientLimiter,  authorizeRoles("admin", "vendor"),tenantFilter, createDelivery);
deliveryRouter.get("/",protect, lenientLimiter,  authorizeRoles("admin", "vendor"),tenantFilter, getAllDeliveries);
// deliveryRouter.get("/vendor", getVendorDeliveries);
deliveryRouter.put("/:id",  protect,lenientLimiter,  authorizeRoles("admin", "vendor"),tenantFilter, updateDelivery);
deliveryRouter.delete("/:id",  protect,lenientLimiter,  authorizeRoles("admin", "vendor"),tenantFilter, deleteDelivery);
deliveryRouter.patch("/:id/toggle",  protect,lenientLimiter,  authorizeRoles("admin", "vendor"),tenantFilter, toggleDeliveryStatus);

// ═══════════════════════════════════════════════════════════════
// VENDOR ROUTES /api/deliveries/vendor/*
// ═══════════════════════════════════════════════════════════════

// deliveryRouter.post("/vendor/create", lenientLimiter, protect, authorizeRoles("vendor"), vendorCreateDelivery);
// deliveryRouter.get("/vendor/my-deliveries", protect, authorizeRoles("vendor"), vendorGetDeliveries);
// deliveryRouter.put("/vendor/:id", lenientLimiter, protect, authorizeRoles("vendor"), vendorUpdateDelivery);
// deliveryRouter.delete("/vendor/:id", lenientLimiter, protect, authorizeRoles("vendor"), vendorDeleteDelivery);
// deliveryRouter.patch("/vendor/:id/toggle", lenientLimiter, protect, authorizeRoles("vendor"), vendorToggleDeliveryStatus);

export default deliveryRouter;