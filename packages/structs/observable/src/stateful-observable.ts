/* -------------------------------------------------------------------------------------------------
 * STATEFUL OBSERVABLE
 * - A stateful observable that allows subscribing to a function that will be called when the
 *   observable's state changes.
 * -----------------------------------------------------------------------------------------------*/

export class StatefulObservable<T> {
  private observers: Array<(data: T) => void> = [];

  constructor(
    private state: T,
    public debugLabel?: string,
  ) {}

  public subscribe(fn: (data: T) => void) {
    fn(this.state);

    this.observers.push(fn);

    return (): void => {
      this.unsubscribe(fn);
    };
  }

  private unsubscribe(fn: (data: T) => void) {
    this.observers = this.observers.filter((obs) => obs !== fn);
  }

  public get(): T {
    return this.state;
  }

  public set(data: T) {
    this.state = data;
    this.observers.forEach((fn) => {
      fn(this.state);
    });
  }
}
