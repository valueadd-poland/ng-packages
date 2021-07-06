import { FilterHostTree, HostTree } from "./host-tree";
import { FilePredicate, MergeStrategy, Tree } from "./interface";
import { SchematicsException } from "../exceptions/exception";

export function empty(): HostTree {
  return new HostTree();
}

export function branch(tree: Tree): Tree {
  return tree.branch();
}

export function merge(
  tree: Tree,
  other: Tree,
  strategy: MergeStrategy = MergeStrategy.Default
): Tree {
  tree.merge(other, strategy);

  return tree;
}

export function partition(
  tree: Tree,
  predicate: FilePredicate<boolean>
): [Tree, Tree] {
  if (tree instanceof HostTree) {
    return [
      new FilterHostTree(tree, predicate),
      new FilterHostTree(tree, (path, entry) => !predicate(path, entry)),
    ];
  } else {
    throw new SchematicsException("Tree type is not supported.");
  }
}
