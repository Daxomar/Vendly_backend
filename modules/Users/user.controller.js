import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js'
import mongoose from 'mongoose';
import Transaction from '../../models/transaction.model.js';
import { nanoid } from "nanoid";
import { sendWelcomeEmail, sendOTPEmail, sendInviteEmail, sendApprovedEmail } from "../../services/emailServices/email.service.js";
import { success } from 'zod/v4';
import { fa } from 'zod/v4/locales';


export const getReseller = async (req, res, next) => {

  try {

    // real usage is this don't forget
    // const { id } = req.user


    //Manual setting for testing purposes
    // const id = "6942af84c58df50e5dd16d00"

    const { id } = req.user


    const user = await User.findById(id).select('-password');

    // const user = await User.findById(req.params.id).select('-password'); // brings eveything out aside from the password of a user

    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404;
      throw error
    }


    let resellerCode = null;


    // Only include resellerCode if user is verified and approved
    if (user.isAccountVerified && user.isApproved) {
      resellerCode = user.resellerCode;
    }

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
      isApproved: user.isApproved,
      resellerCode: resellerCode,
      commissionRate: user.commissionRate,
      totalCommissionsEarned: user.totalCommissionEarned,
      totalCommissionsPaidOut: user.totalCommissionPaidOut,
      totalSales: user.totalSales,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data: safeUser
    }) // Right now i am pushing all the user details, would have to make it more specific


    // res.status(200).json({
    //   success: true,
    //   userData:{
    //     name:user.name,
    //     isAccountVerified: user.isAccountVerified
    //   }
    // })


  } catch (error) {

    next(error)

  }
}

