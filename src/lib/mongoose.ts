import mongoose from 'mongoose';
import { ourProductsData } from '@/data/ourProductsData'; // For seeding
import Product from '@/models/Product'; // For seeding
import User from '@/models/User'; // For seeding

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function seedDatabase() {
    try {
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('No products found, seeding database...');
            const productsToSeed = ourProductsData.map(p => {
                const { id, ...rest } = p;
                return {
                    ...rest,
                    _id: id,
                    featured: ['op1', 'op2', 'op3', 'op4', 'op5'].includes(id) 
                };
            });
            await Product.insertMany(productsToSeed);
            console.log('Database seeded successfully with products.');
        }

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('No users found, creating default admin and cashier users...');
            await User.create([
                { email: 'admin@example.com', password: 'password', role: 'admin' },
                { email: 'caissier@example.com', password: 'password', role: 'caissier' },
            ]);
            console.log('Database seeded successfully with default users.');
        }

    } catch (e) {
        console.error("Error during seeding:", e)
        throw new Error("Database seeding failed.");
    }
}


async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Veuillez définir la variable d\'environnement MONGODB_URI dans votre fichier .env.local'
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      console.log('MongoDB connected');
      await seedDatabase();
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
