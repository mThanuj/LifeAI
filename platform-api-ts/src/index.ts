import express from "express";
import env from "./config/config";
import session from "express-session";
import passport from "./config/passport.config";

import authRoutes from "./routes/auth.routes";

const app = express();
const port = +env.PORT;

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
