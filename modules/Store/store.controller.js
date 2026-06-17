import * as storeService from './store.service.js';

// ── GET /store-config ──────────────────────────────────────────────────────
export const getStoreConfig = async (req, res) => {
    try {
        const config = await storeService.getStoreConfig(req.user.id);
        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch store config',
        });
    }
};

// ── PUT /store-config/branding ─────────────────────────────────────────────
export const updateBranding = async (req, res) => {
    try {
        const config = await storeService.updateBranding(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Branding updated successfully',
            data: config.branding,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update branding',
        });
    }
};

// ── PUT /store-config/hero ─────────────────────────────────────────────────
export const updateHero = async (req, res) => {
    try {
        const config = await storeService.updateHero(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Hero updated successfully',
            data: config.hero,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update hero',
        });
    }
};

// ── PUT /store-config/navigation ───────────────────────────────────────────
export const updateNavigation = async (req, res) => {
    try {
        const config = await storeService.updateNavigation(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Navigation updated successfully',
            data: config.navigation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update navigation',
        });
    }
};

// ── PUT /store-config/contact ──────────────────────────────────────────────
export const updateContact = async (req, res) => {
    try {
        const config = await storeService.updateContact(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            data: config.contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update contact',
        });
    }
};

// ── PUT /store-config/trust ────────────────────────────────────────────────
export const updateTrust = async (req, res) => {
    try {
        const config = await storeService.updateTrust(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Trust & footer updated successfully',
            data: config.trust,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update trust',
        });
    }
};

// ── GET /public/:resellerCode ──────────────────────────────────────────────
// PUBLIC — storefront fetches vendor's store config by reseller code
export const getPublicStoreConfig = async (req, res) => {
    try {
        const { resellerCode } = req.params;
        const config = await storeService.getStoreConfigByResellerCode(resellerCode);

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Store not found',
            });
        }

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch store config',
        });
    }
};