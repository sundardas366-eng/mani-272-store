import mongoose from "mongoose";

/**
 * Global MongoDB connection cache for serverless environments (Next.js / Vercel).
 * Prevents multiple connections during hot-reloads and lambda invocations.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    // If MONGODB_URI is not set in development, log a warning once
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "⚠️ [Database] MONGODB_URI is not defined in environment variables. Database operations will use fallback storage."
      );
    }
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log("✅ [Database] Connected to MongoDB successfully.");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ [Database] MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

