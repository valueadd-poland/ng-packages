import { readJson, updateJson } from "./json";
import type { Tree } from "@nrwl/tao/src/shared/tree";
import type { GeneratorCallback } from "@nrwl/tao/src/shared/workspace";
import { installPackagesTask } from "../../tasks/install-packages-task";

/**
 * Add Dependencies and Dev Dependencies to package.json
 *
 * For example:
 * ```typescript
 * addDependenciesToPackageJson(host, { react: 'latest' }, { jest: 'latest' })
 * ```
 * This will **add** `react` and `jest` to the dependencies and devDependencies sections of package.json respectively.
 *
 * @param host Tree representing file system to modify
 * @param dependencies Dependencies to be added to the dependencies section of package.json
 * @param devDependencies Dependencies to be added to the devDependencies section of package.json
 * @param packageJsonPath Path to package.json
 * @returns Callback to install dependencies only if necessary. undefined is returned if changes are not necessary.
 */
export function addDependenciesToPackageJson(
  host: Tree,
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
  packageJsonPath: string = "package.json"
): GeneratorCallback {
  const currentPackageJson = readJson(host, packageJsonPath);

  if (
    requiresAddingOfPackages(currentPackageJson, dependencies, devDependencies)
  ) {
    updateJson(host, packageJsonPath, (json) => {
      json.dependencies = {
        ...(json.dependencies || {}),
        ...dependencies,
        ...(json.dependencies || {}),
      };
      json.devDependencies = {
        ...(json.devDependencies || {}),
        ...devDependencies,
        ...(json.devDependencies || {}),
      };
      json.dependencies = sortObjectByKeys(json.dependencies);
      json.devDependencies = sortObjectByKeys(json.devDependencies);

      return json;
    });
  }
  return (): void => {
    installPackagesTask(host);
  };
}

/**
 * Remove Dependencies and Dev Dependencies from package.json
 *
 * For example:
 * ```typescript
 * removeDependenciesFromPackageJson(host, ['react'], ['jest'])
 * ```
 * This will **remove** `react` and `jest` from the dependencies and devDependencies sections of package.json respectively.
 *
 * @param dependencies Dependencies to be removed from the dependencies section of package.json
 * @param devDependencies Dependencies to be removed from the devDependencies section of package.json
 * @returns Callback to uninstall dependencies only if necessary. undefined is returned if changes are not necessary.
 */
export function removeDependenciesFromPackageJson(
  host: Tree,
  dependencies: string[],
  devDependencies: string[],
  packageJsonPath: string = "package.json"
): GeneratorCallback {
  const currentPackageJson = readJson(host, packageJsonPath);

  if (
    requiresRemovingOfPackages(
      currentPackageJson,
      dependencies,
      devDependencies
    )
  ) {
    updateJson(host, packageJsonPath, (json) => {
      for (const dep of dependencies) {
        delete json.dependencies[dep];
      }
      for (const devDep of devDependencies) {
        delete json.devDependencies[devDep];
      }
      json.dependencies = sortObjectByKeys(json.dependencies);
      json.devDependencies = sortObjectByKeys(json.devDependencies);

      return json;
    });
  }
  return (): void => {
    installPackagesTask(host);
  };
}

function sortObjectByKeys(obj: unknown): unknown {
  // @ts-ignore
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      return {
        ...result,
        // @ts-ignore
        [key]: obj[key],
      };
    }, {});
}

/**
 * Verifies whether the given packageJson dependencies require an update
 * given the deps & devDeps passed in
 */
function requiresAddingOfPackages(
  packageJsonFile: any,
  deps: any,
  devDeps: any
): boolean {
  let needsDepsUpdate = false;
  let needsDevDepsUpdate = false;

  packageJsonFile.dependencies = packageJsonFile.dependencies || {};
  packageJsonFile.devDependencies = packageJsonFile.devDependencies || {};

  if (Object.keys(deps).length > 0) {
    needsDepsUpdate = Object.keys(deps).some(
      (entry) => !packageJsonFile.dependencies[entry]
    );
  }

  if (Object.keys(devDeps).length > 0) {
    needsDevDepsUpdate = Object.keys(devDeps).some(
      (entry) => !packageJsonFile.devDependencies[entry]
    );
  }

  return needsDepsUpdate || needsDevDepsUpdate;
}

/**
 * Verifies whether the given packageJson dependencies require an update
 * given the deps & devDeps passed in
 */
function requiresRemovingOfPackages(
  packageJsonFile: any,
  deps: string[],
  devDeps: string[]
): boolean {
  let needsDepsUpdate = false;
  let needsDevDepsUpdate = false;

  packageJsonFile.dependencies = packageJsonFile.dependencies || {};
  packageJsonFile.devDependencies = packageJsonFile.devDependencies || {};

  if (deps.length > 0) {
    needsDepsUpdate = deps.some((entry) => packageJsonFile.dependencies[entry]);
  }

  if (devDeps.length > 0) {
    needsDevDepsUpdate = devDeps.some(
      (entry) => packageJsonFile.devDependencies[entry]
    );
  }

  return needsDepsUpdate || needsDevDepsUpdate;
}
