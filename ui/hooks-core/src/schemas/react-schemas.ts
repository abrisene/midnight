import React from "react";
import { z } from "zod";

/* -------------------------------------------------------------------------------------------------
 * SCHEMAS AND TYPES
 * -----------------------------------------------------------------------------------------------*/

export type ReactNodeSchema = z.infer<typeof ReactNodeSchema>;
export const ReactNodeSchema = z.custom<React.ReactNode>((val) => {
  return React.isValidElement(val) || typeof val === "function";
});

/* -------------------------------------------------------------------------------------------------
 * UTILITIES / SCHEMA FACTORIES
 * -----------------------------------------------------------------------------------------------*/

// function createComponentSchema<T extends React.ComponentType>(component: T) {
//   return z.custom<T>((val) => {
//     const valid = React.isValidElement(val) || typeof val === "function";
//     if (!valid) return false;
//     // Check props
//   });
// }

/* -------------------------------------------------------------------------------------------------
 * COMPONENT SCHEMAS
 * -----------------------------------------------------------------------------------------------*/

// export const ComponentWithClassName = createComponentSchema();
