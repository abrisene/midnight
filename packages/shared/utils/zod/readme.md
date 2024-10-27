# SchemaAnalyzer

`SchemaAnalyzer` is a TypeScript utility that analyzes unstructured JSON data and automatically generates Zod schemas based on observed properties. It is particularly useful for working with dynamic data sources where schemas are not predefined. The analyzer can group data using a discriminator function and recursively generate schemas, handling optional fields, union types, and nested objects.

---

## Features

- **Dynamic Schema Inference:** Automatically infer schemas from JSON samples.
- **Discriminator-based Grouping:** Group data into multiple schemas based on a provided discriminator function.
- **Union Types & Optional Fields:** Detects union types and determines optional fields based on frequency.
- **Nested Structures:** Recursively processes nested objects and arrays.
- **Supports Various Types:** Handles strings, numbers, booleans, arrays, objects, and null values.

---

## Installation

Ensure that you have `zod` installed as a dependency in your project.

```bash
npm install zod
```

Then, add the `SchemaAnalyzer` module to your project.

---

## Usage

### 1. Import the Module

```typescript
import { SchemaAnalyzer } from "./src/schema/analyzer";
```

### 2. Example Usage

```typescript
const samples = [
  { type: "A", value: 1 },
  { type: "A", value: 2 },
  { type: "B", value: "hello" },
  { type: "B", value: "world" },
];

const discriminator = (sample: any) => sample.type;

const analyzer = new SchemaAnalyzer();
const schemas = analyzer.analyzeSchema(samples, discriminator);

console.log(schemas);
```

In this example:

- The `discriminator` function groups the samples by the `type` field.
- The analyzer generates Zod schemas for each group based on observed properties and value types.

### 3. Output

The output will look like this:

```javascript
{
  A: ZodObject { value: ZodNumber() },
  B: ZodObject { value: ZodString() }
}
```

---

## API Reference

### **`analyzeSchema(samples: any[], discriminator: (sample: any) => string): Record<string, z.ZodSchema<any>>`**

- **Parameters:**

  - `samples`: An array of JSON objects or primitive values.
  - `discriminator`: A function that takes a sample and returns a string, indicating the group it belongs to.

- **Returns:** A record object containing Zod schemas for each group.

### **`private inferSchema(samples: any[]): z.ZodSchema<any>`**

- Recursively infers the appropriate Zod schema based on the samples provided.

### **`private inferObjectSchema(samples: object[]): z.ZodObject<any>`**

- Generates a Zod object schema from a collection of object samples.

### **`private inferArraySchema(samples: any[][]): z.ZodArray<any>`**

- Creates a Zod array schema by flattening nested arrays and analyzing their contents.

---

## Handling Union Types and Optional Fields

The analyzer determines whether a property is optional based on the frequency of its occurrence:

- **Threshold:** If a property is present in less than 90% of the samples, it is marked as optional.
- **Union Types:** If a field contains multiple types, the analyzer returns a union schema (e.g., `z.union([z.string(), z.number()])`).

---

## Contributing

Feel free to open issues and submit pull requests if you find bugs or have suggestions for new features.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

This module leverages the [Zod](https://github.com/colinhacks/zod) library for schema validation and inference.

---

This README provides a comprehensive overview of how to use and extend the `SchemaAnalyzer` module. Let me know if you need further customization!
