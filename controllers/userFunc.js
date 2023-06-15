import { TryCatch } from "../middlewares/error.js";
import User from "../models/models.js";

 export const myProfile=(req,res,next)=>{
    res.status(200).json({
        success:true,
        user:req.user,
    })

 }

 export const logOut=(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err) return next(err);
        res.clearCookie("connect.sid",
        {
            sameSite:process.env.MODE==="development"? false:"none",
            httpOnly:process.env.MODE==="development"? false:true,
            secure:process.env.MODE==="development"?false:true,
          }
        );
        res.status(200).json({
            status:true,
            msg:"Logged Out"
        });

    })
 }

 export const userInfo=TryCatch(async(req,res,next)=>{
    const user=await User.find({});
    res.status(200).json({
        success:true,
        user,
    });
 });