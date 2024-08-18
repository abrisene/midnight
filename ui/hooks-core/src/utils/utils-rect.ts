export interface ClientRect {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function getWindowClientRect(element: typeof window): ClientRect {
  const width = element.innerWidth;
  const height = element.innerHeight;

  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
  };
}
