"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = exports.getInterfaceType = void 0;
const ejs_1 = require("ejs");
const file_1 = require("./file");
/**
 * 获取接口类型
 * @param schema 模型
 * @param options 选项
 */
function getInterfaceType(schema, options) {
    const { objectIndent = 0, objectPropFlag } = options ?? {};
    if (!schema)
        return 'void';
    switch (schema.type) {
        case 'string':
            switch (schema.format) {
                case 'byte':
                case 'binary': return 'Blob';
                default: return schema.type;
            }
        case 'object':
            if (schema.properties) {
                const typeSegments = [];
                typeSegments.push('{');
                schema.properties.map(property => {
                    const currentObjectIndent = objectIndent + 2;
                    const currentObjectIndentContent = ' '.repeat(currentObjectIndent);
                    typeSegments.push(`${currentObjectIndentContent}/** ${property.description} */`);
                    typeSegments.push(property.required
                        ? `${currentObjectIndentContent}${property.name}: ${getInterfaceType(property, { objectIndent: currentObjectIndent, objectPropFlag })};`
                        : objectPropFlag === 'notOptional'
                            ? `${currentObjectIndentContent}${property.name}: ${getInterfaceType(property, { objectIndent: currentObjectIndent, objectPropFlag })} | undefined;`
                            : objectPropFlag === 'notNull'
                                ? `${currentObjectIndentContent}${property.name}?: ${getInterfaceType(property, { objectIndent: currentObjectIndent, objectPropFlag })};`
                                : `${currentObjectIndentContent}${property.name}?: ${getInterfaceType(property, { objectIndent: currentObjectIndent, objectPropFlag })} | null;`);
                });
                typeSegments.push(`${' '.repeat(objectIndent)}}`);
                return typeSegments.join('\n');
            }
            return 'any';
        case 'ref': return schema.refType;
        case 'array': return `${getInterfaceType(schema.item)}[]`;
        default: return schema.type;
    }
}
exports.getInterfaceType = getInterfaceType;
/**
 * 生成文件
 * @param templateFiles 模板文件
 */
async function generateFiles(templateFiles) {
    await Promise.all(templateFiles.map(async (templateFile) => {
        const resourceContent = (typeof templateFile.content === 'string'
            ? templateFile.content
            : await (0, ejs_1.renderFile)(templateFile.content.template, templateFile.content.data))
            .replace(/\n$/, '');
        return (0, file_1.distFile)(templateFile.dist, resourceContent);
    }));
}
exports.generateFiles = generateFiles;
