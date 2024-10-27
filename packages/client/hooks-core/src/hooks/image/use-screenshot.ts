"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface ScreenshotOptions {
  type?: string;
  quality?: number;
  scale?: number;
  round?: number;
}

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

export function useScreenshot({
  type,
  quality,
  scale = 1,
  round = 64,
}: ScreenshotOptions) {
  const [image, setImage] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(scale);
  const [baseSize, setBaseSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [cropSize, setCropSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const takeScreenshot = async (node: HTMLElement) => {
    const canvas = await html2canvas(node);

    const croppedCanvas = document.createElement("canvas");
    const croppedCanvasContext = croppedCanvas.getContext("2d")!;

    const cropPositionTop = 0;
    const cropPositionLeft = 0;
    const baseWidth = canvas.width;
    const baseHeight = canvas.height;

    let cropWidth = baseWidth;
    let cropHeight = baseHeight;

    if (scale !== undefined) {
      cropWidth *= scale;
      cropHeight *= scale;
    }

    if (round !== undefined) {
      cropWidth = Math.ceil(cropWidth / round) * round;
      cropHeight = Math.ceil(cropHeight / round) * round;
    }

    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    // Calculate the scale factor
    const scaleFactor = Math.min(
      cropWidth / baseWidth,
      cropHeight / baseHeight,
    );

    // Scale the cropped canvas
    if (scaleFactor !== 1) croppedCanvasContext.scale(scaleFactor, scaleFactor);

    // Draw the image on the cropped canvas
    croppedCanvasContext.drawImage(canvas, cropPositionLeft, cropPositionTop);
    const base64Image = croppedCanvas.toDataURL(type, quality);

    setImage(base64Image);
    setScaleFactor(scaleFactor);
    setBaseSize({ width: baseWidth, height: baseHeight });
    setCropSize({ width: cropWidth, height: cropHeight });

    return base64Image;
  };

  return { image, takeScreenshot, scaleFactor, baseSize, cropSize };
}
