import { Strategy as GoogleOAuthStrategy } from "passport-google-oauth20";
import passport from "passport";
import env from "./config";
import { User } from "../generated/prisma";

passport.serializeUser((user, done) => {
    done(null, (user as User).id);
});

passport.deserializeUser((user: User, done) => {
    done(null, { id: user.id, email: user.email, name: user.name });
});

passport.use(
    new GoogleOAuthStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

export default passport;
