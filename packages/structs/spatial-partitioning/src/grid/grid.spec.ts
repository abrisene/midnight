import { Grid } from "./grid";

describe("Grid class", () => {
  it("can create new grids", () => {
    const gridA = new Grid({ width: 3, height: 3 });
    expect(gridA.width).toEqual(3);
    expect(gridA.height).toEqual(3);
    expect(gridA.grid).toHaveLength(3);
    expect(gridA.grid[0]).toHaveLength(3);

    const gridB = new Grid({
      width: 2,
      height: 2,
      initializer: (x, y) => x + y,
    });
    expect(gridB.getTile(0, 0)).toEqual(0);
    expect(gridB.getTile(1, 1)).toEqual(2);
  });

  it("can place and retrieve tiles", () => {
    const grid = new Grid<string>({ width: 3, height: 3 });

    expect(grid.placeTile(0, 0, "A")).toEqual("A");
    expect(grid.getTile(0, 0)).toEqual("A");

    expect(grid.placeTile(3, 3, "B")).toBeNull();
    expect(grid.getTile(3, 3)).toBeNull();
  });

  it("can remove tiles", () => {
    const grid = new Grid<string>({ width: 2, height: 2 });

    grid.placeTile(0, 0, "A");
    expect(grid.removeTile(0, 0)).toEqual("A");
    expect(grid.getTile(0, 0)).toBeNull();

    expect(grid.removeTile(2, 2)).toBeNull();
  });

  it("can check if a position is valid", () => {
    const grid = new Grid({ width: 2, height: 2 });

    expect(grid.isValidPosition(0, 0)).toBe(true);
    expect(grid.isValidPosition(1, 1)).toBe(true);
    expect(grid.isValidPosition(2, 2)).toBe(false);
    expect(grid.isValidPosition(-1, 0)).toBe(false);
  });

  it("can iterate over all tiles", () => {
    const grid = new Grid<number>({
      width: 2,
      height: 2,
      initializer: (x, y) => x + y,
    });
    const values: number[] = [];

    grid.forEach((tile) => {
      if (tile !== null) values.push(tile);
    });

    expect(values).toEqual([0, 1, 1, 2]);
  });

  it("can find a tile", () => {
    const grid = new Grid<string>({ width: 3, height: 3 });
    grid.placeTile(1, 2, "X");

    const result = grid.findTile((tile) => tile === "X");
    expect(result).toEqual({ x: 1, y: 2 });

    const notFound = grid.findTile((tile) => tile === "Y");
    expect(notFound).toBeNull();
  });

  it("can check if the grid is complete", () => {
    const gridA = new Grid<number>({
      width: 2,
      height: 2,
      initializer: () => 0,
    });
    expect(gridA.isComplete()).toBe(true);

    const gridB = new Grid<number>({ width: 2, height: 2 });
    expect(gridB.isComplete()).toBe(false);
  });

  it("can be serialized and deserialized", () => {
    const gridA = new Grid<string>({ width: 2, height: 2 });
    gridA.placeTile(0, 0, "A");
    gridA.placeTile(1, 1, "B");

    const json = gridA.toJSON();
    const gridB = Grid.fromJSON<string>(json);

    expect(gridB.width).toEqual(gridA.width);
    expect(gridB.height).toEqual(gridA.height);
    expect(gridB.getTile(0, 0)).toEqual("A");
    expect(gridB.getTile(1, 1)).toEqual("B");
  });
});
