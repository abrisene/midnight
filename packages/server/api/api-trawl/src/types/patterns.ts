// src/types/patterns.ts
import { z } from "zod";

/**
 * Raw request data captured by adapters
 */
export interface RequestData {
  /**
   * HTTP method
   */
  method: string;

  /**
   * Request path
   */
  path: string;

  /**
   * Query parameters
   */
  query: Record<string, string | string[]>;

  /**
   * Request headers
   */
  headers: Record<string, string | string[]>;

  /**
   * Request body
   */
  body: any;

  /**
   * Request timestamp
   */
  timestamp: Date;

  /**
   * Unique request ID
   */
  id?: string;

  /**
   * Client IP address
   */
  ip?: string;

  /**
   * User agent string
   */
  userAgent?: string;

  /**
   * Request timing information
   */
  timing?: {
    startTime: number;
    endTime?: number;
    duration?: number;
  };

  /**
   * Additional framework-specific metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Raw response data captured by adapters
 */
export interface ResponseData {
  /**
   * HTTP status code
   */
  statusCode: number;

  /**
   * Response headers
   */
  headers: Record<string, string | string[]>;

  /**
   * Response body
   */
  body: any;

  /**
   * Response timestamp
   */
  timestamp: Date;

  /**
   * Size of response in bytes
   */
  size?: number;

  /**
   * Response timing information
   */
  timing?: {
    startTime: number;
    endTime: number;
    duration: number;
    ttfb?: number; // Time to first byte
  };

  /**
   * Error details if response indicates failure
   */
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };

  /**
   * Additional framework-specific metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Analyzed request pattern
 */
export interface RequestPattern {
  /**
   * Inferred schema for the request
   */
  schema: z.ZodSchema<any>;

  /**
   * Number of times this pattern has been observed
   */
  frequency: number;

  /**
   * First time this pattern was observed
   */
  firstSeen: Date;

  /**
   * Last time this pattern was observed
   */
  lastSeen: Date;

  /**
   * Confidence score for this pattern (0-1)
   */
  confidence: number;

  /**
   * Example requests matching this pattern
   */
  examples: RequestData[];

  /**
   * Query parameter patterns
   */
  queryPatterns?: {
    [key: string]: {
      type: string;
      required: boolean;
      frequency: number;
      examples: any[];
    };
  };

  /**
   * Header patterns
   */
  headerPatterns?: {
    [key: string]: {
      required: boolean;
      frequency: number;
      examples: string[];
    };
  };

  /**
   * Performance metrics for this pattern
   */
  performance?: {
    averageSize: number;
    averageDuration: number;
    p95Duration: number;
    p99Duration: number;
  };

  /**
   * Additional metadata about the pattern
   */
  metadata?: {
    userAgents?: string[];
    ipAddresses?: string[];
    timeDistribution?: Record<string, number>; // Hour of day -> frequency
    dayDistribution?: Record<string, number>; // Day of week -> frequency
  };
}

/**
 * Analyzed response pattern
 */
export interface ResponsePattern {
  /**
   * HTTP status code
   */
  statusCode: number;

  /**
   * Inferred schema for the response
   */
  schema: z.ZodSchema<any>;

  /**
   * Number of times this pattern has been observed
   */
  frequency: number;

  /**
   * First time this pattern was observed
   */
  firstSeen: Date;

  /**
   * Last time this pattern was observed
   */
  lastSeen: Date;

  /**
   * Confidence score for this pattern (0-1)
   */
  confidence: number;

  /**
   * Example responses matching this pattern
   */
  examples: ResponseData[];

  /**
   * Header patterns
   */
  headerPatterns?: {
    [key: string]: {
      required: boolean;
      frequency: number;
      examples: string[];
    };
  };

  /**
   * Error patterns if this is an error response
   */
  errorPatterns?: {
    codes: Record<string, number>; // Error code -> frequency
    messages: Record<string, number>; // Error message -> frequency
  };

