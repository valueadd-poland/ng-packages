import { normalize, virtualFs } from "../virtual-fs";
import { FilterHostTree, HostTree } from "./host-tree";
import { MergeStrategy } from "./interface";

describe("HostTree", () => {
  describe("merge", () => {
    it("should create files from each tree", () => {
      const tree = new HostTree();
      tree.create("/file1", "a");
      const tree2 = new HostTree();
      tree2.create("/file2", "a");
      tree.merge(tree2);
      expect(tree.actions[0].kind).toEqual("c");
      expect(tree.actions[1].kind).toEqual("c");
    });

    it("should overwrite if the file exists in one tree", () => {
      const tree = new HostTree();
      tree.create("/file1", "a");
      const tree2 = new HostTree();
      tree2.create("/file1", "b");
      tree.merge(tree2, MergeStrategy.Overwrite);
      expect(tree.actions[0].kind).toEqual("c");
    });

    it("should throw if the file exists in one tree with the correct MergeStrategy", () => {
      const tree = new HostTree();
      tree.create("/file1", "a");
      const tree2 = new HostTree();
      tree2.create("/file1", "b");
      expect(() => tree.merge(tree2)).toThrow();
    });

    it("should not have a second action if the file content is the same", () => {
      const tree = new HostTree();
      tree.create("/file1", "a");
      const tree2 = new HostTree();
      tree2.create("/file1", "a");
      tree.merge(tree2, MergeStrategy.Overwrite);
      expect(tree.actions[0].kind).toEqual("c");
      expect(tree.actions.length).toEqual(1);
    });
  });
});

describe("FilterHostTree", () => {
  it("works", () => {
    const tree = new HostTree();
    tree.create("/file1", "");
    tree.create("/file2", "");
    tree.create("/file3", "");

    const filtered = new FilterHostTree(tree, (p) => p != "/file2");
    const filteredFiles: string[] = [];
    filtered.visit((path) => filteredFiles.push(path));
    filteredFiles.sort();
    expect(filteredFiles).toEqual(["/file1", "/file3"].map(normalize));
    expect(filtered.actions.length).toEqual(2);
  });

  it("works with two filters", () => {
    const tree = new HostTree();
    tree.create("/file1", "");
    tree.create("/file2", "");
    tree.create("/file3", "");

    const filtered = new FilterHostTree(tree, (p) => p != "/file2");
    const filtered2 = new FilterHostTree(filtered, (p) => p != "/file3");
    const filteredFiles: string[] = [];
    filtered2.visit((path) => filteredFiles.push(path));
    filteredFiles.sort();
    expect(filteredFiles).toEqual(["/file1"].map(normalize));
    expect(filtered2.actions.map((a) => a.kind)).toEqual(["c"]);
  });

  it("works with underlying files", () => {
    const fs = new virtualFs.test.TestHost({
      "/file1": "",
    });
    const tree = new HostTree(fs);
    tree.create("/file2", "");
    tree.create("/file3", "");

    const filtered = new FilterHostTree(tree, (p) => p != "/file2");
    const filtered2 = new FilterHostTree(filtered, (p) => p != "/file3");
    const filteredFiles: string[] = [];
    filtered2.visit((path) => filteredFiles.push(path));
    filteredFiles.sort();
    expect(filteredFiles).toEqual(["/file1"].map(normalize));
    expect(filtered2.actions.map((a) => a.kind)).toEqual([]);
  });

  it("works with created paths and files", () => {
    const tree = new HostTree();
    tree.create("/dir1/file1", "");
    tree.create("/dir2/file2", "");
    tree.create("/file3", "");

    const filtered = new FilterHostTree(tree, (p) => p != "/dir2/file2");
    const filtered2 = new FilterHostTree(filtered, (p) => p != "/file3");
    const filteredFiles: string[] = [];
    filtered2.visit((path) => filteredFiles.push(path));
    filteredFiles.sort();
    expect(filteredFiles).toEqual(["/dir1/file1"].map(normalize));
    expect(filtered2.actions.map((a) => a.kind)).toEqual(["c"]);
  });

  it("works with underlying paths and files", () => {
    const fs = new virtualFs.test.TestHost({
      "/dir1/file1": "",
      "/dir2/file2": "",
    });
    const tree = new HostTree(fs);
    tree.create("/file3", "");

    const filtered = new FilterHostTree(tree, (p) => p != "/dir2/file2");
    const filtered2 = new FilterHostTree(filtered, (p) => p != "/file3");
    const filteredFiles: string[] = [];
    filtered2.visit((path) => filteredFiles.push(path));
    filteredFiles.sort();
    expect(filteredFiles).toEqual(["/dir1/file1"].map(normalize));
    expect(filtered2.actions.map((a) => a.kind)).toEqual([]);
  });

  it("subdirs only contains directories", () => {
    const fs = new virtualFs.test.TestHost({
      "/dir1/file1": "",
      "/dir1/dir2/file2": "",
      "/dir1/dir3/file3": "",
    });
    const tree = new HostTree(fs);
    const subDirs = tree.getDir("/dir1").subdirs;
    expect(subDirs as string[]).toEqual(["dir2", "dir3"]);
  });
});
