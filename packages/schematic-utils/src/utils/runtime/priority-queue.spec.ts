import { PriorityQueue } from "./priority-queue";

describe("PriorityQueue", () => {
  it("adds an item", () => {
    const queue = new PriorityQueue<number>((x, y) => x - y);

    queue.push(99);

    expect(queue.size).toBe(1);
    expect(queue.peek()).toBe(99);
  });
});
