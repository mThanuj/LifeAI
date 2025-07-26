import express from "express";
import passport from "../config/passport.config";
import env from "../config/config";

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: `${env.FRONTEND_URL}/dashboard`,
        failureRedirect: `${env.FRONTEND_URL}/login?error=true`,
    })
);
export default router;
