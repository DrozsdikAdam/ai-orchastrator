import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
     console.log(err)

     if (err instanceof ZodError) {
          res.status(StatusCodes.BAD_REQUEST).json({
               error: "Validation Error",
               details: err.errors
          })
          return;
     }

     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Internal Server Error",
          message: process.env.NODE_ENV === "production"
               ? "Valami hiba történt a szerveren."
               : err.message,
     });
};
