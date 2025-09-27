import mongoose, { Mongoose } from 'mongoose';

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Defer failure to runtime usage rather than import time to avoid build failures
    throw new Error('Missing MONGODB_URI environment variable. Set it in your deployment environment.');
  }
  return uri;
}

// Augment the global scope to include the mongoose cache
declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(getMongoUri(), opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
