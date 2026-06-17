// middleware/tenantFilter.middleware.js
import { getTenantFilter } from '../utils/get-tenant.js';

export const tenantFilter = (req, res, next) => {
  req.tenantFilter = getTenantFilter(req.user)
  next()
}