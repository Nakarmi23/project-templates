import type { Request, Response } from 'express';
import { AppHttpError } from '../utilities/custom-errors';
import lodash from 'lodash';
import { logger } from '../utilities/logger';

export const appErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: unknown,
) => {
  if (error && error instanceof AppHttpError) {
    const resPayload: Record<string, unknown> = {
      message: error.message,
      status: error.status,
    };
    if (!lodash.isEmpty(error.errors)) resPayload.issues = error.errors;

    logger.error(`${req.method} ${req.originalUrl}: ${error.message}`, {
      payload: {
        ...resPayload,
        stack: error.stack,
      },
    });
    return res.status(error.status).json(resPayload);
  }

  if (error && error instanceof Error && 'message' in error) {
    logger.error(`${req.method} ${req.originalUrl}: ${error.message}`, {
      payload: { status: 500, message: error.message, stack: error.stack },
    });
    return res.status(500).json({ status: 500, message: error.message });
  }

  logger.error(
    `${req.method} ${req.originalUrl}: Error while trying to resolve http request`,
    { payload: error },
  );
  return res
    .status(500)
    .json({ status: 500, message: 'Internal server error occurred' });
};
