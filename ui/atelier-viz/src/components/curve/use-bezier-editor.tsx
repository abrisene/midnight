import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useResizeObserver } from "@acausal/hooks/use-resize-observer";
import * as d3 from "d3-shape";
import { z } from "zod";

export interface BezierCurve {
  id: string;
  points: [number, number][];
  clampEnds?: boolean;
  color?: string;
  className?: string;
  type?: CurveType;
}
/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type CurveType = z.infer<typeof CurveType>;
export const CurveType = z.enum([
  "linear",
  "linear-closed",
  "basis",
  "basis-closed",
  "basis-open",
  "bumpX",
  "bumpY",
  // "bundle",
  "cardinal",
  "cardinal-closed",
  "cardinal-open",
  "catmull-rom",
  "catmull-rom-closed",
  "catmull-rom-open",
  "monotone-x",
  "monotone-y",
  "natural",
  "step",
  "step-after",
  "step-before",
]);

export interface BezierCurveWithPath extends BezierCurve {
  d: string;
}

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/

export const CURVE_OPTIONS: Record<CurveType, string> = {
  linear: "Linear",
  "linear-closed": "Linear Closed",
  basis: "Basis",
  "basis-closed": "Basis Closed",
  "basis-open": "Basis Open",
  bumpX: "Bump X",
  bumpY: "Bump Y",
  // bundle: "Bundle",
  cardinal: "Cardinal",
  "cardinal-closed": "Cardinal Closed",
  "cardinal-open": "Cardinal Open",
  "catmull-rom": "Catmull-Rom",
  "catmull-rom-closed": "Catmull-Rom Closed",
  "catmull-rom-open": "Catmull-Rom Open",
  "monotone-x": "Monotone X",
  "monotone-y": "Monotone Y",
  natural: "Natural",
  step: "Step",
  "step-after": "Step After",
  "step-before": "Step Before",
};

export const DEFAULT_CURVE: BezierCurve = {
  id: "basis",
  clampEnds: true,
  points: [
    [0, 0.75],
    [0.25, 0.5],
    [0.75, 0.5],
    [1, 0.75],
  ],
  color: "#800000",
};

/* -------------------------------------------------------------------------------------------------
 * getCurveFunction
 * -----------------------------------------------------------------------------------------------*/

export function getCurveFunction(curveType: CurveType): d3.CurveFactory {
  switch (curveType) {
    case "linear":
      return d3.curveLinear;
    case "linear-closed":
      return d3.curveLinearClosed;
    case "basis":
      return d3.curveBasis;
    case "basis-closed":
      return d3.curveBasisClosed;
    case "basis-open":
      return d3.curveBasisOpen;
    // case "bundle":
    //   return d3.curveBundle;
    case "cardinal":
      return d3.curveCardinal;
    case "cardinal-closed":
      return d3.curveCardinalClosed;
    case "cardinal-open":
      return d3.curveCardinalOpen;
    case "catmull-rom":
      return d3.curveCatmullRom;
    case "catmull-rom-closed":
      return d3.curveCatmullRomClosed;
    case "catmull-rom-open":
      return d3.curveCatmullRomOpen;
    case "monotone-x":
      return d3.curveMonotoneX;
    case "monotone-y":
      return d3.curveMonotoneY;
    case "natural":
      return d3.curveNatural;
    case "step":
      return d3.curveStep;
    case "step-after":
      return d3.curveStepAfter;
    case "step-before":
      return d3.curveStepBefore;
    default:
      return d3.curveCatmullRom;
  }
}

/* -------------------------------------------------------------------------------------------------
 * BezierCurvesContext
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurvesContextValue {
  curves: BezierCurve[];
  setCurves: (curves: BezierCurve[]) => void;
  selectedCurveIndex: number;
  setSelectedCurveIndex: (index: number) => void;
  draggingPointIndex: number | null;
  setDraggingPointIndex: (index: number | null) => void;
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
}

const BezierCurvesContext = createContext<BezierCurvesContextValue | undefined>(
  {
    curves: [
      {
        id: "1",
        points: [
          [0, 0.25],
          [0.5, 0.5],
          [1, 0.75],
        ],
        clampEnds: true,
      },
    ],
    setCurves: () => {},
    selectedCurveIndex: 0,
    setSelectedCurveIndex: () => {},
    draggingPointIndex: null,
    setDraggingPointIndex: () => {},
    width: 0,
    setWidth: () => {},
    height: 0,
    setHeight: () => {},
  },
);

/* -------------------------------------------------------------------------------------------------
 * BezierCurvesProvider
 * -----------------------------------------------------------------------------------------------*/