export const getResellerDetail = async (req, res) => {
  try {
    const { id } = req.params
    const resellerId = id
    console.log("Param", req.params)
    console.log("getResellerDetail Migration Successful",  resellerId, id)
    const { parentVendor } = req.tenantFilter

    console.log('Fetching reseller detail for:', { resellerId, parentVendor })
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(resellerId),
          role: 'user',
          // parentVendor: new mongoose.Types.ObjectId(parentVendor)
        }
      },
      {
        $lookup: {
          from: 'transactions',
          let: { resellerCode: '$resellerCode' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$resellerCode', '$$resellerCode'] }
              }
            }
          ],
          as: 'transactions'
        }
      },
      {
        $lookup: {
          from: 'commissions',
          let: { resellerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$reseller', '$$resellerId'] }
              }
            }
          ],
          as: 'commissions'
        }
      },
      {
        $lookup: {
          from: 'payouts',
          let: { resellerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$reseller', '$$resellerId'] }
              }
            }
          ],
          as: 'payouts'
        }
      },
      {
        $addFields: {
          successfulTxns: {
            $filter: { input: '$transactions', as: 't', cond: { $eq: ['$$t.status', 'success'] } }
          },
          pendingTxns: {
            $filter: { input: '$transactions', as: 't', cond: { $eq: ['$$t.status', 'pending'] } }
          },
          totalCommissionEarned: { $sum: '$commissions.amount' },
          totalCommissionPaidOut: {
            $sum: {
              $map: {
                input: {
                  $filter: { input: '$payouts', as: 'p', cond: { $eq: ['$$p.status', 'completed'] } }
                },
                as: 'p',
                in: '$$p.amount'
              }
            }
          },
          totalTxnCount: { $size: '$transactions' },
          successTxnCount: {
            $size: {
              $filter: { input: '$transactions', as: 't', cond: { $eq: ['$$t.status', 'success'] } }
            }
          },
          pendingTxnCount: {
            $size: {
              $filter: { input: '$transactions', as: 't', cond: { $eq: ['$$t.status', 'pending'] } }
            }
          },
          recentTransactions: { $slice: ['$transactions', 5] },
          recentPayouts: { $slice: ['$payouts', 5] },
          allCartItems: {
            $reduce: {
              input: {
                $filter: { input: '$transactions', as: 't', cond: { $eq: ['$$t.status', 'success'] } }
              },
              initialValue: [],
              in: { $concatArrays: ['$$value', { $ifNull: ['$$this.cartItems', []] }] }
            }
          },
          thisMonthTxns: {
            $filter: {
              input: '$transactions',
              as: 't',
              cond: {
                $and: [
                  { $eq: ['$$t.status', 'success'] },
                  {
                    $gte: ['$$t.createdAt', {
                      $dateFromParts: {
                        year: { $year: '$$NOW' },
                        month: { $month: '$$NOW' },
                        day: 1
                      }
                    }]
                  }
                ]
              }
            }
          },
          lastMonthTxns: {
            $filter: {
              input: '$transactions',
              as: 't',
              cond: {
                $and: [
                  { $eq: ['$$t.status', 'success'] },
                  {
                    $gte: ['$$t.createdAt', {
                      $dateFromParts: {
                        year:  { $year:  { $subtract: ['$$NOW', 2592000000] } },
                        month: { $month: { $subtract: ['$$NOW', 2592000000] } },
                        day: 1
                      }
                    }]
                  },
                  {
                    $lt: ['$$t.createdAt', {
                      $dateFromParts: {
                        year: { $year: '$$NOW' },
                        month: { $month: '$$NOW' },
                        day: 1
                      }
                    }]
                  }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          availableBalance: { $subtract: ['$totalCommissionEarned', '$totalCommissionPaidOut'] },
          pendingTransactionRisk: {
            $cond: [
              { $gt: ['$totalTxnCount', 0] },
              { $multiply: [{ $divide: ['$pendingTxnCount', '$totalTxnCount'] }, 100] },
              0
            ]
          },
          salesVelocity: {
            $cond: [
              { $gt: [{ $size: '$lastMonthTxns' }, 0] },
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: [{ $size: '$thisMonthTxns' }, { $size: '$lastMonthTxns' }] },
                      { $size: '$lastMonthTxns' }
                    ]
                  },
                  100
                ]
              },
              0
            ]
          },
          thisMonthRevenue: { $sum: '$thisMonthTxns.amount' },
          lastMonthRevenue: { $sum: '$lastMonthTxns.amount' },
          totalSalesVolume: { $sum: '$successfulTxns.amount' },
          totalSalesCount: '$successTxnCount'
        }
      },
      {
        $project: {
          password: 0,
          verifyOtp: 0,
          verifyOtpExpireAt: 0,
          resetOtp: 0,
          resetOtpExpireAt: 0,
          __v: 0,
          transactions: 0,
          commissions: 0,
          payouts: 0,
          successfulTxns: 0,
          pendingTxns: 0,
          thisMonthTxns: 0,
          lastMonthTxns: 0
        }
      }
    ]

    const [result] = await User.aggregate(pipeline)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Reseller not found'
      })
    }

    // Top 3 products — separate aggregation using resellerCode from result
    const top3Products = await Transaction.aggregate([
      {
        $match: {
          resellerCode: result.resellerCode,
          status: 'success'
        }
      },
      { $unwind: '$cartItems' },
      {
        $group: {
          _id: '$cartItems.bundleName',
          totalUnits: { $sum: '$cartItems.quantity' },
        }
      },
      { $sort: { totalUnits: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          bundleName: '$_id',
          totalUnits: 1,
        }
      }
    ])

    delete result.allCartItems
    result.top3Products = top3Products.map((p, i) => ({ rank: i + 1, ...p }))

    return res.status(200).json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error fetching reseller detail:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reseller detail',
      error: error.message
    })
  }
}






//ACCOUNT CREATION BY ADMIN DIRECTLY

// export const getResellers = async (req, res, next) => {
//   try {
//     // const { id, email, role } = req.user;

//     const { id, email, role } = req.user;
//     console.log("getUSer Migration Successful")


//     // Pagination setup
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Search setup
//     const search = req.query.search ? req.query.search.trim() : "";

//     // Build search query
//     const query = {
//       ...(search && {
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { email: { $regex: search, $options: "i" } },
//         ],
//       }),

//       $and: [
//         {
//           $or: [
//             { Vendor: false },
//             { Vendor: null },
//             { Vendor: { $exists: false } },
//           ],
//         },
//       ],
//     };

//     // Execute queries in parallel for better performance
//     const [users, totalUsers, analytics] = await Promise.all([
//       // Fetch paginated users
//       User.find(query)
//         .select('-password -accessToken -refreshToken') // Exclude sensitive fields
//         .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 }) // Newest first
//         .lean(),

//       // Get total count for pagination
//       User.countDocuments(query),

//       // Get analytics (aggregate all users, not just paginated)
//       User.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalCommissionEarned: { $sum: '$totalCommissionEarned' },
//             totalCommissionPaidOut: { $sum: '$totalCommissionPaidOut' },
//             totalResellers: { $sum: 1 },
//             // activeResellers: {
//             //   $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
//             // },

