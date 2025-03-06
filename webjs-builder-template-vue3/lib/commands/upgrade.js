"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const deepmerge_1 = __importDefault(require("deepmerge"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const promises_1 = require("fs/promises");
const os_1 = require("os");
const path_1 = require("path");
const signale_1 = require("signale");
const util_1 = require("util");
const execx = (0, util_1.promisify)(child_process_1.exec);
/**
 * 升级
 */
async function upgrade() {
    const logger = new signale_1.Signale({ interactive: true });
    try {
        const cwd = process.cwd();
        const packageConfig = require((0, path_1.join)(cwd, 'package.json'));
        const templateName = packageConfig.template?.name;
        if (!templateName) {
            logger.error('找不到模板信息');
            return;
        }
        // 创建临时目录
        const tempPath = await (0, promises_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), 'cortex-app-'));
        // 下载模板
        logger.await('正在检查更新');
        await execx(`git clone --depth=1 https://gitee.com/cloudplex/${templateName}.git`, { cwd: tempPath });
        const templateRoot = (0, path_1.join)(tempPath, templateName);
        const templatePackageConfig = require((0, path_1.join)(templateRoot, 'package.json'));
        if (templatePackageConfig.version !== packageConfig.template.version) {
            // 更新 package.json
            const { name, version, author, homepage, ...otherConfig } = templatePackageConfig;
            const packageConfigNew = (0, deepmerge_1.default)(packageConfig, {
                template: { name, version, author, homepage },
                ...otherConfig,
            });
            const dependencySort = ([key_0], [key_1]) => {
                if (key_0 < key_1)
                    return -1;
                if (key_0 > key_1)
                    return 1;
                return 0;
            };
            packageConfigNew.dependencies = Object.fromEntries(Object.entries(packageConfigNew.dependencies).sort(dependencySort));
            packageConfigNew.devDependencies = Object.fromEntries(Object.entries(packageConfigNew.devDependencies).sort(dependencySort));
            // 复制文件
            logger.await('正在更新');
            await (0, promises_1.writeFile)((0, path_1.join)(cwd, 'package.json'), JSON.stringify(packageConfigNew, undefined, '  '));
            const templateFilePaths = await (0, fast_glob_1.default)('**/*', {
                cwd: templateRoot.replace(/\\/g, '/'),
                dot: true,
                ignore: [
                    '.git',
                    'package.json',
                    'cortex.config.ts',
                    'src/pages/Welcome/Welcome.vue',
                ],
            });
            await Promise.all(templateFilePaths.map(async (path) => {
                const dest = (0, path_1.join)(cwd, path);
                await (0, promises_1.mkdir)((0, path_1.dirname)(dest), { recursive: true });
                await (0, promises_1.copyFile)((0, path_1.join)(templateRoot, path), dest);
            }));
            // 删除临时目录
            await (0, promises_1.rm)(tempPath, { force: true, recursive: true, maxRetries: 3 });
            logger.success('更新成功');
        }
        else {
            logger.success('已是最新版本');
        }
    }
    catch (error) {
        logger.error(error);
    }
}
exports.default = upgrade;
