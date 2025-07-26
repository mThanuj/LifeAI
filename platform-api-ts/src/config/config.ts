import { config } from "dotenv";
import { z } from "zod";

config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});

const envSchema = z.object({
    PORT: z.string(),
    DATABASE_URL: z.url(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CALLBACK_URL: z.url(),
    SESSION_SECRET: z.string(),
    CORS_ORIGIN: z.url(),
    FRONTEND_URL: z.url(),
    BACKBLAZE_API_ID: z.string(),
    BACKBLAZE_API_KEY: z.string(),
    BACKBLAZE_BUCKET_ID: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error(
        "Invalid environment variables:",
        env.error.flatten().fieldErrors
    );
    process.exit(1);
}

export default env.data;
