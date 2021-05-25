export function methodDeclarationTemplate(options, methodBody) {
    const { methodName, methodProperties, methodReturnType } = options;
    return `\n
  ${methodName}(${methodProperties || ''}): ${methodReturnType || 'void'} {
  ${methodBody || ''}
  }\n`;
}
//# sourceMappingURL=method.utils.js.map