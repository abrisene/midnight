import type { z } from "zod";

import type { Prettify } from "../prettify";
import type { OpenUnion } from "../string";

/* -------------------------------------------------------------------------------------------------
 * ZOD TYPE UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Extracts the output type of a Zod schema and prettifies it.
 */
export type zInfer<T extends z.ZodType<any, any, any>> = Prettify<T["_output"]>;

/**
 * Extracts the input type of a Zod schema and prettifies it.
 */
export type zInput<T extends z.ZodType<any, any, any>> = Prettify<T["_input"]>;

/**
 * Extracts the output type of a Zod schema and prettifies it.
 */
export type zOutput<T extends z.ZodType<any, any, any>> = Prettify<
  T["_output"]
>;

/* -------------------------------------------------------------------------------------------------
 * ZOD SCHEMA UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Extracts the keys of a Zod schema.
 */
export type SchemaFields<S> = S extends z.ZodTypeAny
  ? OpenUnion<Extract<keyof z.input<S>, string>>
  : string;

/**
 * A Zod object or wrapped object.
 */
export type ZodObjectOrWrapped =
  | z.ZodObject<any, any>
  | z.ZodEffects<z.ZodObject<any, any>>;
