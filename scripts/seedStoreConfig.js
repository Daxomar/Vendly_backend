import mongoose from 'mongoose'
import StoreConfig from '../models/store.model.js'
import User from '../models/user.model.js'
import {DB_URI} from '../config/env.js';

const seed = async () => {
  try {
    await mongoose.connect(DB_URI)
    console.log('✅ Connected to DB')

    // Find the first admin/reseller user to attach the store config to
    const user = await User.findOne({ role: 'user' })
    if (!user) {
      console.error('❌ No user found — create a user first')
      process.exit(1)
    }

    await StoreConfig.deleteOne({ userId: user._id })
    console.log('🗑️  Cleared existing store config')

    await StoreConfig.create({
      vendorCode: 'FIRST_VENDOR', // This can be used for public storefront fetching
      userId: user._id,
      isActive: true,
      branding: {
        storeName: 'Lovable',
        tagline: 'Premium imports. Delivered with care.',
        ownerName: 'David',
        logoUrl: '',
        primaryColor: '#03563E',
        accentColor: '#34D399',
        bottomColor: '#022C22',
        headingFont: 'DM Sans',
        bodyFont: 'DM Sans',
      },
      hero: {
        slides: [
          {
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop',
            tag: 'New Arrivals',
            title: 'Premium Quality, Delivered',
            subtitle: 'Shop the latest bags, dresses, perfumes and more',
          },
          {
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop',
            tag: 'Best Sellers',
            title: 'Shop What Everyone Loves',
            subtitle: 'Our most popular products, handpicked for you',
          },
        ],
      },
      navigation: {
        announcementBar: 'Free delivery on orders over GH₵ 500 🎉',
        navLinks: [
          { label: 'Shop', url: '/store/shop' },
          { label: 'Categories', url: '/store/categories' },
          { label: 'About', url: '/store/about' },
          { label: 'Contact', url: '/store/contact' },
        ],
        shopLinks: [
          { label: 'All Products', url: '/store/shop' },
          { label: 'Bags', url: '/store/shop?category=Bags' },
          { label: 'Dresses', url: '/store/shop?category=Dresses' },
          { label: 'Kitchen', url: '/store/shop?category=Kitchen' },
          { label: 'Perfumes', url: '/store/shop?category=Perfumes' },
          { label: 'Mannequins', url: '/store/shop?category=Mannequins' },
        ],
        customerCareLinks: [
          { label: 'Track My Order', url: '/track' },
          { label: 'Return Policy', url: '/returns' },
          { label: 'Shipping Info', url: '/shipping' },
          { label: 'FAQs', url: '/faqs' },
          { label: 'Contact Us', url: '/contact' },
        ],
        companyLinks: [
          { label: 'About Us', url: '/about' },
          { label: 'Careers', url: '/careers' },
          { label: 'Press', url: '/press' },
        ],
      },
      contact: {
        info: {
          phone: '+233 24 000 0000',
          email: 'hello@lovable.com',
          address: 'Accra, Ghana',
          pickupAvailable: true,
        },
        socials: {
          instagram: 'https://instagram.com/lovable',
          facebook: 'https://facebook.com/lovable',
          whatsapp: '233240000000',
          twitter: 'https://twitter.com/lovable',
        },
      },
      trust: {
        badges: [
          { icon: '🚚', label: 'Fast Delivery' },
          { icon: '🔒', label: 'Secure Checkout' },
          { icon: '↩️', label: '30-Day Returns' },
          { icon: '⭐', label: 'Premium Quality' },
        ],
        newsletterHeading: 'Join Our Community',
        newsletterSubtext: 'Get exclusive access to new arrivals, secret sales and more.',
        footerText: `© ${new Date().getFullYear()} Lovable. All rights reserved.`,
      },
    })

    console.log('🌱 Store config seeded')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()