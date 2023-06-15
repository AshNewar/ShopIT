import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import ConnectDB from "./connect/connect.js";
import router from "./route/user.js";
import router2 from "./route/order.js";
import passportConnect from "./utils/google.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorWares } from "./middlewares/error.js";
import Razorpay from "razorpay";
import { METHODS } from "http";

dotenv.config();
ConnectDB();

// Razorpay
export var instance = new Razorpay({
  key_id: process.env.RAZOR_ID,
  key_secret: process.env.RAZOR_SECRET,
});

const app = express();
app.use(cors({
  credentials:true,
  origin:process.env.FRONTEND_URI,
  methods:["PUT","GET","DELETE","PUT"],
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,

    cookie:{
      sameSite:process.env.MODE==="development"? false:"none",
      httpOnly:process.env.MODE==="development"? false:true,
      secure:process.env.MODE==="development"?false:true,
    }
  })
);

//GoogleAuth

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy"); 
passportConnect();

//Route Connect

app.use("/newar", router);
app.use("/newar", router2);

// MiddleWares

app.use(errorWares);

export default app;