interface BezierCurvesProviderProps {
  initialCurves?: BezierCurve[];
  children: React.ReactNode;
}

export const BezierCurvesProvider: React.FC<BezierCurvesProviderProps> = ({
  initialCurves = [DEFAULT_CURVE],
  children,
}) => {
  const [curves, setCurves] = useState<BezierCurve[]>(initialCurves);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [selectedCurveIndex, setSelectedCurveIndex] = useState<number>(0);
  const [draggingPointIndex, setDraggingPointIndex] = useState<number | null>(
    null,
  );

  const value: BezierCurvesContextValue = {
    curves,
    setCurves,
    selectedCurveIndex,
    setSelectedCurveIndex,
    draggingPointIndex,
    setDraggingPointIndex,
    width,
    setWidth,
    height,
    setHeight,
  };

  return (
    <BezierCurvesContext.Provider value={value}>
      {children}
    </BezierCurvesContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * useBezierCurves
 * -----------------------------------------------------------------------------------------------*/

export interface BezierCurvesCallbacks {
  // onCurveSelected: (index: number) => void;
  // onPointSelected: (index: number) => void;
  onCurveUpdated: (curve: BezierCurve) => void;
  onCurveDeleted: (id: string) => void;
  onCurveCreated: (curve: BezierCurve) => void;
  onCurvesChanged: (curves: BezierCurve[]) => void;
}

export const useBezierCurves = (
  callbacks: Partial<BezierCurvesCallbacks> = {},
) => {
  // Context Validation
  const context = useContext(BezierCurvesContext);
  if (!context) {
    throw new Error(
      "useBezierCurves must be used within a BezierCurvesProvider",
    );
  }

  // Callbacks / Helpers
  const update = useCallback(
    (update: BezierCurve | BezierCurve[]) => {
      let newCurves: BezierCurve[];
      if (Array.isArray(update)) {
        newCurves = update;
      } else {
        newCurves = context.curves.map((curve) =>
          curve.id === update.id ? update : curve,
        );
      }
      context.setCurves(newCurves);
      callbacks.onCurvesChanged?.(newCurves);
    },
    [context.curves, context.setCurves, callbacks.onCurvesChanged],
  );

  const create = useCallback(
    (update: BezierCurve) => {
      const newCurves = [...context.curves, update];
      context.setCurves(newCurves);
      callbacks.onCurveCreated?.(update);
    },
    [context.curves, context.setCurves, callbacks.onCurveCreated],
  );

  const remove = useCallback(
    (id: string) => {
      const newCurves = context.curves.filter((curve) => curve.id !== id);
      context.setCurves(newCurves);
      callbacks.onCurveDeleted?.(id);
    },
    [context.curves, context.setCurves, callbacks.onCurveDeleted],
  );

  const setColor = useCallback(
    (id: string, color: string) => {
      const newCurves = context.curves.map((curve) =>
        curve.id === id ? { ...curve, color } : curve,
      );
      update(newCurves);
      callbacks.onCurvesChanged?.(newCurves);
    },
    [context.curves, context.setCurves, callbacks.onCurvesChanged],
  );

  const setType = useCallback(
    (id: string, type: CurveType) => {
      const newCurves = context.curves.map((curve) =>
        curve.id === id ? { ...curve, type } : curve,
      );
      update(newCurves);
      callbacks.onCurvesChanged?.(newCurves);
    },
    [context.curves, context.setCurves, callbacks.onCurvesChanged],
  );

  const addPoint = useCallback(
    (curveId: string, x: number, y: number) => {
      const newCurves = context.curves.map((curve) => {
        if (curve.id === curveId) {
          const newPoints = [...curve.points];

          // Create a d3 line generator
          const curveFunction = getCurveFunction(curve.type || "linear");
          const lineGenerator = d3
            .line()
            .x((d) => d[0] * context.width * 0.98)
            .y((d) => d[1] * context.height * 0.98)
            .curve(curveFunction);

          // Generate the path
          const path = lineGenerator(newPoints);
          if (!path) return curve;

          // Create an SVG path element
          const pathNode = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
          );
          pathNode.setAttribute("d", path);

          // Find the point on the curve
          const pathLength = pathNode.getTotalLength();
          const targetX = x * context.width;
          const point = pathNode.getPointAtLength(
            (targetX / context.width) * pathLength,
          );

          // Convert the point back to normalized coordinates
          const newPoint: [number, number] = [
            point.x / context.width,
            point.y / context.height,
          ];

          // Find the correct position to insert the new point
          let insertIndex = newPoints.findIndex(
            (point) => point[0] > newPoint[0],
          );
          if (insertIndex === -1) insertIndex = newPoints.length;

          // Insert the new point
          newPoints.splice(insertIndex, 0, newPoint);
          return { ...curve, points: newPoints };
        }
        return curve;
      });
      context.setCurves(newCurves);
      callbacks.onCurvesChanged?.(newCurves);
    },
    [
      context.curves,
      context.setCurves,
      callbacks.onCurvesChanged,
      context.width,
      context.height,
    ],
  );

  const removePoint = useCallback(
    (curveId: string, pointIndex: number) => {
      const newCurves = context.curves.map((curve) => {
        if (curve.id === curveId) {
          // Don't remove if there are only two points left
          if (curve.points.length <= 2) return curve;

          const newPoints = curve.points.filter(
            (_, index) => index !== pointIndex,
          );
          return { ...curve, points: newPoints };
        }
        return curve;
      });
      context.setCurves(newCurves);
      callbacks.onCurvesChanged?.(newCurves);
    },
    [context.curves, context.setCurves, callbacks.onCurvesChanged],
  );

  // SVG Viewer observer
  const ref = useRef<HTMLDivElement>(null);
  const observer = useResizeObserver({
    callback: (entries) => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }
      const firstEntry = entries[0]!;
      const size = firstEntry.borderBoxSize[0];
      if (!size) return;
      context.setWidth(size.inlineSize);
      context.setHeight(size.blockSize);
    },
  });

  // Container Sizing
  useEffect(() => {
    if (!ref.current || !observer) return;
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [observer]);

  // Mouse Move Handler
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (context.draggingPointIndex !== null && ref.current) {
        const svgRect = ref.current.getBoundingClientRect();
        requestAnimationFrame(() => {
          // Get the mouse position in normalized coordinates
          const x = (event.clientX - svgRect.left) / svgRect.width;
          const y = (event.clientY - svgRect.top) / svgRect.height;

          // Update the selected curve
          const updatedCurves = context.curves.map((curve, idx) => {
            if (idx === context.selectedCurveIndex) {
              const newPoints = curve.points.map((point, pointIdx) => {
                if (pointIdx === context.draggingPointIndex) {
                  let newX = x;

                  // If the curve is clamped, clamp the first and last points to x = 0 and x = 1
                  if (curve.clampEnds) {
                    if (pointIdx === 0) {
                      newX = 0; // Always clamp the first point to x = 0
                    } else if (pointIdx === curve.points.length - 1) {
                      newX = 1; // Always clamp the last point to x = 1
                    }
                  }

                  // Create the new point
                  const newPoint = [
                    Math.max(0, Math.min(newX, 1)), // Clamp x to 0-1 range
                    Math.max(0, Math.min(y, 1)), // Clamp y to 0-1 range
                  ] as [number, number];

                  return newPoint;
                }
                return point;
              });
              return { ...curve, points: newPoints };
            }
            return curve;
          });

          // Update the curves
          context.setCurves(updatedCurves);
        });
      }
    },
    [context],
  );

  // Handling mouse events
  useEffect(() => {
    const handleMouseUp = () => {
      // Stop dragging
      context.setDraggingPointIndex(null);

      // Remove the event listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // If we're dragging a point, add the event listeners
    if (context.draggingPointIndex !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, context.setDraggingPointIndex]);

  return {
    ...context,
    create,
    update,
    remove,
    setColor,
    setType,
    addPoint,
    removePoint,
    ref,
  };
};
