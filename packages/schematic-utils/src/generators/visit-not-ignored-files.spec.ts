import type { Tree } from "@nrwl/tao/src/shared/tree";
import { visitNotIgnoredFiles } from "./visit-not-ignored-files";
import { createTree } from "../tests/create-tree";

describe("visitNotIgnoredFiles", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("should visit files recursively in a directory", () => {
    tree.write("dir/file1.ts", "");
    tree.write("dir/dir2/file2.ts", "");

    const visitor = jest.fn();
    visitNotIgnoredFiles(tree, "dir", visitor);

    expect(visitor).toHaveBeenCalledWith("dir/file1.ts");
    expect(visitor).toHaveBeenCalledWith("dir/dir2/file2.ts");
  });

  it("should not visit ignored files in a directory", () => {
    tree.write(".gitignore", "node_modules");

    tree.write("dir/file1.ts", "");
    tree.write("dir/node_modules/file1.ts", "");
    tree.write("dir/dir2/file2.ts", "");

    const visitor = jest.fn();
    visitNotIgnoredFiles(tree, "dir", visitor);

    expect(visitor).toHaveBeenCalledWith("dir/file1.ts");
    expect(visitor).toHaveBeenCalledWith("dir/dir2/file2.ts");
    expect(visitor).not.toHaveBeenCalledWith("dir/node_modules/file1.ts");
  });

  it("should be able to visit the root", () => {
    tree.write(".gitignore", "node_modules");

    tree.write("dir/file1.ts", "");
    tree.write("dir/node_modules/file1.ts", "");
    tree.write("dir/dir2/file2.ts", "");

    const visitor = jest.fn();
    visitNotIgnoredFiles(tree, "", visitor);

    expect(visitor).toHaveBeenCalledWith(".gitignore");
    expect(visitor).toHaveBeenCalledWith("dir/file1.ts");
    expect(visitor).toHaveBeenCalledWith("dir/dir2/file2.ts");
    expect(visitor).not.toHaveBeenCalledWith("dir/node_modules/file1.ts");
  });
});
