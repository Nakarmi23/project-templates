import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utilities/logger';

export const appEndpointLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.originalUrl}: Received request`);
  next();
};
