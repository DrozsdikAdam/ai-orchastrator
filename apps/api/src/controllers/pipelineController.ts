import { Response, NextFunction } from "express";
import { PipelineService } from "../services/pipelineService";
import { AuthRequest } from "../middlewares/auth";
import { StatusCodes } from "http-status-codes";

export class PipelineController {
     static async create(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await PipelineService.create(req.userId!, req.body);
               res.status(StatusCodes.CREATED).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async getById(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await PipelineService.getById(req.params.id as string, req.userId!);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async list(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await PipelineService.listByUser(req.userId!);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async update(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               const result = await PipelineService.update(req.params.id as string, req.userId!, req.body);
               res.status(StatusCodes.OK).json(result);
          } catch (error) {
               next(error);
          }
     }

     static async delete(req: AuthRequest, res: Response, next: NextFunction) {
          try {
               await PipelineService.delete(req.params.id as string, req.userId!);
               res.status(StatusCodes.NO_CONTENT).send();
          } catch (error) {
               next(error);
          }
     }
}
