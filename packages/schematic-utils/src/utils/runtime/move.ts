import { noop } from "./base";
import { Rule } from "../../engine/interface";
import { Tree } from "../../tree/interface";
import { join, normalize } from "../../virtual-fs/path";

export function move(from: string, to?: string): Rule {
  if (to === undefined) {
    to = from;
    from = "/";
  }

  const fromPath = normalize("/" + from);
  const toPath = normalize("/" + to);

  if (fromPath === toPath) {
    return noop;
  }

  return (tree): Tree => {
    if (tree.exists(fromPath)) {
      // fromPath is a file
      tree.rename(fromPath, toPath);
    } else {
      // fromPath is a directory
      tree.getDir(fromPath).visit((path) => {
        tree.rename(path, join(toPath, path.substr(fromPath.length)));
      });
    }

    return tree;
  };
}
