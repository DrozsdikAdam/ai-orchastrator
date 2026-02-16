import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { env } from "../config/env"

const SALT_ROUNDS = 10

export const hashPassword = async (password: string): Promise<string> => {
     return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
     return await bcrypt.compare(password, hash)
}

export const generateToken = (payload: { userId: string }): string => {
     return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1d" })
}