/* -------------------------------------------------------------------------------------------------
 * MULTI-DIMENSIONAL GRID
 * -----------------------------------------------------------------------------------------------*/

export class MultiDimensionalGrid<T> {
  dimensions: number[];
  data: Map<string, T | null>;

  constructor({
    dimensions,
    initializer,
  }: {
    dimensions: number[];
    initializer?: (...indices: number[]) => T | null;
  }) {
    this.dimensions = dimensions;
    this.data = new Map();

    if (initializer) {
      this.forEach((_, ...indices) => {
        this.setValue(initializer(...indices), ...indices);
      });
    }
  }

  private computeKey(indices: number[]): string {
    return indices.join(",");
  }

  /**
   * Places a value at the given indices.
   * @param value - The value to place.
   * @param indices - The indices where to place the value.
   * @returns The value that was placed, or null if the position is invalid.
   */
  setValue(value: T | null, ...indices: number[]): T | null {
    if (!this.isValidPosition(...indices)) return null;
    const key = this.computeKey(indices);
    this.data.set(key, value);
    return value;
  }

  /**
   * Retrieves a value from the grid at the given indices.
   * @param indices - The indices of the value.
   * @returns The value at the given indices, or null if none exists.
   */
  getValue(...indices: number[]): T | null {
    if (!this.isValidPosition(...indices)) return null;
    const key = this.computeKey(indices);
    return this.data.get(key) ?? null;
  }

  /**
   * Removes a value from the grid at the given indices.
   * @param indices - The indices of the value to remove.
   * @returns The value that was removed, or null if the position is invalid.
   */
  removeValue(...indices: number[]): T | null {
    if (!this.isValidPosition(...indices)) return null;
    const key = this.computeKey(indices);
    const value = this.data.get(key) ?? null;
    this.data.delete(key);
    return value;
  }

  /**
   * Checks if the given indices are valid.
   * @param indices - The indices to check.
   * @returns True if the indices are valid, false otherwise.
   */
  isValidPosition(...indices: number[]): boolean {
    if (indices.length !== this.dimensions.length) return false;
    return indices.every(
      (value, index) => value >= 0 && value < (this.dimensions[index] ?? 0),
    );
  }

  /**
   * Iterates over each value in the grid.
   * @param callback - The callback to invoke for each value.
   */
  forEach(callback: (value: T | null, ...indices: number[]) => void): void {
    const recurse = (currentIndices: number[]) => {
      if (currentIndices.length === this.dimensions.length) {
        callback(this.getValue(...currentIndices), ...currentIndices);
        return;
      }
      const dimIndex = currentIndices.length;
      if (!this.dimensions[dimIndex]) return;
      for (let i = 0; i < this.dimensions[dimIndex]; i++) {
        recurse([...currentIndices, i]);
      }
    };
    recurse([]);
  }

  /**
   * Finds the first value that satisfies the given predicate.
   * @param predicate - The predicate to match.
   * @returns The indices of the value, or null if no value satisfies the predicate.
   */
  findValue(predicate: (value: T | null) => boolean): number[] | null {
    for (const [key, value] of this.data.entries()) {
      if (predicate(value)) {
        return key.split(",").map(Number);
      }
    }
    return null;
  }

  /**
   * Removes all values from the grid.
   */
  clear(): void {
    this.data.clear();
  }

  /**
   * Checks if the grid is complete, i.e. all values are non-null.
   * @returns True if the grid is complete, false otherwise.
   */
  // isComplete(): boolean {
  //   let complete = true;

  //   this.forEach((value) => {
  //     if (value === null) {
  //       complete = false;
  //     }
  //   });
  //   return complete;
  // }

  /**
   * Converts the grid to a JSON object.
   * @returns The JSON representation of the grid.
   */
  toJSON() {
    return {
      dimensions: this.dimensions,
      data: Array.from(this.data.entries()),
    };
  }

  /**
   * Converts the grid to a string.
   * @returns The string representation of the grid.
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Creates a new multi-dimensional grid from a JSON object.
   * @param json - The JSON object to create the grid from.
   * @returns The new multi-dimensional grid.
   */
  static fromJSON<T>(json: {
    dimensions: number[];
    data: [string, T | null][];
  }) {
    const grid = new MultiDimensionalGrid<T>({ dimensions: json.dimensions });
    for (const [key, value] of json.data) {
      const indices = key.split(",").map(Number);
      grid.setValue(value, ...indices);
    }
    return grid;
  }
}
