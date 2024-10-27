// src/llm/openai.ts
import { Configuration, OpenAIApi } from "openai";

import {
  AnalysisContext,
  AnalysisResult,
  EndpointPattern,
  FunctionSchema,
  LLMProvider,
} from "../types/types";

export class OpenAIProvider implements LLMProvider {
  private client: OpenAIApi;

  constructor(config: Configuration) {
    this.client = new OpenAIApi(config);
  }

  async analyze(context: AnalysisContext): Promise<AnalysisResult> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an API analyzer that identifies patterns and suggests improvements.
                   Analyze the provided API endpoint data and return structured insights.`,
        },
        {
          role: "user",
          content: this.buildAnalysisPrompt(context),
        },
      ],
      functions: [
        {
          name: "provideAnalysis",
          parameters: {
            type: "object",
            properties: {
              purpose: { type: "string" },
              commonPatterns: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["request", "response", "workflow"],
                    },
                    frequency: { type: "number" },
                    confidence: { type: "number" },
                    description: { type: "string" },
                  },
                },
              },
              suggestedAutomations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    trigger: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        config: { type: "object" },
                      },
                    },
                    actions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          type: { type: "string" },
                          config: { type: "object" },
                        },
                      },
                    },
                    confidence: { type: "number" },
                  },
                },
              },
            },
            required: ["purpose", "commonPatterns", "suggestedAutomations"],
          },
        },
      ],
      function_call: { name: "provideAnalysis" },
    });

    const functionCall = response.choices[0].message.function_call;
    if (!functionCall?.arguments) {
      throw new Error("No analysis provided");
    }

    return JSON.parse(functionCall.arguments) as AnalysisResult;
  }

  private buildAnalysisPrompt(context: AnalysisContext): string {
    return `Analyze this API endpoint:

    Path: ${context.endpoint.path}
    Method: ${context.endpoint.method}

    Request Patterns: ${JSON.stringify(context.endpoint.requestPatterns)}
    Response Patterns: ${JSON.stringify(context.endpoint.responsePatterns)}
    Workflows: ${JSON.stringify(context.endpoint.workflows)}

    Provide detailed analysis including purpose, common patterns, and automation opportunities.`;
  }

  async generateFunctionSchema(
    endpoint: EndpointPattern,
  ): Promise<FunctionSchema> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "Generate an OpenAI function schema based on the provided endpoint pattern.",
        },
        {
          role: "user",
          content: `Generate a function schema for:\n${JSON.stringify(endpoint, null, 2)}`,
        },
      ],
      functions: [
        {
          name: "provideFunctionSchema",
          parameters: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              parameters: { type: "object" },
            },
            required: ["name", "description", "parameters"],
          },
        },
      ],
      function_call: { name: "provideFunctionSchema" },
    });

    const functionCall = response.choices[0].message.function_call;
    if (!functionCall?.arguments) {
      throw new Error("No schema provided");
    }

    return JSON.parse(functionCall.arguments) as FunctionSchema;
  }
}
