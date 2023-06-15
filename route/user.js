import express from "express";
import passport from "passport";
import { logOut, myProfile, userInfo } from "../controllers/userFunc.js";
import { adminAuthenticated, isAuthenticated } from "../middlewares/auth.js";
  
const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);


router.get(
    "/login",
    passport.authenticate("google",{
      successRedirect:process.env.FRONTEND_URI,
    })
    
  );


router.get("/", (req, res) => {
  res.send("hello1");
});

router.get("/me", isAuthenticated, myProfile);


router.get("/logout",logOut);

router.get("/admin/users",isAuthenticated,adminAuthenticated,userInfo)

export default router;