  /**
   * Performance metrics for this pattern
   */
  performance?: {
    averageSize: number;
    averageDuration: number;
    p95Duration: number;
    p99Duration: number;
  };
}

/**
 * Analyzed workflow pattern
 */
export interface WorkflowPattern {
  /**
   * Sequence of endpoint calls in this workflow
   */
  sequence: Array<{
    method: string;
    path: string;
    conditions?: WorkflowCondition[];
  }>;

  /**
   * Number of times this workflow has been observed
   */
  frequency: number;

  /**
   * First time this workflow was observed
   */
  firstSeen: Date;

  /**
   * Last time this workflow was observed
   */
  lastSeen: Date;

  /**
   * Confidence score for this workflow (0-1)
   */
  confidence: number;

  /**
   * Average time to complete the workflow
   */
  averageTimeToComplete: number;

  /**
   * Success rate of the workflow
   */
  successRate: number;

  /**
   * Example workflow instances
   */
  examples: WorkflowExample[];

  /**
   * Data dependencies between steps
   */
  dataDependencies?: Array<{
    fromStep: number;
    toStep: number;
    fields: string[];
  }>;

  /**
   * Common variations of this workflow
   */
  variations?: Array<{
    sequence: Array<{
      method: string;
      path: string;
    }>;
    frequency: number;
  }>;

  /**
   * Metadata about the workflow
   */
  metadata?: {
    userTypes?: string[];
    timeDistribution?: Record<string, number>;
    averageConcurrentWorkflows?: number;
  };
}

/**
 * Workflow condition
 */
export interface WorkflowCondition {
  type: "response" | "state" | "time";
  field?: string;
  operator: "eq" | "ne" | "gt" | "lt" | "gte" | "lte" | "in" | "nin";
  value: any;
}

/**
 * Example of a workflow instance
 */
export interface WorkflowExample {
  /**
   * Unique identifier for this workflow instance
   */
  id: string;

  /**
   * Steps in this workflow instance
   */
  steps: Array<{
    method: string;
    path: string;
    request: RequestData;
    response: ResponseData;
    timestamp: Date;
    duration: number;
  }>;

  /**
   * Start time of the workflow
   */
  startTime: Date;

  /**
   * End time of the workflow
   */
  endTime: Date;

  /**
   * Total duration in milliseconds
   */
  duration: number;

  /**
   * Whether the workflow completed successfully
   */
  successful: boolean;

  /**
   * Error information if workflow failed
   */
  error?: {
    step: number;
    error: Error;
  };

  /**
   * User/session identifier
   */
  userId?: string;
  sessionId?: string;
}

/**
 * Pattern matching utilities
 */
export class PatternMatcher {
  /**
   * Check if a request matches a pattern
   */
  static requestMatches(
    request: RequestData,
    pattern: RequestPattern,
  ): boolean {
    try {
      pattern.schema.parse(request.body);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a response matches a pattern
   */
  static responseMatches(
    response: ResponseData,
    pattern: ResponsePattern,
  ): boolean {
    try {
      return (
        response.statusCode === pattern.statusCode &&
        pattern.schema.parse(response.body)
      );
    } catch {
      return false;
    }
  }

  /**
   * Check if a sequence of requests/responses matches a workflow pattern
   */
  static workflowMatches(
    sequence: Array<{ request: RequestData; response: ResponseData }>,
    pattern: WorkflowPattern,
  ): boolean {
    if (sequence.length !== pattern.sequence.length) return false;

    return sequence.every((step, index) => {
      const patternStep = pattern.sequence[index];
      return (
        step.request.method === patternStep?.method &&
        step.request.path === patternStep?.path &&
        (!patternStep?.conditions ||
          patternStep.conditions.every((condition) =>
            this.checkCondition(step, condition),
          ))
      );
    });
  }

  private static checkCondition(
    step: { request: RequestData; response: ResponseData },
    condition: WorkflowCondition,
  ): boolean {
    // Condition checking implementation
    return true; // Placeholder
  }
}
