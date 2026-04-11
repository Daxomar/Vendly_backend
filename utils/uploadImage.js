// lib/uploadImage.js
import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (file, folder = 'bundles') => {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataUri = `data:${file.mimetype};base64,${b64}`;

  const uploaded = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });

  return { imageUrl: uploaded.secure_url, publicId: uploaded.public_id };
};