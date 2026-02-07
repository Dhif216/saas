export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const notFoundError = (resource: string) => {
  return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
};

export const unauthorizedError = (message = 'Unauthorized access') => {
  return new AppError(message, 401, 'UNAUTHORIZED');
};

export const forbiddenError = (message = 'Forbidden') => {
  return new AppError(message, 403, 'FORBIDDEN');
};

export const badRequestError = (message: string) => {
  return new AppError(message, 400, 'BAD_REQUEST');
};

export const conflictError = (message: string) => {
  return new AppError(message, 409, 'CONFLICT');
};
