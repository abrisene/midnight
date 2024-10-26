// packages/logger/src/logger.ts
import pino from "pino";
import type { Logger, LoggerOptions, LogContext } from "./types";
import { formatters } from "./formatters";
import { errorSerializer, requestSerializer, responseSerializer } from "./serializers";
import { DEFAULT_LOG_LEVEL } from "./constants";

export function createLogger(options: LoggerOptions = {}): Logger {
  const {
    level = DEFAULT_LOG_LEVEL,
    name = "app",
    prettify = process.env.NODE_ENV === "development",
  } = options;

  const transport = prettify
    ? {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        },
      },
    }
    : {};

  return pino({
    name,
    level,
    formatters,
    serializers: {
      error: errorSerializer,
      req: requestSerializer,
      res: responseSerializer,
    },
    base: {
      environment: process.env.NODE_ENV,
    },
    ...transport,
  });
}
