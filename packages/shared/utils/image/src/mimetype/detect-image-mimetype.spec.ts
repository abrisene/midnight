import { detectImageMimeType } from "./detect-image-mimetype";

describe("detectImageMimeType", () => {
  it("should detect GIF images", () => {
    const gifSignature = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    expect(detectImageMimeType(gifSignature)).toBe("image/gif");
  });

  it("should detect PNG images", () => {
    const pngSignature = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    expect(detectImageMimeType(pngSignature)).toBe("image/png");
  });

  it("should detect JPEG images", () => {
    const jpegSignature = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    expect(detectImageMimeType(jpegSignature)).toBe("image/jpeg");
  });

  it("should detect WebP images", () => {
    const webpSignature = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    expect(detectImageMimeType(webpSignature)).toBe("image/webp");
  });

  it("should return undefined for unknown image types", () => {
    const unknownSignature = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    expect(detectImageMimeType(unknownSignature)).toBeUndefined();
  });

  it("should return undefined for empty arrays", () => {
    const emptyArray = new Uint8Array([]);
    expect(detectImageMimeType(emptyArray)).toBeUndefined();
  });

  it("should correctly handle arrays with insufficient length", () => {
    const shortArray = new Uint8Array([0x89, 0x50]);
    expect(detectImageMimeType(shortArray)).toBeUndefined();
  });
});
