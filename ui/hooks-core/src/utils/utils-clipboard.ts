"use client";
/* -------------------------------------------------------------------------------------------------
 * UTILS
 * -----------------------------------------------------------------------------------------------*/

export async function copyToClipboardWithMeta(value: string) {
  await navigator.clipboard.writeText(value);
}
