// packages/logger/src/serializers.ts
import type { SerializerFn } from "pino";

export const errorSerializer: SerializerFn = (error: Error) => {
  return {
    type: error.constructor.name,
    message: error.message,
    stack: error.stack,
    ...(error as any),
  };
};

export const requestSerializer: SerializerFn = (req: any) => {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    remoteAddress: req.remoteAddress,
    remotePort: req.remotePort,
  };
};

export const responseSerializer: SerializerFn = (res: any) => {
  return {
    statusCode: res.statusCode,
    headers: res.getHeaders?.(),
  };
};
