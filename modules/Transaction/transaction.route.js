// import  { Router} from 'express';

// import  {  authorizeRoles,  protect,   } from '../../middlewares/auth.middleware.js'
// import { 
//     getTransactions, 
//     bulkExportTransactions, 
//     getBulkExportTransactions, 
//     bulkMarkDelivered, 
//     getAllBulkExports,
//     updateDeliveryStatus

//  } from '../Transaction/transaction.controller.js';

//  import { generalLimiter, lenientLimiter, strictLimiter } from "../../middlewares/ratelimiter.middleware.js";





// const transactionRouter = Router();


// transactionRouter.post('/bulk-export', protect, authorizeRoles("admin"), generalLimiter, bulkExportTransactions);

// // Get list of bulk exports - GENERAL (read-only, admin)
// transactionRouter.get('/bulk-exports/list', protect, authorizeRoles("admin"), generalLimiter, getAllBulkExports);

// // Get specific bulk export - GENERAL (read-only, admin)
// transactionRouter.get('/bulk-export/:exportId', protect, authorizeRoles("admin"), generalLimiter, getBulkExportTransactions);

// // Mark as delivered - STRICT (write operation)
// transactionRouter.patch('/bulk-export/:exportId/mark-delivered', protect, authorizeRoles("admin"), lenientLimiter, bulkMarkDelivered);

// // Get all transactions - GENERAL (read-only, admin)
// transactionRouter.get('/', protect, authorizeRoles("admin"), lenientLimiter, getTransactions);


// // Update delivery status
// transactionRouter.patch('/:transactionId/delivery', protect, authorizeRoles("admin"), lenientLimiter, updateDeliveryStatus);

// export default transactionRouter;



import  { Router} from 'express';

import  {  authorizeRoles,  protect,   } from '../../middlewares/auth.middleware.js'
import { 
    getTransactions, 
    bulkExportTransactions, 
    getBulkExportTransactions, 
    bulkMarkDelivered, 
    getAllBulkExports,
    updateDeliveryStatus,
    // vendorGetTransactions,
    // vendorBulkExportTransactions,
    // vendorGetBulkExportTransactions,
    // vendorBulkMarkDelivered,
    // vendorGetAllBulkExports,
    // vendorUpdateDeliveryStatus

 } from '../Transaction/transaction.controller.js';

 import { generalLimiter, lenientLimiter, strictLimiter } from "../../middlewares/ratelimiter.middleware.js";

const transactionRouter = Router();

/* ════════════════════════════════════════
   ADMIN ROUTES /api/transactions/*
   ════════════════════════════════════════ */

transactionRouter.post('/bulk-export', protect, authorizeRoles("admin"), generalLimiter, bulkExportTransactions);

// Get list of bulk exports - GENERAL (read-only, admin)
transactionRouter.get('/bulk-exports/list', protect, authorizeRoles("admin"), generalLimiter, getAllBulkExports);

// Get specific bulk export - GENERAL (read-only, admin)
transactionRouter.get('/bulk-export/:exportId', protect, authorizeRoles("admin"), generalLimiter, getBulkExportTransactions);

// Mark as delivered - STRICT (write operation)
transactionRouter.patch('/bulk-export/:exportId/mark-delivered', protect, authorizeRoles("admin"), lenientLimiter, bulkMarkDelivered);

// Get all transactions - GENERAL (read-only, admin)
transactionRouter.get('/', protect, authorizeRoles("admin"), lenientLimiter, getTransactions);

// Update delivery status
transactionRouter.patch('/:transactionId/delivery', protect, authorizeRoles("admin"), lenientLimiter, updateDeliveryStatus);

/* ════════════════════════════════════════
   VENDOR ROUTES /api/transactions/vendor/*
   ════════════════════════════════════════ */

// // Get all reseller transactions under this vendor
// transactionRouter.get('/vendor/all', protect, authorizeRoles("vendor"), lenientLimiter, vendorGetTransactions);

// // Bulk export reseller transactions
// transactionRouter.post('/vendor/bulk-export', protect, authorizeRoles("vendor"), generalLimiter, vendorBulkExportTransactions);

// // Get list of vendor's bulk exports
// transactionRouter.get('/vendor/bulk-exports/list', protect, authorizeRoles("vendor"), generalLimiter, vendorGetAllBulkExports);

// // Get specific bulk export
// transactionRouter.get('/vendor/bulk-export/:exportId', protect, authorizeRoles("vendor"), generalLimiter, vendorGetBulkExportTransactions);

// // Mark reseller transactions as delivered
// transactionRouter.patch('/vendor/bulk-export/:exportId/mark-delivered', protect, authorizeRoles("vendor"), lenientLimiter, vendorBulkMarkDelivered);

// // Update reseller transaction delivery status
// transactionRouter.patch('/vendor/:transactionId/delivery', protect, authorizeRoles("vendor"), lenientLimiter, vendorUpdateDeliveryStatus);

export default transactionRouter;