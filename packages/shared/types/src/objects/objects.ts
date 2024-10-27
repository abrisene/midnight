/* -------------------------------------------------------------------------------------------------
 * KEY UTILS
 * -----------------------------------------------------------------------------------------------*/

export type RenameKey<T, K extends keyof T, N extends string> = Omit<T, K> & {
  [P in N]: T[K];
};

/* -------------------------------------------------------------------------------------------------
 * REPLACEMENT UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Replaces the specified property in T with N.
 */
export type Replace<T, K extends keyof T, N extends T[K]> = Omit<T, K> & {
  [P in K]: N;
};

/* -------------------------------------------------------------------------------------------------
 * MERGE UTILS
 * -----------------------------------------------------------------------------------------------*/

export type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

/* -------------------------------------------------------------------------------------------------
 * PARTIAL UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Makes all properties in T optional except for the keys specified in K.
 */
export type PartializePick<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

/**
 * Makes all properties in T optional except for the keys specified in K which are required.
 */
export type PartializePickRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;

/**
 * Makes the specified properties in T optional.
 */
export type Partialize<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
