import { Router } from 'express';
import {
    getStoreConfig,
    updateBranding,
    updateHero,
    updateNavigation,
    updateContact,
    updateTrust,
    getPublicStoreConfig,
} from './store.controller.js';
import { protect, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { tenantFilter } from '../../middlewares/tenantFilter.middleware.js';
import { generalLimiter, lenientLimiter } from '../../middlewares/ratelimiter.middleware.js';

const storeRouter = Router();

// ── Public (no auth) ───────────────────────────────────────────────────────
// Storefront fetches vendor's store by reseller code
// resellerCode → find reseller → get parentVendor → fetch StoreConfig
storeRouter.get('/public/:resellerCode', generalLimiter, getPublicStoreConfig);

// ── Protected (vendor only) ────────────────────────────────────────────────
// Vendors manage their own store config
storeRouter.get(
    '/',
    protect,
    authorizeRoles('vendor'),
    tenantFilter,
    lenientLimiter,
    getStoreConfig
);

storeRouter.put(
    '/branding',
    protect,
    authorizeRoles('vendor'),
    tenantFilter,
    lenientLimiter,
    updateBranding
);

storeRouter.put(
    '/hero',
    protect,
    authorizeRoles('vendor'),
    tenantFilter,
    lenientLimiter,
    updateHero
);

storeRouter.put(
    '/navigation',
    protect,
    authorizeRoles('vendor'),
    tenantFilter,
    lenientLimiter,
    updateNavigation
);

storeRouter.put(
    '/contact',
    protect,
    authorizeRoles('vendor'),
    tenantFilter,
    lenientLimiter,
    updateContact
);

storeRouter.put(
    '/trust',
    protect,
    authorizeRoles('vendor'),
    tenantFilter,
    lenientLimiter,
    updateTrust
);

export default storeRouter;