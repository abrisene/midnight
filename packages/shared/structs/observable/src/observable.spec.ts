import { SimpleObservable } from "./simple-observable";
import { StatefulObservable } from "./stateful-observable";

describe("Observable classes", () => {
  describe("SimpleObservable", () => {
    it("can create new SimpleObservable instances", () => {
      const obs = new SimpleObservable<number>();
      expect(obs).toBeInstanceOf(SimpleObservable);
      expect(obs.debugLabel).toBeUndefined();

      const labeledObs = new SimpleObservable<string>("test");
      expect(labeledObs.debugLabel).toBe("test");
    });

    it("can subscribe and receive updates", () => {
      const obs = new SimpleObservable<number>();
      const mockFn = jest.fn();

      obs.subscribe(mockFn);
      obs.next(1);
      obs.next(2);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, 1);
      expect(mockFn).toHaveBeenNthCalledWith(2, 2);
    });

    it("can unsubscribe from updates", () => {
      const obs = new SimpleObservable<number>();
      const mockFn = jest.fn();

      const unsubscribe = obs.subscribe(mockFn);
      obs.next(1);
      unsubscribe();
      obs.next(2);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(1);
    });
  });

  describe("StatefulObservable", () => {
    it("can create new StatefulObservable instances", () => {
      const obs = new StatefulObservable<number>(0);
      expect(obs).toBeInstanceOf(StatefulObservable);
      expect(obs.debugLabel).toBeUndefined();
      expect(obs.get()).toBe(0);

      const labeledObs = new StatefulObservable<string>("initial", "test");
      expect(labeledObs.debugLabel).toBe("test");
      expect(labeledObs.get()).toBe("initial");
    });

    it("can subscribe and receive initial state and updates", () => {
      const obs = new StatefulObservable<number>(0);
      const mockFn = jest.fn();

      obs.subscribe(mockFn);
      obs.set(1);
      obs.set(2);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenNthCalledWith(1, 0);
      expect(mockFn).toHaveBeenNthCalledWith(2, 1);
      expect(mockFn).toHaveBeenNthCalledWith(3, 2);
    });

    it("can unsubscribe from updates", () => {
      const obs = new StatefulObservable<number>(0);
      const mockFn = jest.fn();

      const unsubscribe = obs.subscribe(mockFn);
      obs.set(1);
      unsubscribe();
      obs.set(2);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, 0);
      expect(mockFn).toHaveBeenNthCalledWith(2, 1);
    });

    it("can get current state", () => {
      const obs = new StatefulObservable<number>(0);
      expect(obs.get()).toBe(0);

      obs.set(5);
      expect(obs.get()).toBe(5);
    });

    it("can set new state and notify subscribers", () => {
      const obs = new StatefulObservable<string>("initial");
      const mockFn = jest.fn();

      obs.subscribe(mockFn);
      obs.set("updated");

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenNthCalledWith(1, "initial");
      expect(mockFn).toHaveBeenNthCalledWith(2, "updated");
      expect(obs.get()).toBe("updated");
    });
  });
});
