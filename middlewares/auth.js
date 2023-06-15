import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated=(req,res,next)=>{
    const token=req.cookies["connect.sid"];
    if(!token){
        return next(new ErrorHandler("Login First",401));
    }
    else{
        return next();
    }
}

//Admin Checker 

export const adminAuthenticated=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return next(new ErrorHandler("Only for Admin",401));
    }
    else{
        return next();
    }
}