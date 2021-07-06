export class LinkedList<T extends { next: T | null }> {
  constructor(private _head: T) {}

  get(l: number): T | null {
    let c: T | null = this._head;
    while (c && l > 0) {
      l--;
      c = c.next;
    }

    return c;
  }

  get head(): T {
    return this._head;
  }
  get length(): number {
    let c: T | null = this._head;
    let i = 0;
    while (c) {
      i++;
      c = c.next;
    }

    return i;
  }

  reduce<R>(
    accumulator: (acc: R, value: T, index?: number) => R,
    seed: R
  ): any {
    let c: T | null = this._head;
    let acc = seed;
    let i = 0;
    while (c) {
      acc = accumulator(acc, c, i);
      i++;
      c = c.next;
    }

    return acc;
  }

  find(predicate: (value: T, index?: number) => boolean): T | null {
    let c: T | null = this._head;
    let i = 0;
    while (c) {
      if (predicate(c, i)) {
        break;
      }
      i++;
      c = c.next;
    }

    return c;
  }

  forEach(visitor: (value: T, index?: number) => void): void {
    let c: T | null = this._head;
    let i = 0;
    while (c) {
      visitor(c, i);
      i++;
      c = c.next;
    }
  }
}
