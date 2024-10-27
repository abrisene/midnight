// src/types/config.ts
import { z } from "zod";

/**
 * Complete configuration for the API Analyzer
 */
export interface AnalyzerConfig {
  /**
   * Analysis configuration
   */
  analysis: AnalysisConfig;

  /**
   * Schema inference configuration
   */
  schema: SchemaConfig;

  /**
   * Storage configuration for patterns and analysis results
   */
  storage: StorageConfig;

  /**
   * Sampling and performance configuration
   */
  sampling: SamplingConfig;

  /**
   * Security and filtering configuration
   */
  security: SecurityConfig;

  /**
   * LLM-specific configuration
   */
  llm: LLMConfig;

  /**
   * Framework-specific configuration
   */
  framework: FrameworkConfig;
}

export interface AnalysisConfig {
  /**
   * How frequently to run analysis (in milliseconds)
   * @default 3600000 (1 hour)
   */
  analysisInterval: number;

  /**
   * Minimum number of requests before triggering analysis
   * @default 100
   */
  minRequestsForAnalysis: number;

  /**
   * Maximum number of requests to analyze per endpoint
   * @default 1000
   */
  maxRequestsPerAnalysis: number;

  /**
   * Whether to analyze request bodies
   * @default true
   */
  analyzeRequestBodies: boolean;

  /**
   * Whether to analyze response bodies
   * @default true
   */
  analyzeResponseBodies: boolean;

  /**
   * Whether to analyze headers
   * @default false
   */
  analyzeHeaders: boolean;

  /**
   * Whether to analyze query parameters
   * @default true
   */
  analyzeQueryParams: boolean;

  /**
   * Whether to detect workflow patterns
   * @default true
   */
  detectWorkflows: boolean;

  /**
   * Maximum workflow sequence length to detect
   * @default 5
   */
  maxWorkflowLength: number;
}

export interface SchemaConfig {
  /**
   * Minimum confidence threshold for schema updates
   * @default 0.8
   */
  minConfidenceThreshold: number;

  /**
   * Whether to allow breaking schema changes
   * @default false
   */
  allowBreakingChanges: boolean;

  /**
   * Maximum depth for recursive schema inference
   * @default 5
   */
  maxSchemaDepth: number;

  /**
   * Whether to generate example values in schemas
   * @default true
   */
  generateExamples: boolean;

  /**
   * Maximum number of examples to store per field
   * @default 3
   */
  maxExamplesPerField: number;

  /**
   * Whether to preserve null values in schemas
   * @default true
   */
  preserveNullValues: boolean;

  /**
   * Custom Zod transforms to apply during schema inference
   */
  zodTransforms?: Array<(schema: z.ZodType<any>) => z.ZodType<any>>;
}

export interface StorageConfig {
  /**
   * Storage adapter to use
   * @default 'memory'
   */
  adapter: "memory" | "redis" | "postgres" | "custom";

  /**
   * Connection configuration for storage adapter
   */
  connection?: {
    url?: string;
    options?: Record<string, any>;
  };

  /**
   * Maximum age of stored patterns (in milliseconds)
   * @default 2592000000 (30 days)
   */
  maxPatternAge: number;

  /**
   * Whether to persist analysis results
   * @default true
   */
  persistResults: boolean;

  /**
   * Maximum number of patterns to store per endpoint
   * @default 1000
   */
  maxPatternsPerEndpoint: number;
}

export interface SamplingConfig {
  /**
   * Sampling rate for requests (0-1)
   * @default 1
   */
  samplingRate: number;

  /**
   * Maximum number of requests to buffer
   * @default 10000
   */
  maxBufferSize: number;

  /**
   * Whether to sample errors differently
   * @default true
   */
  separateErrorSampling: boolean;

  /**
   * Sampling rate for error responses (0-1)
   * @default 1
   */
  errorSamplingRate: number;

  /**
   * Performance thresholds for sampling
   */
  performance: {
    /**
     * Response time threshold (ms) for increased sampling
     * @default 1000
     */
    slowResponseThreshold: number;

    /**
     * Sampling rate for slow responses (0-1)
     * @default 1
     */
    slowResponseSamplingRate: number;
  };
}

export interface SecurityConfig {
  /**
   * Fields to exclude from analysis
   */
  excludeFields: string[];

  /**
   * Patterns for sensitive data to redact
   */
  redactionPatterns: RegExp[];

  /**
   * Whether to redact numeric values that look like sensitive data
   * @default true
   */
  redactNumericPatterns: boolean;

