// src/adapters/nitro.ts
import { H3Event } from "h3";

import { FrameworkAdapter, RequestData, ResponseData } from "../types/types";

export class NitroAdapter implements FrameworkAdapter<H3Event> {
  extractRequest(event: H3Event): RequestData {
    return {
      method: event.method,
      path: event.path,
      body: event.body, // Will need to be awaited
      query: event.query,
      headers: event.headers,
      timestamp: new Date(),
    };
  }

  extractResponse(event: H3Event): ResponseData {
    return {
      statusCode: event.res.statusCode,
      body: event.res.body,
      headers: event.res.getHeaders(),
      timestamp: new Date(),
    };
  }

  createMiddleware() {
    return async (event: H3Event) => {
      // Store original response methods
      const originalJson = event.res.json;
      const originalSend = event.res.send;

      // Override response methods
      event.res.json = function (data: any) {
        event.res.body = data;
        return originalJson.call(this, data);
      };

      event.res.send = function (data: any) {
        event.res.body = data;
        return originalSend.call(this, data);
      };
    };
  }
}
