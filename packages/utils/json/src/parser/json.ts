import * as json5 from "json5";
import { z } from "zod";

import { beautifyJSON } from "../beautify";
import { parsePartialJson5 } from "../json5/parse-partial-json5";
import { parsePartialJson } from "../partial/parse-partial-json";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface JSONParser extends JSON {
  parse: <T = unknown>(
    value: string,
    reviver?: (this: any, key: string, value: string) => any,
    options?: ParseOptions<T>,
  ) => T;
  parseValidated: <T = unknown>(
    value: string,
    schema: z.ZodSchema<T>,
    options?: Omit<ParseOptions<T>, "validator">,
  ) => T;
  stringify: (
    value: unknown,
    replacer?: Function | object | unknown[] | null,
    space?: string | number,
    limit?: number,
  ) => string;
}

interface ParseOptions<T = unknown> {
  partial?: boolean;
  json5?: boolean;
}

const defaultOptions: ParseOptions = {
  partial: true,
  json5: true,
};

/* -------------------------------------------------------------------------------------------------
 * JSON PARSE / STRINGIFY
 * -----------------------------------------------------------------------------------------------*/

/**
 * Parse a JSON string to a value.
 * @param value The JSON string to parse.
 * @param reviver A function that alters the behavior of the parsing.
 * @param options.validator A function or ZodSchema that validates the parsed value.
 * @param options.partial Whether to parse partial JSON.
 * @param options.json5 Whether to parse the JSON string using JSON5.
 * @returns The parsed value.
 */
const jsonParse = <T = unknown>(
  value: string,
  reviver?: (this: any, key: string, value: string) => any,
  options?: ParseOptions<T>,
): T => {
  // Merge the default options with the provided options
  const { partial: parsePartial, json5: useJson5 } = {
    ...defaultOptions,
    ...options,
  };

  // Select the parser based on the options
  let parser = useJson5 ? json5.parse : JSON.parse;
  if (useJson5) {
    parser = parsePartial ? parsePartialJson5 : json5.parse;
  } else {
    parser = parsePartial ? parsePartialJson : JSON.parse;
  }

  // Parse the JSON string
  const parsed = parser(value, reviver);
  return parsed;
};

/**
 * Stringify a value to a JSON string.
 * @param value The value to stringify.
 * @param replacer A function that alters the behavior of the stringification.
 * @param space A string or number that inserts whitespace into the output JSON string.
 * @param limit The maximum number of characters to stringify.
 * @returns A JSON string.
 */
const jsonStringify = (
  value: unknown,
  replacer: Function | object | unknown[] | null = null,
  space: string | number = 2,
  limit: number = 80,
) => {
  return beautifyJSON(value, replacer, space, limit);
};

/**
 * Parse a JSON string to a value using a ZodSchema.
 * @param value The JSON string to parse.
 * @param schema The ZodSchema to validate the parsed value.
 * @param options.partial Whether to parse partial JSON.
 * @param options.json5 Whether to parse the JSON string using JSON5.
 * @returns The parsed value.
 */
const jsonParseSchema = <Schema extends z.ZodSchema<T>, T = z.infer<Schema>>(
  value: string,
  schema: Schema,
  options?: ParseOptions<T>,
): T => {
  const result = jsonParse<T>(value, undefined, {
    ...options,
  });
  return schema.parse(result);
};

/* -------------------------------------------------------------------------------------------------
 * JSON PARSER
 * -----------------------------------------------------------------------------------------------*/

export const Json: JSONParser = {
  [Symbol.toStringTag]: "Json",
  /**
   * Parse a JSON string to a value.
   * @param value The JSON string to parse.
   * @param reviver A function that alters the behavior of the parsing.
   * @param options.validator A function or ZodSchema that validates the parsed value.
   * @param options.partial Whether to parse partial JSON.
   * @param options.json5 Whether to parse the JSON string using JSON5.
   * @returns The parsed value.
   */
  parse: jsonParse,

  /**
   * Parse a JSON string to a value using a ZodSchema.
   * @param value The JSON string to parse.
   * @param schema The ZodSchema to validate the parsed value.
   * @param options.partial Whether to parse partial JSON.
   * @param options.json5 Whether to parse the JSON string using JSON5.
   * @returns The parsed value.
   */
  parseValidated: jsonParseSchema,

  /**
   * Stringify a value to a JSON string.
   * @param value The value to stringify.
   * @param replacer A function that alters the behavior of the stringification.
   * @param space A string or number that inserts whitespace into the output JSON string.
   * @param limit The maximum number of characters to stringify.
   * @returns A JSON string.
   */
  stringify: jsonStringify,
};
