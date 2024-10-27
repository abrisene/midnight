// src/adapters/fastly.ts
import { FrameworkAdapter, RequestData, ResponseData } from "../types/types";

export class FastlyAdapter implements FrameworkAdapter {
  extractRequest(req: Request): RequestData {
    return {
      method: req.method,
      path: new URL(req.url).pathname,
      body: req.body, // Will need to be read
      query: Object.fromEntries(new URL(req.url).searchParams),
      headers: Object.fromEntries(req.headers),
      timestamp: new Date(),
    };
  }

  extractResponse(res: Response): ResponseData {
    return {
      statusCode: res.status,
      body: res.body, // Will need to be read
      headers: Object.fromEntries(res.headers),
      timestamp: new Date(),
    };
  }

  createMiddleware() {
    return async (req: Request, context: any) => {
      // Fastly-specific middleware logic
      const response = await context.next(req);

      // Clone response to read body
      const clone = response.clone();
      const body = await clone.text();

      // Store response data
      this.storeResponseData({
        request: this.extractRequest(req),
        response: {
          ...this.extractResponse(response),
          body,
        },
      });

      return response;
    };
  }

  private storeResponseData(data: any) {
    // Implementation for storing response data
  }
}
