import express from "express";
import env from "./config/config";
import session from "express-session";
import passport from "./config/passport.config";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import documentRoutes from "./routes/document.routes";

const app = express();
const port = +env.PORT;

app.use(express.json());
app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? env.CORS_ORIGIN
                : "http://localhost:3000",
        credentials: true,
    })
);
app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