//             // Active resellers must have BOTH isApproved AND isAccountVerified as true
//             activeResellers: {
//               $sum: {
//                 $cond: [
//                   {
//                     $and: [
//                       { $eq: ['$isApproved', true] },
//                       { $eq: ['$isAccountVerified', true] }
//                     ]
//                   },
//                   1,
//                   0
//                 ]
//               }
//             },
//             // pendingResellers: {
//             //   $sum: { $cond: [{ $eq: ['$isApproved', false] }, 1, 0] }
//             pendingResellers: {
//               $sum: {
//                 $cond: [
//                   {
//                     $or: [
//                       { $eq: ['$isApproved', false] },
//                       { $eq: ['$isAccountVerified', false] }
//                     ]
//                   },
//                   1,
//                   0
//                 ]
//               }
//             }
//           }
//         }
//       ])
//     ]);

//     // Handle empty search results or no users
//     if (!users || users.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         analytics: {
//           totalCommissionEarned: 0,
//           totalCommissionPaidOut: 0,
//           totalResellers: 0,
//           activeResellers: 0,
//           pendingResellers: 0,
//           availableBalance: 0,
//           currency: 'GHS'
//         },
//         message: search
//           ? "No users matched your search query"
//           : "No users found in the database",
//         pagination: {
//           currentPage: page,
//           totalPages: 0,
//           totalUsers: 0,
//           limit,
//           hasNextPage: false,
//           hasPrevPage: false,
//           nextPage: null,
//           prevPage: null,
//         },
//       });
//     }

//     // Clean users model - safe to return to frontend
//     const safeUsers = users.map(user => ({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role || 'user',
//       status: user.isApproved ? 'active' : 'pending',
//       isApproved: user.isApproved || false,
//       isAccountVerified: user.isAccountVerified || false,
//       createdAt: user.createdAt,
//       totalCommissionEarned: user.totalCommissionEarned || 0,
//       totalCommissionPaidOut: user.totalCommissionPaidOut || 0,
//       salesVolume: user.totalCommissionEarned || 0,
//       availableBalance: (user.totalCommissionEarned || 0) - (user.totalCommissionPaidOut || 0)
//     }));

//     // Extract analytics data
//     const analyticsData = analytics[0] || {
//       totalCommissionEarned: 0,
//       totalCommissionPaidOut: 0,
//       totalResellers: 0,
//       activeResellers: 0,
//       pendingResellers: 0
//     };

//     // Calculate available balance across all resellers
//     const availableBalance = analyticsData.totalCommissionEarned - analyticsData.totalCommissionPaidOut;

//     // Pagination info
//     const totalPages = Math.ceil(totalUsers / limit);
//     const hasNextPage = page < totalPages;
//     const hasPrevPage = page > 1;

//     // Return data with analytics
//     res.status(200).json({
//       success: true,
//       data: safeUsers,
//       analytics: {
//         totalCommissionEarned: parseFloat(analyticsData.totalCommissionEarned.toFixed(2)),
//         totalCommissionPaidOut: parseFloat(analyticsData.totalCommissionPaidOut.toFixed(2)),
//         totalResellers: analyticsData.totalResellers,
//         activeResellers: analyticsData.activeResellers,
//         pendingResellers: analyticsData.pendingResellers,
//         availableBalance: parseFloat(availableBalance.toFixed(2)),
//         currency: 'GHS'
//       },
//       message: `Here are all the resellers. Request made by admin with id: ${id}`,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalUsers,
//         limit,
//         hasNextPage,
//         hasPrevPage,
//         nextPage: hasNextPage ? page + 1 : null,
//         prevPage: hasPrevPage ? page - 1 : null,
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching resellers:', error);

