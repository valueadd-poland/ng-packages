import { Source } from "../../engine/interface";
import { HostTree } from "../../tree/host-tree";

function generateStringOfLength(l: number): string {
  return new Array(l)
    .fill(0)
    .map(() => {
      return "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    })
    .join("");
}

function random(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from)) + from;
}

export interface RandomOptions {
  root?: string;
  multi?: boolean | number;
  multiFiles?: boolean | number;
}

export default function (options: RandomOptions): Source {
  return (): HostTree => {
    const root = "root" in options ? options.root : "/";

    const map = new HostTree();
    const nbFiles =
      "multiFiles" in options
        ? typeof options.multiFiles == "number"
          ? options.multiFiles
          : random(2, 12)
        : 1;

    for (let i = 0; i < nbFiles; i++) {
      const path = "a/b/c/d/e/f".slice(Math.random() * 10);
      const fileName = generateStringOfLength(20);
      const content = generateStringOfLength(100);

      map.create(root + "/" + path + "/" + fileName, content);
    }

    return map;
  };
}
