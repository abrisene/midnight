// License for this File only:
//
// MIT License
//
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Copyright (c) Vercel, Inc. (https://vercel.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
// TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

import type { z } from "zod";

/**
Create a type from an object with all keys and nested keys set to optional.
The helper supports normal objects and Zod schemas (which are resolved automatically).
It always recurses into arrays.

Adopted from [type-fest](https://github.com/sindresorhus/type-fest/tree/main) PartialDeep.
 */
export type DeepPartial<T> = T extends
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  | void
  | Date
  | RegExp
  | ((...arguments_: any[]) => unknown)
  | (new (...arguments_: any[]) => unknown)
  ? T
  : T extends Map<infer KeyType, infer ValueType>
    ? PartialMap<KeyType, ValueType>
    : T extends Set<infer ItemType>
      ? PartialSet<ItemType>
      : T extends ReadonlyMap<infer KeyType, infer ValueType>
        ? PartialReadonlyMap<KeyType, ValueType>
        : T extends ReadonlySet<infer ItemType>
          ? PartialReadonlySet<ItemType>
          : T extends z.Schema<any>
            ? DeepPartial<T["_type"]>
            : T extends object
              ? T extends readonly (infer ItemType)[] // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
                ? ItemType[] extends T // Test for arrays (non-tuples) specifically
                  ? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
                    ? readonly DeepPartial<ItemType | undefined>[]
                    : DeepPartial<ItemType | undefined>[]
                  : PartialObject<T> // Tuples behave properly
                : PartialObject<T>
              : unknown;

type PartialMap<KeyType, ValueType> = {} & Map<
  DeepPartial<KeyType>,
  DeepPartial<ValueType>
>;

type PartialSet<T> = {} & Set<DeepPartial<T>>;

type PartialReadonlyMap<KeyType, ValueType> = {} & ReadonlyMap<
  DeepPartial<KeyType>,
  DeepPartial<ValueType>
>;

type PartialReadonlySet<T> = {} & ReadonlySet<DeepPartial<T>>;

type PartialObject<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: DeepPartial<ObjectType[KeyType]>;
};
