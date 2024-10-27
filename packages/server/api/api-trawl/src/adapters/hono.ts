// src/adapters/hono.ts
import type { Context } from "hono";

import { FrameworkAdapter, RequestData, ResponseData } from "../types/types";

export class HonoAdapter implements FrameworkAdapter<Context> {
  extractRequest(c: Context): RequestData {
    return {
      method: c.req.method,
      path: c.req.path,
      body: c.req.raw.body, // Will need to be awaited
      query: Object.fromEntries(new URL(c.req.url).searchParams),
      headers: Object.fromEntries(c.req.raw.headers),
      timestamp: new Date(),
    };
  }

  extractResponse(c: Context): ResponseData {
    return {
      statusCode: c.res.status,
      body: c.res.body, // May need parsing depending on type
      headers: Object.fromEntries(c.res.headers),
      timestamp: new Date(),
    };
  }

  createMiddleware() {
    return async (c: Context, next: () => Promise<void>) => {
      // Store original response methods
      const originalJson = c.json.bind(c);
      const originalSend = c.send.bind(c);

      // Override response methods to capture data
      c.json = async (data: any) => {
        c.res.body = data;
        return await originalJson(data);
      };

      c.send = async (data: any) => {
        c.res.body = data;
        return await originalSend(data);
      };

      await next();
    };
  }
}
