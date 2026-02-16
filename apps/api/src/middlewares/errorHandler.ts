import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApiError } from "../lib/apiError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
     // Csak fejlesztői módban logolunk mindent
     if (process.env.NODE_ENV !== "production") {
          console.error(err);
     }

     // 1. Zod validációs hibák
     if (err instanceof ZodError) {
          res.status(StatusCodes.BAD_REQUEST).json({
               success: false,
               error: "Validation Error",
               message: "A megadott adatok nem érvényesek.",
               details: err.errors,
          });
          return;
     }

     // 2. Saját API hibák
     if (err instanceof ApiError) {
          res.status(err.statusCode).json({
               success: false,
               error: err.name,
               message: err.message,
               details: err.details,
          });
          return;
     }

     // 3. Minden más váratlan hiba (Pl. Prisma, Redis kapcsolódási hiba, stb.)
     const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
     res.status(statusCode).json({
          success: false,
          error: "Internal Server Error",
          message: process.env.NODE_ENV === "production"
               ? "Váratlan hiba történt a szerveren."
               : err.message,
     });
};
