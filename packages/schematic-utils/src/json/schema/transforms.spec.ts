/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { mergeMap } from "rxjs/operators";
import { CoreSchemaRegistry } from "./registry";
import { addUndefinedDefaults } from "./transforms";

describe("addUndefinedDefaults", () => {
  it("should add defaults to undefined properties (1)", async () => {
    const registry = new CoreSchemaRegistry();
    registry.addPreTransform(addUndefinedDefaults);
    const data: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    const result = await registry
      .compile({
        properties: {
          bool: { type: "boolean" },
          str: { type: "string", default: "someString" },
          obj: {
            properties: {
              num: { type: "number" },
              other: { type: "number", default: 0 },
            },
          },
          objAllOk: {
            allOf: [{ type: "object" }],
          },
          objAllBad: {
            allOf: [{ type: "object" }, { type: "number" }],
          },
          objOne: {
            oneOf: [{ type: "object" }],
          },
          objNotOk: {
            not: { not: { type: "object" } },
          },
          objNotBad: {
            type: "object",
            not: { type: "object" },
          },
        },
      })
      .pipe(mergeMap((validator) => validator(data)))
      .toPromise();

    expect(result.success).toBeTruthy();
    expect(data.bool).toBeUndefined();
    expect(data.str).toBe("someString");
    expect(data.obj.num).toBeUndefined();
    expect(data.obj.other).toBe(0);
    expect(data.objAllOk).toEqual({});
    expect(data.objOne).toEqual({});
    expect(data.objAllBad).toBeUndefined();
    expect(data.objNotOk).toEqual({});
    expect(data.objNotBad).toBeUndefined();
  });

  it("should add defaults to undefined properties (2)", async () => {
    const registry = new CoreSchemaRegistry();
    registry.addPreTransform(addUndefinedDefaults);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      bool: undefined,
      str: undefined,
      obj: {
        num: undefined,
      },
    };

    const result = await registry
      .compile({
        properties: {
          bool: { type: "boolean", default: true },
          str: { type: "string", default: "someString" },
          obj: {
            properties: {
              num: { type: "number", default: 0 },
            },
          },
        },
      })
      .pipe(mergeMap((validator) => validator(data)))
      .toPromise();

    expect(result.success).toBeTruthy();
    expect(data.bool).toBeTruthy();
    expect(data.str).toBe("someString");
    expect(data.obj.num).toBe(0);
  });

  it("should add defaults to undefined properties when using oneOf", async () => {
    const registry = new CoreSchemaRegistry();
    registry.addPreTransform(addUndefinedDefaults);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataNoObj: any = {
      bool: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataObj: any = {
      bool: undefined,
      obj: {
        a: false,
      },
    };

    const validator = registry.compile({
      properties: {
        bool: { type: "boolean", default: true },
        obj: {
          default: true,
          oneOf: [
            {
              type: "object",
              properties: {
                a: { type: "boolean", default: true },
                b: { type: "boolean", default: true },
                c: { type: "boolean", default: false },
              },
            },
            {
              type: "boolean",
            },
          ],
        },
        noDefaultOneOf: {
          oneOf: [
            {
              type: "object",
              properties: {
                a: { type: "boolean", default: true },
                b: { type: "boolean", default: true },
                c: { type: "boolean", default: false },
              },
            },
            {
              type: "boolean",
            },
          ],
        },
      },
    });

    const result1 = await validator
      .pipe(mergeMap((validator) => validator(dataNoObj)))
      .toPromise();

    expect(result1.success).toBeTruthy();
    expect(dataNoObj.bool).toBeTruthy();
    expect(dataNoObj.obj).toBeTruthy();
    expect(dataNoObj.noDefaultOneOf).toBeUndefined();

    const result2 = await validator
      .pipe(mergeMap((validator) => validator(dataObj)))
      .toPromise();

    expect(result2.success).toBeTruthy();
    expect(dataObj.bool).toBeTruthy();
    expect(dataObj.obj.a).toBeFalsy();
    expect(dataObj.obj.b).toBeTruthy();
    expect(dataObj.obj.c).toBeFalsy();
  });

  it("should add defaults to undefined properties when using anyOf", async () => {
    const registry = new CoreSchemaRegistry();
    registry.addPreTransform(addUndefinedDefaults);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataNoObj: any = {
      bool: undefined,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataObj: any = {
      bool: undefined,
      obj: {
        a: false,
      },
    };

    const validator = registry.compile({
      properties: {
        bool: { type: "boolean", default: true },
        obj: {
          default: true,
          anyOf: [
            {
              type: "object",
              properties: {
                d: { type: "boolean", default: false },
              },
            },
            {
              type: "object",
              properties: {
                a: { type: "boolean", default: true },
                b: { type: "boolean", default: true },
                c: { type: "boolean", default: false },
              },
            },
            {
              type: "boolean",
            },
          ],
        },
      },
    });

    const result1 = await validator
      .pipe(mergeMap((validator) => validator(dataNoObj)))
      .toPromise();

    expect(result1.success).toBeTruthy();
    expect(dataNoObj.bool).toBeTruthy();
    expect(dataNoObj.obj).toBeTruthy();

    const result2 = await validator
      .pipe(mergeMap((validator) => validator(dataObj)))
      .toPromise();

    expect(result2.success).toBeTruthy();
    expect(dataObj.bool).toBeTruthy();
    expect(dataObj.obj.a).toBeFalsy();
    expect(dataObj.obj.b).toBeTruthy();
    expect(dataObj.obj.c).toBeFalsy();
  });
});
