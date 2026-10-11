import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Response } from "express";

const MAP: Record<string, [number, string]> = {
  P2025: [HttpStatus.NOT_FOUND, "Record not found"],
  P2002: [HttpStatus.CONFLICT, "That value is already in use"],
  P2003: [HttpStatus.CONFLICT, "This record is still in use elsewhere"],
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const [statusCode, message] = MAP[error.code] ?? [HttpStatus.INTERNAL_SERVER_ERROR, "Database error"];
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) console.error(error);
    host.switchToHttp().getResponse<Response>().status(statusCode).json({ statusCode, message });
  }
}
