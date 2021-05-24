import { InsertChange, NoopChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';
import { findNodes } from './ast.utils';
import { findClassBodyInFile, findDeclarationNodeByName } from './ts.utils';
export function methodExists(node, methodName) {
    const methodDeclarations = findNodes(node, ts.SyntaxKind.MethodDeclaration);
    const methodNames = methodDeclarations.map(md => md.name.getText());
    return methodNames.indexOf(methodName) !== -1;
}
export function getDefaultCrudMethodReturnType(entity, collection) {
    return collection ? `Observable<${entity}[]>` : `Observable<${entity}>`;
}
export function methodDeclarationTemplate(options, methodBody) {
    const { methodName, methodProperties, methodReturnType } = options;
    return `\n
  ${methodName}(${methodProperties || ''}): ${methodReturnType || 'void'} {
  ${methodBody || ''}
  }\n`;
}
export function insertMethod(host, context, path, options, methodBody = '') {
    const { methodName, methodProperties, methodReturnType } = options;
    const classBody = findClassBodyInFile(host, path);
    // Check if the method already exists.
    if (methodExists(classBody, methodName)) {
        // The declaration exists, so we have nothing to do.
        context.logger.warn(`Method ${methodName} already exists.`);
        return new NoopChange();
    }
    return new InsertChange(path, classBody.getEnd(), methodDeclarationTemplate({
        methodName,
        methodProperties,
        methodReturnType
    }, methodBody));
}
export function insertPropertyToDictionaryField(host, path, dictionaryField, property) {
    const classBody = findClassBodyInFile(host, path);
    const propertyDeclaration = findDeclarationNodeByName(classBody, dictionaryField);
    if (propertyDeclaration && propertyDeclaration.initializer) {
        const obj = propertyDeclaration.initializer;
        if (obj.properties.find(prop => !!prop.name && prop.name.getText() === property.split(':')[0])) {
            // property exists there is nothing to do
            return new NoopChange();
        }
        const toAdd = obj.properties.length ? `,\n${property}` : property;
        return new InsertChange(path, obj.getEnd() - 1, toAdd);
    }
    else {
        const toAdd = `
    readonly ${dictionaryField} = {
      ${property}
    };
    `;
        return new InsertChange(path, classBody.getStart(), toAdd);
    }
}
//# sourceMappingURL=class.utils.js.map