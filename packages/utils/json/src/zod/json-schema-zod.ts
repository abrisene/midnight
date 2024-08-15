import { z } from "zod";

import { parsePartialJson5 } from "../json5/parse-partial-json5";
import { parsePartialJson } from "../partial/parse-partial-json";

/**
 * See https://zod.dev/?id=json-type
 */

/* -------------------------------------------------------------------------------------------------
 * LITERAL SCHEMA
 * -----------------------------------------------------------------------------------------------*/

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type JsonType = Literal | { [key: string]: JsonType } | JsonType[];

/* -------------------------------------------------------------------------------------------------
 * JSON SCHEMA
 * -----------------------------------------------------------------------------------------------*/

export type JsonSchema = z.infer<typeof JsonSchema>;
export const JsonSchema: z.ZodType<JsonType> = z.lazy(() =>
  z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]),
);

/* -------------------------------------------------------------------------------------------------
 * JSON STRING SCHEMA
 * - Supports JSON and JSON5
 * - Attempts to heal broken JSON.
 * -----------------------------------------------------------------------------------------------*/

export type CoerceJSONType = z.infer<typeof CoerceJSONSchema>;
export const CoerceJSONSchema = z.string().transform((value) => {
  try {
    return JsonSchema.parse(parsePartialJson5(value));
  } catch {
    return JsonSchema.parse(parsePartialJson(value));
  }
});
