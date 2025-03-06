"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSerivces = exports.getServices = exports.parseJDL = exports.parseOpenAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const promises_1 = require("fs/promises");
const openapi_types_1 = require("openapi-types");
const pluralize_1 = __importDefault(require("pluralize"));
const signale_1 = require("signale");
const file_1 = require("./file");
const string_1 = require("./string");
const template_1 = require("./template");
const { type } = require("os");
/**
 * 解析 OpenAPI
 * @param service 服务
 * @param doc 文档
 * @param entities 实体
 */
function parseOpenAPI(service, doc, entities) {
    debugger
    // 实体记录
    const entityRecord = entities
        ? Object.fromEntries(entities?.map(entity => [entity.name, {
                extra: entity.extra,
                propertyRecord: Object.fromEntries(entity.properties.map((property, propertyIndex) => [property.name, {
                        sequence: propertyIndex + 1,
                        extra: property.extra,
                    }])),
            }]))
        : {};
    // 生成模型
    const schemas = Object
        .entries(doc.components?.schemas ?? {})
        .map(([schemaName, openAPISchema]) => {
        const entityName = schemaName.replace(/(DTO|VM|VO|Dto)$/, '');
        const entity = entityRecord[entityName];
        const schema = generateSchema(openAPISchema, schemaName.endsWith('VO'));
        schema.service = service;
        schema.name = schemaName;
        schema.description = '$ref' in openAPISchema
            ? schemaName
            : (openAPISchema.description ||
                openAPISchema.title ||
                schemaName);
        schema.extra = {
            ...entity?.extra,
            Name: (0, string_1.getPascalCase)(entityName),
            Names: (0, pluralize_1.default)((0, string_1.getPascalCase)(entityName)),
            name: (0, string_1.getCamelCase)(entityName),
            names: (0, pluralize_1.default)((0, string_1.getCamelCase)(entityName)),
        };
        if (schema.type === 'object') {
            schema.properties
                ?.sort((property_0, property_1) => {
                const property_0_sequence = property_0.name === 'id' ? 0 : entity?.propertyRecord[property_0.name]?.sequence ?? Infinity;
                const property_1_sequence = property_1.name === 'id' ? 0 : entity?.propertyRecord[property_1.name]?.sequence ?? Infinity;
                return property_0_sequence - property_1_sequence;
            })
                .forEach(property => {
                property.extra = {
                    ...entity?.propertyRecord[property.name]?.extra,
                    Name: (0, string_1.getPascalCase)(property.name),
                    Names: (0, pluralize_1.default)((0, string_1.getPascalCase)(property.name)),
                    name: (0, string_1.getCamelCase)(property.name),
                    names: (0, pluralize_1.default)((0, string_1.getCamelCase)(property.name)),
                };
            });
        }
        return schema;
    });
    // 生成请求对象
    const httpMethods = Object.values(openapi_types_1.OpenAPIV3.HttpMethods);
    const requests = Object.entries(doc.paths)
        .filter(([, openAPIPathSchema]) => openAPIPathSchema)
        .map(([path, openAPIPathSchema]) => {
        return Object.entries(openAPIPathSchema)
            .filter(([method]) => httpMethods.includes(method))
            .map(([method, openAPIMethodSchema]) => {
            const openAPIRequestParams = openAPIMethodSchema.parameters
                ?.filter(parameter => !('$ref' in parameter) && parameter.in === 'path');
            const openAPIRequestPuery = openAPIMethodSchema.parameters
                ?.filter(parameter => !('$ref' in parameter) && parameter.in === 'query');
            const [openAPIRequestBodyContentType, openAPIRequestBodyContent] = openAPIMethodSchema.requestBody &&
                !('$ref' in openAPIMethodSchema.requestBody) &&
                Object.entries(openAPIMethodSchema.requestBody.content)[0] ||
                [];
            const openAPIResponse = Object.entries(openAPIMethodSchema.responses)
                .find(([responseCode, response]) => responseCode.startsWith('2') && !('$ref' in response))?.[1];
            const openAPIResponseContent = openAPIResponse?.content && Object.values(openAPIResponse.content)[0];
            return {
                service,
                from: openAPIMethodSchema.tags ?? ['index-resource'],
                name: openAPIMethodSchema.operationId || 'anonymousFunction',
                description: openAPIMethodSchema.summary || '匿名方法',
                path: path.replace(/(?={[^}]+})/g, '$'),
                method: method.toUpperCase(),
                params: openAPIRequestParams?.length
                    ? openAPIRequestParams.map(param => ({
                        name: param.name,
                        description: param.description || param.name,
                        ...generateSchema(param.schema ?? {}),
                    }))
                    : undefined,
                query: openAPIRequestPuery?.length
                    ? openAPIRequestPuery.map(param => ({
                        name: param.name,
                        description: param.description || param.name,
                        ...generateSchema(param.schema ?? {}),
                        required: !!param.required,
                    }))
                    : undefined,
                queryRequired: openAPIRequestPuery?.length
                    ? !!openAPIRequestPuery?.find(param => param.required)
                    : undefined,
                body: openAPIRequestBodyContent?.schema
                    ? generateSchema(openAPIRequestBodyContent.schema)
                    : undefined,
                contentType: openAPIRequestBodyContentType,
                return: openAPIResponseContent?.schema
                    ? generateSchema(openAPIResponseContent.schema)
                    : undefined,
            };
        });
    })
        .flat();
    return {
        schemas,
        requests,
    };
}
exports.parseOpenAPI = parseOpenAPI;
/**
 * 生成模型
 * @param openAPISchema
 * @param isViewSchema
 */
