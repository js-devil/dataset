import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import path from 'path';
export default (err, req, res, next) => {
  const { statusCode, message } = err;

  switch (statusCode) {
    // Internal Server Error
    case 500:
      return res.status(statusCode).json({
        ...err,
        message: message || 'An error occured! Try again later',
      });
    default:
      return res.status(statusCode || 400).json({ error: true, message });
  }
};
