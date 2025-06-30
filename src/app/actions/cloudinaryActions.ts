'use server';
import { v2 as cloudinary } from 'cloudinary';

export async function getSignature() {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    const missingKeys = [];
    if (!apiSecret) missingKeys.push('CLOUDINARY_API_SECRET');
    if (!apiKey) missingKeys.push('CLOUDINARY_API_KEY');
    if (!cloudName) missingKeys.push('CLOUDINARY_CLOUD_NAME');

    throw new Error(`Les clés Cloudinary suivantes manquent dans votre fichier .env.local : ${missingKeys.join(', ')}`);
  }

  // Configure Cloudinary inside the action to ensure it's done on-demand
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    apiSecret
  );

  return { timestamp, signature };
}
