
import mongoose from 'mongoose';
import { ourProductsData } from '@/data/ourProductsData'; // For seeding
import Product from '@/models/Product'; // For seeding
import User from '@/models/User'; // For seeding
import Category from '@/models/Category'; // For seeding

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
        const adminUserCount = await User.countDocuments({ email: 'admin@example.com' });
        if (adminUserCount === 0) {
            console.log('Creating default admin user...');
            await User.create({ email: 'admin@example.com', password: 'password', role: 'admin' });
            console.log('Default admin user created.');
        }

        const cashierUserCount = await User.countDocuments({ email: 'caissier@example.com' });
        if (cashierUserCount === 0) {
            console.log('Creating default cashier user...');
            await User.create({ email: 'caissier@example.com', password: 'password', role: 'caissier' });
            console.log('Default cashier user created.');
        }

        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            console.log('Seeding categories...');
            const categories = ["Anneaux", "Collier", "Bracelet", "Boucles d'oreilles", "Pendentif", "Montre"].map(name => ({ name }));
            await Category.insertMany(categories);
            console.log('Categories seeded successfully.');
        }

        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('No products found, seeding database with initial products...');

            const categories = await Category.find({});
            const categoryMap: Record<string, string> = categories.reduce((map, cat) => {
                map[cat.name] = cat._id;
                return map;
            }, {} as Record<string, string>);

            const productsToSeed = ourProductsData.map(p => {
                const { id, category, ...rest } = p;
                const categoryId = categoryMap[category as string];
                if (!categoryId) {
                    console.warn(`Category "${category}" not found for product "${p.name}". Skipping.`);
                    return null;
                }
                return {
                    ...rest,
                    _id: id,
                    category: categoryId,
                    featured: ['op1', 'op2', 'op3', 'op4', 'op5'].includes(id) 
                };
            }).filter(p => p); // filter out nulls

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

  // If a connection is already cached, return it.
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no connection promise, create one. This prevents multiple
  // concurrent connection attempts.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      // The seeding logic is now part of the connection promise,
      // ensuring it runs only once when the connection is first established.
      await seedDatabase();
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // In case of a connection error, reset the promise
    throw e;
  }

  return cached.conn;
}

export default connectDB;
