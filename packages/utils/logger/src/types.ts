// packages/logger/src/types.ts
import type { Logger as PinoLogger } from "pino";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export interface LoggerOptions {
  level?: LogLevel;
  name?: string;
  prettify?: boolean;
}

export interface Logger extends Omit<PinoLogger, 'child'> {
  child(bindings: Record<string, unknown>): Logger;
}

export interface LogContext {
  [key: string]: unknown;
  requestId?: string;
  userId?: string;
  service?: string;
  environment?: string;
}
