import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
     DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
     REDIS_URL: z.string().min(1, "REDIS_URL is required"),
})

export const env = envSchema.parse(process.env)
