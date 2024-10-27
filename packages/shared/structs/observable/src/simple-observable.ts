/* -------------------------------------------------------------------------------------------------
 * SIMPLE OBSERVABLE
 * - A simple observable that allows subscription / unsubscription to a function that will be called
 *   when the observable's state changes.
 * -----------------------------------------------------------------------------------------------*/

export class SimpleObservable<T> {
  private observers: ((data: T) => void)[] = [];

  constructor(public debugLabel?: string) {}

  public subscribe(fn: (data: T) => void) {
    this.observers.push(fn);

    return (): void => {
      this.unsubscribe(fn);
    };
  }

  private unsubscribe(fn: (data: T) => void) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  public next(data: T) {
    this.observers.forEach((observer) => {
      observer(data);
    });
  }
}
