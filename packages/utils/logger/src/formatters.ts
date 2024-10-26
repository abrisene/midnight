// packages/logger/src/formatters.ts
export const formatters = {
  bindings: (bindings: Record<string, unknown>) => {
    return {
      ...bindings,
      environment: process.env.NODE_ENV || "development",
    };
  },
  level: (label: string, number: number) => {
    return {
      level: label,
      severity: number,
    };
  },
};
