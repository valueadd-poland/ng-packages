/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepCopy } from "./object";

describe("object", () => {
  describe("deepCopy", () => {
    it("works with empty", () => {
      const data = {};
      expect(deepCopy(data)).toEqual({});
    });

    it("works with objects", () => {
      const data = { a: 1, b: { c: "hello" } };
      expect(deepCopy(data)).toEqual({
        a: 1,
        b: { c: "hello" },
      });
    });

    it("works with null", () => {
      const data = null;
      expect(deepCopy(data)).toEqual(data);
    });

    it("works with number", () => {
      const data = 1;
      expect(deepCopy(data)).toEqual(data);
    });

    it("works with simple classes", () => {
      class Data {
        constructor(private _x = 1, protected _y = 2, public _z = 3) {}
      }
      const data = new Data();
      expect(deepCopy(data)).toMatchObject(data);
      expect(deepCopy(data) instanceof Data).toBe(true);
    });

    it("works with circular objects", () => {
      const data1 = { a: 1 } as any;
      const data = { b: data1 };
      data1["circular"] = data;

      const result = deepCopy(data) as any;
      expect(result.b.a).toBe(1);
      expect(result.b.circular.b.a).toBe(1);
      expect(result.b).not.toBe(data1);
      expect(result.b).toBe(result.b.circular.b);
    });

    it("works with null prototype", () => {
      const data = Object.create(null);
      data["a"] = 1;
      expect(deepCopy(data)).toMatchObject(data);
    });
  });
});
