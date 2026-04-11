import mongoose from 'mongoose';
import Bundle from '../../models/bundle.model.js'
import ResellerBundlePrice from '../../models/resellerBundlePrice.model.js';
import { createBundleService } from './bundle.service.js';
import { validateCreateBundle } from './bundle.validator.js'
//will refactor this to use the service layer for better separation of concerns and cleaner code. The service layer will handle all the business logic, while the controller will focus on request handling and response formatting.
import cloudinary from '../../config/cloudinary.js';
import { uploadImage } from '../../utils/uploadImage.js';



export const createBundleInDb = async (req, res, next) => {
  // const { Bundle_id, Data, name, JBCP, JBSP, network, size, Duration,  recommendedRange } = req.body;

  try {
   
    //testing it out here cleaner version
    // const NewBundle = await createBundleService(req.body)
    const NewBundle = await createBundleService(req.body, req.file) // Pass file for image upload if needed
    
    //responding 
      res.status(201).json({
      success: true,
      message: "Bundle created successfully",
      data: NewBundle
    });


    console.log("Bundle Migration Successfull")

    // // 1. Validate required fields
    // if (!Bundle_id || !Data || !name || !JBCP || !JBSP|| !network || !Duration) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Missing required bundle details"
    //   });
    // }



    // // 2. Check if bundle already exists
    // const existingBundle = await Bundle.findOne({ Bundle_id });
    // if (existingBundle) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Bundle with this ID already exists"
    //   });
    // }

    // // 4. Create bundle in DB
    // const newBundle = await Bundle.create({
    //   Bundle_id,
    //   Data,
    //   name,
    //   JBCP,
    //   JBSP,
    //   size,
    //   network,
    //   Duration,
    //   recommendedRange
    // });

    // // 5. Respond
    // res.status(201).json({
    //   success: true,
    //   message: "Bundle created successfully",
    //   data: newBundle
    // });

  } catch (error) {
    next(error);
    console.log(error)
   if(error.statusCode){
    return res.status(error.statusCode).json({
      success: false,
      message: "Bundle Creation Failed"
    })
   }


    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};






export const getAllBundles = async (req, res, next) => {
  try {

    console.log("Bundle Migration successful")

    const bundles = await Bundle.find().sort({ network: 1, JBCP: 1 });
    
        

    const activeCount = bundles.filter(b => b.isActive).length;
    const inactiveCount = bundles.filter(b => !b.isActive).length;

    res.status(200).json({
      success: true,
      message: "Bundles fetched successfully",
      activeCount,
      inactiveCount,
      data: bundles
    });

  } catch (error) {
    next(error);
  }
};




export const changeActiveStatus = async (req,res)=>{

  try{
    
    const {bundleId} = req.params 
    console.log("Toggle Bundle", bundleId)
    
    if(!bundleId) {
    return res.status(404).json({
        success: false, 
        message:"Bundle Not Found"
      })
    }

    const bundle = await Bundle.findById(bundleId)

    if(!bundle){
    return  res.status(404).json({
        status: false,
        message: "Bundle Not found v2"
      })
    }

    const currentState = bundle.isActive

    bundle.isActive = !currentState;

    await bundle.save()

   console.log("Bundle Found", bundle)

     return res.status(200).json({
      success: true,
      message: "Bundle State Changed Successfully",
    
    });

  }catch(error){
    console.log(error.message)

     
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
  }






// ////THIRD VERSION ////
// export const updateBundle = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     console.log("Starting atomic bundle update");
//     const { bundleId } = req.params;

//     if (!bundleId) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "No bundleId provided"
//       });
//     }

//     const { name, JBCP, JBSP, network, Data, recommendedRange } = req.body;

//     // Validation
//     if (!name || JBCP === undefined || JBSP === undefined || !network || !Data || !recommendedRange) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "All fields required (name, JBCP, JBSP, network, Data, Range)"
//       });
//     }

//     // Validate JBSP is a valid number
//     if (typeof JBSP !== 'number' || JBSP < 0) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "JBSP must be a non-negative number"
//       });
//     }

//     console.log("Update info:", { name, JBCP, JBSP, network, Data });

//     // ===== STEP 1: Fetch and update the bundle =====
//     const bundle = await Bundle.findById(bundleId).session(session);

//     if (!bundle) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Bundle not found"
//       });
//     }

//     const oldJBSP = bundle.JBSP;
//     const jbspChanged = oldJBSP !== JBSP;

//     // Update bundle fields
//     bundle.name = name;
//     bundle.JBCP = JBCP;
//     bundle.JBSP = JBSP;
//     bundle.network = network;
//     bundle.Data = Data;
//     bundle.recommendedRange= recommendedRange;

//     await bundle.save({ session });

//     // ===== STEP 2: If JBSP changed, sync all reseller prices =====
//     let resellerImpactReport = [];

//     if (jbspChanged) {
//       console.log(`JBSP changed from ${oldJBSP} to ${JBSP}. Syncing reseller prices...`);

//       // Use MongoDB aggregation pipeline update - single operation, no fetching
//       const result = await ResellerBundlePrice.updateMany(
//         { bundleId },
//         [
//           {
//             $set: {
//               customPrice: {
//                 // If customPrice < JBSP, set to JBSP, else keep customPrice
//                 $max: ['$customPrice', JBSP]
//               },
//               basePriceSnapshot: JBSP,
//               commission: {
//                 // Calculate new commission: max(customPrice, JBSP) - JBSP
//                 $subtract: [
//                   { $max: ['$customPrice', JBSP] },
//                   JBSP
//                 ]
//               },
//               updatedAt: new Date()
//             }
//           }
//         ],
//         { session }
//       );

//       console.log(`Updated ${result.modifiedCount} reseller prices in single operation`);

//       // Fetch updated docs for impact report
//       const updatedPrices = await ResellerBundlePrice.find(
//         { bundleId },
//         null,
//         { session }
//       );

//       updatedPrices.forEach(price => {
//         resellerImpactReport.push({
//           resellerId: price.resellerId,
//           bundleId: price.bundleId,
//           newCustomPrice: price.customPrice,
//           newBasePriceSnapshot: price.basePriceSnapshot,
//           newCommission: price.commission,
//           status: 'updated'
//         });
//       });
//     }

//     // ===== STEP 3: Commit transaction =====
//     await session.commitTransaction();
//     console.log("Transaction committed successfully");

//     return res.status(200).json({
//       success: true,
//       message: "Bundle updated successfully",
//       newBundle: bundle,
//       ...(jbspChanged && {
//         priceUpdateInfo: {
//           jbspChanged: true,
//           oldJBSP,
//           newJBSP: JBSP,
//           affectedResellersCount: resellerImpactReport.length,
//           marginErodedCount: resellerImpactReport.filter(
//             r => r.status === 'margin_eroded'
//           ).length,
//           impactReport: resellerImpactReport
//         }
//       })
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     console.error("Update bundle error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update bundle",
//       error: error.message
//     });

//   } finally {
//     session.endSession();
//   }
// };



export const updateBundle = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Starting atomic bundle update");
    const { bundleId } = req.params;

    if (!bundleId) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "No bundleId provided"
      });
    }

    //Zod Shcema Validation
    const validatedData = validateCreateBundle(req.body)
    
    const { name, JBCP, JBSP, network, Data, recommendedRange } = validatedData;

    // Validation
    if (!name || JBCP === undefined || JBSP === undefined || !network || !Data || !recommendedRange) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "All fields required (name, JBCP, JBSP, network, Data, Range)"
      });
    }

    // Validate JBSP is a valid number
    if (typeof JBSP !== 'number' || JBSP < 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "JBSP must be a non-negative number"
      });
    }

    console.log("Update info:", { name, JBCP, JBSP, network, Data });

    // ===== STEP 1: Fetch the bundle =====
    const bundle = await Bundle.findById(bundleId).session(session);

    if (!bundle) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Bundle not found"
      });
    }

    const oldJBSP = bundle.JBSP;
    const jbspChanged = oldJBSP !== JBSP;

    // ===== STEP 1.5: Handle image update (primary image) =====
    let imageUrl = bundle.imageUrl;
    let publicId = bundle.publicId;

    if (req.file) {
      try {
        const { imageUrl: newImageUrl, publicId: newPublicId } = await uploadImage(req.file);
        
        // Delete old image after successful upload
        if (bundle.publicId) {
          await cloudinary.uploader.destroy(bundle.publicId, { invalidate: true });
        }
        
        imageUrl = newImageUrl;
        publicId = newPublicId;
      } catch (error) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
          error: error.message
        });
      }
    }

    // ===== STEP 2: Handle multiple images gallery =====
    let images = bundle.images || [];

    if (req.files && req.files.length > 0) {
      try {
        // Delete old gallery images
        if (bundle.images && bundle.images.length > 0) {
          for (const img of bundle.images) {
            await cloudinary.uploader.destroy(img.publicId, { invalidate: true });
          }
        }

        // Upload new gallery images
        images = [];
        for (const file of req.files) {
          const { imageUrl: url, publicId: pid } = await uploadImage(file);
          images.push({ url, publicId: pid });
        }
      } catch (error) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Failed to upload gallery images",
          error: error.message
        });
      }
    }

    // ===== STEP 3: Update bundle fields =====
    bundle.name = name;
    bundle.JBCP = JBCP;
    bundle.JBSP = JBSP;
    bundle.network = network;
    bundle.Data = Data;
    bundle.recommendedRange = recommendedRange;
    bundle.imageUrl = imageUrl;
    bundle.publicId = publicId;
    bundle.images = images;

    await bundle.save({ session });

    // ===== STEP 4: If JBSP changed, sync all reseller prices =====
    let resellerImpactReport = [];

    if (jbspChanged) {
      console.log(`JBSP changed from ${oldJBSP} to ${JBSP}. Syncing reseller prices...`);

      const result = await ResellerBundlePrice.updateMany(
        { bundleId },
        [
          {
            $set: {
              customPrice: {
                $max: ['$customPrice', JBSP]
              },
              basePriceSnapshot: JBSP,
              commission: {
                $subtract: [
                  { $max: ['$customPrice', JBSP] },
                  JBSP
                ]
              },
              updatedAt: new Date()
            }
          }
        ],
        { session }
      );

      console.log(`Updated ${result.modifiedCount} reseller prices in single operation`);

      const updatedPrices = await ResellerBundlePrice.find(
        { bundleId },
        null,
        { session }
      );

      updatedPrices.forEach(price => {
        resellerImpactReport.push({
          resellerId: price.resellerId,
          bundleId: price.bundleId,
          newCustomPrice: price.customPrice,
          newBasePriceSnapshot: price.basePriceSnapshot,
          newCommission: price.commission,
          status: 'updated'
        });
      });
    }

    // ===== STEP 5: Commit transaction =====
    await session.commitTransaction();
    console.log("Transaction committed successfully");

    return res.status(200).json({
      success: true,
      message: "Bundle updated successfully",
      newBundle: bundle,
      ...(jbspChanged && {
        priceUpdateInfo: {
          jbspChanged: true,
          oldJBSP,
          newJBSP: JBSP,
          affectedResellersCount: resellerImpactReport.length,
          marginErodedCount: resellerImpactReport.filter(
            r => r.status === 'margin_eroded'
          ).length,
          impactReport: resellerImpactReport
        }
      })
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Update bundle error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update bundle",
      error: error.message
    });

  } finally {
    session.endSession();
  }
};







