import { z } from "zod";

/* -------------------------------------------------------------------------------------------------
 * CONSTANTS
 * -----------------------------------------------------------------------------------------------*/

const mimeTypeSignatures = [
  { mimeType: "image/gif" as const, bytes: [0x47, 0x49, 0x46] },
  { mimeType: "image/png" as const, bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mimeType: "image/jpeg" as const, bytes: [0xff, 0xd8] },
  { mimeType: "image/webp" as const, bytes: [0x52, 0x49, 0x46, 0x46] },
  // { mimeType: "image/svg+xml" as const, bytes: [0x3c, 0x3f, 0x78, 0x6d, 0x6c] },
];

/* -------------------------------------------------------------------------------------------------
 * SCHEMAS
 * -----------------------------------------------------------------------------------------------*/

const Unit8ArraySchema = z.custom<Uint8Array>(
  (value) => value instanceof Uint8Array,
);

export const ImageMimeType = z
  .union([
    z.literal("image/gif"),
    z.literal("image/png"),
    z.literal("image/jpeg"),
    z.literal("image/webp"),
    z.literal("image/svg+xml"),
    Unit8ArraySchema,
  ])
  .transform((value) => {
    if (typeof value === "string") {
      return value as
        | "image/gif"
        | "image/png"
        | "image/jpeg"
        | "image/webp"
        | "image/svg+xml";
    }

    return detectImageMimeType(value);
  });

/* -------------------------------------------------------------------------------------------------
 * DETECT IMAGE MIME TYPE
 * -----------------------------------------------------------------------------------------------*/

export function detectImageMimeType(
  image: Uint8Array,
):
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | undefined {
  for (const { bytes, mimeType } of mimeTypeSignatures) {
    if (
      image.length >= bytes.length &&
      bytes.every((byte, index) => image[index] === byte)
    ) {
      return mimeType;
    }
  }

  return undefined;
}
