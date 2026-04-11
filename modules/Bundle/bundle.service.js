import { createError, throwResponse } from "../../utils/error.js"
import { uploadImage } from "../../utils/uploadImage.js"

import { findBundleById, createBundle } from './bundle.repository.js'
import { validateCreateBundle } from './bundle.validator.js'


export const createBundleService = async (data, file) => {
    const validatedData = validateCreateBundle(data)
    const existingBundle = await findBundleById(validatedData.Bundle_id)
    if (existingBundle) {
        throwResponse(409, "Bundle With this Id already exists",)
    }
    let imageUrl = null;
    let publicId = null;

    if (file) {
        ({ imageUrl, publicId } = await uploadImage(file));
    }

     try {
    return await createBundle({ ...validatedData, imageUrl });
  } catch (error) {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { invalidate: true });
    }
    throw error;
  }
}

