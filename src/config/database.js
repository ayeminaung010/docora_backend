import mongoose from "mongoose";
export const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    }catch(err){    
        console.error("MONGODB connection FAILED: ", err);
        process.exit(1);
    }
}
