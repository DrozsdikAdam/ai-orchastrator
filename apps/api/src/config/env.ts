import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
     DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
     REDIS_URL: z.string().min(1, "REDIS_URL is required"),
     JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
     PORT: z.coerce.number().default(3000)
})

export const env = envSchema.parse(process.env)