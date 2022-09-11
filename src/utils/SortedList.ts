export type SortedListItem<T> = {
  key: number;
  data: T;
}

export class SortedList<T> {
  private store: Record<number, T[]>;
  private keys: number[];

  constructor () {
    this.store = {};
    this.keys = [];
  }

  public add (key: number, data: T) {
    if (!this.store[key]) {
      this.store[key] = [];
    }
    this.store[key].push(data);
    for (let i = 0; i < this.keys.length + 1; i++) {
      if (this.keys[i] === undefined) {
        this.keys[i] = key;
        break;
      }
      if (key === this.keys[i]) break;
      if (key > this.keys[i]) {
        const len = this.keys.length + 1;
        let prev = key;
        for (let j = i; j < len; j++) {
          const temp = this.keys[j];
          this.keys[j] = prev;
          prev = temp;
        }
        break;
      }
    }
  }

  public getKeys () {
    return this.keys;
  }

  public *list (): Generator<T, void, unknown> {
    const keys = this.getKeys();
    for (const key of keys) {
      for (const item of this.store[key]) {
        yield item;
      }
    }
  }
}