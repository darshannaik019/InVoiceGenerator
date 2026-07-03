import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("WARNING: MONGODB_URI is not defined. Database connection skipped.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

export default connectDB;
