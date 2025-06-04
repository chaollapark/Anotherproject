import mongoose from 'mongoose';

const EFFECTIVE_MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const EFFECTIVE_DB_NAME = process.env.MONGODB_DB_NAME || 'test';

if (!EFFECTIVE_MONGODB_URI) {
  throw new Error('Please define MONGODB_URI or MONGO_URI environment variable in your .env file');
}

//remember to do single global sockets
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

//before it was initialized beore the if statement and it didn't work... (I got fucked)
const cached = global.mongoose;

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`🔌 Connecting to MongoDB (DB: ${EFFECTIVE_DB_NAME})...`);
    const opts = {
      bufferCommands: false,
      dbName: EFFECTIVE_DB_NAME,
    };

    cached.promise = mongoose.connect(EFFECTIVE_MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
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

export default dbConnect;
