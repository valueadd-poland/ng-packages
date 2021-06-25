import { PartiallyOrderedSet } from "./partially-ordered-set";

describe("PartiallyOrderedSet", () => {
  it("can add an item", () => {
    const set = new PartiallyOrderedSet<string>();

    set.add("hello");

    expect([...set]).toEqual(["hello"]);
  });

  it("can remove an item", () => {
    const set = new PartiallyOrderedSet<string>();

    set.add("hello");
    set.add("world");

    set.delete("world");

    expect([...set]).toEqual(["hello"]);
  });

  it("list items in determistic order of dependency", () => {
    const set = new PartiallyOrderedSet<string>();

    set.add("red");
    set.add("yellow", ["red"]);
    set.add("green", ["red"]);
    set.add("blue");
    set.add("purple", ["red", "blue"]);

    expect([...set]).toEqual(["red", "blue", "yellow", "green", "purple"]);
  });
});
