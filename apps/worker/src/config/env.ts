import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
     DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
     REDIS_URL: z.string().min(1, "REDIS_URL is required"),
     ENCRYPTION_KEY: z.string().length(64, "ENCRYPTION_KEY must be 64 characters long")
})

export const env = envSchema.parse(process.env)
