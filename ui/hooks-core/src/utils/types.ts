//   HTMLInputElement | HTMLTextAreaElement
// > = (event) => event.currentTarget.value;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParamRest<T extends (...args: any[]) => unknown> = T extends (
  first: Parameters<T>[0],
  ...rest: infer Rest
) => ReturnType<T>
  ? Rest
  : never;