  /**
   * Whether to analyze authentication headers
   * @default false
   */
  analyzeAuthHeaders: boolean;

  /**
   * Maximum size (in bytes) of request/response bodies to analyze
   * @default 1048576 (1MB)
   */
  maxBodySize: number;
}

export interface LLMConfig {
  /**
   * Configuration for rate limiting LLM requests
   */
  rateLimit: {
    /**
     * Maximum requests per minute
     * @default 60
     */
    requestsPerMinute: number;

    /**
     * Maximum concurrent requests
     * @default 10
     */
    concurrentRequests: number;
  };

  /**
   * Retry configuration for failed LLM requests
   */
  retry: {
    /**
     * Maximum number of retries
     * @default 3
     */
    maxRetries: number;

    /**
     * Base delay between retries (ms)
     * @default 1000
     */
    baseDelay: number;

    /**
     * Maximum delay between retries (ms)
     * @default 10000
     */
    maxDelay: number;
  };

  /**
   * Whether to cache LLM responses
   * @default true
   */
  enableResponseCaching: boolean;

  /**
   * Time-to-live for cached responses (ms)
   * @default 3600000 (1 hour)
   */
  cacheTTL: number;
}

export interface FrameworkConfig {
  /**
   * Framework-specific options
   */
  options: Record<string, any>;

  /**
   * Routes to exclude from analysis
   */
  excludeRoutes: string[];

  /**
   * Routes to include in analysis (if empty, all non-excluded routes are analyzed)
   */
  includeRoutes: string[];

  /**
   * Whether to capture raw request/response objects
   * @default false
   */
  captureRawObjects: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: AnalyzerConfig = {
  analysis: {
    analysisInterval: 3600000,
    minRequestsForAnalysis: 100,
    maxRequestsPerAnalysis: 1000,
    analyzeRequestBodies: true,
    analyzeResponseBodies: true,
    analyzeHeaders: false,
    analyzeQueryParams: true,
    detectWorkflows: true,
    maxWorkflowLength: 5,
  },
  schema: {
    minConfidenceThreshold: 0.8,
    allowBreakingChanges: false,
    maxSchemaDepth: 5,
    generateExamples: true,
    maxExamplesPerField: 3,
    preserveNullValues: true,
  },
  storage: {
    adapter: "memory",
    maxPatternAge: 2592000000,
    persistResults: true,
    maxPatternsPerEndpoint: 1000,
  },
  sampling: {
    samplingRate: 1,
    maxBufferSize: 10000,
    separateErrorSampling: true,
    errorSamplingRate: 1,
    performance: {
      slowResponseThreshold: 1000,
      slowResponseSamplingRate: 1,
    },
  },
  security: {
    excludeFields: ["password", "token", "secret", "key"],
    redactionPatterns: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // email
      /\b\d{16,}\b/, // credit card
      /\b[A-Za-z0-9]{24,}\b/, // tokens
    ],
    redactNumericPatterns: true,
    analyzeAuthHeaders: false,
    maxBodySize: 1048576,
  },
  llm: {
    rateLimit: {
      requestsPerMinute: 60,
      concurrentRequests: 10,
    },
    retry: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
    },
    enableResponseCaching: true,
    cacheTTL: 3600000,
  },
  framework: {
    options: {},
    excludeRoutes: ["/health", "/metrics"],
    includeRoutes: [],
    captureRawObjects: false,
  },
};

/**
 * Helper function to merge custom config with defaults
 */
export function mergeConfig(custom: Partial<AnalyzerConfig>): AnalyzerConfig {
  return {
    analysis: { ...DEFAULT_CONFIG.analysis, ...custom.analysis },
    schema: { ...DEFAULT_CONFIG.schema, ...custom.schema },
    storage: { ...DEFAULT_CONFIG.storage, ...custom.storage },
    sampling: {
      ...DEFAULT_CONFIG.sampling,
      ...custom.sampling,
      performance: {
        ...DEFAULT_CONFIG.sampling.performance,
        ...custom.sampling?.performance,
      },
    },
    security: { ...DEFAULT_CONFIG.security, ...custom.security },
    llm: {
      ...DEFAULT_CONFIG.llm,
      ...custom.llm,
      rateLimit: {
        ...DEFAULT_CONFIG.llm.rateLimit,
        ...custom.llm?.rateLimit,
      },
      retry: {
        ...DEFAULT_CONFIG.llm.retry,
        ...custom.llm?.retry,
      },
    },
    framework: { ...DEFAULT_CONFIG.framework, ...custom.framework },
  };
}
