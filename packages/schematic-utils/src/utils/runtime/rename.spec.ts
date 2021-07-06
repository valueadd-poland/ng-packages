import { of as observableOf } from "rxjs";
import { callRule } from "./call";
import { rename } from "./rename";
import { SchematicContext } from "../../engine/interface";
import { HostTree } from "../../tree/host-tree";

const context: SchematicContext = null!;

describe("rename", () => {
  it("works", (done) => {
    const tree = new HostTree();
    tree.create("a/b/file1", "hello world");
    tree.create("a/b/file2", "hello world");
    tree.create("a/c/file3", "hello world");

    let i = 0;

    // Rename all files that contain 'b' to 'hello'.
    callRule(
      rename(
        (x) => !!x.match(/b/),
        () => "hello" + i++
      ),
      observableOf(tree),
      context
    )
      .toPromise()
      .then((result) => {
        expect(result.exists("a/b/file1")).toBe(false);
        expect(result.exists("a/b/file2")).toBe(false);
        expect(result.exists("hello0")).toBe(true);
        expect(result.exists("hello1")).toBe(true);
        expect(result.exists("a/c/file3")).toBe(true);
      })
      .then(done, done.fail);
  });

  it("works (2)", (done) => {
    const tree = new HostTree();
    tree.create("a/b/file1", "hello world");
    tree.create("a/b/file2", "hello world");
    tree.create("a/c/file3", "hello world");

    let i = 0;

    // Rename all files that contain 'b' to 'hello'.
    callRule(
      rename(
        (x) => !!x.match(/b/),
        (x) => x + i++
      ),
      observableOf(tree),
      context
    )
      .toPromise()
      .then((result) => {
        expect(result.exists("a/b/file1")).toBe(false);
        expect(result.exists("a/b/file2")).toBe(false);
        expect(result.exists("a/b/file10")).toBe(true);
        expect(result.exists("a/b/file21")).toBe(true);
        expect(result.exists("a/c/file3")).toBe(true);
      })
      .then(done, done.fail);
  });
});
