import { SchematicsException } from '@angular-devkit/schematics';
import { normalize } from 'path';
import * as ts from 'typescript';
import { getSourceNodes } from './ast.utils';
export function readIntoSourceFile(host, filePath) {
    const text = host.read(filePath);
    if (text === null) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
}
export function showTree(node, indent = '    ') {
    console.log(indent + ts.SyntaxKind[node.kind]);
    if (node.getChildCount() === 0) {
        console.log(indent + '    Text: ' + node.getText());
    }
    for (const child of node.getChildren()) {
        showTree(child, indent + '    ');
    }
}
export function createFilesArrayFromDir(dir, dirFilterFn = () => true) {
    let files = [];
    const directoriesToScan = [dir];
    while (directoriesToScan.length) {
        const currentDir = directoriesToScan.shift();
        files = files.concat(currentDir.subfiles.map(subFile => normalize(`${currentDir.path}/${subFile}`)));
        directoriesToScan.push(...currentDir.subdirs.map(subdir => currentDir.dir(subdir)).filter(dirFilterFn));
    }
    return files;
}
export function findDeclarationNodeByName(node, name) {
    const n = node.name;
    if (n && n.escapedText === name) {
        return node;
    }
    const children = node.getChildren();
    for (let i = 0; i < children.length; i++) {
        const foundNode = findDeclarationNodeByName(children[i], name);
        if (foundNode) {
            return foundNode;
        }
    }
    return null;
}
export function findDeclarationNodeByPartialName(node, name) {
    const n = node.name;
    if (n && n.escapedText.indexOf(name) !== -1) {
        return node;
    }
    const children = node.getChildren();
    for (let i = 0; i < children.length; i++) {
        const foundNode = findDeclarationNodeByPartialName(children[i], name);
        if (foundNode) {
            return foundNode;
        }
    }
    return null;
}
export function guessType(value) {
    if (value.includes('false') || value.includes('true')) {
        return 'boolean';
    }
    if (value.match(/^\d+$/)) {
        return 'number';
    }
    if (value === 'null' || value === 'undefined' || value === 'never') {
        return value;
    }
    return 'any';
}
export function parseType(type) {
    const types = [];
    const generics = type.split('<').map(t => t.replace('>', ''));
    generics.forEach(g => {
        types.push(...g.split('|'));
    });
    return types.map(t => t.trim());
}
export function isBaseType(type) {
    return ([
        'boolean',
        'boolean[]',
        'number',
        'number[]',
        'null',
        'null[]',
        'undefined',
        'undefined[]',
        'string',
        'string[]',
        'any',
        'any[]'
    ].indexOf(type) !== -1);
}
export function parseInterfaceMembers(members) {
    const props = [];
    members.forEach(member => {
        const nodes = member
            .getChildren()
            .filter(node => node.kind !== ts.SyntaxKind.QuestionToken && node.kind !== ts.SyntaxKind.ColonToken);
        props.push(nodes);
    });
    return props;
}
export function findClassBodyInFile(host, filePath) {
    const sourceFile = readIntoSourceFile(host, filePath);
    const nodes = getSourceNodes(sourceFile);
    const classNode = nodes.find(n => n.kind === ts.SyntaxKind.ClassKeyword);
    if (!classNode) {
        throw new SchematicsException(`expected class in ${filePath}`);
    }
    if (!classNode.parent) {
        throw new SchematicsException(`expected class in ${filePath} to have a parent node`);
    }
    let siblings = classNode.parent.getChildren();
    const classIndex = siblings.indexOf(classNode);
    siblings = siblings.slice(classIndex);
    const classIdentifierNode = siblings.find(n => n.kind === ts.SyntaxKind.Identifier);
    if (!classIdentifierNode) {
        throw new SchematicsException(`expected class in ${filePath} to have an identifier`);
    }
    // Find opening curly braces (FirstPunctuation means '{' here).
    const curlyNodeIndex = siblings.findIndex(n => n.kind === ts.SyntaxKind.FirstPunctuation);
    siblings = siblings.slice(curlyNodeIndex);
    const listNode = siblings.find(n => n.kind === ts.SyntaxKind.SyntaxList);
    if (!listNode) {
        throw new SchematicsException(`expected first class in ${filePath} to have a body`);
    }
    return listNode;
}
export function findClassNameInFile(host, filePath) {
    const sourceFile = readIntoSourceFile(host, filePath);
    const nodes = getSourceNodes(sourceFile);
    const classNode = nodes.find(n => n.kind === ts.SyntaxKind.ClassKeyword);
    if (!classNode) {
        throw new SchematicsException(`expected class in ${filePath}`);
    }
    let siblings = classNode.parent.getChildren();
    const classIndex = siblings.indexOf(classNode);
    siblings = siblings.slice(classIndex);
    const classIdentifierNode = siblings.find(n => n.kind === ts.SyntaxKind.Identifier);
    if (!classIdentifierNode) {
        throw new SchematicsException(`expected class in ${filePath} to have an identifier`);
    }
    return classIdentifierNode.getText();
}
export function findNamespaceName(host, filePath) {
    const sourceFile = readIntoSourceFile(host, filePath);
    const nodes = getSourceNodes(sourceFile);
    const namespaceNode = nodes.find(n => n.kind === ts.SyntaxKind.NamespaceKeyword);
    if (!namespaceNode) {
        throw new SchematicsException(`expected class in ${filePath}`);
    }
    let siblings = namespaceNode.parent.getChildren();
    const namespaceIndex = siblings.indexOf(namespaceNode);
    siblings = siblings.slice(namespaceIndex);
    const namespaceIdentifierNode = siblings.find(n => n.kind === ts.SyntaxKind.Identifier);
    if (!namespaceIdentifierNode) {
        throw new SchematicsException(`expected namespace in ${filePath} to have an identifier`);
    }
    return namespaceIdentifierNode.getText();
}
export function findByIdentifier(host, filePath, identifier) {
    const sourceFile = readIntoSourceFile(host, filePath);
    const nodes = getSourceNodes(sourceFile);
    const identifierNode = nodes.find(n => n.kind === ts.SyntaxKind.Identifier && n.getText() === identifier);
    if (!identifierNode) {
        throw new SchematicsException(`Identifier ${identifier} not found in ${filePath}.`);
    }
    if (!identifierNode.parent) {
        throw new SchematicsException(`Expecting to identifier ${identifier} has parent node.`);
    }
    return identifierNode.parent;
}
//# sourceMappingURL=ts.utils.js.map