//     // Handle custom errors with statusCode
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({
//         success: false,
//         message: error.message
//       });
//     }

//     // Handle any other unexpected errors
//     return res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message
//     });
//   }
// };

export const getResellers = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";

    // Base query for resellers only
    const baseQuery = {
      role: "user",
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    };

    // Merge with tenant filter if it exists (vendor route)
    const query = { ...baseQuery, ...req.tenantFilter };
    const [users, totalUsers, analytics] = await Promise.all([
      User.find(query)
        .select('-password -accessToken -refreshToken')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      User.countDocuments(query),

      User.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalCommissionEarned: { $sum: '$totalCommissionEarned' },
            totalCommissionPaidOut: { $sum: '$totalCommissionPaidOut' },
            totalResellers: { $sum: 1 },
            activeResellers: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$isApproved', true] },
                      { $eq: ['$isAccountVerified', true] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            pendingResellers: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ['$isApproved', false] },
                      { $eq: ['$isAccountVerified', false] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        analytics: {
          totalCommissionEarned: 0,
          totalCommissionPaidOut: 0,
          totalResellers: 0,
          activeResellers: 0,
          pendingResellers: 0,
          availableBalance: 0,
          currency: 'GHS'
        },
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalUsers: 0,
          limit,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        },
      });
    }

    const safeUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      resellerCode: user.resellerCode,
      status: user.isApproved && user.isAccountVerified ? 'active' : 'pending',
      isApproved: user.isApproved || false,
      isAccountVerified: user.isAccountVerified || false,
      createdAt: user.createdAt,
      totalCommissionEarned: user.totalCommissionEarned || 0,
      totalCommissionPaidOut: user.totalCommissionPaidOut || 0,
      availableBalance: (user.totalCommissionEarned || 0) - (user.totalCommissionPaidOut || 0)
    }));

    const analyticsData = analytics[0] || {
      totalCommissionEarned: 0,
      totalCommissionPaidOut: 0,
      totalResellers: 0,
      activeResellers: 0,
      pendingResellers: 0
    };

    const availableBalance = analyticsData.totalCommissionEarned - analyticsData.totalCommissionPaidOut;
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: safeUsers,
      analytics: {
        totalCommissionEarned: parseFloat(analyticsData.totalCommissionEarned.toFixed(2)),
        totalCommissionPaidOut: parseFloat(analyticsData.totalCommissionPaidOut.toFixed(2)),
        totalResellers: analyticsData.totalResellers,
        activeResellers: analyticsData.activeResellers,
        pendingResellers: analyticsData.pendingResellers,
        availableBalance: parseFloat(availableBalance.toFixed(2)),
        currency: 'GHS'
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      }
    });

  } catch (error) {
    console.error('Error fetching resellers:', error);
    next(error);
  }
};


export const getVendors = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    console.log("getVendors Migration Successful")

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";

    const query = {
      role: "vendor",
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { vendorCode: { $regex: search, $options: "i" } },
        ],
      }),
    };

    // Get vendors with their reseller stats
    const [vendorStats, totalVendors] = await Promise.all([
      User.aggregate([
        { $match: query },
        { $skip: skip },
        { $limit: limit },
        
        // Lookup their resellers
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "parentVendor",
            as: "resellers"
          }
        },

        // Calculate stats
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            vendorCode: 1,
            phoneNumber: 1,
            isApproved: 1,
            isAccountVerified: 1,
            createdAt: 1,
            totalCommissionEarned: 1,
            totalCommissionPaidOut: 1,
            
            // Reseller counts
            totalResellers: { $size: "$resellers" },
            activeResellers: {
              $size: {
                $filter: {
                  input: "$resellers",
                  as: "r",
                  cond: {
                    $and: [
                      { $eq: ["$$r.isApproved", true] },
                      { $eq: ["$$r.isAccountVerified", true] }
                    ]
                  }
                }
              }
            },
            pendingResellers: {
              $size: {
                $filter: {
                  input: "$resellers",
                  as: "r",
                  cond: {
                    $or: [
                      { $eq: ["$$r.isApproved", false] },
                      { $eq: ["$$r.isAccountVerified", false] }
                    ]
                  }
                }
              }
            }
          }
        },

        { $sort: { createdAt: -1 } }
      ]),

      User.countDocuments(query)
    ]);

    if (!vendorStats || vendorStats.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: search ? "No vendors matched your search" : "No vendors found",
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalVendors: 0,
          limit,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    // Map to table format
    const safeVendors = vendorStats.map(vendor => ({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
      vendorCode: vendor.vendorCode,
      status: vendor.isApproved && vendor.isAccountVerified ? 'active' : 'pending',
      isApproved: vendor.isApproved,
      isAccountVerified: vendor.isAccountVerified,
      
      // Table columns
      totalResellers: vendor.totalResellers,
      activeResellers: vendor.activeResellers,
      pendingResellers: vendor.pendingResellers,
      totalCommissionEarned: vendor.totalCommissionEarned || 0,
      totalCommissionPaidOut: vendor.totalCommissionPaidOut || 0,
      availableBalance: (vendor.totalCommissionEarned || 0) - (vendor.totalCommissionPaidOut || 0),
      
      createdAt: vendor.createdAt,
    }));

    const totalPages = Math.ceil(totalVendors / limit);

    res.status(200).json({
      success: true,
      data: safeVendors,
      message: `All vendors (${totalVendors} total)`,
      pagination: {
        currentPage: page,
        totalPages,
        totalVendors,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      }
    });

  } catch (error) {
    console.error("Error Getting Vendors:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};


export const creatAccountByAdmin = async (req, res, next) => {

  const session = await mongoose.startSession();
  session.startTransaction(); // I actually learnt this in class for relational dbs, makes the database atomic
  //all or nothing, no halfway authentications, it either works or it doesn't


  const { id, role } = req.user

  // So that we don't have to send empty details to the server
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json(
      {
        success: false,
        message: 'Missing Details, Please provide them'
      }
    )
  }

  //Making sure the person making the update request is the admin first
  if (!req.user || req.user.role !== 'admin') {
    const error = new Error('Unauthorized to create admin accounts');
    error.statusCode = 403;
    throw error;
  }


  try {
    //Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error('User already exists')
      error.statusCode = 409;
      throw error;
    }

    //If newuser doesn't already exit continue flow and hash created passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUsers = await User.create([{ name, email, password: hashedPassword }], { session }); // I might change this later for just singleNewUser creation



    //I DID NOT AUTOMATICALLY GENERATE TOKEN AND SET TO COOKIES, CAUSE I DON'T WANT THE ACCOUNT TO BE IMMEDIATELY LOGGED IN AFTER CREATION
    await session.commitTransaction();
    session.endSession();



    res.status(201).json({
      success: true,
      message: `User created successfully by ${id} role: ${role}, PLEASE LOG IN `,
      data: {
        user: newUsers[0],
      }
    });


    // Sends the welcome email 
    await sendWelcomeEmail({
      to: email,
      userName: name
    })



  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }

}



