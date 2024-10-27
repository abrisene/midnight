# API Pattern Analyzer

A TypeScript package for automatically analyzing API patterns, generating schemas, and enabling LLM automation of common workflows.

<!-- [![npm version](https://badge.fury.io/js/api-trawl.svg)](https://badge.fury.io/js/api-pattern-analyzer) -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔍 Automatic API pattern detection and analysis
- 📊 Dynamic schema inference and evolution
- 🤖 LLM-powered workflow automation
- 🔌 Pluggable framework adapters (Express, Hono, tRPC, Nitro, Fastly)
- 🧠 Multiple LLM provider support (OpenAI, Anthropic)
- 🛡️ Built-in security and privacy features
- 📈 Performance monitoring and optimization
- 🔄 Workflow detection and automation

## Installation

```bash
npm install api-pattern-analyzer
# or
yarn add api-pattern-analyzer
# or
pnpm add api-pattern-analyzer
```

## Quick Start

```typescript
import { APIAnalyzer } from "api-pattern-analyzer";
import { ExpressAdapter } from "api-pattern-analyzer/adapters";
import { OpenAIProvider } from "api-pattern-analyzer/llm";
import express from "express";

// Initialize the analyzer
const analyzer = new APIAnalyzer(
  new OpenAIProvider({ apiKey: "your-openai-key" }),
  new ExpressAdapter(),
  {
    // Optional configuration
  },
);

// Use with Express
const app = express();
app.use(analyzer.middleware());
```

## Framework Support

### Express

```typescript
import { ExpressAdapter } from "api-pattern-analyzer/adapters";

const adapter = new ExpressAdapter();
const analyzer = new APIAnalyzer(llmProvider, adapter);

app.use(analyzer.middleware());
```

### Hono

```typescript
import { HonoAdapter } from "api-pattern-analyzer/adapters";

const adapter = new HonoAdapter();
const analyzer = new APIAnalyzer(llmProvider, adapter);

app.use(analyzer.middleware());
```

### tRPC

```typescript
import { TRPCAdapter } from "api-pattern-analyzer/adapters";

const adapter = new TRPCAdapter(router);
const analyzer = new APIAnalyzer(llmProvider, adapter);

// Use in your tRPC router configuration
const appRouter = router.middleware(analyzer.middleware());
```

### Nitro

```typescript
import { NitroAdapter } from "api-pattern-analyzer/adapters";

const adapter = new NitroAdapter();
const analyzer = new APIAnalyzer(llmProvider, adapter);

// In your Nitro configuration
export default defineNitroConfig({
  middleware: [analyzer.middleware()],
});
```

### Fastly

```typescript
import { FastlyAdapter } from "api-pattern-analyzer/adapters";

const adapter = new FastlyAdapter();
const analyzer = new APIAnalyzer(llmProvider, adapter);

// In your Fastly Compute@Edge application
addEventListener("fetch", (event) => {
  event.respondWith(analyzer.middleware()(event));
});
```

## LLM Provider Configuration

### OpenAI

```typescript
import { OpenAIProvider } from "api-pattern-analyzer/llm";

const llmProvider = new OpenAIProvider({
  apiKey: "your-openai-key",
  model: "gpt-4-turbo-preview", // optional, defaults to gpt-4-turbo-preview
});
```

### Anthropic (Claude)

```typescript
import { ClaudeProvider } from "api-pattern-analyzer/llm";

const llmProvider = new ClaudeProvider({
  apiKey: "your-anthropic-key",
  model: "claude-3-opus-20240229", // optional
});
```

## Configuration Options

```typescript
const analyzer = new APIAnalyzer(llmProvider, adapter, {
  analysis: {
    analysisInterval: 3600000, // 1 hour
    minRequestsForAnalysis: 100,
    maxRequestsPerAnalysis: 1000,
    analyzeRequestBodies: true,
    analyzeResponseBodies: true,
    detectWorkflows: true,
  },
  schema: {
    minConfidenceThreshold: 0.8,
    allowBreakingChanges: false,
    maxSchemaDepth: 5,
    generateExamples: true,
  },
  security: {
    excludeFields: ["password", "token"],
    redactionPatterns: [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/],
    maxBodySize: 1048576, // 1MB
  },
  // ... see types/config.ts for all options
});
```

## Schema Analysis

The analyzer automatically infers and evolves schemas for your API endpoints:

```typescript
// Get current schema for an endpoint
const schema = analyzer.getEndpointSchema("/api/users", "POST");

// Get all detected patterns
const patterns = analyzer.getPatterns();

// Get workflow patterns
const workflows = analyzer.getWorkflowPatterns();
```

Example schema evolution:

```typescript
// Initial schema based on observations
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  },
  required: ['name', 'email']
}

// Schema evolves as new patterns are detected
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'number', optional: true },
    preferences: {
      type: 'object',
      properties: {
        theme: { type: 'string', enum: ['light', 'dark'] },
        notifications: { type: 'boolean' }
      }
    }
  },
  required: ['name', 'email']
}
```

## Workflow Detection

The analyzer automatically detects common workflow patterns:

```typescript
const workflows = analyzer.getWorkflowPatterns();

// Example workflow pattern
{
  sequence: [
    { method: 'POST', path: '/api/users' },
    { method: 'POST', path: '/api/users/:id/preferences' },
    { method: 'GET', path: '/api/users/:id/dashboard' }
  ],
  frequency: 156,
  confidence: 0.92,
  averageTimeToComplete: 2500,
  dataDependencies: [
    {
      fromStep: 0,
      toStep: 1,
      fields: ['id']
    }
  ]
}
```

## LLM Integration

The analyzer uses LLMs to understand API patterns and generate automation:

```typescript
// Get LLM analysis of an endpoint
const analysis = await analyzer.analyzePath("/api/users", "POST");

// Generate OpenAI function schema
const functionSchema = await analyzer.generateFunctionSchema(
  "/api/users",
  "POST",
);

// Get automation suggestions
const automations = await analyzer.getAutomationSuggestions();
```

## Security

Built-in security features:

- Automatic redaction of sensitive data
- Configurable field exclusion
- Rate limiting
- Request/response size limits
- Auth header protection

```typescript
const analyzer = new APIAnalyzer(llmProvider, adapter, {
  security: {
    excludeFields: ["password", "token", "secret"],
    redactionPatterns: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // email
      /\b\d{16,}\b/, // credit card
      /\b[A-Za-z0-9]{24,}\b/, // tokens
    ],
    redactNumericPatterns: true,
    analyzeAuthHeaders: false,
    maxBodySize: 1048576, // 1MB
  },
});
```

## Performance Monitoring

The analyzer includes built-in performance monitoring:

```typescript
// Get performance metrics for an endpoint
const metrics = analyzer.getEndpointMetrics('/api/users', 'POST');

// Example metrics
{
  averageResponseTime: 245,
  p95ResponseTime: 850,
  errorRate: 0.02,
  throughput: 150, // requests per minute
  statusCodeDistribution: {
    '200': 0.95,
    '400': 0.03,
    '500': 0.02
  }
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Schema validation powered by [Zod](https://github.com/colinhacks/zod)
- LLM support via [OpenAI](https://openai.com/) and [Anthropic](https://www.anthropic.com/)
