import mongoose from 'mongoose';

export const connectDB = async () => {
  // Use a fallback check to see if the variable is even visible
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is undefined. Check if your .env file exists and the variable name is correct."
    );
  }

  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};