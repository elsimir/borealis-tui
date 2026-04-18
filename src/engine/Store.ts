export class Store<T extends { id: PropertyKey }> {
  private items: T[] = [];
  private index = new Map<T["id"], number>();

  constructor(private readonly label: string) {}

  add(item: T): void {
    this.index.set(item.id, this.items.length);
    this.items.push(item);
  }

  get(id: T["id"]): T {
    const idx = this.index.get(id);
    if (idx === undefined) throw new Error(`${this.label} not found: ${String(id)}`);
    return this.items[idx];
  }

  all(): T[] {
    return this.items;
  }
}
