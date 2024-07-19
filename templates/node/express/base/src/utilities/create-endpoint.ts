import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';
import { BadRequestError } from './custom-errors';

type EndpointSchemas<
  TParam extends z.ZodType = any,
  TBody extends z.ZodType = any,
  TQuery extends z.ZodType = any
> = {
  param?: TParam;
  body?: TBody;
  query?: TQuery;
};

export const createEndpoint =
  <
    TParam extends z.ZodType = any,
    TBody extends z.ZodType = any,
    TQuery extends z.ZodType = any
  >(
    schemas: EndpointSchemas<TParam, TBody, TQuery> | null = null
  ) =>
  (
    callback: RequestHandler<
      z.infer<TParam>,
      any,
      z.infer<TBody>,
      z.infer<TQuery>
    >
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas) {
        if (schemas.param) {
          const param = schemas.param.safeParse(req.params);

          if (!param.success)
            throw new BadRequestError(
              'Invalid parameters detected',
              param.error.issues
            );

          req.params = param.data as never;
        }

        if (schemas.query) {
          const query = schemas.query.safeParse(req.query);

          if (!query.success)
            throw new BadRequestError(
              'Invalid query detected',
              query.error.issues
            );

          req.query = query.data as never;
        }

        if (schemas.body) {
          const body = schemas.body.safeParse(req.body);

          if (!body.success)
            throw new BadRequestError(
              'Invalid body detected',
              body.error.issues
            );

          req.body = body.data as never;
        }
      }

      return callback(req as never, res, next);
    } catch (error) {
      next(error);
    }
  };
