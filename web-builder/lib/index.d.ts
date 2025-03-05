export * from './utils';
/**
 * 定义配置
 * @param config 配置
 */
export declare function defineConfig(config: Config): Config;
export interface Config {
    /** 应用名称 */
    name?: string;
    /** 服务 */
    services?: {
        /** 服务名称 */
        name: string;
        /** openAPI 文档地址 */
        openAPIDoc: string;
        /** 码云配置 */
        gitee?: {
            /** 所属 */
            owner: string;
            /** 仓库 */
            repo: string;
            /** 分支，默认为 `master` */
            branch?: string;
        };
    }[];
    /** 模板 */
    template: {
        /** 服务模板 */
        service: {
            /**
             * 服务资源模板生成器
             * @description 类型为 `(requests: Request[]) => TemplateFile[] | Promise<TemplateFile[]>`
             */
            resource: string;
        };
        /** 组件模板 */
        components?: {
            /** 组件模板名称 */
            name: string;
            /**
             * 组件模板生成器
             * @description 类型为 `() => TemplateFile[] | Promise<TemplateFile[]>`
             */
            generator: string;
        }[];
    };
    /** 部署 */
    deploy?: {
        /** 部署分支，默认为 `master` */
        branch?: string;
        /** 部署目录，默认为 `dist` */
        dir?: string;
        /** 远程主机 */
        host: string;
        /** 远程端口 */
        port: number;
        /** 远程路径 */
        path: string;
        /** 基础路径，默认为 `/` */
        base?: string;
    };
}
/**
 * 定义服务
 * @param config 配置
 */
export declare function defineService(config: ServiceConfig): ServiceConfig;
export interface ServiceConfig {
    /** 源 */
    origin: string;
}
/**
 * 定义虚拟API
 * @param config 配置
 */
export declare function defineMockAPI(config: MockAPIConfig): MockAPIConfig;
export declare type MockAPIConfig = Record<string, MockResponseHandle>;
export declare type MockResponseHandle = MockRespones | ((mockRequest: MockRequest) => MockRespones) | ((mockRequest: MockRequest) => Promise<MockRespones>);
export interface MockRequest {
    /** 头部 */
    headers: Record<string, any>;
    /** 参数 */
    params: Record<string, any>;
    /** 查询 */
    query: Record<string, any>;
    /** 主体 */
    body?: any;
}
export interface MockRespones {
    /** 状态码 */
    statusCode?: number;
    /** 头部 */
    headers?: Record<string, string | number | string[]>;
    /** 主体 */
    body: any;
}
