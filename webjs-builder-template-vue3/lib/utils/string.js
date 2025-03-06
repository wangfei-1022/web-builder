"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCamelCase = exports.getPascalCase = exports.getSeparatorCase = exports.groupingCase = void 0;
/**
 * 命名分组
 * @param value 值
 */
function groupingCase(value) {
    return value
        .split(/[^A-Za-z0-9]+/)
        .reduce((group, item) => {
        const matchs = item.match(/([A-Z][a-z]+|[A-Z][A-Z]+|[a-z][a-z]+|[A-Z]+|[a-z]+|\d+)/g);
        if (matchs)
            return group.concat(matchs);
        return group;
    }, []);
}
exports.groupingCase = groupingCase;
/**
 * 获取分隔线命名
 * @param value 值
 * @param options 选项
 */
function getSeparatorCase(value, options) {
    const { separator = '-', mode } = options ?? {};
    const group = groupingCase(value);
    switch (mode) {
        case 'upper': return group.join(separator).toUpperCase();
        case 'lower': return group.join(separator).toLowerCase();
        case 'pascal': return group
            .map(item => `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`)
            .join(separator);
        default: return group.join(separator);
    }
}
exports.getSeparatorCase = getSeparatorCase;
/**
 * 获取大驼峰命名
 * @param value 值
 */
function getPascalCase(value) {
    return groupingCase(value)
        .map(item => /^[A-Z0-9]+$/.test(item) ? item : `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`)
        .join('');
}
exports.getPascalCase = getPascalCase;
/**
 * 获取小驼峰命名
 * @param value 值
 */
function getCamelCase(value) {
    return groupingCase(value)
        .map((item, index) => {
        if (index === 0)
            return item.toLowerCase();
        return /^[A-Z0-9]+$/.test(item) ? item : `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`;
    })
        .join('');
}
exports.getCamelCase = getCamelCase;
