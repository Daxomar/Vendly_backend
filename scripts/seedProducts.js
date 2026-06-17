// import mongoose from "mongoose";
// import Bundle from '../models/bundle.model.js'
// import {DB_URI} from '../config/env.js';

// const products = [
//   {
//     Bundle_id: 'LVB-BAG-001',
//     name: 'Classic Leather Tote Bag',
//     network: 'General',
//     JBCP: 180, JBSP: 250, stock: 15,
//     category: 'Bags',
//     tags: ['leather', 'tote', 'classic'],
//     recommendedRange: 'Everyday use',
//     imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', publicId: 'bag_001_1' },
//       { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop', publicId: 'bag_001_2' },
//       { url: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&auto=format&fit=crop', publicId: 'bag_001_3' },
//     ],
//     description: 'A timeless leather tote bag perfect for everyday use. Spacious interior with multiple pockets.',
//     isFeatured: true, isBestSeller: true,
//   },
//   {
//     Bundle_id: 'LVB-DRS-001',
//     name: 'Floral Summer Dress',
//     network: 'General',
//     JBCP: 120, JBSP: 180, stock: 20,
//     category: 'Dresses',
//     tags: ['summer', 'floral', 'casual'],
//     recommendedRange: 'Casual outings',
//     imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop', publicId: 'dress_001_1' },
//       { url: 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=800&auto=format&fit=crop', publicId: 'dress_001_2' },
//       { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop', publicId: 'dress_001_3' },
//     ],
//     description: 'Light and breezy floral dress perfect for warm weather and casual outings.',
//     isFeatured: false, isBestSeller: true,
//   },
//   {
//     Bundle_id: 'LVB-KIT-001',
//     name: 'Ceramic Pour-Over Coffee Set',
//     network: 'General',
//     JBCP: 210, JBSP: 320, stock: 8,
//     category: 'Kitchen',
//     tags: ['coffee', 'ceramic', 'kitchen'],
//     recommendedRange: 'Coffee lovers',
//     imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop', publicId: 'kit_001_1' },
//       { url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop', publicId: 'kit_001_2' },
//       { url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop', publicId: 'kit_001_3' },
//     ],
//     description: 'Handcrafted ceramic pour-over set for the perfect morning brew. Includes dripper and carafe.',
//     isFeatured: true, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-PRF-001',
//     name: 'Oud Noir Perfume',
//     network: 'General',
//     JBCP: 280, JBSP: 420, stock: 12,
//     category: 'Perfumes',
//     tags: ['oud', 'luxury', 'fragrance'],
//     recommendedRange: 'Luxury lovers',
//     imageUrl: 'https://images.unsplash.com/photo-1590156546382-7db9a7d4b326?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1590156546382-7db9a7d4b326?w=800&auto=format&fit=crop', publicId: 'prf_001_1' },
//       { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', publicId: 'prf_001_2' },
//       { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop', publicId: 'prf_001_3' },
//     ],
//     description: 'A rich deep oud fragrance with notes of dark wood, amber, and musk. Long lasting.',
//     isFeatured: true, isBestSeller: true,
//   },
//   {
//     Bundle_id: 'LVB-MAN-001',
//     name: 'Female Dress Mannequin',
//     network: 'General',
//     JBCP: 380, JBSP: 550, stock: 5,
//     category: 'Mannequins',
//     tags: ['mannequin', 'display', 'boutique'],
//     recommendedRange: 'Boutique owners',
//     imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', publicId: 'man_001_1' },
//       { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop', publicId: 'man_001_2' },
//       { url: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&auto=format&fit=crop', publicId: 'man_001_3' },
//     ],
//     description: 'Full body female mannequin ideal for boutiques and clothing displays. Realistic proportions.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-BAG-002',
//     name: 'Crossbody Mini Bag',
//     network: 'General',
//     JBCP: 95, JBSP: 150, stock: 30,
//     category: 'Bags',
//     tags: ['crossbody', 'mini', 'casual'],
//     recommendedRange: 'Everyday use',
//     imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop', publicId: 'bag_002_1' },
//       { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', publicId: 'bag_002_2' },
//       { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop', publicId: 'bag_002_3' },
//     ],
//     description: 'Compact and stylish crossbody bag with adjustable strap. Fits phone, keys and essentials.',
//     isFeatured: false, isBestSeller: true,
//   },
//   {
//     Bundle_id: 'LVB-KIT-002',
//     name: 'Blender Pro 2000',
//     network: 'General',
//     JBCP: 320, JBSP: 480, stock: 10,
//     category: 'Kitchen',
//     tags: ['blender', 'appliance', 'kitchen'],
//     recommendedRange: 'Home cooks',
//     imageUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop', publicId: 'kit_002_1' },
//       { url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop', publicId: 'kit_002_2' },
//       { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop', publicId: 'kit_002_3' },
//     ],
//     description: 'High-powered blender with 6 speed settings. Perfect for smoothies, soups and more.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-PRF-002',
//     name: 'Rose Gold Perfume',
//     network: 'General',
//     JBCP: 180, JBSP: 280, stock: 18,
//     category: 'Perfumes',
//     tags: ['rose', 'floral', 'feminine'],
//     recommendedRange: 'Daily wear',
//     imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', publicId: 'prf_002_1' },
//       { url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop', publicId: 'prf_002_2' },
//       { url: 'https://images.unsplash.com/photo-1590156546382-7db9a7d4b326?w=800&auto=format&fit=crop', publicId: 'prf_002_3' },
//     ],
//     description: 'A delicate floral fragrance with rose, peach and light musk. Perfect for daily wear.',
//     isFeatured: false, isBestSeller: true,
//   },
//   {
//     Bundle_id: 'LVB-DRS-002',
//     name: 'Wrap Midi Dress',
//     network: 'General',
//     JBCP: 140, JBSP: 210, stock: 14,
//     category: 'Dresses',
//     tags: ['midi', 'wrap', 'elegant'],
//     recommendedRange: 'Office & events',
//     imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop', publicId: 'dress_002_1' },
//       { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop', publicId: 'dress_002_2' },
//       { url: 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=800&auto=format&fit=crop', publicId: 'dress_002_3' },
//     ],
//     description: 'Elegant wrap midi dress that flatters all body types. Available in multiple colors.',
//     isFeatured: true, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-MAN-002',
//     name: 'Half Body Male Mannequin',
//     network: 'General',
//     JBCP: 210, JBSP: 320, stock: 7,
//     category: 'Mannequins',
//     tags: ['mannequin', 'male', 'upper body'],
//     recommendedRange: 'Boutique owners',
//     imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop', publicId: 'man_002_1' },
//       { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', publicId: 'man_002_2' },
//       { url: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&auto=format&fit=crop', publicId: 'man_002_3' },
//     ],
//     description: 'Upper body male mannequin with realistic muscle definition. Great for shirts and jackets.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-PRF-003',
//     name: 'Luxury Vanity Perfume Set',
//     network: 'General',
//     JBCP: 420, JBSP: 650, stock: 6,
//     category: 'Perfumes',
//     tags: ['gift set', 'luxury', 'vanity'],
//     recommendedRange: 'Gift buyers',
//     imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop', publicId: 'prf_003_1' },
//       { url: 'https://images.unsplash.com/photo-1590156546382-7db9a7d4b326?w=800&auto=format&fit=crop', publicId: 'prf_003_2' },
//       { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', publicId: 'prf_003_3' },
//     ],
//     description: 'A curated set of 3 luxury fragrances in an elegant gift box. Perfect for gifting.',
//     isFeatured: true, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-BAG-003',
//     name: 'Structured Work Bag',
//     network: 'General',
//     JBCP: 230, JBSP: 350, stock: 11,
//     category: 'Bags',
//     tags: ['work', 'professional', 'laptop'],
//     recommendedRange: 'Professionals',
//     imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', publicId: 'bag_003_1' },
//       { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', publicId: 'bag_003_2' },
//       { url: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&auto=format&fit=crop', publicId: 'bag_003_3' },
//     ],
//     description: 'Professional structured bag with laptop compartment and organiser pockets.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-KIT-003',
//     name: 'Air Fryer XL',
//     network: 'General',
//     JBCP: 480, JBSP: 720, stock: 9,
//     category: 'Kitchen',
//     tags: ['air fryer', 'healthy', 'cooking'],
//     recommendedRange: 'Home cooks',
//     imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop', publicId: 'kit_003_1' },
//       { url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop', publicId: 'kit_003_2' },
//       { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop', publicId: 'kit_003_3' },
//     ],
//     description: 'Large capacity air fryer with digital controls. Cook crispy meals with less oil.',
//     isFeatured: true, isBestSeller: true,
//   },
//   {
//     Bundle_id: 'LVB-DRS-003',
//     name: 'Bodycon Evening Dress',
//     network: 'General',
//     JBCP: 125, JBSP: 195, stock: 16,
//     category: 'Dresses',
//     tags: ['evening', 'bodycon', 'night out'],
//     recommendedRange: 'Night out',
//     imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop', publicId: 'dress_003_1' },
//       { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop', publicId: 'dress_003_2' },
//       { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop', publicId: 'dress_003_3' },
//     ],
//     description: 'Sleek bodycon dress designed for evenings out. Stretchy fabric for a perfect fit.',
//     isFeatured: false, isBestSeller: true,
//   },
//   {
//     Bundle_id: 'LVB-MAN-003',
//     name: 'Child Mannequin Set',
//     network: 'General',
//     JBCP: 270, JBSP: 410, stock: 4,
//     category: 'Mannequins',
//     tags: ['child', 'mannequin', 'set'],
//     recommendedRange: 'Kids boutiques',
//     imageUrl: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop', publicId: 'man_003_1' },
//       { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', publicId: 'man_003_2' },
//       { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop', publicId: 'man_003_3' },
//     ],
//     description: 'Set of 2 child mannequins in different sizes. Ideal for kids clothing boutiques.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-BAG-004',
//     name: 'Wicker Basket Bag',
//     network: 'General',
//     JBCP: 80, JBSP: 130, stock: 22,
//     category: 'Bags',
//     tags: ['wicker', 'summer', 'handwoven'],
//     recommendedRange: 'Beach & summer',
//     imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f43?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f43?w=800&auto=format&fit=crop', publicId: 'bag_004_1' },
//       { url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop', publicId: 'bag_004_2' },
//       { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop', publicId: 'bag_004_3' },
//     ],
//     description: 'Handwoven wicker basket bag with leather handles. A chic summer statement piece.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-KIT-004',
//     name: 'Electric Kettle Slim',
//     network: 'General',
//     JBCP: 135, JBSP: 210, stock: 13,
//     category: 'Kitchen',
//     tags: ['kettle', 'electric', 'slim'],
//     recommendedRange: 'Home & office',
//     imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop', publicId: 'kit_004_1' },
//       { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop', publicId: 'kit_004_2' },
//       { url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop', publicId: 'kit_004_3' },
//     ],
//     description: 'Sleek slim electric kettle with temperature control and keep-warm function.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-DRS-004',
//     name: 'Maxi Boho Dress',
//     network: 'General',
//     JBCP: 145, JBSP: 225, stock: 17,
//     category: 'Dresses',
//     tags: ['boho', 'maxi', 'festival'],
//     recommendedRange: 'Festivals & beach',
//     imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop', publicId: 'dress_004_1' },
//       { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop', publicId: 'dress_004_2' },
//       { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop', publicId: 'dress_004_3' },
//     ],
//     description: 'Free-flowing boho maxi dress with earthy tones. Perfect for festivals and beach days.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-PRF-004',
//     name: 'Aqua Fresh Cologne',
//     network: 'General',
//     JBCP: 120, JBSP: 190, stock: 25,
//     category: 'Perfumes',
//     tags: ['cologne', 'aqua', 'masculine'],
//     recommendedRange: 'Daily wear',
//     imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop', publicId: 'prf_004_1' },
//       { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop', publicId: 'prf_004_2' },
//       { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', publicId: 'prf_004_3' },
//     ],
//     description: 'A crisp aquatic cologne with citrus top notes and a clean woody base. Great for men.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-MAN-004',
//     name: 'Headless Display Mannequin',
//     network: 'General',
//     JBCP: 180, JBSP: 280, stock: 9,
//     category: 'Mannequins',
//     tags: ['headless', 'minimalist', 'display'],
//     recommendedRange: 'Modern boutiques',
//     imageUrl: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&auto=format&fit=crop', publicId: 'man_004_1' },
//       { url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop', publicId: 'man_004_2' },
//       { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop', publicId: 'man_004_3' },
//     ],
//     description: 'Minimalist headless female mannequin ideal for modern boutique displays.',
//     isFeatured: false, isBestSeller: false,
//   },
//   {
//     Bundle_id: 'LVB-BAG-005',
//     name: 'Velvet Clutch Bag',
//     network: 'General',
//     JBCP: 58, JBSP: 95, stock: 28,
//     category: 'Bags',
//     tags: ['clutch', 'velvet', 'evening'],
//     recommendedRange: 'Events & weddings',
//     imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
//     images: [
//       { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop', publicId: 'bag_005_1' },
//       { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f43?w=800&auto=format&fit=crop', publicId: 'bag_005_2' },
//       { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', publicId: 'bag_005_3' },
//     ],
//     description: 'Elegant velvet clutch bag with gold clasp closure. Perfect for weddings and events.',
//     isFeatured: false, isBestSeller: true,
//   },
// ]

