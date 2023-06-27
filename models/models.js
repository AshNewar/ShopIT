import mongoose from "mongoose";



const schema=mongoose.Schema({
    name:String,
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    googleId:{
        type:String,
        unique:true,
        required:true,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user",
    },
    photoSrc:String,
    createdAt:{
        type:Date,
        default:Date.now,
    }

});

const User=mongoose.model("user",schema);

export default User;
