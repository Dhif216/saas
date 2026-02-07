import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export const validateRequestBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        code: 'VALIDATION_ERROR',
      });
    }
    next();
  };
};

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // Basic sanitization - remove scripts from inputs
  const sanitize = (obj: any) => {
    if (typeof obj === 'string') {
      return obj.replace(/[<>]/g, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  req.body = sanitize(req.body);
  next();
};
