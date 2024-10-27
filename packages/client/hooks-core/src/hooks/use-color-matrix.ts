"use client";

import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";

type MatrixValue = number | string;

/* prettier-ignore */
type Matrix20 = [
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
];

/* prettier-ignore */
type Matrix25 = [
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
  MatrixValue, MatrixValue, MatrixValue, MatrixValue, MatrixValue,
];

type MatrixSetter = (value: number) => void;

interface MatrixFunctions {
  setBrightness: MatrixSetter;
  setSaturation: MatrixSetter;
  setHueRotation: MatrixSetter;
  setContrast: MatrixSetter;
  setInvert: (value: boolean) => void;
  setSepia: MatrixSetter;
  setTint: (color: string, amount: number) => void;
}

type ColorMatrixHook = [string, MatrixFunctions];

export const useColorMatrix = (): ColorMatrixHook => {
  const [colorMatrix, setColorMatrix] = useState("none");

  useEffect(() => {
    const updateColorMatrix = () => {
      const [rX, rY, gX, gY, bX, bY, aX, aY, fR, fG, fB, fA] = colorMatrix
        .split(",")
        .map(parseFloat);
      // Check if the color matrix is a valid matrix
      if (
        rX === undefined ||
        rY === undefined ||
        gX === undefined ||
        gY === undefined ||
        bX === undefined ||
        bY === undefined ||
        aX === undefined ||
        aY === undefined ||
        fR === undefined ||
        fG === undefined ||
        fB === undefined ||
        fA === undefined
      ) {
        return "none";
      }
      /* prettier-ignore */
      const matrix: Matrix25 = [
        rX, rY, 0, 0, 0,
        gX, gY, 0, 0, 0,
        bX, bY, 0, 0, 0,
        aX, aY, 0, 1, 0,
        fR, fG, fB, fA, 0
      ];
      return `matrix(${matrix.join(",")})`;
    };

    setColorMatrix(updateColorMatrix());
  }, [colorMatrix]);

  const setBrightness: MatrixSetter = (value) => {
    /* prettier-ignore */
    const matrix: Matrix20 = [
      value, 0, 0, 0, 0,
      0, value, 0, 0, 0,
      0, 0, value, 0, 0,
      0, 0, 0, 1, 0
    ];
    setColorMatrix(matrix.join(","));
  };

  const setSaturation: MatrixSetter = (value) => {
    /* prettier-ignore */
    const matrix: Matrix20 = [
      0.3086 * (1 - value) + value, 0.6094 * (1 - value), 0.0820 * (1 - value), 0, 0,
      0.3086 * (1 - value), 0.6094 * (1 - value) + value, 0.0820 * (1 - value), 0, 0,
      0.3086 * (1 - value), 0.6094 * (1 - value), 0.0820 * (1 - value) + value, 0, 0,
      0, 0, 0, 1, 0
    ];
    setColorMatrix(matrix.join(","));
  };

  const setHueRotation: MatrixSetter = (degrees) => {
    const radians = degrees * (Math.PI / 180);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const lumR = 0.213;
    const lumG = 0.715;
    const lumB = 0.072;
    /* prettier-ignore */
    const matrix: Matrix20 = [
      lumR + cos * (1 - lumR) + sin * (-lumR), lumG + cos * (-lumG) + sin * (-lumG), lumB + cos * (-lumB) + sin * (1 - lumB), 0, 0,
      lumR + cos * (-lumR) + sin * (0.143), lumG + cos * (1 - lumG) + sin * (0.140), lumB + cos * (-lumB) + sin * (-0.283), 0, 0,
      lumR + cos * (-lumR) + sin * (-(1 - lumR)), lumG + cos * (-lumG) + sin * (lumG), lumB + cos * (1 - lumB) + sin * (lumB), 0, 0,
      0, 0, 0, 1, 0
    ];
    setColorMatrix(matrix.join(","));
  };

  const setContrast: MatrixSetter = (value) => {
    /* prettier-ignore */
    const matrix: Matrix20 = [
      value, 0, 0, 0, 128 * (1 - value),
      0, value, 0, 0, 128 * (1 - value),
      0, 0, value, 0, 128 * (1 - value),
      0, 0, 0, 1, 0
    ];
    setColorMatrix(matrix.join(","));
  };

  const setInvert = (value: boolean) => {
    /* prettier-ignore */
    const matrix: Matrix20 = [
      value ? -1 : 1, 0, 0, 0, 255 * (value ? 1 : 0),
      0, value ? -1 : 1, 0, 0, 255 * (value ? 1 : 0),
      0, 0, value ? -1 : 1, 0, 255 * (value ? 1 : 0),
      0, 0, 0, 1, 0
    ];
    setColorMatrix(matrix.join(","));
  };

  const setSepia: MatrixSetter = (value) => {
    /* prettier-ignore */
    const matrix: Matrix20 = [
      0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value), 0, 0,
      0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value), 0, 0,
      0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value), 0, 0,
      0, 0, 0, 1, 0
    ];
    setColorMatrix(matrix.join(","));
  };

  const setTint = (color: string, amount: number) => {
    const baseColor = tinycolor(color);
    const { r, g, b } = baseColor.toRgb();
    /* prettier-ignore */
    const matrix: Matrix20 = [
      1 - amount, 0, 0, 0, amount * (r / 255),
      0, 1 - amount, 0, 0, amount * (g / 255),
      0, 0, 1 - amount, 0, amount * (b / 255),
      0, 0, 0, 1, 0
    ];
    setColorMatrix(matrix.join(","));
  };

  return [
    colorMatrix,
    {
      setBrightness,
      setSaturation,
      setHueRotation,
      setContrast,
      setInvert,
      setSepia,
      setTint,
    },
  ];
};
