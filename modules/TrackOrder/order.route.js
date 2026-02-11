import  { Router} from 'express';


import { trackOrdersByPhone,  } from '../TrackOrder/order.controller.js';
import { generalLimiter, } from "../../middlewares/ratelimiter.middleware.js";


const orderRouter = Router();


// Public endpoint - no auth needed

orderRouter.get('/track', generalLimiter, trackOrdersByPhone);



export default orderRouter;
