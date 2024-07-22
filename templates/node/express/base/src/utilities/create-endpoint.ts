import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { BadRequestError } from './custom-errors';

interface EndpointSchemas<
  TParam extends z.ZodType = never,
  TBody extends z.ZodType = never,
  TQuery extends z.ZodType = never,
> {
  param?: TParam;
  body?: TBody;
  query?: TQuery;
}

export const createRouteHandler =
  <
    TParam extends z.ZodType = never,
    TBody extends z.ZodType = never,
    TQuery extends z.ZodType = never,
  >(
    schemas: EndpointSchemas<TParam, TBody, TQuery> | null = null,
  ) =>
  (
    callback: (
      req: Request<z.infer<TParam>, z.infer<TBody>, z.infer<TQuery>>,
      res: Response,
      next: NextFunction,
    ) => Promise<void> | void,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas) {
        if (schemas.param) {
          const param = schemas.param.safeParse(req.params);

          if (!param.success)
            throw new BadRequestError(
              'Invalid parameters detected',
              param.error.issues,
            );

          req.params = param.data as never;
        }

        if (schemas.query) {
          const query = schemas.query.safeParse(req.query);

          if (!query.success)
            throw new BadRequestError(
              'Invalid query detected',
              query.error.issues,
            );

          req.query = query.data as never;
        }

        if (schemas.body) {
          const body = schemas.body.safeParse(req.body);

          if (!body.success)
            throw new BadRequestError(
              'Invalid body detected',
              body.error.issues,
            );

          req.body = body.data as never;
        }
      }

      await callback(req as never, res, next);
    } catch (error) {
      next(error);
    }
  };
