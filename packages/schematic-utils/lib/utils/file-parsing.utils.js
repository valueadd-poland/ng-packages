import * as ts from 'typescript';
import { findNode, getSourceNodes } from './ast.utils';
import { findDeclarationNodeByName } from './ts.utils';
export function parseReducerFile(sourceFile) {
    const nodes = getSourceNodes(sourceFile);
    const initialState = findDeclarationNodeByName(sourceFile, 'initialState');
    const reducerFunction = nodes
        .filter(node => node.kind === ts.SyntaxKind.FunctionDeclaration)
        .filter(node => node.name
        .getText()
        .toLowerCase()
        .includes('reducer'))[0];
    const stateInterface = nodes
        .filter(node => node.kind === ts.SyntaxKind.InterfaceDeclaration)
        .filter(node => {
        const name = node.name.getText().toLowerCase();
        return name.includes('state') && !name.includes('partialstate');
    })[0];
    const reducerSwitchStatement = findNode(reducerFunction.getChildren().filter(node => node.kind === ts.SyntaxKind.Block)[0], ts.SyntaxKind.SwitchStatement);
    return {
        initialState: initialState,
        reducerFunction: reducerFunction,
        reducerSwitchStatement: reducerSwitchStatement,
        stateInterface: stateInterface
    };
}
export function getSpecPath(path) {
    const p = path.split('.ts');
    p.pop();
    p.push('.spec.ts');
    return p.join('');
}
//# sourceMappingURL=file-parsing.utils.js.map