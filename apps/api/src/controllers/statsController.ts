import { Response, NextFunction } from "express";
import { StatsService } from "../services/statsService";
import { AuthRequest } from "../middlewares/auth";
import { StatusCodes } from "http-status-codes";

export class StatsController {
     static async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await StatsService.getUserStats(req.userId!);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }
}
