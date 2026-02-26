import { Response, NextFunction } from "express";
import { ExecutionService } from "../services/executionService";
import { AuthRequest } from "../middlewares/auth";
import { StatusCodes } from "http-status-codes";

export class ExecutionController {
     static async execute(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await ExecutionService.create(req.params.pipelineId as string, req.userId!);
               res.status(StatusCodes.ACCEPTED).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async getById(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await ExecutionService.getById(req.params.id as string, req.userId!);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async list(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await ExecutionService.listByPipeline(req.params.pipelineId as string, req.userId!);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }
}
