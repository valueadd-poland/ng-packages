import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { addExportAstrix, insert } from './ast.utils';
import { names, toFileName } from './name.utils';

export interface AppConfig {
  appModule: string; // app/app.module.ts in the above sourceDir
  appName: string; // name of app
}

export interface LibConfig {
  barrel: string;
  module: string;
  name: string;
}

let appConfig: AppConfig; // configure built in createApp()
let libConfig: LibConfig;

export function getAppConfig(): AppConfig {
  return appConfig;
}

export function getLibConfig(): LibConfig {
  return libConfig;
}

export const schematicRunner = new SchematicTestRunner(
  '@nrwl/schematics',
  path.join(__dirname, '../collection.json')
);

export function runSchematic(name: string, options: any, tree: Tree): Promise<UnitTestTree> {
  return schematicRunner
    .runSchematicAsync(name, { ...options, skipFormat: true }, tree)
    .toPromise();
}

export function createEmptyWorkspace(tree: UnitTestTree): UnitTestTree {
  tree.create('/angular.json', JSON.stringify({ projects: {}, newProjectRoot: '' }));
  tree.create(
    '/package.json',
    JSON.stringify({
      dependencies: {},
      devDependencies: {}
    })
  );
  tree.create('/nx.json', JSON.stringify({ npmScope: 'proj', projects: {} }));
  tree.create('/tsconfig.json', JSON.stringify({ compilerOptions: { paths: {} } }));
  tree.create(
    '/tslint.json',
    JSON.stringify({
      rules: {
        'nx-enforce-module-boundaries': [
          true,
          {
            npmScope: '<%= npmScope %>',
            lazyLoad: [],
            allow: []
          }
        ]
      }
    })
  );
  return tree;
}

export function createApp(
  tree: UnitTestTree,
  appName: string,
  routing: boolean = true
): UnitTestTree {
  // save for getAppDir() lookup by external *.spec.ts tests
  appConfig = {
    appName,
    appModule: `/apps/${appName}/src/app/app.module.ts`
  };

  tree.create(
    appConfig.appModule,
    `
     import { NgModule } from '@angular/core';
     import { BrowserModule } from '@angular/platform-browser';
     ${routing ? "import { RouterModule } from '@angular/router'" : ''};
     import { AppComponent } from './app.component';
     @NgModule({
       imports: [BrowserModule, ${routing ? 'RouterModule.forRoot([])' : ''}],
       declarations: [AppComponent],
       bootstrap: [AppComponent]
     })
     export class AppModule {}
  `
  );
  tree.create(
    `/apps/${appName}/src/main.ts`,
    `
    import { enableProdMode } from '@angular/core';
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

    import { AppModule } from './app/app.module';
    import { environment } from './environments/environment';

    if (environment.production) {
      enableProdMode();
    }

    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.log(err));
  `
  );
  tree.create(
    `/apps/${appName}/tsconfig.app.json`,
    JSON.stringify({
      include: ['**/*.ts']
    })
  );
  tree.create(
    `/apps/${appName}-e2e/tsconfig.e2e.json`,
    JSON.stringify({
      include: ['../**/*.ts']
    })
  );
  tree.overwrite(
    '/angular.json',
    JSON.stringify({
      newProjectRoot: '',
      projects: {
        [appName]: {
          root: `apps/${appName}`,
          sourceRoot: `apps/${appName}/src`,
          architect: {
            build: {
              options: {
                main: `apps/${appName}/src/main.ts`
              }
            },
            serve: {
              options: {}
            }
          }
        }
      }
    })
  );
  return tree;
}

export function createLib(tree: UnitTestTree, libName: string): UnitTestTree {
  const { name, className, fileName } = names(libName);

  libConfig = {
    name,
    module: `/libs/${fileName}/src/lib/${fileName}.module.ts`,
    barrel: `/libs/${fileName}/src/index.ts`
  };

  tree.create(
    libConfig.module,
    `
      import { NgModule } from '@angular/core';
      import { CommonModule } from '@angular/common';
      @NgModule({
        imports: [
          CommonModule
        ],
        providers: []
      })
      export class ${className}Module { }
  `
  );
  tree.create(
    libConfig.barrel,
    `
    export * from './lib/${fileName}.module';
  `
  );
  return tree;
}

export function createServiceInLib(
  tree: UnitTestTree,
  serviceName: string,
  libName: string
): UnitTestTree {
  const { name, className, fileName } = names(serviceName);
  libName = toFileName(libName);

  const serviceConfig = {
    name,
    service: `/libs/${libName}/src/lib/services/${fileName}.service.ts`,
    barrel: `/libs/${libName}/src/lib/services/index.ts`
  };

  tree.create(
    serviceConfig.service,
    `
      import { Injectable } from '@angular/core';

      @Injectable({
        providedIn: 'root'
      })
      export class ${className}Service {}
  `
  );
  tree.create(
    serviceConfig.barrel,
    `
    export * from './${fileName}.service';
  `
  );

  return tree;
}

export function createModelInLib(
  tree: UnitTestTree,
  modelName: string,
  libName: string
): UnitTestTree {
  const { name, className, fileName } = names(modelName);
  libName = toFileName(libName);

  const serviceConfig = {
    name,
    service: `/libs/${libName}/src/lib/resources/models/${fileName}.model.ts`,
    barrel: `/libs/${libName}/src/lib/resources/models/index.ts`
  };

  tree.create(
    serviceConfig.service,
    `
      export class ${className} {
        id: string;
        name: string;
        data: any;
        errors: any;
      }
  `
  );

  if (tree.exists(serviceConfig.barrel)) {
    insert(tree, serviceConfig.barrel, [
      addExportAstrix(tree, serviceConfig.barrel, `./${fileName}.model`)
    ]);
  } else {
    tree.create(
      serviceConfig.barrel,
      `
    export * from './${fileName}.model';
  `
    );
  }

  return tree;
}
