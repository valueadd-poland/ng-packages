import * as ts from 'typescript';
import { getSourceNodes } from './ast.utils';
export function findActionsNamespace(actionsSourceFile) {
    const nodes = getSourceNodes(actionsSourceFile);
    let actionsNamespace = '';
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].kind === ts.SyntaxKind.NamespaceKeyword) {
            actionsNamespace = nodes[i + 1].getText();
            break;
        }
    }
    return actionsNamespace;
}
//# sourceMappingURL=naming.utils.js.map