
import { Router} from 'express';
import { verifyPayment ,handleWebhook, initializeCartPayment, validateCartPrices  } from '../Payments/payment.controller.js';
import { strictLimiterIpBased, generalLimiter } from "../../middlewares/ratelimiter.middleware.js";
import { bossuWebhookHandler } from '../../utils/bossu.js';

const paymentRouter = Router();
// Webhook endpoint - NO LIMITER

//very temporal webhook 
paymentRouter.post('/bossu-webhook', bossuWebhookHandler)
//very temporal webhook 


paymentRouter.post('/paystack/webhook', handleWebhook);

paymentRouter.post('/paystack/cart/validate-cart-prices', generalLimiter, validateCartPrices);


// Initialize payment - STRICT IP-based (prevent payment spam)
paymentRouter.post('/paystack/initialize', strictLimiterIpBased, initializeCartPayment);

// Verify a transaction - GENERAL (read-only)
paymentRouter.get('/paystack/verify/:reference', generalLimiter, verifyPayment);




export default paymentRouter
;