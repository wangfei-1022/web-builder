/**
 * 命名分组
 * @param value 值
 */
export declare function groupingCase(value: string): string[];
/**
 * 获取分隔线命名
 * @param value 值
 * @param options 选项
 */
export declare function getSeparatorCase(value: string, options?: {
    /** 模式，默认为 `'default'` */
    mode?: 'default' | 'upper' | 'lower' | 'pascal';
    /** 分隔符，默认为 `'-'` */
    separator?: string;
}): string;
/**
 * 获取大驼峰命名
 * @param value 值
 */
export declare function getPascalCase(value: string): string;
/**
 * 获取小驼峰命名
 * @param value 值
 */
export declare function getCamelCase(value: string): string;
