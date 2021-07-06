import type { Tree } from "@nrwl/tao/src/shared/tree";
import { readJson } from "./json";
import type { NxJsonConfiguration } from "@nrwl/tao/src/shared/nx";

/**
 * Returns workspace defaults. It includes defaults folders for apps and libs,
 * and the default scope.
 *
 * Example:
 *
 * ```typescript
 * { appsDir: 'apps', libsDir: 'libs', npmScope: 'myorg' }
 * ```
 * @param host - file system tree
 */
export function getWorkspaceLayout(
  host: Tree
): {
  appsDir: string;
  libsDir: string;
  npmScope: string;
} {
  const nxJson = readJson<NxJsonConfiguration>(host, "nx.json");
  return {
    appsDir: nxJson.workspaceLayout?.appsDir ?? "apps",
    libsDir: nxJson.workspaceLayout?.libsDir ?? "libs",
    npmScope: nxJson.npmScope,
  };
}

export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ["/angular.json", "/workspace.json"];
  return possibleFiles.filter((path) => host.exists(path))[0];
}
