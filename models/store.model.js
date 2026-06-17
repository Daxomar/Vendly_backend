// models/StoreConfig.js
import mongoose from "mongoose";

// ── Sub-schemas ────────────────────────────────────────────────────────────

const BadgeSchema = new mongoose.Schema({
  icon: { type: String, default: "" },
  label: { type: String, default: "" },
}, { _id: false });

const LinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const HeroSlideSchema = new mongoose.Schema({
  image: { type: String, default: "" },
  tag: { type: String, default: "" },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
}, { _id: false });

const SocialLinksSchema = new mongoose.Schema({
  instagram: { type: String, default: "" },
  facebook: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  twitter: { type: String, default: "" },
}, { _id: false });

const ContactSchema = new mongoose.Schema({
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  pickupAvailable: { type: Boolean, default: false },
}, { _id: false });

const BrandingSchema = new mongoose.Schema({
  storeName: { type: String, default: "My Store" },
  tagline: { type: String, default: "" },
  ownerName: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  primaryColor: { type: String, default: "#03563E" },
  accentColor: { type: String, default: "#34D399" },
  bottomColor: { type: String, default: "#022C22" },
  headingFont: { type: String, default: "DM Sans" },
  bodyFont: { type: String, default: "DM Sans" },
}, { _id: false });

const HeroSchema = new mongoose.Schema({
  slides: { type: [HeroSlideSchema], default: [] },
}, { _id: false });

const NavigationSchema = new mongoose.Schema({
  announcementBar: { type: String, default: "" },
  navLinks: { type: [LinkSchema], default: [] },
  shopLinks: { type: [LinkSchema], default: [] },
  customerCareLinks: { type: [LinkSchema], default: [] },
  companyLinks: { type: [LinkSchema], default: [] },
}, { _id: false });

const TrustSchema = new mongoose.Schema({
  badges: { type: [BadgeSchema], default: [] },
  newsletterHeading: { type: String, default: "" },
  newsletterSubtext: { type: String, default: "" },
  footerText: { type: String, default: "" },
}, { _id: false });

// ── Main schema ────────────────────────────────────────────────────────────

const StoreConfigSchema = new mongoose.Schema(
  {

    parentVendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true,
      index: true
    },

    // Future multi-tenant fields — optional for now

    storeSlug: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Settings sections
    branding: { type: BrandingSchema, default: () => ({}) },
    hero: { type: HeroSchema, default: () => ({}) },
    navigation: { type: NavigationSchema, default: () => ({}) },
    contact: {
      info: { type: ContactSchema, default: () => ({}) },
      socials: { type: SocialLinksSchema, default: () => ({}) },
    },
    trust: { type: TrustSchema, default: () => ({}) },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────

// Primary lookup — find a store by its owner

// Future multi-tenant lookups
StoreConfigSchema.index({ parentVendor: 1 }, { unique: true, sparse: true });
StoreConfigSchema.index({ storeSlug: 1 }, { sparse: true });

// Filtering active stores when you list all stores in admin
StoreConfigSchema.index({ isActive: 1 });

// Compound — active stores by user (useful when one user owns multiple stores later)
StoreConfigSchema.index({ parentVendor: 1, isActive: 1 });

// ── Model ──────────────────────────────────────────────────────────────────

const StoreConfig = mongoose.models.StoreConfig || mongoose.model("StoreConfig", StoreConfigSchema);

export default StoreConfig;