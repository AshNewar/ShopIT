import mongoose from "mongoose";
const ConnectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("Database Connected");
        }).catch((err)=>{
            console.log(err);
        })
    
    } catch (error) {
        console.log(error);
        
    }
    
}
export default ConnectDB;