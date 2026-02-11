import  { Router} from 'express';

import { 
    getMyCommissions, 
    getCommissionStats, 
    getCommissionsByMonth 
} from "../Commission/commission.controller.js";


import  {  protect,  } from '../../middlewares/auth.middleware.js'
import { strictLimiter, generalLimiter } from "../../middlewares/ratelimiter.middleware.js";

const commissionRouter = Router();





// Get my commissions (with pagination) //testing purpose only

commissionRouter.get('/my-commissions', protect, generalLimiter, getMyCommissions);


export default commissionRouter;