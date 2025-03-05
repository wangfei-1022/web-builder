import { OpenAPIV3 } from 'openapi-types';
import type { Config } from '..';
/**
 * 解析 OpenAPI
 * @param service 服务
 * @param doc 文档
 * @param entities 实体
 */
export declare function parseOpenAPI(service: string, doc: OpenAPIV3.Document, entities?: Entity[]): {
    schemas: Schema[];
    requests: Request[];
};
export declare type Entity = {
    /** 名称 */
    name: string;
    /** 描述 */
    description: string | undefined;
    /** 属性 */
    properties: EntityProperty[];
    /** 额外属性 */
    extra: Record<string, any> | undefined;
};
export declare type EntityProperty = {
    /** 名称 */
    name: string;
    /** 描述 */
    description: string | undefined;
    /** 额外属性 */
    extra: Record<string, any> | undefined;
};
export declare type Schema = (CommonSchema | ObjectSchema | ArraySchema | RefSchema | UnknownSchema) & {
    /** 服务 */
    service: string;
    /** 名称 */
    name: string;
    /** 描述 */
    description: string;
    /** 额外 */
    extra: SchemaExtra;
};
export declare type CommonSchema = CommonSchemaBase;
export declare type ObjectSchema = {
    /** 类型 */
    type: 'object';
    /** 属性 */
    properties?: ObjectSchemaProperty[];
};
export declare type ObjectSchemaProperty = ObjectSchemaBaseProperty & {
    /** 额外 */
    extra: SchemaExtra;
};
export declare type ArraySchema = ArraySchemaBase;
export declare type RefSchema = RefSchemaBase;
export declare type UnknownSchema = UnknownSchemaBase;
export declare type SchemaExtra = {
    [key: string]: any;
    /** 名称（大驼峰命名） */
    Name: string;
    /** 名称（大驼峰命名+复数形式） */
    Names: string;
    /** 名称（小驼峰命名） */
    name: string;
    /** 名称（小驼峰命名+复数形式） */
    names: string;
};
export declare type SchemaBase = CommonSchemaBase | ObjectSchemaBase | ArraySchemaBase | RefSchemaBase | UnknownSchemaBase;
export declare type CommonSchemaBase = {
    /** 类型 */
    type: 'string' | 'number' | 'boolean';
    /** 格式 */
    format?: string;
};
export declare type ObjectSchemaBase = {
    /** 类型 */
    type: 'object';
    /** 属性 */
    properties?: ObjectSchemaBaseProperty[];
};
export declare type ObjectSchemaBaseProperty = SchemaBase & {
    /** 名称 */
    name: string;
    /** 描述 */
    description: string;
    /** 必填 */
    required: boolean;
    /** 规则 */
    rules: ObjectSchemaBasePropertyRule[];
};
export declare type ObjectSchemaBasePropertyRule = {
    /** 类型 */
    type?: 'string' | 'number' | 'boolean';
    /** 规则键 */
    key: string;
    /** 规则值 */
    value: string;
    /** 提示消息 */
    message: string;
};
export declare type ArraySchemaBase = {
    /** 类型 */
    type: 'array';
    /** 子级 */
    item: SchemaBase;
};
export declare type RefSchemaBase = {
    /** 类型 */
    type: 'ref';
    /** 引用类型 */
    refType: string;
};
export declare type UnknownSchemaBase = {
    /** 类型 */
    type: 'any';
};
/** 请求 */
export declare type Request = {
    /** 服务 */
    service: string;
    /** 来自 */
    from: string[];
    /** 名称 */
    name: string;
    /** 服务 */
    description: string;
    /** 路由 */
    path: string;
    /** 方法 */
    method: string;
    /** 参数 */
    params?: RequestParam[];
    /** 查询参数 */
    query?: RequestQuery[];
    /** 查询参数必填 */
    queryRequired?: boolean;
    /** 主体 */
    body?: SchemaBase;
    /** 内容类型 */
    contentType?: string;
    /** 返回 */
    return?: SchemaBase;
};
export declare type RequestParam = SchemaBase & {
    /** 名称 */
    name: string;
    /** 描述 */
    description: string;
};
export declare type RequestQuery = SchemaBase & {
    /** 名称 */
    name: string;
    /** 描述 */
    description: string;
    /** 必填 */
    required: boolean;
};
/**
 * 解析 JDL
 * @param content 内容
 */
export declare function parseJDL(content: string): Entity[];
/**
 * 获取服务
 */
export declare function getServices(): Promise<Service[]>;
export interface Service {
    /** 服务名称 */
    name: string;
    /** 模型 */
    schemas: Schema[];
    /** 请求 */
    requests: Request[];
}
/**
 * 生成服务
 * @param config 配置
 */
export declare function generateSerivces(config: NonNullable<Config['services']>): Promise<void>;