function generateSchema(openAPISchema, isViewSchema = false) {
    if ('$ref' in openAPISchema) {
        return {
            type: 'ref',
            refType: openAPISchema.$ref.split('/').pop(),
        };
    }
    else if (openAPISchema.type === 'array') {
        return {
            type: 'array',
            item: generateSchema(openAPISchema.items, isViewSchema),
        };
    }
    else if (openAPISchema.type === 'object') {
        return {
            type: 'object',
            properties: openAPISchema.properties && Object.entries(openAPISchema.properties)
                .map(([propertySchemaName, openAPIPropertySchema]) => {
                const required = isViewSchema || openAPISchema.required?.includes(propertySchemaName) || false;
                return {
                    name: propertySchemaName,
                    description: '$ref' in openAPIPropertySchema
                        ? propertySchemaName
                        : openAPIPropertySchema.description || openAPIPropertySchema.title || propertySchemaName,
                    required,
                    rules: [
                        required && { key: 'required', value: 'true', message: '此项为必填项' },
                        'minLength' in openAPIPropertySchema && openAPIPropertySchema.minLength && { key: 'minLength', value: `${openAPIPropertySchema.minLength}`, message: `最少${openAPIPropertySchema.minLength}个字符` },
                        'maxLength' in openAPIPropertySchema && { key: 'maxLength', value: `${openAPIPropertySchema.maxLength}`, message: `最多${openAPIPropertySchema.maxLength}个字符` },
                        'minimum' in openAPIPropertySchema && { type: 'number', key: 'min', value: `${openAPIPropertySchema.minimum}`, message: `最小值为${openAPIPropertySchema.minimum}` },
                        'maximum' in openAPIPropertySchema && { type: 'number', key: 'max', value: `${openAPIPropertySchema.maximum}`, message: `最大值为${openAPIPropertySchema.maximum}` },
                    ]
                        .filter(rule => rule),
                    ...generateSchema(openAPIPropertySchema, isViewSchema),
                };
            }),
        };
    }
    else if (openAPISchema.type) {
        return {
            type: openAPISchema.type === 'integer' ? 'number' : openAPISchema.type,
            format: openAPISchema.format,
        };
    }
    return { type: 'any' };
}
;
/**
 * 解析 JDL
 * @param content 内容
 */
