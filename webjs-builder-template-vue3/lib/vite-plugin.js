"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const http_1 = require("http");
const https_1 = require("https");
const micromatch_1 = require("micromatch");
const os_1 = require("os");
const path_to_regexp_1 = require("path-to-regexp");
const querystring_1 = require("querystring");
const utils_1 = require("./utils");
/**
 * 云极科技前端应用 vite 插件
 */
function cortex() {
    const cwd = process.cwd();
    const serviceConfigFileGlob = (0, utils_1.joinPath)(cwd, 'src/services/*/config.ts');
    const serviceMockFileGlob = (0, utils_1.joinPath)(cwd, 'src/services/*/resources/*.mock.ts');
    let cortexConfig;
    let useDevConfig;
    return {
        name: 'cortex',
        config: async ({ server }, { mode }) => {
            cortexConfig = (0, utils_1.requirex)('cortex.config.ts');
            // 获取服务列表
            const serviceConfigPaths = await (0, fast_glob_1.default)(serviceConfigFileGlob);
            const services = [];
            await Promise.all(serviceConfigPaths.map(async (serviceConfigPath) => {
                try {
                    services.push({
                        name: serviceConfigPath.split('/').slice(-2)[0],
                        config: (0, utils_1.requirex)(serviceConfigPath),
                    });
                }
                catch (error) { }
            }));
            // 生成新的配置
            const newConfig = {
                define: {
                    __APP_NAME__: JSON.stringify(cortexConfig.name ?? 'Cortex App'),
                },
            };
            useDevConfig = mode === 'development' && process.env.NODE_ENV !== 'test';
            if (useDevConfig) {
                const protocol = server?.https ? 'https' : 'http';
                const host = (server?.host !== true && server?.host) || getNetworkAddress();
                const port = server?.port;
                const origin = (host && port) ? `${protocol}://${host}:${port}` : '';
                newConfig.server = { proxy: {} };
                services.forEach(({ name, config }) => {
                    // 生成服务源常量
                    const serviceOriginName = `__${(0, utils_1.getSeparatorCase)(name, { mode: 'upper', separator: '_' })}__`;
                    const servicePathPrefix = `/__services__/${name}`;
                    newConfig.define[serviceOriginName] = JSON.stringify(`${origin}${servicePathPrefix}`);
                    // 生成服务代理
                    if (config.origin) {
                        newConfig.server.proxy[`${servicePathPrefix}/`] = {
                            target: config.origin,
                            secure: false,
                            changeOrigin: true,
                            agent: config.origin.startsWith('https') ? new https_1.Agent() : new http_1.Agent(),
                            headers: {
                                Origin: config.origin,
                            },
                            rewrite: path => path.replace(new RegExp(`^${servicePathPrefix}`), ''),
                        };
                    }
                });
            }
            else {
                newConfig.base = cortexConfig.deploy?.base?.replace(/^(?!\/)|(?<!\/)$/g, '/') ?? '/';
                newConfig.esbuild = {
                    drop: ['console'],
                };
                services.forEach(({ name, config }) => {
                    // 生成服务源常量
                    const serviceOriginName = `__${(0, utils_1.getSeparatorCase)(name, { mode: 'upper', separator: '_' })}__`;
                    newConfig.define[serviceOriginName] = JSON.stringify(config.origin);
                });
            }
            return newConfig;
        },
        configureServer: async (server) => {
            if (!useDevConfig)
                return;
            // 跨域暴露所有响应属性
            const exposeHeaders = (_, response, next) => {
                response.setHeader('Access-Control-Expose-Headers', '*');
                next();
            };
            server.middlewares.use(exposeHeaders);
            const mockResources = {};
            // 定义更新虚拟资源方法
            const updateMockResources = async (mockFilePath) => {
                try {
                    await (0, promises_1.access)(mockFilePath);
                    const mockHandles = [];
                    const [mockName, mockRoot] = mockFilePath.slice(cwd.length).split('/').reverse().slice(2);
                    const mockPathPrefix = `/__${mockRoot}__/${mockName}`;
                    const mockAPIConfig = (0, utils_1.requirex)(mockFilePath);
                    Object.entries(mockAPIConfig).forEach(([key, mockResponseHandle]) => {
                        const mockArgs = key.split(/ +/);
                        const mockMethod = mockArgs.length > 1 ? mockArgs[0].toUpperCase() : 'GET';
                        const mockPath = (0, utils_1.joinPath)(mockPathPrefix, mockArgs.pop());
                        const mockMatch = (0, path_to_regexp_1.match)(mockPath, { decode: decodeURIComponent });
                        mockHandles.push(async (request, response) => {
                            // 验证请求方法
                            if (request.method !== mockMethod)
                                return false;
                            // 验证请求路径
                            const [requestPath, requestQuery] = request.url.split('?');
                            const matchResult = mockMatch(requestPath);
                            if (!matchResult)
                                return false;
                            // 获取虚拟响应
                            const mockRequest = {
                                headers: request.headers,
                                params: matchResult.params,
                                query: (0, querystring_1.parse)(requestQuery),
                                body: await new Promise(resolve => {
                                    let bodyRaw;
                                    request.on('data', chuck => {
                                        bodyRaw = (bodyRaw ?? '') + chuck;
                                    });
                                    request.on('end', async () => {
                                        try {
                                            resolve(JSON.parse(bodyRaw));
                                        }
                                        catch (error) {
                                            resolve(bodyRaw);
                                        }
                                    });
                                }),
                            };
                            let mockResponse;
                            try {
                                mockResponse = await (typeof mockResponseHandle === 'function'
                                    ? mockResponseHandle(mockRequest)
                                    : mockResponseHandle);
                            }
                            catch (error) {
                                mockResponse = { statusCode: 500, body: error };
                            }
                            // 更新响应状态
                            if (mockResponse.statusCode) {
                                response.statusCode = mockResponse.statusCode;
                            }
                            // 更新响应主体
                            if (mockResponse.body !== null) {
                                if (typeof mockResponse.body === 'string') {
                                    mockResponse.headers = {
                                        contentType: 'text/plain;charset=UTF-8',
                                        ...mockResponse.headers,
                                    };
                                }
                                else {
                                    mockResponse.headers = {
                                        contentType: 'application/json',
                                        ...mockResponse.headers,
                                    };
                                }
                            }
                            // 更新响应头部
                            if (mockResponse.headers) {
                                for (const [key, value] of Object.entries(mockResponse.headers)) {
                                    const name = (0, utils_1.getSeparatorCase)(key, { mode: 'pascal' });
                                    response.setHeader(name, value);
                                }
                                if (mockResponse.headers.contentType === 'application/json') {
                                    response.write(JSON.stringify(mockResponse.body));
                                }
                                else {
                                    response.write(mockResponse.body);
                                }
                            }
                            // 结束响应
                            await new Promise(resolve => response.end(resolve));
                            return true;
                        });
                    });
                    mockResources[mockFilePath] = mockHandles;
                }
                catch (error) {
                    delete mockResources[mockFilePath];
                }
            };
            // 获取所有虚拟资源
            const mockFilePaths = await (0, fast_glob_1.default)(serviceMockFileGlob);
            await Promise.all(mockFilePaths.map(updateMockResources));
            // 定义虚拟资源API中间件
            const mockAPI = async (request, response, next) => {
                const mockHandles = Object.values(mockResources).flat();
                for (const mockHandle of mockHandles) {
                    if (await mockHandle(request, response))
                        return;
                }
                next();
            };
            // 使用虚拟资源API中间件
            server.middlewares.use(mockAPI);
            // 监听服务相关文件
            let hasServiceConfigFile = false;
            let changeMockFilePaths = {};
            let changeHandleTimer;
            const serviceWatcher = (0, fs_1.watch)('.', { recursive: true }, (_, fileName) => {
                clearTimeout(changeHandleTimer);
                if (fileName) {
                    const filePath = (0, utils_1.joinPath)(cwd, fileName ?? '');
                    if ((0, micromatch_1.isMatch)(filePath, serviceConfigFileGlob)) {
                        hasServiceConfigFile = true;
                    }
                    if ((0, micromatch_1.isMatch)(filePath, serviceMockFileGlob)) {
                        changeMockFilePaths[filePath] = true;
                    }
                }
                changeHandleTimer = setTimeout(() => {
                    if (hasServiceConfigFile) {
                        // 重启开发服务器
                        serviceWatcher.close();
                        server.restart();
                    }
                    else {
                        // 更新虚拟资源
                        Object.keys(changeMockFilePaths).forEach(mockFilePath => {
                            updateMockResources(mockFilePath);
                        });
                        changeMockFilePaths = {};
                    }
                }, 200);
            });
        },
        transformIndexHtml: html => {
            return {
                html: html
                    .replace(/__APP_NAME__/g, cortexConfig.name ?? 'Cortex App'),
                tags: [
                    {
                        tag: 'meta',
                        attrs: { name: 'version', content: '__APP_VERSION__' },
                        injectTo: 'head',
                    },
                    {
                        tag: 'meta',
                        attrs: { name: 'last-modified-time', content: '__APP_LAST_MODIFIED_TIME__' },
                        injectTo: 'head',
                    },
                ],
            };
        },
    };
}
exports.default = cortex;
/**
 * 获取网络地址
 */
function getNetworkAddress() {
    return Object.values((0, os_1.networkInterfaces)())
        .flat()
        .find(networkInterface => (networkInterface?.family === 'IPv4' &&
        networkInterface.internal === false &&
        networkInterface.mac !== '00:00:00:00:00:00' &&
        networkInterface.cidr !== null))
        ?.address;
}
