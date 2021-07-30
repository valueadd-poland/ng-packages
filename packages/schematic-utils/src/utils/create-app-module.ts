import { UnitTestTree } from "../tree/unit-test-tree";

export function createAppModule(
  tree: UnitTestTree,
  path?: string
): UnitTestTree {
  tree.create(
    path || "/src/app/app.module.ts",
    `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { AppComponent } from './app.component';
    @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule { }
  `
  );

  return tree;
}
