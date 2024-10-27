// src/types.ts
import { z } from "zod";

import {
  RequestData,
  RequestPattern,
  ResponseData,
  ResponsePattern,
  WorkflowPattern,
} from "./patterns";
import { FunctionSchema } from "./schema";

export interface LLMProvider {
  analyze(context: AnalysisContext): Promise<AnalysisResult>;
  generateFunctionSchema(endpoint: EndpointPattern): Promise<FunctionSchema>;
}

export interface FrameworkAdapter<TRequest = any, TResponse = any> {
  extractRequest(req: TRequest): RequestData;
  extractResponse(res: TResponse): ResponseData;
  createMiddleware(): unknown; // Type depends on framework
}

export interface AnalysisContext {
  endpoint: EndpointPattern;
  globalPatterns: Map<string, EndpointPattern>;
  timeframe: {
    start: Date;
    end: Date;
  };
}

export interface AnalysisResult {
  purpose: string;
  commonPatterns: Pattern[];
  suggestedAutomations: Automation[];
  updatedSchema?: z.ZodSchema<any>;
}

export interface EndpointPattern {
  path: string;
  method: string;
  requestPatterns: RequestPattern[];
  responsePatterns: ResponsePattern[];
  workflows: WorkflowPattern[];
  schema: SchemaPattern;
  lastAnalyzed: Date;
}

export interface SchemaPattern {
  request: z.ZodSchema<any>;
  response: z.ZodSchema<any>;
  confidence: number; // 0-1 indicating how sure we are about the schema
  examples: {
    requests: any[];
    responses: any[];
  };
}

export interface Pattern {
  type: "request" | "response" | "workflow";
  frequency: number;
  confidence: number;
  description: string;
}

export interface Automation {
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  confidence: number;
}

export interface AutomationTrigger {
  type: "schedule" | "event" | "condition";
  config: Record<string, any>;
}

export interface AutomationAction {
  type: "apiCall" | "notification" | "dataTransform";
  config: Record<string, any>;
}
