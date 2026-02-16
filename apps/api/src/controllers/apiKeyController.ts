import { Response, NextFunction } from "express";
import { ApiKeyService } from "../services/apiKeyService";
import { AuthRequest } from "../middlewares/auth";
import { StatusCodes } from "http-status-codes";

export class ApiKeyController {
     static async create(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await ApiKeyService.create(req.userId!, req.body);
               res.status(StatusCodes.CREATED).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async list(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await ApiKeyService.list(req.userId!);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async delete(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               await ApiKeyService.delete(req.params.id as string, req.userId!);
               res.status(StatusCodes.NO_CONTENT).send();
          } catch (error) {
               next(error);
          }
     }
}
