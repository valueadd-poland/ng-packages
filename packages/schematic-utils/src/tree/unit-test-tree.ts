import { DelegateTree } from "./delegate";

export class UnitTestTree extends DelegateTree {
  get files(): string[] {
    const result: string[] = [];
    this.visit((path) => result.push(path));

    return result;
  }

  readContent(path: string): string {
    const buffer = this.read(path);
    if (buffer === null) {
      return "";
    }

    return buffer.toString();
  }
}
