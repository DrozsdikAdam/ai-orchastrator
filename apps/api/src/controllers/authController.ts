import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { StatusCodes } from "http-status-codes";

export class AuthController {
     static async register(req: Request, res: Response, next: NextFunction) {
          try {
               const result = await AuthService.register(req.body);
               res.status(StatusCodes.CREATED).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async login(req: Request, res: Response, next: NextFunction) {
          try {
               const result = await AuthService.login(req.body);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }
}
