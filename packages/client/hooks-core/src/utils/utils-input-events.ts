import type { ChangeEvent } from "react";

import type { ParamRest } from "./types";

export function coerceEventToText(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
): string {
  return event.currentTarget.value;
}

export function toInputHandler<
  F extends (text: string, ...args: unknown[]) => unknown,
>(fn?: F, args?: ParamRest<F>) {
  if (!fn) return undefined;
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    args !== undefined
      ? fn(coerceEventToText(event), ...args)
      : fn(coerceEventToText(event));
}
