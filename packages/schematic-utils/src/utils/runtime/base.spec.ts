import { of as observableOf } from "rxjs";
import { apply, applyToSubtree, chain } from "./base";
import { Rule, SchematicContext, Source } from "../../engine/interface";
import { MergeStrategy, Tree } from "../../tree/interface";
import { callSource } from "../../rules/call";
import { callRule } from "./call";
import { empty } from "../../tree/static";
import { move } from "./move";
import { HostTree } from "../../tree/host-tree";

const context: SchematicContext = ({
  engine: null,
  debug: false,
  strategy: MergeStrategy.Default,
} as any) as SchematicContext;

describe("chain", () => {
  it("works with simple rules", (done) => {
    const rulesCalled: Tree[] = [];

    const tree0 = empty();
    const tree1 = empty();
    const tree2 = empty();
    const tree3 = empty();

    const rule0: Rule = (tree: Tree) => ((rulesCalled[0] = tree), tree1);
    const rule1: Rule = (tree: Tree) => ((rulesCalled[1] = tree), tree2);
    const rule2: Rule = (tree: Tree) => ((rulesCalled[2] = tree), tree3);

    callRule(chain([rule0, rule1, rule2]), observableOf(tree0), context)
      .toPromise()
      .then((result) => {
        expect(result).not.toBe(tree0);
        expect(rulesCalled[0]).toBe(tree0);
        expect(rulesCalled[1]).toBe(tree1);
        expect(rulesCalled[2]).toBe(tree2);
        expect(result).toBe(tree3);
      })
      .then(done, done.fail);
  });

  it("works with observable rules", (done) => {
    const rulesCalled: Tree[] = [];

    const tree0 = empty();
    const tree1 = empty();
    const tree2 = empty();
    const tree3 = empty();

    const rule0: Rule = (tree: Tree) => (
      (rulesCalled[0] = tree), observableOf(tree1)
    );
    const rule1: Rule = (tree: Tree) => (
      (rulesCalled[1] = tree), observableOf(tree2)
    );
    const rule2: Rule = (tree: Tree) => ((rulesCalled[2] = tree), tree3);

    callRule(chain([rule0, rule1, rule2]), observableOf(tree0), context)
      .toPromise()
      .then((result) => {
        expect(result).not.toBe(tree0);
        expect(rulesCalled[0]).toBe(tree0);
        expect(rulesCalled[1]).toBe(tree1);
        expect(rulesCalled[2]).toBe(tree2);
        expect(result).toBe(tree3);
      })
      .then(done, done.fail);
  });
});

describe("apply", () => {
  it("works with simple rules", (done) => {
    const rulesCalled: Tree[] = [];
    const tree0 = empty();
    const tree1 = empty();
    const tree2 = empty();
    const tree3 = empty();

    const source: Source = () => tree0;
    const rule0: Rule = (tree: Tree) => ((rulesCalled[0] = tree), tree1);
    const rule1: Rule = (tree: Tree) => ((rulesCalled[1] = tree), tree2);
    const rule2: Rule = (tree: Tree) => ((rulesCalled[2] = tree), tree3);

    callSource(apply(source, [rule0, rule1, rule2]), context)
      .toPromise()
      .then((result) => {
        expect(result).not.toBe(tree0);
        expect(rulesCalled[0]).toBe(tree0);
        expect(rulesCalled[1]).toBe(tree1);
        expect(rulesCalled[2]).toBe(tree2);
        expect(result).toBe(tree3);
      })
      .then(done, done.fail);
  });

  it("works with observable rules", (done) => {
    const rulesCalled: Tree[] = [];
    const tree0 = empty();
    const tree1 = empty();
    const tree2 = empty();
    const tree3 = empty();

    const source: Source = () => tree0;
    const rule0: Rule = (tree: Tree) => (
      (rulesCalled[0] = tree), observableOf(tree1)
    );
    const rule1: Rule = (tree: Tree) => (
      (rulesCalled[1] = tree), observableOf(tree2)
    );
    const rule2: Rule = (tree: Tree) => ((rulesCalled[2] = tree), tree3);

    callSource(apply(source, [rule0, rule1, rule2]), context)
      .toPromise()
      .then((result) => {
        expect(result).not.toBe(tree0);
        expect(rulesCalled[0]).toBe(tree0);
        expect(rulesCalled[1]).toBe(tree1);
        expect(rulesCalled[2]).toBe(tree2);
        expect(result).toBe(tree3);
      })
      .then(done, done.fail);
  });
});

describe("applyToSubtree", () => {
  it("works", (done) => {
    const tree = new HostTree();
    tree.create("a/b/file1", "hello world");
    tree.create("a/b/file2", "hello world");
    tree.create("a/c/file3", "hello world");

    callRule(
      applyToSubtree("a/b", [move("x")]),
      observableOf(tree as Tree),
      context
    )
      .toPromise()
      .then((result) => {
        expect(result.exists("a/b/x/file1")).toBe(true);
        expect(result.exists("a/b/x/file2")).toBe(true);
        expect(result.exists("a/c/file3")).toBe(true);
      })
      .then(done, done.fail);
  });
});
