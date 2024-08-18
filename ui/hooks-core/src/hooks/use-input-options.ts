import type { Replace } from "@acausal/types";
import React, { useMemo } from "react";
import { z } from "zod";

/* -------------------------------------------------------------------------------------------------
 * SCHEMAS AND TYPES
 * -----------------------------------------------------------------------------------------------*/

export type InputValueType = z.infer<typeof InputValueType>;
const InputValueType = z.string();
// const InputValueType = z.union([
//   z.string(),
//   // z.array(z.string()).readonly(),
//   z.number(),
//   z.boolean(),
// ]);

const InputOptionInputSchema = z.object({
  label: z.string().optional(),
  value: InputValueType.optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  key: z.string().optional(),
  iconKey: z.string().optional(),
  iconSrc: z.string().optional(),
});

const InputOptionOutputSchema = z.object({
  label: z.string(),
  value: InputValueType,
  iconSrc: z.string().optional(),
  iconKey: z.string().optional(),
});

type InputOptionParseInput<T extends InputValueType = string> = Replace<
  z.input<typeof InputOptionSchema>,
  "value",
  T
>;

export const InputOptionSchema = InputOptionInputSchema.transform((v) => {
  const iconBase = {
    value: v.value ?? v.id,
    label: v.label ?? v.name ?? v.value ?? v.key ?? v.id,
    iconSrc: v.iconSrc,
    iconKey: v.iconKey,
  };
  return InputOptionOutputSchema.parse(iconBase);
});

/* -------------------------------------------------------------------------------------------------
 * SCHEMAS AND TYPES
 * -----------------------------------------------------------------------------------------------*/

export type IconType = React.ComponentType<{
  className?: string;
  src?: string;
  imgKey?: string;
}>;

export interface SelectOptionGroup<T extends InputValueType> {
  options: SelectOption<T>[];
  label: string;
  icon?: IconType;
  iconSrc?: string;
  iconKey?: string;
  className?: string;
  iconClassName?: string;
}

export interface SelectOption<T extends InputValueType>
  extends Omit<InputOptionParseInput<T>, "icon" | "value"> {
  value?: T;
  label: string;
  icon?: IconType;
  iconSrc?: string;
  iconKey?: string;
  className?: string;
  iconClassName?: string;
}

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

export function useInputOptions<T extends InputValueType>(
  data: Record<string, any> | SelectOption<T>[],
  selectKey?: string,
) {
  return useMemo(() => formatInputOptions(data, selectKey), [data, selectKey]);
}

export function formatInputOptions<T extends InputValueType>(
  data: Record<string, any> | SelectOption<T>[],
  selectKey?: string,
): SelectOption<T>[] {
  if (Array.isArray(data)) {
    return data.reduce((acc, option) => {
      const parsed = InputOptionSchema.safeParse(option);
      if (parsed.success) {
        return [...acc, parsed.data as SelectOption<T>];
      }
      return acc;
    }, [] as SelectOption<T>[]);
  }

  const keys = Object.keys(data);

  if (!selectKey || keys.length === 0) {
    return keys.map((key) => ({ label: key, value: key as T }));
  }

  if (keys[0] !== undefined && typeof data[keys[0]] !== "object") {
    return keys.map((key) => ({ label: key, value: data[key] as T }));
  }

  const options = Object.values(data).reduce<SelectOption<T>[]>(
    (acc, value) => {
      if (typeof value !== "object" || !value[selectKey]) {
        return acc;
      }

      const key = value[selectKey];

      if (key === null || key === undefined) {
        return acc;
      }

      const stringifiedKey =
        typeof key === "object" ? JSON.stringify(key) : String(key);

      const option: SelectOption<T> = {
        label: stringifiedKey,
        value: key as T,
        iconSrc: value.iconSrc,
        iconKey: value.iconKey,
      };

      return acc.some((o) => o.value === option.value) ? acc : [...acc, option];
    },
    [],
  );

  return options;
}
