import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
     public readonly statusCode: number;
     public readonly details?: any;

     constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, details?: any) {
          super(message);
          this.statusCode = statusCode;
          this.details = details;
          this.name = "ApiError";

          // Biztosítja, hogy az instanceof helyesen működjön
          Object.setPrototypeOf(this, ApiError.prototype);
     }

     static badRequest(message: string, details?: any) {
          return new ApiError(message, StatusCodes.BAD_REQUEST, details);
     }

     static unauthorized(message: string = "Hiba az azonosítás során.") {
          return new ApiError(message, StatusCodes.UNAUTHORIZED);
     }

     static notFound(message: string = "A kért erőforrás nem található.") {
          return new ApiError(message, StatusCodes.NOT_FOUND);
     }

     static internal(message: string = "Váratlan szerverhiba történt.") {
          return new ApiError(message, StatusCodes.INTERNAL_SERVER_ERROR);
     }
}
