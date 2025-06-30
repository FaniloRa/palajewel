import mongoose from 'mongoose';
import { ourProductsData } from '@/data/ourProductsData'; // For seeding
import Product from '@/models/Product'; // For seeding

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.warn(
      'La variable d\'environnement MONGODB_URI n\'est pas définie. L\'application utilisera des données statiques. Veuillez définir la variable MONGODB_URI dans votre fichier .env.local'
    );
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      console.log('MongoDB connected');
      // Seed data if the products collection is empty
      try {
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
          console.log('No products found, seeding database...');
          const productsToSeed = ourProductsData.map(p => {
              const { id, ...rest } = p;
              return {
                  ...rest,
                  _id: id, // Use original ID for consistency with links
                  featured: ['op1', 'op2', 'op3', 'op4'].includes(id) 
              };
          });
          await Product.insertMany(productsToSeed);
          console.log('Database seeded successfully with products.');
        }
      } catch (e) {
        console.error("Error during seeding:", e)
      }

      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.warn(`Échec de la connexion à MongoDB : ${e.message}. L'application utilisera des données statiques. Vérifiez votre MONGODB_URI.`);
    return null;
  }

  return cached.conn;
}

export default connectDB;
