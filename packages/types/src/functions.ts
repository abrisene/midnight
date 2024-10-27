/* eslint-disable @typescript-eslint/no-explicit-any */
// export type FirstArg<T extends Function> = T extends (
//   ...args: [infer T, any]
// ) => any
//   ? unknown extends T
//     ? any
//     : T
//   : never;

// export type SecondArg<T extends Function> = T extends (
//   ...args: [any, infer T]
// ) => any
//   ? unknown extends T
//     ? any
//     : T
//   : never;

/* -------------------------------------------------------------------------------------------------
 * CURRYING UTILS
 * -----------------------------------------------------------------------------------------------*/

// https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/
export type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;

export type Tail<T extends any[]> = ((...t: T) => any) extends (
  _: any,
  ...tail: infer TT
) => any
  ? TT
  : never;

export type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

/* -------------------------------------------------------------------------------------------------
 * PARAM REST
 * -----------------------------------------------------------------------------------------------*/

export type ParamRest<T extends (...args: any[]) => unknown> = T extends (
  first: Parameters<T>[0],
  ...rest: infer Rest
) => ReturnType<T>
  ? Rest
  : never;
