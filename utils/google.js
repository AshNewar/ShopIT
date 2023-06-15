import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/models.js";
import passport from "passport";

const passportConnect = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        try {

        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            photoSrc: profile.photos[0].value,
          });
          return done(null,newUser);
        }
        else{

            return done(null,user);
        }
            
        } catch (error) {
            console.log(error);
            
        }
        
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

export default passportConnect;
