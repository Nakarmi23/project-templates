export class AppHttpError extends Error {
  public status!: number;
  public errors!: Iterable<unknown>;

  constructor(message: string, status = 500, errors: Iterable<unknown> = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'Application Http Error';
  }
}

export class BadRequestError extends AppHttpError {
  constructor(message: string, errors: Iterable<unknown> = []) {
    super(message, 400, errors);
    this.name = 'Bad Request';
  }
}

export class UnauthorizedError extends AppHttpError {
  constructor(message: string, errors: Iterable<unknown> = []) {
    super(message, 401, errors);
    this.name = 'Unauthorized';
  }
}

export class NotFoundError extends AppHttpError {
  constructor(message: string, errors: Iterable<unknown> = []) {
    super(message, 404, errors);
    this.name = 'Not Found';
  }
}

export class ForbiddenError extends AppHttpError {
  constructor(message: string, errors: Iterable<unknown> = []) {
    super(message, 403, errors);
    this.name = 'Forbidden';
  }
}

export class InternalServerError extends AppHttpError {
  constructor(message: string, errors: Iterable<unknown> = []) {
    super(message, 500, errors);
    this.name = 'Internal Server Error';
  }
}
