import mongoose from 'mongoose';

const connectDB = async () => {


    try {
         const connection = await mongoose.connect(process.env.MONGO_URI as string,{
            serverSelectionTimeoutMS: 5000,
         });
        console.log(`MongoDB connected ${connection.connection.host}`);
    
    } catch (error) {
        console.log('MongoDB connection error', error);
    }


}


export default connectDB;
