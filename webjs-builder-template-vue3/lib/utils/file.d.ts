/**
 * 加载模块
 * @param path 路径
 */
export declare function requirex<ResultType = any>(path: string): ResultType;
/**
 * 拼接路径
 * @param paths 路径
 */
export declare function joinPath(...paths: string[]): string;
/**
 * 生成文件
 * @param path 路径
 * @param data 数据
 */
export declare function distFile(path: string, data: any): Promise<void>;
