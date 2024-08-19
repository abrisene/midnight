"use client";

import React from "react";
import { motion } from "framer-motion";

import { cn } from "../utils/cn";

const TilesComponent: React.FC<{
  className?: string;
  rows?: number;
  cols?: number;
}> = ({ className, rows: r, cols: c }) => {
  const rows = new Array(r || 100).fill(1);
  const cols = new Array(c || 10).fill(1);

  return (
    <div
      className={cn(
        "relative z-0 flex h-full w-full justify-center",
        className,
      )}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className={`relative h-9 w-9 border-l border-neutral-200 dark:border-neutral-900 sm:h-12 md:w-12`}
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `var(--tile)`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="relative h-9 w-9 border-r border-t border-neutral-200 dark:border-neutral-900 sm:h-12 md:w-12"
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const AnimatedTiles = React.memo(TilesComponent);
