export const errorWares=(err,req,res,next)=>{
    err.msg=err.message|| "Internal Error";
    err.statusCode=err.statusCode || 500;

    res.status(err.statusCode).json({
        success:false,
        msg:err.msg,
    })
}


export const TryCatch = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
};



