"use client";

import { useCallback, useState } from "react";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface ScaledNumberRecord {
  key: string;
  value: number;
  locked: boolean;
  noReduce: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

const useScaledArray = (
  initialArray: ScaledNumberRecord[],
  magnitude: number,
) => {
  const [numberArray, setNumberArray] =
    useState<ScaledNumberRecord[]>(initialArray);

  const setScaledValue = useCallback(
    (key: string, newValue: number) => {
      setNumberArray((prevArray) => {
        const unlockedItems = prevArray.filter(
          (item) => !item.locked && item.key !== key,
        );
        const totalUnlockedValue = unlockedItems.reduce(
          (acc, item) => acc + item.value,
          0,
        );
        const remainingMagnitude = magnitude - newValue;

        if (remainingMagnitude < 0) {
          // handle error or adjust logic for values exceeding magnitude
          return prevArray;
        }

        const scaleFactor = remainingMagnitude / totalUnlockedValue;
        const updatedArray = prevArray.map((item) => {
          if (item.key === key) {
            return { ...item, value: newValue };
          }

          if (item.locked) {
            return item;
          }

          const scaledValue = item.value * scaleFactor;

          if (item.noReduce && scaledValue < item.value) {
            return item;
          }

          return { ...item, value: scaledValue };
        });

        return updatedArray;
      });
    },
    [magnitude],
  );

  return {
    numberArray,
    setScaledValue,
  };
};

export default useScaledArray;
