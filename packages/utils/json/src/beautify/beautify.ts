import jsonBeautify from "json-beautify";

/*
 * json-beautify typings
 * @author TeodorDre
 * @Github - https://github.com/TeodorDre
 *
 */

declare module "json-beautify" {
  export default function beautify(
    value: unknown,
    replacer: Function | object | unknown[] | null,
    space: number | string,
    limit?: number,
  ): string;
}

export const beautifyJSON = (
  value: unknown,
  replacer: Function | object | unknown[] | null = null,
  space: number | string = 2,
  limit = 80,
) => jsonBeautify(value, replacer, space, limit);
