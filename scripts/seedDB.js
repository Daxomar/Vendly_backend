import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import Bundle from '../models/bundle.model.js'
import Transaction from '../models/transaction.model.js'
import Commission from '../models/commission.model.js'
import Payout from '../models/payout.model.js'
import ResellerBundlePrice from '../models/resellerBundlePrice.model.js'
import Delivery from '../models/delivery.model.js'
import StoreConfig from '../models/store.model.js'

const DB_URI = "mongodb://mongodb:27017/VENDLYTEST?replicaSet=rs0"
// const DB_URI = "mongodb+srv://daxohnero_db_user:6Iipcm3XAKJPUGe3@mini-importation-dev.5twxn8x.mongodb.net/?appName=Mini-Importation-DEV"


const seed = async () => {
  try {
    await mongoose.connect(DB_URI)
    console.log('✅ Connected to DB')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('12345678', salt)

    // Clear existing test data
    await Promise.all([
      User.deleteMany({ email: { $regex: '@test.com' } }),
      Bundle.deleteMany({}),
      Transaction.deleteMany({}),
      Commission.deleteMany({}),
      Payout.deleteMany({}),
      ResellerBundlePrice.deleteMany({}),
      Delivery.deleteMany({}),
      StoreConfig.deleteMany({})
    ])
    console.log('🗑️  Cleared existing test data')

    // ============ 1. CREATE ADMINS ============
    const admins = [
      {
        name: 'Super Admin',
        email: 'admin@test.com',
        phoneNumber: '0200000001',
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
        isAccountVerified: true,
      },
      {
        name: 'Admin User',
        email: 'admin2@test.com',
        phoneNumber: '0200000002',
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
        isAccountVerified: true,
      }
    ]
    const createdAdmins = await User.insertMany(admins)
    console.log(`✅ Created ${createdAdmins.length} admins`)

    // ============ 2. CREATE VENDORS ============
    const vendors = [
      { name: 'TechHub Solutions',     email: 'techhub@test.com',        phoneNumber: '0241234567', password: hashedPassword, role: 'vendor', vendorCode: 'TECH-001', isApproved: true, isAccountVerified: true },
      { name: 'Fashion Forward Inc',   email: 'fashionforward@test.com', phoneNumber: '0241234568', password: hashedPassword, role: 'vendor', vendorCode: 'FASH-001', isApproved: true, isAccountVerified: true },
      { name: 'Home Essentials Ltd',   email: 'homeessentials@test.com', phoneNumber: '0241234569', password: hashedPassword, role: 'vendor', vendorCode: 'HOME-001', isApproved: true, isAccountVerified: true },
      { name: 'Beauty & Wellness Co',  email: 'beautywell@test.com',     phoneNumber: '0241234570', password: hashedPassword, role: 'vendor', vendorCode: 'BEAU-001', isApproved: true, isAccountVerified: true },
      { name: 'Sports Gear Pro',       email: 'sportsgear@test.com',     phoneNumber: '0241234571', password: hashedPassword, role: 'vendor', vendorCode: 'SPOR-001', isApproved: true, isAccountVerified: true },
      { name: 'Gourmet Foods Global',  email: 'gourmetfoods@test.com',   phoneNumber: '0241234572', password: hashedPassword, role: 'vendor', vendorCode: 'GOUR-001', isApproved: true, isAccountVerified: true },
      { name: 'Electronics World',     email: 'electronicsworld@test.com',phoneNumber: '0241234573', password: hashedPassword, role: 'vendor', vendorCode: 'ELEC-001', isApproved: true, isAccountVerified: true },
      { name: 'Artisan Crafts Gallery',email: 'artisancrafts@test.com',  phoneNumber: '0241234574', password: hashedPassword, role: 'vendor', vendorCode: 'ARTI-001', isApproved: true, isAccountVerified: true },
      { name: 'Pet Paradise Store',    email: 'petparadise@test.com',    phoneNumber: '0241234575', password: hashedPassword, role: 'vendor', vendorCode: 'PETS-001', isApproved: true, isAccountVerified: true },
      { name: 'Kids Wonderland',       email: 'kidswonderland@test.com', phoneNumber: '0241234576', password: hashedPassword, role: 'vendor', vendorCode: 'KIDS-001', isApproved: true, isAccountVerified: true },
    ]
    const createdVendors = await User.insertMany(vendors)
    console.log(`✅ Created ${createdVendors.length} vendors`)

    // ============ 3. CREATE RESELLERS ============
    const resellerDefs = [
      { name: 'Ali Tech Reseller',        email: 'alitech@test.com',      phoneNumber: '0241234577', resellerCode: 'TECH-RES-001', vendorIdx: 0 },
      { name: 'Fatima Fashion Seller',    email: 'fatimafashion@test.com', phoneNumber: '0241234578', resellerCode: 'FASH-RES-001', vendorIdx: 1 },
      { name: 'Kwame Home Goods',         email: 'kwamehome@test.com',     phoneNumber: '0241234579', resellerCode: 'HOME-RES-001', vendorIdx: 2 },
      { name: 'Ama Beauty Hub',           email: 'amabeauty@test.com',     phoneNumber: '0241234580', resellerCode: 'BEAU-RES-001', vendorIdx: 3 },
      { name: 'Kofi Sports Store',        email: 'kofisports@test.com',    phoneNumber: '0241234581', resellerCode: 'SPOR-RES-001', vendorIdx: 4 },
      { name: 'Nana Gourmet Delights',    email: 'nanagourmet@test.com',   phoneNumber: '0241234582', resellerCode: 'GOUR-RES-001', vendorIdx: 5 },
      { name: 'Yaw Electronics Hub',      email: 'yawelectronics@test.com',phoneNumber: '0241234583', resellerCode: 'ELEC-RES-001', vendorIdx: 6 },
      { name: 'Abena Artisan Creations',  email: 'abenaartisan@test.com',  phoneNumber: '0241234584', resellerCode: 'ARTI-RES-001', vendorIdx: 7 },
      { name: 'Bismark Pet Supplies',     email: 'bismarkpets@test.com',   phoneNumber: '0241234585', resellerCode: 'PETS-RES-001', vendorIdx: 8 },
      { name: 'Cynthia Kids Paradise',    email: 'cynthiakids@test.com',   phoneNumber: '0241234586', resellerCode: 'KIDS-RES-001', vendorIdx: 9 },
    ]

    const createdResellers = await User.insertMany(
      resellerDefs.map(r => ({
        name: r.name,
        email: r.email,
        phoneNumber: r.phoneNumber,
        password: hashedPassword,
        role: 'user',
        parentVendor: createdVendors[r.vendorIdx]._id,
        resellerCode: r.resellerCode,
        isApproved: true,
        isAccountVerified: true,
        commissionRate: 5,
        totalCommissionEarned: 0,
        totalCommissionPaidOut: 0,
        totalSales: 0,
      }))
    )
    console.log(`✅ Created ${createdResellers.length} resellers`)

    // ============ 4. CREATE BUNDLES (10 per vendor) ============
    const allBundles = []
    const bundleNames = ['Starter', 'Basic', 'Pro', 'Premium', 'Elite', 'Deluxe', 'Ultimate', 'Platinum', 'Diamond', 'Exclusive']
    const bundleCategories = ['Tech', 'Fashion', 'Home', 'Beauty', 'Sports', 'Gourmet', 'Electronics', 'Artisan', 'Pets', 'Kids']
//   Per-vendor image pools — 10 images each, cycled across bundle tiers
//     Images sourced from the product seed (same Unsplash IDs for determinism)

    const vendorImagePools = {
      'TECH-001': [
        { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop', publicId: 'tech_1' },
        { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop', publicId: 'tech_2' },
        { url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop', publicId: 'tech_3' },
        { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop', publicId: 'tech_4' },
        { url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop', publicId: 'tech_5' },
        { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop', publicId: 'tech_6' },
        { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop', publicId: 'tech_7' },
        { url: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800&auto=format&fit=crop', publicId: 'tech_8' },
        { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop', publicId: 'tech_9' },
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop', publicId: 'tech_10' },
      ],
      'FASH-001': [
        { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop', publicId: 'fash_1' },
        { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop', publicId: 'fash_2' },
        { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop', publicId: 'fash_3' },
        { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop', publicId: 'fash_4' },
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', publicId: 'fash_5' },
        { url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop', publicId: 'fash_6' },
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', publicId: 'fash_7' },
        { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop', publicId: 'fash_8' },
        { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f43?w=800&auto=format&fit=crop', publicId: 'fash_9' },
        { url: 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800&auto=format&fit=crop', publicId: 'fash_10' },
      ],
      'HOME-001': [
        { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop', publicId: 'home_1' },
        { url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop', publicId: 'home_2' },
        { url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop', publicId: 'home_3' },
        { url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop', publicId: 'home_4' },
        { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop', publicId: 'home_5' },
        { url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop', publicId: 'home_6' },
        { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop', publicId: 'home_7' },
        { url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop', publicId: 'home_8' },
        { url: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&auto=format&fit=crop', publicId: 'home_9' },
        { url: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800&auto=format&fit=crop', publicId: 'home_10' },
      ],
      'BEAU-001': [
        { url: 'https://images.unsplash.com/photo-1590156546382-7db9a7d4b326?w=800&auto=format&fit=crop', publicId: 'beau_1' },
        { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&auto=format&fit=crop', publicId: 'beau_2' },
        { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop', publicId: 'beau_3' },
        { url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop', publicId: 'beau_4' },
        { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop', publicId: 'beau_5' },
        { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop', publicId: 'beau_6' },
        { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop', publicId: 'beau_7' },
        { url: 'https://images.unsplash.com/photo-1583241475880-083f84372725?w=800&auto=format&fit=crop', publicId: 'beau_8' },
        { url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop', publicId: 'beau_9' },
        { url: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800&auto=format&fit=crop', publicId: 'beau_10' },
      ],
      'SPOR-001': [
        { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop', publicId: 'spor_1' },
        { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop', publicId: 'spor_2' },
        { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop', publicId: 'spor_3' },
        { url: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800&auto=format&fit=crop', publicId: 'spor_4' },
        { url: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=800&auto=format&fit=crop', publicId: 'spor_5' },
        { url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&auto=format&fit=crop', publicId: 'spor_6' },
        { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop', publicId: 'spor_7' },
        { url: 'https://images.unsplash.com/photo-1598289431512-b97b0917afars?w=800&auto=format&fit=crop', publicId: 'spor_8' },
        { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop', publicId: 'spor_9' },
        { url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop', publicId: 'spor_10' },
      ],
      'GOUR-001': [
        { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop', publicId: 'gour_1' },
        { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop', publicId: 'gour_2' },
        { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop', publicId: 'gour_3' },
        { url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop', publicId: 'gour_4' },
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop', publicId: 'gour_5' },
        { url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop', publicId: 'gour_6' },
        { url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop', publicId: 'gour_7' },
        { url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop', publicId: 'gour_8' },
        { url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop', publicId: 'gour_9' },
        { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop', publicId: 'gour_10' },
      ],
      'ELEC-001': [
        { url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop', publicId: 'elec_1' },
        { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop', publicId: 'elec_2' },
        { url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop', publicId: 'elec_3' },
        { url: 'https://images.unsplash.com/photo-1583394293214-0b3e9f9b6b74?w=800&auto=format&fit=crop', publicId: 'elec_4' },
        { url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop', publicId: 'elec_5' },
        { url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop', publicId: 'elec_6' },
        { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop', publicId: 'elec_7' },
        { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop', publicId: 'elec_8' },
        { url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop', publicId: 'elec_9' },
        { url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&auto=format&fit=crop', publicId: 'elec_10' },
      ],
      'ARTI-001': [
        { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop', publicId: 'arti_1' },
        { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&auto=format&fit=crop', publicId: 'arti_2' },
        { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop', publicId: 'arti_3' },
        { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop', publicId: 'arti_4' },
        { url: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop', publicId: 'arti_5' },
        { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop', publicId: 'arti_6' },
        { url: 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=800&auto=format&fit=crop', publicId: 'arti_7' },
        { url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&auto=format&fit=crop', publicId: 'arti_8' },
        { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop', publicId: 'arti_9' },
        { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop', publicId: 'arti_10' },
      ],
      'PETS-001': [
        { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop', publicId: 'pets_1' },
        { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=800&auto=format&fit=crop', publicId: 'pets_2' },
        { url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop', publicId: 'pets_3' },
        { url: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=800&auto=format&fit=crop', publicId: 'pets_4' },
        { url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&auto=format&fit=crop', publicId: 'pets_5' },
        { url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&auto=format&fit=crop', publicId: 'pets_6' },
        { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop', publicId: 'pets_7' },
        { url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&auto=format&fit=crop', publicId: 'pets_8' },
        { url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&auto=format&fit=crop', publicId: 'pets_9' },
        { url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&auto=format&fit=crop', publicId: 'pets_10' },
      ],
      'KIDS-001': [
        { url: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop', publicId: 'kids_1' },
        { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop', publicId: 'kids_2' },
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', publicId: 'kids_3' },
        { url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop', publicId: 'kids_4' },
        { url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop', publicId: 'kids_5' },
        { url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop', publicId: 'kids_6' },
        { url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop', publicId: 'kids_7' },
        { url: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop', publicId: 'kids_8' },
        { url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&auto=format&fit=crop', publicId: 'kids_9' },
        { url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop', publicId: 'kids_10' },
      ],
    }

    for (let i = 0; i < createdVendors.length; i++) {
      const vendor = createdVendors[i]
      const imagePool = vendorImagePools[vendor.vendorCode] || vendorImagePools['TECH-001']
      for (let j = 0; j < 10; j++) {
         // Each bundle gets its own primary image + 2 supporting images from the pool (cycled)
        const primary   = imagePool[j]
        const secondary = imagePool[(j + 3) % 10]
        const tertiary  = imagePool[(j + 6) % 10]
        allBundles.push({
          Bundle_id: `${vendor.vendorCode}-${bundleNames[j].toUpperCase()}`,
          Data: `${(j + 1) * 5}GB`,
          name: `${bundleNames[j]} ${vendor.name} Bundle`,
          JBCP: (j + 1) * 10 + Math.random() * 5,
          JBSP: (j + 1) * 15 + Math.random() * 5,
          network: ['mtn', 'telecel', 'at'][i % 3],
          size: `${(j + 1) * 5}GB`,
          Duration: 'non-expiry',
          isActive: true,
          category: bundleCategories[i % bundleCategories.length],
          parentVendor: vendor._id,
          recommendedRange: `${(j + 1) * 20} – ${(j + 1) * 30}`,
         imageUrl: primary.url,
         images: [                                        // ✅ gallery images
        { url: primary.url,   publicId: `${primary.publicId}_a`   },
        { url: secondary.url, publicId: `${secondary.publicId}_b` },
        { url: tertiary.url,  publicId: `${tertiary.publicId}_c`  },
      ],
        })
      }
    }
    const createdBundles = await Bundle.insertMany(allBundles)
    console.log(`✅ Created ${createdBundles.length} bundles`)

    // ============ 5. CREATE DELIVERY LOCATIONS (5 per vendor) ============
    const allDeliveryLocations = []
    const deliveryCities = ['Accra', 'Kumasi', 'Takoradi', 'Cape Coast', 'Tema', 'Sekondi', 'Koforidua', 'Tamale', 'Bolgatanga', 'Wa']

    for (let i = 0; i < createdVendors.length; i++) {
      const vendor = createdVendors[i]
      for (let j = 0; j < 5; j++) {
        allDeliveryLocations.push({
          location: `${deliveryCities[j]}-${vendor.vendorCode}`,
          label: `${deliveryCities[j]} Delivery`,
          description: `Express delivery to ${deliveryCities[j]} and surrounding areas`,
          note: `Standard delivery: 1-2 business days`,
          price: 50 + (j * 10),
          active: true,
          parentVendor: vendor._id,
        })
      }
    }
    const createdDeliveries = await Delivery.insertMany(allDeliveryLocations)
    console.log(`✅ Created ${createdDeliveries.length} delivery locations`)

    // ============ 6. CREATE TRANSACTIONS + COMMISSIONS (10 per reseller) ============
    const cities = ['Accra', 'Kumasi', 'Takoradi', 'Tema', 'Cape Coast', 'Pokuase', 'Ashaiman', 'Ofankor']
    const shippingMethods = [
      { label: 'Standard Delivery', price: 30 },
      { label: 'Express Delivery',  price: 75 },
      { label: 'Special Delivery',  price: 100 },
    ]
    const month = new Date().toISOString().substring(0, 7)

    let totalTransactionsCreated = 0
    let totalCommissionsCreated = 0

    for (let i = 0; i < createdResellers.length; i++) {
      const reseller = createdResellers[i]
      const vendor = createdVendors[resellerDefs[i].vendorIdx]
      const vendorBundles = createdBundles.filter(b => b.parentVendor.toString() === vendor._id.toString())

      const resellerPriceMap = {}
      for (const bundle of vendorBundles) {
        const markup = 5 + Math.random() * 30
        resellerPriceMap[bundle._id.toString()] = {
          customPrice: bundle.JBSP + markup,
          profit: markup,
          network: bundle.network,
        }
      }

      let resellerCommissionEarned = 0

      for (let j = 0; j < 10; j++) {
        const cartItemCount = 2 + Math.floor(Math.random() * 3)
        const cartItems = []
        let subtotal = 0
        let txProfit = 0
        let txNetwork = 'mtn'

        for (let k = 0; k < cartItemCount; k++) {
          const bundle = vendorBundles[(j + k) % vendorBundles.length]
          const priceInfo = resellerPriceMap[bundle._id.toString()]
          const quantity = 1 + Math.floor(Math.random() * 3)
          const itemPrice = priceInfo.customPrice * quantity
          const itemProfit = priceInfo.profit * quantity
          subtotal += itemPrice
          txProfit += itemProfit
          if (k === 0) txNetwork = priceInfo.network
          cartItems.push({
            bundleId: bundle._id,
            bundleName: bundle.name,
            quantity,
          })
        }

        const commissionAmount = Math.max(txProfit, 0.01)

        const shippingMethod = shippingMethods[Math.floor(Math.random() * shippingMethods.length)]
        const paystackCharge = subtotal * 0.029 + 0.5
        const grandTotal = subtotal + shippingMethod.price + paystackCharge
        const timestamp = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        const reference = `VendPay_${timestamp}_${Math.floor(Math.random() * 1000000)}`
        const selectedCity = cities[Math.floor(Math.random() * cities.length)]

        const transaction = await Transaction.create({
          email: reseller.email,
          cartItems,
          deliveryDetails: {
            fullName: reseller.name,
            email: reseller.email,
            phone: reseller.phoneNumber,
            address: `${selectedCity} Area, Ghana`,
            city: selectedCity,
            notes: '',
          },
          resellerCode: reseller.resellerCode,
          amount: grandTotal,
          currency: 'GHS',
          reference,
          status: 'success',
          channel: 'paystack',
          network: txNetwork,
          parentVendor: vendor._id,
          paystackCharge,
          subtotal,
          shippingMethod,
          deliveryStatus: 'delivered',
          deliveredAt: new Date(timestamp),
          provider_response: {
            gateway_response: 'Approved',
            paid_at: new Date(timestamp).toISOString(),
            ip_address: '154.161.140.236',
          },
          metadata: {
            resellerId: reseller._id.toString(),
            resellerName: reseller.name,
            resellerCode: reseller.resellerCode,
            vendorCode: vendor.vendorCode,
            vendorName: vendor.name,
            itemCount: cartItems.length,
            cartTotal: subtotal,
            shippingCost: shippingMethod.price,
            paystackFee: paystackCharge,
            grandTotal,
            network: txNetwork,
          },
        })
        totalTransactionsCreated++

        await Commission.create({
          reseller: reseller._id,
          resellerName: reseller.name,
          transaction: transaction._id,
          bundle: cartItems[0].bundleId,
          amount: commissionAmount,
          percentage: 5,
          status: 'earned',
          month,
          parentVendor: vendor._id,
        })
        totalCommissionsCreated++

        resellerCommissionEarned += commissionAmount
      }

      const safeEarned = Math.max(resellerCommissionEarned, 0.01)

      console.log(`   Reseller ${reseller.name} → earned: GHS ${safeEarned.toFixed(2)}`)

      const updateResult = await User.findByIdAndUpdate(
        reseller._id,
        {
          $set: {
            totalCommissionEarned: safeEarned,
            totalCommissionPaidOut: 0,
            totalSales: 10,  // ✅ FIXED: 10 successful transactions per reseller
          }
        },
        { new: true }
      )

      if (!updateResult || updateResult.totalCommissionEarned !== safeEarned) {
        console.warn(`⚠️  Update may have failed for ${reseller.name}, retrying...`)
        await User.updateOne(
          { _id: reseller._id },
          {
            $set: {
              totalCommissionEarned: safeEarned,
              totalCommissionPaidOut: 0,
              totalSales: 10,
            }
          }
        )
      }
    }

    console.log(`✅ Created ${totalTransactionsCreated} transactions (all success)`)
    console.log(`✅ Created ${totalCommissionsCreated} commissions (all earned, markup-based)`)

    // ============ 7. CREATE PAYOUTS (all pending) ============
    const payoutNetworks = ['MTN', 'Vodafone', 'AirtelTigo']
    let totalPayoutsCreated = 0

    for (let i = 0; i < createdResellers.length; i++) {
      const reseller = createdResellers[i]
      const vendor = createdVendors[resellerDefs[i].vendorIdx]

      const freshReseller = await User.findById(reseller._id).lean()
      const totalEarned = freshReseller.totalCommissionEarned
      const makeCharge = (amount) => amount > 50 ? 2.5 : 1.5

      await Payout.create({
        reseller: reseller._id,
        amount: totalEarned,
        payoutCharge: makeCharge(totalEarned),
        netAmount: totalEarned - makeCharge(totalEarned),
        network: payoutNetworks[i % 3],
        phoneNumber: reseller.phoneNumber,
        accountName: reseller.name,
        status: 'pending',
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        processedAt: null,
        processedBy: null,
        transactionReference: `PAYOUT-PEND-${reseller._id}-${Date.now()}`,
        parentVendor: vendor._id,
      })
      totalPayoutsCreated++
    }

    console.log(`✅ Created ${totalPayoutsCreated} payouts (all pending)`)

    // ============ 8. CREATE RESELLER BUNDLE PRICES ============
    const allResellerPrices = []

    for (let i = 0; i < createdResellers.length; i++) {
      const reseller = createdResellers[i]
      const vendor = createdVendors[resellerDefs[i].vendorIdx]
      const vendorBundles = createdBundles.filter(b => b.parentVendor.toString() === vendor._id.toString())

      for (const bundle of vendorBundles) {
        const markup = 5 + Math.random() * 30
        const customPrice = bundle.JBSP + markup
        allResellerPrices.push({
          resellerId: reseller._id,
          bundleId: bundle._id,
          customPrice,
          basePriceSnapshot: bundle.JBSP,
          commission: customPrice - bundle.JBSP,
          isActive: true,
          parentVendor: vendor._id,
        })
      }
    }
    const createdPrices = await ResellerBundlePrice.insertMany(allResellerPrices)
    console.log(`✅ Created ${createdPrices.length} reseller bundle prices`)

    // ============ 9. CREATE STORE CONFIGS (one per vendor) ============
    const allStoreConfigs = []

    for (let i = 0; i < createdVendors.length; i++) {
      const vendor = createdVendors[i]

      allStoreConfigs.push({
        parentVendor: vendor._id,
        isActive: true,
        branding: {
          storeName: `${vendor.name} Store`,
          tagline: `Premium products from ${vendor.name}`,
          ownerName: vendor.name,
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
              title: `Welcome to ${vendor.name}`,
              subtitle: `Shop quality products curated for you`,
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
          announcementBar: 'Fast delivery on all orders 🎉',
          navLinks: [
            { label: 'Shop', url: '/store/shop' },
            { label: 'About', url: '/store/about' },
            { label: 'Contact', url: '/store/contact' },
          ],
          shopLinks: [
            { label: 'All Products', url: '/store/shop' },
            { label: 'Popular', url: '/store/shop?sort=popular' },
          ],
          customerCareLinks: [
            { label: 'Track My Order', url: '/track' },
            { label: 'Return Policy', url: '/returns' },
            { label: 'FAQs', url: '/faqs' },
          ],
          companyLinks: [
            { label: 'About Us', url: '/about' },
            { label: 'Contact', url: '/contact' },
          ],
        },
        contact: {
          info: {
            phone: vendor.phoneNumber,
            email: vendor.email,
            address: `Accra, Ghana`,
            pickupAvailable: true,
          },
          socials: {
            instagram: '#',
            facebook: '#',
            whatsapp: vendor.phoneNumber,
            twitter: '#',
          },
        },
        trust: {
          badges: [
            { icon: '🚚', label: 'Fast Delivery' },
            { icon: '🔒', label: 'Secure Checkout' },
            { icon: '↩️', label: '30-Day Returns' },
            { icon: '⭐', label: 'Quality Assured' },
          ],
          newsletterHeading: 'Join Our Community',
          newsletterSubtext: 'Get exclusive deals and updates.',
          footerText: `© 2026 ${vendor.name}. All rights reserved.`,
        },
      })
    }

    const createdStoreConfigs = await StoreConfig.insertMany(allStoreConfigs)
    console.log(`✅ Created ${createdStoreConfigs.length} store configs (1 per vendor)`)

    // ============ SUMMARY ============
    console.log('\n========== 🎉 SEED COMPLETE ==========')
    console.log(`✅ Admins:                ${createdAdmins.length}`)
    console.log(`✅ Vendors:               ${createdVendors.length}`)
    console.log(`✅ Resellers:             ${createdResellers.length}`)
    console.log(`✅ Bundles:               ${createdBundles.length} (10 per vendor)`)
    console.log(`✅ Delivery Locations:    ${createdDeliveries.length} (5 per vendor)`)
    console.log(`✅ Transactions:          ${totalTransactionsCreated} (10 per reseller, all success)`)
    console.log(`✅ Commissions:           ${totalCommissionsCreated} (1 per transaction, all earned)`)
    console.log(`✅ Payouts:               ${totalPayoutsCreated} (all pending)`)
    console.log(`✅ Reseller Bundle Prices:${createdPrices.length}`)
    console.log(`✅ Store Configs:         ${createdStoreConfigs.length} (1 per vendor)`)
    console.log('\n🔐 Password: 12345678')
    console.log('📧 Admin:     admin@test.com | admin2@test.com')
    console.log('📧 Vendors:   techhub@test.com → kidswonderland@test.com')
    console.log('📧 Resellers: alitech@test.com → cynthiakids@test.com')
    console.log('========================================\n')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()



