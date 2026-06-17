import mongoose from 'mongoose';

// helpers/getTenantFilter.js
export const getTenantFilter = (user) => {
  if (user.role === "admin") {
    return {}  // See everything
  } 
  
  if (user.role === "vendor") {
    return { 
        parentVendor: new mongoose.Types.ObjectId(user.id) 
    }  // See own resellers
  }
  
  if (user.role === "user") {  // reseller
    return { resellerId: new mongoose.Types.ObjectId(user.id) }
  }
  
  return {}
}