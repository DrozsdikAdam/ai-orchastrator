import { prisma } from "@repo/database";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";
import { LoginRequest, RegisterRequest } from "@repo/types";
import { StatusCodes } from "http-status-codes";

export class AuthService {
     static async register(data: RegisterRequest) {
          const existingUser = await prisma.user.findUnique({
               where: { email: data.email },
          });

          if (existingUser) {
               const error: any = new Error("Ez az email cím már foglalt.");
               error.statusCode = StatusCodes.BAD_REQUEST;
               throw error;
          }

          const hashedPassword = await hashPassword(data.password);

          const user = await prisma.user.create({
               data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
               },
          });

          const token = generateToken({ userId: user.id });

          return { user: this.sanitizeUser(user), token };
     }

     static async login(data: LoginRequest) {
          const user = await prisma.user.findUnique({
               where: { email: data.email },
          });

          if (!user) {
               const error: any = new Error("Érvénytelen email vagy jelszó.");
               error.statusCode = StatusCodes.UNAUTHORIZED;
               throw error;
          }

          const isPasswordValid = await comparePassword(data.password, user.password);

          if (!isPasswordValid) {
               const error: any = new Error("Érvénytelen email vagy jelszó.");
               error.statusCode = StatusCodes.UNAUTHORIZED;
               throw error;
          }

          const token = generateToken({ userId: user.id });

          return { user: this.sanitizeUser(user), token };
     }

     private static sanitizeUser(user: any) {
          const { password, ...sanitized } = user;
          return sanitized;
     }
}
