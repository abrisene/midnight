import { SchemaAnalyzer } from "./src/schema/analyzer";
import { AnalyzerConfig } from "./src/types/config";
import {
  EndpointPattern,
  FrameworkAdapter,
  LLMProvider,
} from "./src/types/types";

// src/index.ts
export class APIAnalyzer {
  private llmProvider: LLMProvider;
  private adapter: FrameworkAdapter;
  private schemaAnalyzer: SchemaAnalyzer;
  private patterns: Map<string, EndpointPattern> = new Map();

  constructor(
    llmProvider: LLMProvider,
    adapter: FrameworkAdapter,
    config?: Partial<AnalyzerConfig>,
  ) {
    this.llmProvider = llmProvider;
    this.adapter = adapter;
    this.schemaAnalyzer = new SchemaAnalyzer();
    // Initialize with config
  }

  public middleware() {
    return this.adapter.createMiddleware();
  }

  public async analyze() {
    // Trigger analysis for all endpoints
  }

  public getEndpointSchema(path: string, method: string) {
    // Get current schema for endpoint
  }

  // Additional methods...
}

export * from "./src/types/types";
export * from "./src/llm/openai";
export * from "./src/adapters/express";
// Export other modules...
