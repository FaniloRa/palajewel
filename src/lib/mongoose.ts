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
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        if (!adminUser) {
            console.log('Creating default admin user...');
            await User.create({ email: 'admin@example.com', password: 'password', role: 'admin' });
            console.log('Default admin user created.');
        }

        const cashierUser = await User.findOne({ email: 'caissier@example.com' });
        if (!cashierUser) {
            console.log('Creating default cashier user...');
            await User.create({ email: 'caissier@example.com', password: 'password', role: 'caissier' });
            console.log('Default cashier user created.');
        }

        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('No products found, seeding database with initial products...');
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

    } catch (e) {
        console.error("An error occurred during database seeding:", e);
        // We don't re-throw the error, as seeding is a non-critical setup operation.
    }
}


async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Veuillez définir la variable d\'environnement MONGODB_URI dans votre fichier .env.local'
    );
  }

  // Connect if not already connected
  if (!cached.conn) {
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }
    
    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }
  }

  // After ensuring a connection, attempt to seed the database.
  // The seedDatabase function is idempotent, meaning it won't create
  // duplicate users or products, so it's safe to run.
  // This ensures that even if the app was run once before the seeding
  // logic was complete, the default users will be created.
  await seedDatabase();

  return cached.conn;
}

export default connectDB;
