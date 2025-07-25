import { log } from "console";
import mongoose from "mongoose";

export const connectDB = async() => {
    const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/docora_db";
    log(`\nConnecting to MongoDB at: ${dbURI}`);
    try{
        const connectionInstance = await mongoose.connect(dbURI);
        console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    }catch(err){    
        console.error("MONGODB connection FAILED: ", err);
        process.exit(1);
    }
}
