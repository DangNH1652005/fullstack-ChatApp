import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected DB successfully");
    } catch (error) {
        console.log("Error connected from DB: ", error);
    }
}; 