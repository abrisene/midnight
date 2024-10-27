// src/adapters/trpc.ts
import { inferRouterInputs, inferRouterOutputs, TRPCError } from "@trpc/server";

import { FrameworkAdapter, RequestData, ResponseData } from "../types/types";

export class TRPCAdapter implements FrameworkAdapter {
  private router: any; // TRPC router type

  constructor(router: any) {
    this.router = router;
  }

  extractRequest(ctx: any): RequestData {
    return {
      method: ctx.type,
      path: ctx.path,
      body: ctx.rawInput,
      query: {},
      headers: ctx.req?.headers || {},
      timestamp: new Date(),
    };
  }

  extractResponse(ctx: any): ResponseData {
    return {
      statusCode: 200, // TRPC handles errors differently
      body: ctx.result,
      headers: {},
      timestamp: new Date(),
    };
  }

  createMiddleware() {
    return async (opts: any) => {
      const { ctx, next, path, type } = opts;

      const start = Date.now();
      let result;

      try {
        result = await next(opts);

        // Capture successful response
        this.captureResponse({
          path,
          type,
          duration: Date.now() - start,
          input: opts.rawInput,
          output: result,
          error: null,
        });

        return result;
      } catch (error) {
        // Capture error response
        this.captureResponse({
          path,
          type,
          duration: Date.now() - start,
          input: opts.rawInput,
          output: null,
          error,
        });

        throw error;
      }
    };
  }

  private captureResponse(data: any) {
    // Store response data for analysis
  }
}
