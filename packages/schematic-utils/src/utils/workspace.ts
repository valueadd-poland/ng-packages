import * as workspaces from "../workspace";
import * as json from "../json/interface";
import { ProjectType } from "./workspace-models";
import { Tree } from "../tree/interface";
import { Rule } from "../engine/interface";
import { noop } from "./runtime";
import { virtualFs } from "../virtual-fs";

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new Error("File not found.");
      }

      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      // approximate a directory check
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

export function updateWorkspace(
  updater: (
    workspace: workspaces.WorkspaceDefinition
  ) => void | Rule | PromiseLike<void | Rule>
): Rule;
export function updateWorkspace(
  workspace: workspaces.WorkspaceDefinition
): Rule;
export function updateWorkspace(
  updaterOrWorkspace:
    | workspaces.WorkspaceDefinition
    | ((
        workspace: workspaces.WorkspaceDefinition
      ) => void | Rule | PromiseLike<void | Rule>)
): Rule {
  return async (tree: Tree): Promise<void | Rule> => {
    const host = createHost(tree);

    if (typeof updaterOrWorkspace === "function") {
      const { workspace } = await workspaces.readWorkspace("/", host);

      const result = await updaterOrWorkspace(workspace);

      await workspaces.writeWorkspace(workspace, host);

      return result || noop;
    } else {
      await workspaces.writeWorkspace(updaterOrWorkspace, host);

      return noop;
    }
  };
}

export async function getWorkspace(
  tree: Tree,
  path = "/"
): Promise<workspaces.WorkspaceDefinition> {
  const host = createHost(tree);

  const { workspace } = await workspaces.readWorkspace(path, host);

  return workspace;
}

/**
 * Build a default project path for generating.
 * @param project The project which will have its default path generated.
 */
export function buildDefaultPath(
  project: workspaces.ProjectDefinition
): string {
  const root = project.sourceRoot
    ? `/${project.sourceRoot}/`
    : `/${project.root}/src/`;
  const projectDirName =
    project.extensions["projectType"] === ProjectType.Application
      ? "app"
      : "lib";

  return `${root}${projectDirName}`;
}

export async function createDefaultPath(
  tree: Tree,
  projectName: string
): Promise<string> {
  const workspace = await getWorkspace(tree);
  const project = workspace.projects.get(projectName);
  if (!project) {
    throw new Error(`Project "${projectName}" does not exist.`);
  }

  return buildDefaultPath(project);
}

export function* allWorkspaceTargets(
  workspace: workspaces.WorkspaceDefinition
): Iterable<
  [string, workspaces.TargetDefinition, string, workspaces.ProjectDefinition]
> {
  for (const [projectName, project] of workspace.projects) {
    for (const [targetName, target] of project.targets) {
      yield [targetName, target, projectName, project];
    }
  }
}

export function* allTargetOptions(
  target: workspaces.TargetDefinition,
  skipBaseOptions = false
): Iterable<[string | undefined, Record<string, json.JsonValue | undefined>]> {
  if (!skipBaseOptions && target.options) {
    yield [undefined, target.options];
  }

  if (!target.configurations) {
    return;
  }

  for (const [name, options] of Object.entries(target.configurations)) {
    if (options !== undefined) {
      yield [name, options];
    }
  }
}
