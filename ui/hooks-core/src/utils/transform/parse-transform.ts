import type { Transform } from "@dnd-kit/utilities";

export function parseTransform(transform: string): Transform | null {
  if (transform.startsWith("matrix3d(")) {
    const transformArray = transform.slice(9, -1).split(/, /);
    const x = transformArray[12] ? +transformArray[12] : 0;
    const y = transformArray[13] ? +transformArray[13] : 0;
    const scaleX = transformArray[0] ? +transformArray[0] : 1;
    const scaleY = transformArray[5] ? +transformArray[5] : 1;

    return {
      x,
      y,
      scaleX,
      scaleY,
    };
  } else if (transform.startsWith("matrix(")) {
    const transformArray = transform.slice(7, -1).split(/, /);

    return {
      x: transformArray[4] ? +transformArray[4] : 0,
      y: transformArray[5] ? +transformArray[5] : 0,
      scaleX: transformArray[0] ? +transformArray[0] : 1,
      scaleY: transformArray[3] ? +transformArray[3] : 1,
    };
  }

  return null;
}
