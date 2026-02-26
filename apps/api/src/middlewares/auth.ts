import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env"

export interface AuthRequest extends Request {
     userId?: string
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
     const authHeader = req.headers.authorization

     if (!authHeader || !authHeader.startsWith("Bearer ")) {
          res.status(StatusCodes.UNAUTHORIZED).json({
               success: false,
               error: "Unauthorized",
               message: "Hiányzó vagy érvénytelen token."
          })
          return
     }

     const token = authHeader.split(" ")[1]

     try {
          const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string }
          req.userId = payload.userId
          next()
     } catch (error) {
          res.status(StatusCodes.UNAUTHORIZED).json({
               success: false,
               error: "Unauthorized",
               message: "Érvénytelen vagy lejárt token."
          });
     }
}
