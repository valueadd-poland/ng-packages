import { normalize } from '@angular-devkit/core';
import { guessType } from './ts.utils';
export function parseStateDir(path, host) {
    const statePath = normalize(path);
    const stateDir = host.getDir(statePath);
    const findFileByEnding = (name) => {
        return stateDir.subfiles.find(file => file.endsWith(name));
    };
    return {
        actions: normalize(statePath + '/' + findFileByEnding('.actions.ts')),
        effects: normalize(statePath + '/' + findFileByEnding('.effects.ts')),
        effectsSpec: normalize(statePath + '/' + findFileByEnding('.effects.spec.ts')),
        facade: normalize(statePath + '/' + findFileByEnding('.facade.ts')),
        facadeSpec: normalize(statePath + '/' + findFileByEnding('.facade.spec.ts')),
        reducer: normalize(statePath + '/' + findFileByEnding('.reducer.ts')),
        reducerSpec: normalize(statePath + '/' + findFileByEnding('.reducer.spec.ts')),
        selectors: normalize(statePath + '/' + findFileByEnding('.selectors.ts')),
        selectorsSpec: normalize(statePath + '/' + findFileByEnding('.selectors.spec.ts'))
    };
}
export function parsePropsToUpdate(propsToUpdate) {
    return propsToUpdate
        .split(',')
        .map(prop => prop.split(/(?<!\\):/g))
        .map(prop => {
        return {
            key: prop[0],
            value: prop[1].replace('\\:', ':'),
            type: prop[2] || guessType(prop[1])
        };
    });
}
export function parseTypedProperties(str) {
    const props = str ? str.split(',') : [];
    return props.map(prop => {
        const p = prop.split(':');
        return {
            name: p[0],
            type: p[1] || 'any'
        };
    });
}
export function typedPropertiesToString(typedProperties, separator = ', ') {
    return typedProperties.map(tp => `${tp.name}: ${tp.type}`).join(separator);
}
//# sourceMappingURL=options-parsing.utils.js.map