"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distFile = exports.joinPath = exports.requirex = void 0;
const esbuild_1 = require("esbuild");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const packageConfig = require('../../package.json');
/**
 * 加载模块
 * @param path 路径
 */
function requirex(path) {
    const filePath = (0, path_1.resolve)(path);
    const extension = (0, path_1.extname)(filePath);
    if (extension === '.ts') {
        // 构建commonjs模块
        const buildResult = (0, esbuild_1.buildSync)({
            entryPoints: [filePath],
            external: [packageConfig.name],
            outfile: '__tempFile.js',
            write: false,
            platform: 'node',
            bundle: true,
            format: 'cjs',
            metafile: true,
            target: 'es2015',
        });
        const bundledCode = buildResult.outputFiles[0].text;
        // 保存默认加载器
        const defaultLoader = require.extensions[extension];
        // 更新加载器
        require.extensions[extension] = (module, filename) => {
            if (filename === filePath) {
                module._compile(bundledCode, filename);
            }
            else {
                defaultLoader?.(module, filename);
            }
        };
        // 加载模块
        delete require.cache[filePath];
        const raw = require(filePath);
        // 恢复默认加载器
        require.extensions[extension] = defaultLoader;
        return raw.default ?? raw;
    }
    else {
        // 加载模块
        delete require.cache[filePath];
        const raw = require(filePath);
        return raw.default ?? raw;
    }
}
exports.requirex = requirex;
/**
 * 拼接路径
 * @param paths 路径
 */
function joinPath(...paths) {
    return (0, path_1.join)(...paths).replace(/\\/g, '/');
}
exports.joinPath = joinPath;
/**
 * 生成文件
 * @param path 路径
 * @param data 数据
 */
async function distFile(path, data) {
    const content = typeof data === 'string' ? data : JSON.stringify(data, undefined, '  ');
    await (0, promises_1.mkdir)((0, path_1.dirname)(path), { recursive: true });
    await (0, promises_1.writeFile)(path, content);
}
exports.distFile = distFile;
