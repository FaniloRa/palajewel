'use server';
import { v2 as cloudinary } from 'cloudinary';

export async function getSignature() {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error("La clé secrète de Cloudinary (CLOUDINARY_API_SECRET) n'est pas configurée dans votre fichier .env.local");
  }

  // Configure Cloudinary inside the action to ensure it's done on-demand
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
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
