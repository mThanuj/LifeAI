import { config } from "dotenv";
import { z } from "zod";

config();

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
