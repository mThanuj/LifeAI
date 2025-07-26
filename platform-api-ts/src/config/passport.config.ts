import { Strategy as GoogleOAuthStrategy } from "passport-google-oauth20";
import passport from "passport";
import env from "./config";
import prisma from "./prisma.config";
import { User } from "../generated/prisma";

passport.serializeUser((user, done) => {
    done(null, (user as User).id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleOAuthStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        oauth_provider: profile.provider,
                        oauth_id: profile.id,
                    },
                });

                if (existingUser) {
                    return done(null, existingUser);
                }

                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(
                        new Error("No email found in Google profile."),
                        false
                    );
                }

                const newUser = await prisma.user.create({
                    data: {
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        oauth_provider: profile.provider,
                        oauth_id: profile.id,
                    },
                });

                return done(null, newUser);
            } catch (error) {
                return done(error as Error, false);
            }
        }
    )
);

export default passport;