//ACCOUNT UPDATE BY ADMIN DIRECTLY
export const updateUserByAdmin = async (req, res, next) => {

  try {
    const { id: user } = req.param;  //user id from request params
    const { id: loggedInUser, role } = req.user; // current logged-in user supposedly admin from middleware trying to update a specific account by using :id params

    const updateData = req.body
  } catch (error) {
    console.log(error)
    next(error)
  }

}




// RESLLER LINK GENERATION
export const resellerLink = async (req, res, next) => {
  try {
    // const userId = req.user.id; // Auth middleware sets this

    // const { userId } = req.query; // instead of req.body// for now until i set the middleware properly will manually send the userId in the query string


    console.log("resellerLink Migration Successful")


    const { id, email, role } = req.user;
    const userId = id

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // if (userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate resellerCode if not exists
    if (!user.resellerCode || user.resellerCode.trim() === "") {

      const safeName = user.name || "USER";
      const prefix = safeName.substring(0, 4).toUpperCase(); // first 4 letters
      user.resellerCode = `${prefix}-${nanoid(6)}`; // e.g., JOHN-a1b2c3
      await user.save();
    }

    let referralURL;

    // Check verification and approval status
    if (!user.isAccountVerified) {
      referralURL = "You need to verify your account first";
    } else if (user.isAccountVerified && !user.isApproved) {
      referralURL = "Text admin to approve account";
    } else {
      referralURL = `${process.env.FRONTEND_URL}/store/shop?resellerCode=${user.resellerCode}`;
    }

    return res.status(200).json({
      success: true,
      message: "Referral link generated successfully",
      referralURL,
    });
  } catch (err) {
    console.error("Error generating referral link:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const vendorlink = async (req, res, next) => {
  try {
    // const userId = req.user.id; // Auth middleware sets this

    // const { userId } = req.query; // instead of req.body// for now until i set the middleware properly will manually send the userId in the query string


    console.log("resellerLink Migration Successful")


    const { id, email, role } = req.user;
    const userId = id

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // if (userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate vendorCode if not exists
    if (!user.vendorCode || user.vendorCode.trim() === "") {
      const safeName = `${user.name}-VD` || "USER";
      const prefix = safeName.substring(0, 4).toUpperCase(); // first 4 letters
      user.vendorCode = `${prefix}-${nanoid(6)}`; // e.g., JOHN-a1b2c3
      await user.save();
    }

    let referralURL;

    // Check verification and approval status
    if (!user.isAccountVerified) {
      referralURL = "You need to verify your account first";
    } else if (user.isAccountVerified && !user.isApproved) {
      referralURL = "Text admin to approve account";
    } else {
      // referralURL = `${process.env.FRONTEND_URL}/store/shop?vendorCode =${user.vendorCode }`;
      referralURL = `${process.env.FRONTEND_URL}/reseller-auth/register?vendorCode =${user.vendorCode}`;
    }

    return res.status(200).json({
      success: true,
      message: "vendor invite link generated successfully",
      referralURL,
    });
  } catch (err) {
    console.error("Error generating referral link:", err);
    return res.status(500).json({ message: "Server error" });
  }
};





//GET RESELLER COMMISSION PUBLIC ENDPOINT
export const getResellerCommission = async (req, res) => {
  try {
    const { resellerCode } = req.params;

    console.log("Backend received resellerCode:", resellerCode);
    // Find reseller by code
    const reseller = await User.findOne({
      resellerCode: resellerCode,
    });

    if (!reseller) {
      return res.status(404).json({
        success: false,
        message: "Reseller not found"
      });
    }

    // Return ONLY commission rate (no sensitive data)
    return res.status(200).json({
      success: true,
      data: {
        resellerCode: reseller.resellerCode,
        commissionRate: reseller.commissionRate, // e.g., 0.15 for 15%
        // Optionally: reseller name for display
      }
    });

  } catch (error) {
    console.error("Get reseller commission error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch commission rate"
    });
  }
};





//Invite Email controller
export const inviteReseller = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate invite token (valid for 7 days)
    const inviteToken = jwt.sign(
      { email, type: 'reseller_invite' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create invite link
    const inviteLink = `${process.env.FRONTEND_URL}/auth/register?token=${inviteToken}&email=${encodeURIComponent(email)}`;

    // Send invite email
    await sendInviteEmail({
      to: email,
      inviteUrl: inviteLink
    });

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully',
      email,
      timestamp: new Date().toISOString()
    });


  } catch (error) {
    console.error('Error inviting reseller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};



//Approve Reseller Controller
export const approveReseller = async (req, res) => {
  try {
    const { id } = req.user
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isApproved) return res.status(409).json({
      message: "User already approved"
    })


    if (user.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Only resellers can be approved'
      });
    }


    user.isApproved = true; // e.g., JOHN-a1b2c3
    await user.save();



    // Send approved email notification
    //     sendApprovedEmail({
    //       to: user.email,
    //       userName: user.name,
    //       loginUrl: `${process.env.FRONTEND_URL}/auth/login`
    //     }).catch(err => {
    //   console.error("Failed to send Approval Email :", err);
    // });;

    return res.status(200).json({
      success: true,
      message: "User Approved Successfully",
      data: {
        userId,
        name: user.name,
        email: user.email,
        isApproved: true,
        approvedAt: user.updatedAt,
        approvedBy: id
      },
    });

  } catch (error) {
    console.error('Error Updating Reseller as approved:', error);

    // Handle custom errors with statusCode
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    // Handle any other unexpected errors
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}