// const seed = async () => {
//   try {
//     await mongoose.connect(DB_URI)
//     console.log('✅ Connected to DB')

//     await Bundle.deleteMany({ network: 'General' }) // only clears product seeds, not real bundles
//     console.log('🗑️  Cleared existing products')

//     await Bundle.insertMany(products)
//     console.log(`🌱 Seeded ${products.length} products`)

//     process.exit(0)
//   } catch (error) {
//     console.error('❌ Seed failed:', error)
//     process.exit(1)
//   }
// }

// seed()






import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import {DB_URI} from '../config/env.js'
const seed = async () => {
  try {
    await mongoose.connect(DB_URI)
    console.log('✅ Connected to DB')

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('12345678', salt)

    // Delete existing test users FIRST
    await User.deleteMany({
      email: { $regex: '@test.com' }
    })
    console.log('🗑️  Cleared existing test users')

    // Create 10 vendors
    const vendors = [
      {
        name: 'TechHub Solutions',
        email: 'techhub@test.com',
        phoneNumber: '0241234567',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'TECH-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Fashion Forward Inc',
        email: 'fashionforward@test.com',
        phoneNumber: '0241234568',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'FASH-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Home Essentials Ltd',
        email: 'homeessentials@test.com',
        phoneNumber: '0241234569',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'HOME-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Beauty & Wellness Co',
        email: 'beautywell@test.com',
        phoneNumber: '0241234570',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'BEAU-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Sports Gear Pro',
        email: 'sportsgear@test.com',
        phoneNumber: '0241234571',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'SPOR-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Gourmet Foods Global',
        email: 'gourmetfoods@test.com',
        phoneNumber: '0241234572',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'GOUR-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Electronics World',
        email: 'electronicsworld@test.com',
        phoneNumber: '0241234573',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'ELEC-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Artisan Crafts Gallery',
        email: 'artisancrafts@test.com',
        phoneNumber: '0241234574',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'ARTI-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Pet Paradise Store',
        email: 'petparadise@test.com',
        phoneNumber: '0241234575',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'PETS-001',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Kids Wonderland',
        email: 'kidswonderland@test.com',
        phoneNumber: '0241234576',
        password: hashedPassword,
        role: 'vendor',
        vendorCode: 'KIDS-001',
        isApproved: true,
        isAccountVerified: true,
      },
    ]

    // Insert vendors FIRST and get their ObjectIds
    const createdVendors = await User.insertMany(vendors)
    console.log(`🌱 Seeded ${createdVendors.length} vendors`)

    // Create 10 resellers linked to vendors by ObjectId
    const resellers = [
      {
        name: 'Ali Tech Reseller',
        email: 'alitech@test.com',
        phoneNumber: '0241234577',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[0]._id,  // ← Link to TECH vendor
        resellerCode: 'TECH-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Fatima Fashion Seller',
        email: 'fatimafashion@test.com',
        phoneNumber: '0241234578',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[1]._id,  // ← Link to FASH vendor
        resellerCode: 'FASH-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Kwame Home Goods',
        email: 'kwamehome@test.com',
        phoneNumber: '0241234579',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[2]._id,  // ← Link to HOME vendor
        resellerCode: 'HOME-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Ama Beauty Hub',
        email: 'amabeauty@test.com',
        phoneNumber: '0241234580',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[3]._id,  // ← Link to BEAU vendor
        resellerCode: 'BEAU-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Kofi Sports Store',
        email: 'kofisports@test.com',
        phoneNumber: '0241234581',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[4]._id,  // ← Link to SPOR vendor
        resellerCode: 'SPOR-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Nana Gourmet Delights',
        email: 'nanagourmet@test.com',
        phoneNumber: '0241234582',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[5]._id,  // ← Link to GOUR vendor
        resellerCode: 'GOUR-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Yaw Electronics Hub',
        email: 'yawelectronics@test.com',
        phoneNumber: '0241234583',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[6]._id,  // ← Link to ELEC vendor
        resellerCode: 'ELEC-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Abena Artisan Creations',
        email: 'abenaartisan@test.com',
        phoneNumber: '0241234584',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[7]._id,  // ← Link to ARTI vendor
        resellerCode: 'ARTI-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Bismark Pet Supplies',
        email: 'bismarkpets@test.com',
        phoneNumber: '0241234585',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[8]._id,  // ← Link to PETS vendor
        resellerCode: 'PETS-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
      {
        name: 'Cynthia Kids Paradise',
        email: 'cynthiakids@test.com',
        phoneNumber: '0241234586',
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[9]._id,  // ← Link to KIDS vendor
        resellerCode: 'KIDS-RES-001',
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      },
    ]

    // Insert resellers
    await User.insertMany(resellers)
    console.log(`🌱 Seeded ${resellers.length} resellers`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()