function parseJDL(content) {
    const entities = [];
    let currentEntity;
    let nextDescription;
    let nextExtra;
    let currentContent = content;
    while (currentContent.length > 0) {
        // 获取实体
        if (currentContent.startsWith('entity ')) {
            const [matchWords, entityName] = currentContent.match(/^entity[ \r\n]+([A-Z][A-Za-z0-9]*)[ \r\n]*{/);
            entities.push(currentEntity = {
                name: entityName,
                description: nextDescription,
                extra: nextExtra,
                properties: [],
            });
            nextDescription = undefined;
            nextExtra = undefined;
            currentContent = currentContent.slice(matchWords.length);
        }
        if (currentContent.startsWith('}')) {
            currentEntity = undefined;
            nextDescription = undefined;
            nextExtra = undefined;
            currentContent = currentContent.slice(1);
        }
        // 获取实体属性
        if (currentEntity && /^[a-z][A-Za-z0-9]+/.test(currentContent)) {
            const [fieldRaw, fieldName] = currentContent.match(/^([a-z][A-Za-z0-9]+) +[^\r\n]*/);
            const field = {
                name: fieldName,
                description: nextDescription,
                extra: nextExtra,
            };
            if (field.extra?.filter === true || field.extra?.filter === 'inMore') {
                if (!field.extra.filterRender && field.extra.inputRender) {
                    field.extra.filterRender = field.extra.inputRender;
                }
            }
            currentEntity.properties.push(field);
            currentContent = currentContent.slice(fieldRaw.length);
        }
        // 获取多行注释
        if (currentContent.startsWith('/*')) {
            const multilineCommentRaw = currentContent.match(/^\/\*((?<!\*\/)[\W\w])*\*\//)[0];
            const multilineComment = multilineCommentRaw
                .replace(/^\/\*[* ]*|[* ]*\*\/$|(?<=[\r\n]+)[* ]+|[* ]+(?=[\r\n]+)/g, '')
                .split(/[\r\n]+/)
                .filter(item => item);
            nextDescription = multilineComment[0];
            nextExtra = undefined;
            currentContent = currentContent.slice(multilineCommentRaw.length);
        }
        // 获取单行注释
        if (currentContent.startsWith('//')) {
            const singleLineCommentRaw = currentContent.match(/^\/{2}[^\r\n]*/)[0];
            const singleLineComment = singleLineCommentRaw.replace(/^\/{2}/, '').trim();
            if (/[:：]/.test(singleLineComment)) {
                const restoreString = (value) => value?.replace(/\\[,，:：、]/g, words => words.slice(1)) || '';
                nextExtra = {
                    ...nextExtra,
                    ...Object.fromEntries(singleLineComment
                        .split(/(?<!\\)[,，]/)
                        .map(item => {
                        const keyAndValue = item.trim().split(/(?<!\\) *[:：] */);
                        keyAndValue[0] = restoreString(keyAndValue[0]);
                        if (keyAndValue[0] === 'options') {
                            if (keyAndValue[1] === 'dict') {
                                keyAndValue[0] = 'optionsFromDict';
                                keyAndValue[1] = keyAndValue[2];
                            }
                            else if (keyAndValue[1] === 'entity') {
                                const [entityName, entityField] = keyAndValue[2]?.split('.') ?? [];
                                keyAndValue[0] = 'optionsFromEntity';
                                keyAndValue[1] = entityName
                                    ? { name: entityName, field: entityField }
                                    : undefined;
                            }
                            else {
                                keyAndValue[1] = keyAndValue[1].split(/(?<!\\)、/).map(item => restoreString(item));
                            }
                        }
                        if (/^(\d+|true|false)$/.test(keyAndValue[1])) {
                            keyAndValue[1] = JSON.parse(keyAndValue[1]);
                        }
                        if (typeof keyAndValue[1] === 'string') {
                            keyAndValue[1] = restoreString(keyAndValue[1]);
                        }
                        return keyAndValue;
                    })),
                };
            }
            currentContent = currentContent.slice(singleLineCommentRaw.length);
        }
        currentContent = currentContent.slice(1);
    }
    return entities;
}
exports.parseJDL = parseJDL;
/**
 * 获取服务
 */
async function getServices() {
    const servicesRoot = (0, file_1.joinPath)(process.cwd(), 'src/services');
    let serviceNames;
    try {
        serviceNames = await (0, promises_1.readdir)(servicesRoot);
    }
    catch (error) {
        serviceNames = [];
    }
    if (serviceNames.length === 0)
        throw Error('请生成服务后再进行操作');
    return Promise.all(serviceNames.map(async (serviceName) => {
        const serviceDocPath = (0, file_1.joinPath)(servicesRoot, serviceName, 'doc.json');
        const serviceDoc = require(serviceDocPath);
        const serviceJDLFileGlob = (0, file_1.joinPath)(servicesRoot, serviceName, 'jdl/*.jh');
        const serviceJDLFilePaths = await (0, fast_glob_1.default)(serviceJDLFileGlob);
        const serviceEntities = (await Promise.all(serviceJDLFilePaths.map(async (serviceJDLFilePath) => {
            const serviceJDLFileContent = await (0, promises_1.readFile)(serviceJDLFilePath, 'utf8');
            return parseJDL(serviceJDLFileContent);
        })))
            .flat();
        return {
            name: serviceName,
            ...parseOpenAPI(serviceName, serviceDoc, serviceEntities),
        };
    }));
}
exports.getServices = getServices;
/**
 * 生成服务
 * @param config 配置
 */
async function generateSerivces(config) {
    const { service } = global.config.template;
    // 顺序生成服务
    const { GITEE_ACCESS_TOKEN } = process.env;
    let sequence = Promise.resolve();
    config.forEach(({ name: serviceName, openAPIDoc, gitee }) => {
        sequence = sequence.then(async () => {
            const logger = new signale_1.Signale({ interactive: true, scope: serviceName });
            try {
                // 下载文档
                logger.await('正在下载文档');
                let serviceDoc = openAPIDoc.startsWith('http')
                    ? (await axios_1.default.get(openAPIDoc)).data
                    : JSON.parse(await (0, promises_1.readFile)(openAPIDoc, 'utf8'));
                // 转换文档
                if (!serviceDoc.openapi?.startsWith('3')) {
                    logger.await('正在转换文档');
                    serviceDoc = (await axios_1.default.post('https://converter.swagger.io/api/convert', serviceDoc)).data;
                }
                // 获取JDL
                let jdlFiles;
                if (gitee) {
                    // 获取分支目录树
                    const { owner, repo, branch = 'master' } = gitee;
                    const rootTreeResponse = await axios_1.default.get(`https://gitee.com/api/v5/repos/${owner}/${repo}/git/trees/${branch}?access_token=${GITEE_ACCESS_TOKEN}`);
                    // 获取jdl目录树
                    const jdlRootSha = rootTreeResponse.data.tree.find(treeNode => treeNode.path === 'jdl')?.sha;
                    if (!jdlRootSha)
                        throw Error('jdl 目录不存在');
                    const jdlTreeResponse = await axios_1.default.get(`https://gitee.com/api/v5/repos/${owner}/${repo}/git/trees/${jdlRootSha}?access_token=${GITEE_ACCESS_TOKEN}`);
                    // 获取jdl文件
                    jdlFiles = await Promise.all(jdlTreeResponse.data.tree
                        .filter(treeNode => !treeNode.path.startsWith('temp.'))
                        .map(async (treeNode) => {
                        const jdlFileResponse = await axios_1.default.get(`https://gitee.com/api/v5/repos/${owner}/${repo}/git/blobs/${treeNode.sha}?access_token=${GITEE_ACCESS_TOKEN}`);
                        return {
                            name: treeNode.path,
                            content: Buffer.from(jdlFileResponse.data.content, jdlFileResponse.data.encoding).toString(),
                        };
                    }));
                }
                // 解析数据
                const serviceOrigin = (0, string_1.getSeparatorCase)(serviceName, { mode: 'upper', separator: '_' });
                const entities = jdlFiles?.map(({ content }) => parseJDL(content)).flat();
                const { schemas, requests } = parseOpenAPI(serviceName, serviceDoc, entities);
                // 清空目录
                const servicePath = `src/services/${serviceName}`;
                await (0, promises_1.rm)(servicePath, { force: true, recursive: true, maxRetries: 3 });
                await new Promise(resolve => setTimeout(resolve, 200));
                logger.await('正在生成服务');
                // 生成文档
                const docPath = `${servicePath}/doc.json`;
                await (0, file_1.distFile)(docPath, serviceDoc);
                if (jdlFiles) {
                    await Promise.all(jdlFiles.map(({ name, content }) => {
                        const jdlPath = `${servicePath}/jdl/${name}`;
                        return (0, file_1.distFile)(jdlPath, content);
                    }));
                }
                // 生成声明
                const typingsDist = `${servicePath}/typings.d.ts`;
                const typingsContentSegments = [];
                typingsContentSegments.push(`/** ${serviceDoc.info?.title || serviceName} */`);
                typingsContentSegments.push(`declare const __${serviceOrigin}__: string;`);
                const typingsContent = typingsContentSegments.join('\n');
                await (0, file_1.distFile)(typingsDist, typingsContent);
                // 生成配置
                const configDist = `${servicePath}/config.ts`;
                const configContentSegments = [];
                configContentSegments.push('import { defineService } from \'@cloudplex/cortex\';');
                configContentSegments.push('');
                configContentSegments.push('export default defineService({');
                configContentSegments.push(`  origin: '${serviceDoc.servers?.[0]?.url || ''}',`);
                configContentSegments.push('});');
                const configContent = configContentSegments.join('\n');
                await (0, file_1.distFile)(configDist, configContent);
                // 生成接口
                const interfacesDist = `${servicePath}/interfaces.ts`;
                const interfacesContent = schemas
                    .map(schema => {
                    const typeSegments = [];
                    typeSegments.push(`/** ${schema.description} */`);
                    typeSegments.push(`export type ${schema.name} = ${(0, template_1.getInterfaceType)(schema)};`);
                    return typeSegments.join('\n');
                })
                    .join('\n\n');
                await (0, file_1.distFile)(interfacesDist, interfacesContent);
                // 生成资源
                const resourceTemplateFiles = await (0, file_1.requirex)(service.resource)(requests);
                await (0, template_1.generateFiles)(resourceTemplateFiles.map(({ ...resourceTemplateFile }) => {
                    resourceTemplateFile.dist = (0, file_1.joinPath)(servicePath, resourceTemplateFile.dist);
                    return resourceTemplateFile;
                }));
                // 生成索引
                const indexDist = `${servicePath}/index.ts`;
                const indexContentSegments = [];
                indexContentSegments.push('export * from \'./interfaces\';');
                resourceTemplateFiles.forEach(({ dist }) => {
                    indexContentSegments.push(`export * from '${dist.slice(0, -3)}';`);
                });
                const indexContent = indexContentSegments.join('\n');
                await (0, file_1.distFile)(indexDist, indexContent);
                logger.success('生成服务成功');
            }
            catch (error) {
                logger.error(error);
            }
            process.stdout.write('\n');
        });
    });
    await sequence;
}
exports.generateSerivces = generateSerivces;
