import { MultiDimensionalGrid } from "./grid-n-dimensional";

describe("MultiDimensionalGrid class", () => {
  it("can create new multi-dimensional grids", () => {
    const gridA = new MultiDimensionalGrid<number>({ dimensions: [2, 2, 2] });
    expect(gridA.dimensions).toEqual([2, 2, 2]);

    const gridB = new MultiDimensionalGrid<number>({
      dimensions: [2, 2],
      initializer: (x, y) => x + y,
    });
    expect(gridB.getValue(0, 0)).toEqual(0);
    expect(gridB.getValue(1, 1)).toEqual(2);
  });

  it("can set and get values", () => {
    const grid = new MultiDimensionalGrid<string>({ dimensions: [3, 3, 3] });

    expect(grid.setValue("A", 0, 0, 0)).toEqual("A");
    expect(grid.getValue(0, 0, 0)).toEqual("A");

    expect(grid.setValue("B", 3, 3, 3)).toBeNull();
    expect(grid.getValue(3, 3, 3)).toBeNull();
  });

  it("can remove values", () => {
    const grid = new MultiDimensionalGrid<string>({ dimensions: [2, 2, 2] });

    grid.setValue("A", 0, 0, 0);
    expect(grid.removeValue(0, 0, 0)).toEqual("A");
    expect(grid.getValue(0, 0, 0)).toBeNull();

    expect(grid.removeValue(2, 2, 2)).toBeNull();
  });

  it("can check if a position is valid", () => {
    const grid = new MultiDimensionalGrid({ dimensions: [2, 2, 2] });

    expect(grid.isValidPosition(0, 0, 0)).toBe(true);
    expect(grid.isValidPosition(1, 1, 1)).toBe(true);
    expect(grid.isValidPosition(2, 2, 2)).toBe(false);
    expect(grid.isValidPosition(-1, 0, 0)).toBe(false);
  });

  it("can iterate over all values", () => {
    const grid = new MultiDimensionalGrid<number>({
      dimensions: [2, 2],
      initializer: (x, y) => x + y,
    });
    const values: number[] = [];

    grid.forEach((value) => {
      if (value !== null) values.push(value);
    });

    expect(values).toEqual([0, 1, 1, 2]);
  });

  it("can find a value", () => {
    const grid = new MultiDimensionalGrid<string>({ dimensions: [3, 3, 3] });
    grid.setValue("X", 1, 2, 0);

    const result = grid.findValue((value) => value === "X");
    expect(result).toEqual([1, 2, 0]);

    const notFound = grid.findValue((value) => value === "Y");
    expect(notFound).toBeNull();
  });

  /*
  it("can check if the grid is complete", () => {
    const gridA = new MultiDimensionalGrid<number>({
      dimensions: [2, 2],
      initializer: () => 0,
    });
    expect(gridA.isComplete()).toBe(true);

    const gridB = new MultiDimensionalGrid<number>({ dimensions: [2, 2] });
    expect(gridB.isComplete()).toBe(true);

    gridB.setValue(null, 0, 0);
    expect(gridB.isComplete()).toBe(false);
  });
  */

  it("can be serialized and deserialized", () => {
    const gridA = new MultiDimensionalGrid<string>({ dimensions: [2, 2, 2] });
    gridA.setValue("A", 0, 0, 0);
    gridA.setValue("B", 1, 1, 1);

    const json = gridA.toJSON();
    const gridB = MultiDimensionalGrid.fromJSON<string>(json);

    expect(gridB.dimensions).toEqual(gridA.dimensions);
    expect(gridB.getValue(0, 0, 0)).toEqual("A");
    expect(gridB.getValue(1, 1, 1)).toEqual("B");
  });

  it("can clear all values", () => {
    const grid = new MultiDimensionalGrid<string>({ dimensions: [2, 2, 2] });
    grid.setValue("A", 0, 0, 0);
    grid.setValue("B", 1, 1, 1);

    grid.clear();

    expect(grid.getValue(0, 0, 0)).toBeNull();
    expect(grid.getValue(1, 1, 1)).toBeNull();
  });
});
