import { join, relative } from "path";
import type { FileChange, Tree } from "@nrwl/tao/src/shared/tree";
import type {
  Generator,
  GeneratorCallback,
} from "@nrwl/tao/src/shared/workspace";

class RunCallbackTask {
  constructor(private callback: GeneratorCallback) {}
  toConfiguration() {
    return {
      name: "RunCallback",
      options: {
        callback: this.callback,
      },
    };
  }
}

function createRunCallbackTask() {
  return {
    name: "RunCallback",
    create: () => {
      return Promise.resolve(
        async ({ callback }: { callback: GeneratorCallback }) => {
          await callback();
        }
      );
    },
  };
}

/**
 * Convert an Nx Generator into an Angular Devkit Schematic
 */
export function convertNxGenerator<T = any>(generator: Generator<T>) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (options: T) => invokeNxGenerator(generator, options);
}

/**
 * Create a Rule to invoke an Nx Generator
 */
function invokeNxGenerator<T = any>(generator: Generator<T>, options: T) {
  return async ([tree, context]: [any, any]) => {
    if (context.engine.workflow) {
      const engineHost = (context.engine.workflow as any).engineHost;
      engineHost.registerTaskExecutor(createRunCallbackTask());
    }

    const root =
      context.engine.workflow && context.engine.workflow.engineHost.paths
        ? context.engine.workflow.engineHost.paths[1]
        : tree.root.path;

    const adapterTree = new DevkitTreeFromAngularDevkitTree(tree, root);
    const result = await generator(adapterTree, options);

    if (!result) {
      return adapterTree["tree"];
    }
    if (typeof result === "function") {
      if (context.engine.workflow) {
        context.addTask(new RunCallbackTask(result));
      }
    }
  };
}

const actionToFileChangeMap: Record<string, string> = {
  c: "CREATE",
  o: "UPDATE",
  d: "DELETE",
};

class DevkitTreeFromAngularDevkitTree implements Tree {
  constructor(private tree: any, private _root: string) {}

  get root(): string {
    return this._root;
  }

  children(dirPath: string): string[] {
    const { subdirs, subfiles } = this.tree.getDir(dirPath);
    return [...subdirs, ...subfiles];
  }

  delete(filePath: string): void {
    this.tree.delete(filePath);
  }

  exists(filePath: string): boolean {
    if (this.isFile(filePath)) {
      return this.tree.exists(filePath);
    } else {
      return this.children(filePath).length > 0;
    }
  }

  isFile(filePath: string): boolean {
    return this.tree.exists(filePath) && !!this.tree.read(filePath);
  }

  listChanges(): FileChange[] {
    const fileChanges = [];
    for (const action of this.tree.actions) {
      if (action.kind === "r") {
        fileChanges.push({
          path: this.normalize(action.to),
          type: "CREATE",
          content: this.read(action.to),
        });
        fileChanges.push({
          path: this.normalize(action.path),
          type: "DELETE",
          content: null,
        });
      } else if (action.kind === "c") {
        fileChanges.push({
          path: this.normalize(action.path),
          type: actionToFileChangeMap[action.kind],
          content: action.content,
        });
      } else if (action.kind === "o") {
        fileChanges.push({
          path: this.normalize(action.path),
          type: actionToFileChangeMap[action.kind],
          content: action.content,
        });
      } else {
        fileChanges.push({
          path: this.normalize(action.path),
          type: "DELETE",
          content: null,
        });
      }
    }
    return fileChanges as FileChange[];
  }

  private normalize(path: string): string {
    return relative(this.root, join(this.root, path));
  }

  read(filePath: string): Buffer;
  read(filePath: string, encoding: BufferEncoding): string;
  read(filePath: string, encoding?: BufferEncoding) {
    return encoding
      ? this.tree.read(filePath).toString(encoding)
      : this.tree.read(filePath);
  }

  rename(from: string, to: string): void {
    this.tree.rename(from, to);
  }

  write(filePath: string, content: Buffer | string): void {
    if (this.tree.exists(filePath)) {
      this.tree.overwrite(filePath, content);
    } else {
      this.tree.create(filePath, content);
    }
  }
}
