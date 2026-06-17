import StoreConfig from "../../models/store.model.js";
import User from "../../models/user.model.js";

// ── Get store config (vendor only) ─────────────────────────────────────────
export const getStoreConfig = async (vendorId) => {
    let config = await StoreConfig.findOne({ parentVendor: vendorId });

    if (!config) {
        config = await StoreConfig.create({ parentVendor: vendorId });
    }

    return config;
};

// ── Update branding ────────────────────────────────────────────────────────
export const updateBranding = async (vendorId, payload) => {
    const config = await StoreConfig.findOneAndUpdate(
        { parentVendor: vendorId },
        { $set: { branding: payload } },
        { new: true, upsert: true }
    );
    return config;
};

// ── Update hero ────────────────────────────────────────────────────────────
export const updateHero = async (vendorId, payload) => {
    const config = await StoreConfig.findOneAndUpdate(
        { parentVendor: vendorId },
        { $set: { hero: payload } },
        { new: true, upsert: true }
    );
    return config;
};

// ── Update navigation ──────────────────────────────────────────────────────
export const updateNavigation = async (vendorId, payload) => {
    const config = await StoreConfig.findOneAndUpdate(
        { parentVendor: vendorId },
        { $set: { navigation: payload } },
        { new: true, upsert: true }
    );
    return config;
};

// ── Update contact ─────────────────────────────────────────────────────────
export const updateContact = async (vendorId, payload) => {
    const config = await StoreConfig.findOneAndUpdate(
        { parentVendor: vendorId },
        { $set: { contact: payload } },
        { new: true, upsert: true }
    );
    return config;
};

// ── Update trust ───────────────────────────────────────────────────────────
export const updateTrust = async (vendorId, payload) => {
    const config = await StoreConfig.findOneAndUpdate(
        { parentVendor: vendorId },
        { $set: { trust: payload } },
        { new: true, upsert: true }
    );
    return config;
};

// ── PUBLIC: Get config by resellerCode ─────────────────────────────────────
export const getStoreConfigByResellerCode = async (resellerCode) => {
    try {
        // 1. Find reseller and only select parentVendor (faster query)
        const reseller = await User.findOne({ resellerCode }).select('parentVendor');
        console.log('Reseller found for code', resellerCode, ':', reseller);
        if (!reseller) return null;

        // 2. Find the store config for that vendor
        const config = await StoreConfig.findOne({ parentVendor: reseller.parentVendor });
        return config;
    } catch (error) {
        console.error('Error fetching store config by reseller code:', error);
        return null;
    }
};