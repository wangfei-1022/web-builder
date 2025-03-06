import type { Schema, SchemaBase } from './service';
/**
 * 获取接口类型
 * @param schema 模型
 * @param options 选项
 */
export declare function getInterfaceType(schema?: Schema | SchemaBase, options?: {
    /** 对象缩进 */
    objectIndent?: number;
    /** 对象属性标记 */
    objectPropFlag?: 'default' | 'notNull' | 'notOptional';
}): string;
/**
 * 生成文件
 * @param templateFiles 模板文件
 */
export declare function generateFiles(templateFiles: TemplateFile[]): Promise<void>;
export interface TemplateFile {
    /** 生成路径 */
    dist: string;
    /** 内容 */
    content: EjsContent | string;
}
export interface EjsContent {
    /** 模板 */
    template: string;
    /** 数据 */
    data: Record<string, any>;
}
