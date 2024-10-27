// src/llm/claude.ts
import Client from "@anthropic-ai/sdk";

import {
  AnalysisContext,
  AnalysisResult,
  EndpointPattern,
  FunctionSchema,
  LLMProvider,
} from "../types/types";

export class ClaudeProvider implements LLMProvider {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ apiKey });
  }

  async analyze(context: AnalysisContext): Promise<AnalysisResult> {
    const prompt = this.buildAnalysisPrompt(context);

    const response = await this.client.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      system: `You are an API analyzer that identifies patterns and suggests improvements.
               Analyze the provided API endpoint data and return structured insights in JSON format.
               Focus on identifying common usage patterns, data shapes, and automation opportunities.`,
    });

    try {
      // Extract and parse the JSON response from Claude
      const jsonStr = response.content[0].text.match(
        /```json\n([\s\S]*?)\n```/,
      )?.[1];
      if (!jsonStr) throw new Error("No JSON found in response");

      return JSON.parse(jsonStr) as AnalysisResult;
    } catch (error) {
      throw new Error(`Failed to parse Claude response: ${error.message}`);
    }
  }

  private buildAnalysisPrompt(context: AnalysisContext): string {
    return `Analyze the following API endpoint data and provide structured insights:

Endpoint: ${context.endpoint.path} ${context.endpoint.method}

Request Patterns:
${JSON.stringify(context.endpoint.requestPatterns, null, 2)}

Response Patterns:
${JSON.stringify(context.endpoint.responsePatterns, null, 2)}

Workflow Patterns:
${JSON.stringify(context.endpoint.workflows, null, 2)}

Current Schema:
${JSON.stringify(context.endpoint.schema, null, 2)}

Please provide analysis in the following JSON format:
{
  "purpose": "Brief description of endpoint purpose",
  "commonPatterns": [
    {
      "type": "request|response|workflow",
      "frequency": 0.0-1.0,
      "confidence": 0.0-1.0,
      "description": "Pattern description"
    }
  ],
  "suggestedAutomations": [
    {
      "trigger": {
        "type": "schedule|event|condition",
        "config": {}
      },
      "actions": [
        {
          "type": "apiCall|notification|dataTransform",
          "config": {}
        }
      ],
      "confidence": 0.0-1.0
    }
  ],
  "updatedSchema": {} // Optional Zod-compatible schema structure
}`;
  }

  async generateFunctionSchema(
    endpoint: EndpointPattern,
  ): Promise<FunctionSchema> {
    const response = await this.client.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Generate an OpenAI-compatible function schema for this API endpoint:
          ${JSON.stringify(endpoint, null, 2)}

          Return only the JSON schema without any explanation or markdown.`,
        },
      ],
      system:
        "You are an API schema generator. Generate precise OpenAI function schemas based on endpoint patterns.",
    });

    try {
      const jsonStr =
        response.content[0].text.match(/```json\n([\s\S]*?)\n```/)?.[1] ||
        response.content[0].text;
      return JSON.parse(jsonStr) as FunctionSchema;
    } catch (error) {
      throw new Error(`Failed to parse function schema: ${error.message}`);
    }
  }
}
