import { prisma } from "@repo/database";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";
import { LoginRequest, RegisterRequest } from "@repo/types";
import { ApiError } from "../lib/apiError";

export class AuthService {
     static async register(data: RegisterRequest) {
          const existingUser = await prisma.user.findUnique({
               where: { email: data.email },
          });

          if (existingUser) {
               throw ApiError.badRequest("Ez az email cím már foglalt.");
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
               throw ApiError.unauthorized("Érvénytelen email vagy jelszó.");
          }

          const isPasswordValid = await comparePassword(data.password, user.password);

          if (!isPasswordValid) {
               throw ApiError.unauthorized("Érvénytelen email vagy jelszó.");
          }

          const token = generateToken({ userId: user.id });

          return { user: this.sanitizeUser(user), token };
     }

     private static sanitizeUser(user: any) {
          const { password, ...sanitized } = user;
          return sanitized;
     }
}
