import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useResizeObserver } from "@acausal/hooks/use-resize-observer";
import { z } from "zod";

export interface BezierCurve {
  id: string;
  points: [number, number][];
  color?: string;
  className?: string;
  type?: CurveType;
}
/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type CurveType = z.infer<typeof CurveType>;
const CurveType = z.enum([
  "linear",
  "linear-closed",
  "basis",
  "basis-closed",
  "basis-open",
  "bumpX",
  "bumpY",
  "bundle",
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

const DEFAULT_CURVE: BezierCurve = {
  id: "basis",
  points: [
    [0, 0.75],
    [0.25, 0.5],
    [0.75, 0.5],
    [1, 0.75],
  ],
  color: "#800000",
};

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

  useEffect(() => {
    if (!ref.current || !observer) return;
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [observer]);

  // Container Sizing

  // Mouse Move Handler
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (context.draggingPointIndex !== null && ref.current) {
        const svgRect = ref.current.getBoundingClientRect();
        requestAnimationFrame(() => {
          const x = (event.clientX - svgRect.left) / svgRect.width;
          const y = (event.clientY - svgRect.top) / svgRect.height;
          const updatedCurves = context.curves.map((curve, idx) => {
            if (idx === context.selectedCurveIndex) {
              const newPoints = curve.points.map((point, pointIdx) => {
                if (pointIdx === context.draggingPointIndex) {
                  const newPoint = [
                    Math.max(0, Math.min(x, 1)),
                    Math.max(0, Math.min(y, 1)),
                  ] as [number, number];

                  return newPoint;
                }
                return point;
              });
              return { ...curve, points: newPoints };
            }
            return curve;
          });
          context.setCurves(updatedCurves);
        });
      }
    },
    [context],
  );

  // Handling mouse events
  useEffect(() => {
    const handleMouseUp = () => {
      context.setDraggingPointIndex(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

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
    ref,
  };
};
