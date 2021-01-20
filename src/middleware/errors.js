import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import path from "path";
export default (err, req, res, next) => {
  const { statusCode, message } = err;

  switch (statusCode) {
    case 404:
      // Not found error
      return res
        .status(404)
        .sendFile(path.join(__dirname, "../../public/404.html"));

    case 403:
      return res
        .status(403)
        .sendFile(path.join(__dirname, "../../public/403.html"));

    // Internal Server Error
    case 500:
      return res.status(statusCode).json({
        ...err,
        message: message || "An error occured! Try again later",
      });
    default:
      return res.status(statusCode || 400).json({ error: true, message });
  }

  // 401 - unauthenticated error

  // 403 - unauthorized

  // 405  - Method Not Allowed (Wrong method call POST or GET)

  // 406 - Not Acceptable (Data Format)

  // 415 - Unsupported Media Type

  // 422 - Invalid Input
};