export const approveVendor = async (req, res) => {
  try {
    const { id } = req.user
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isApproved) return res.status(409).json({
      message: "User already approved"
    })


    if (user.role !== 'vendor') {
      return res.status(400).json({
        success: false,
        message: 'Only vendors can be approved'
      });
    }


    if (!user.vendorCode || user.vendorCode.trim() === "") {
      const safeName = user.name || "Vendor";
      const prefix = safeName.substring(0, 4).toUpperCase(); // first 4 letters
      user.vendorCode = `${prefix}-${nanoid(6)}`; // e.g., JOHN-a1b2c3
      //Approve the vendor
      user.isApproved = true;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Vendor Approved Successfully",
    })

  } catch (error) {
    console.error('Error Updating Vendor as approved:', error);
    // Handle custom errors with statusCode
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}



export const rejectReseller = async (req, res) => {
  try {
    // const rejectedBy = req.user.id;
    const { userId } = req.params;
    // const { reason } = req.body; // optional

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isApproved) {
      return res.status(409).json({
        success: false,
        message: "Approved resellers cannot be rejected"
      });
    }

    if (user.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: "Only reseller accounts can be rejected"
      });
    }

    user.isApproved = true;


    await user.save();

    return res.status(200).json({
      success: true,
      message: "Reseller rejected successfully",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        isRejected: true,
        rejectedAt: new Date(),

        // rejectionReason: user.rejectionReason  will add this later
      }
    });

  } catch (error) {
    console.error("Error rejecting reseller:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
