import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { Change, InsertChange, NoopChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';
import { findNodes } from './ast.utils';
import { findClassBodyInFile, findDeclarationNodeByName } from './ts.utils';

export interface MethodDeclarationOptions {
  methodName: string;
  methodProperties?: string;
  methodReturnType?: string;
}

export function methodExists(node: ts.Node, methodName: string): boolean {
  const methodDeclarations = findNodes<ts.MethodDeclaration>(node, ts.SyntaxKind.MethodDeclaration);
  const methodNames = methodDeclarations.map(md => md.name.getText());

  return methodNames.indexOf(methodName) !== -1;
}

export function getDefaultCrudMethodReturnType(entity: string, collection: boolean): string {
  return collection ? `Observable<${entity}[]>` : `Observable<${entity}>`;
}

export function methodDeclarationTemplate(
  options: MethodDeclarationOptions,
  methodBody?: string
): string {
  const { methodName, methodProperties, methodReturnType } = options;

  return `\n
  ${methodName}(${methodProperties || ''}): ${methodReturnType || 'void'} {
  ${methodBody || ''}
  }\n`;
}

export function insertMethod(
  host: Tree,
  context: SchematicContext,
  path: string,
  options: MethodDeclarationOptions,
  methodBody = ''
): Change {
  const { methodName, methodProperties, methodReturnType } = options;
  const classBody = findClassBodyInFile(host, path);

  // Check if the method already exists.
  if (methodExists(classBody, methodName)) {
    // The declaration exists, so we have nothing to do.
    context.logger.warn(`Method ${methodName} already exists.`);
    return new NoopChange();
  }

  return new InsertChange(
    path,
    classBody.getEnd(),
    methodDeclarationTemplate(
      {
        methodName,
        methodProperties,
        methodReturnType
      },
      methodBody
    )
  );
}

export function insertPropertyToDictionaryField(
  host: Tree,
  path: string,
  dictionaryField: string,
  property: string
): Change {
  const classBody = findClassBodyInFile(host, path);
  const propertyDeclaration = findDeclarationNodeByName<ts.PropertyDeclaration>(
    classBody,
    dictionaryField
  );

  if (propertyDeclaration && propertyDeclaration.initializer) {
    const obj = propertyDeclaration.initializer as ts.ObjectLiteralExpression;

    if (
      obj.properties.find(prop => !!prop.name && prop.name.getText() === property.split(':')[0])
    ) {
      // property exists there is nothing to do
      return new NoopChange();
    }

    const toAdd = obj.properties.length ? `,\n${property}` : property;
    return new InsertChange(path, obj.getEnd() - 1, toAdd);
  } else {
    const toAdd = `
    readonly ${dictionaryField} = {
      ${property}
    };
    `;
    return new InsertChange(path, classBody.getStart(), toAdd);
  }
}
