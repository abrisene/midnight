/* -------------------------------------------------------------------------------------------------
 * SCHEMAS
 * -----------------------------------------------------------------------------------------------*/

import { z } from "zod";

export type GridDTO<Tile> = Omit<z.infer<typeof GridDTO>, "grid"> & {
  grid: (Tile | null)[][];
};
export const GridDTO = z.object({
  width: z.number(),
  height: z.number(),
  grid: z.array(z.array(z.any())),
});

/* -------------------------------------------------------------------------------------------------
 * GRID
 * -----------------------------------------------------------------------------------------------*/

export class Grid<Tile> {
  width: number;
  height: number;
  grid: (Tile | null)[][];

  constructor({
    width,
    height,
    grid,
    initializer,
  }: {
    width: number;
    height: number;
    grid?: (Tile | null)[][];
    initializer?: (x: number, y: number) => Tile | null;
  }) {
    this.width = width;
    this.height = height;
    this.grid =
      grid ??
      Array.from({ length: height }, (_, y) =>
        Array.from({ length: width }, (_, x) =>
          initializer ? initializer(x, y) : null,
        ),
      );
  }

  /**
   * Places a tile at the given coordinates.
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   * @param tile - The tile to place.
   * @returns The tile that was placed, or null if the position is invalid.
   */
  placeTile(x: number, y: number, tile: Tile) {
    if (!this.isValidPosition(x, y)) return null;
    if (!this.grid[y]) this.grid[y] = [];
    this.grid[y][x] = tile;
    return this.grid[y][x];
  }

  /**
   * Retrieves a tile from the grid at the given coordinates.
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   * @returns The tile at the given coordinates, or null if none exists.
   */
  getTile(x: number, y: number): Tile | null {
    if (!this.isValidPosition(x, y)) return null;
    return this.grid?.[y]?.[x] ?? null;
  }

  /**
   * Removes a tile from the grid at the given coordinates.
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   * @returns The tile that was removed, or null if the position is invalid.
   */
  removeTile(x: number, y: number): Tile | null {
    if (!this.isValidPosition(x, y)) return null;
    const tile = this.grid?.[y]?.[x];
    if (this.grid?.[y]?.[x]) this.grid[y][x] = null;
    return tile ?? null;
  }

  /**
   * Checks if the given coordinates are valid.
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   * @returns True if the coordinates are valid, false otherwise.
   */
  isValidPosition(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Iterates over each tile in the grid.
   * @param callback - The callback to invoke for each tile.
   */
  forEach(callback: (tile: Tile | null, x: number, y: number) => void): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(this.grid?.[y]?.[x] ?? null, x, y);
      }
    }
  }

  /**
   * Finds the first tile that satisfies the given predicate.
   * @param predicate - The predicate to match.
   * @returns The coordinates of the tile, or null if no tile satisfies the predicate.
   */
  findTile(
    predicate: (tile: Tile | null) => boolean,
  ): { x: number; y: number } | null {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (predicate(this.grid?.[y]?.[x] ?? null)) {
          return { x, y };
        }
      }
    }
    return null;
  }

  /**
   * Checks if the grid is complete, i.e. all tiles are non-null.
   * @returns True if the grid is complete, false otherwise.
   */
  isComplete(): boolean {
    return this.grid.every((row) => row.every((cell) => cell !== null));
  }

  /**
   * Converts the grid to a JSON object.
   * @returns The JSON representation of the grid.
   */
  toJSON() {
    return {
      width: this.width,
      height: this.height,
      grid: this.grid,
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
   * Creates a new grid from a JSON object.
   * @param json - The JSON object to create the grid from.
   * @returns The new grid.
   */
  static fromJSON<Tile>(json: unknown) {
    const { width, height, grid } = GridDTO.parse(json);
    const newGrid = new Grid({ width, height });
    newGrid.grid = grid;
    return newGrid as Grid<Tile>;
  }
}
