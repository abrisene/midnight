// src/adapters/express.ts
import { NextFunction, Request, Response } from "express";

import { FrameworkAdapter, RequestData, ResponseData } from "../types/types";

export class ExpressAdapter implements FrameworkAdapter<Request, Response> {
  extractRequest(req: Request): RequestData {
    return {
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query,
      headers: req.headers,
      timestamp: new Date(),
    };
  }

  extractResponse(res: Response): ResponseData {
    return {
      statusCode: res.statusCode,
      body: res.locals.responseBody, // Requires body capture in middleware
      headers: res.getHeaders(),
      timestamp: new Date(),
    };
  }

  createMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Capture original send method
      const originalSend = res.send;
      res.send = function (body: any) {
        res.locals.responseBody = body;
        return originalSend.call(this, body);
      };
      next();
    };
  }
}
