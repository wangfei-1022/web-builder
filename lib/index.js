"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const fast_glob_1 = __importDefault(require("fast-glob"));
const child_process_1 = require("child_process");
const promises_1 = require("fs/promises");
const inquirer_1 = __importDefault(require("inquirer"));
const os_1 = require("os");
const path_1 = require("path");
const signale_1 = require("signale");
const util_1 = require("util");
const execx = (0, util_1.promisify)(child_process_1.exec);
/**
 * 创建应用
 */
function createApp() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const logger = new signale_1.Signale({ interactive: true });
        try {
            const { appName } = yield inquirer_1.default.prompt([
                {
                    message: '请输入应用名称:',
                    name: 'appName',
                    type: 'input',
                    validate: (value) => {
                        if (!value)
                            return '应用名称不可为空';
                        if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value))
                            return '应用名称不合法';
                        return true;
                    },
                },
            ]);
            const cwd = process.cwd();
            const appRoot = (0, path_1.join)(cwd, appName);
            try {
                yield (0, promises_1.access)(appRoot);
                logger.error(`应用 ${appName} 已存在！${(0, ansi_colors_1.gray)('如需升级应用模板，请在应用根目录运行 pnpm run upgrade 命令。')}`);
                return;
            }
            catch (error) {
                // 目录不存在，继续执行
            }
            const templateChoices = [
                { name: '桌面应用Vue2', value: 'esit-frontend' },
                { name: '桌面应用Vue3', value: 'esit-frontend' },
                { name: '移动应用', value: 'esit-frontend' },
            ];
            const { templateName } = yield inquirer_1.default.prompt([
                {
                    message: '请选择模板:',
                    name: 'templateName',
                    type: 'list',
                    choices: templateChoices,
                },
            ]);
            const tempPath = yield (0, promises_1.mkdir)((0, os_1.tmpdir)() + '/webjs-temp', {
                recursive: true,
            });
            if (!tempPath) {
                return;
            }
            // 下载模板
            logger.await('正在下载');
            yield execx(`git clone --depth=1 http://gitlab.tuochetong.com/root/${templateName}.git`, { cwd: tempPath });
            const templateRoot = (0, path_1.join)(tempPath, templateName);
            // 动态导入 package.json 文件
            const templatePackageConfig = yield (_a = (0, path_1.join)(templateRoot, 'package.json'), Promise.resolve().then(() => __importStar(require(_a))));
            const { name, version, author, homepage } = templatePackageConfig, otherConfig = __rest(templatePackageConfig, ["name", "version", "author", "homepage"]);
            const packageConfigNew = Object.assign(Object.assign({ name: appName, version: '0.0.0' }, otherConfig), { private: true, template: { name, version, author, homepage } });
            // 复制文件
            logger.await('正在安装');
            yield (0, promises_1.mkdir)(appRoot, { recursive: true });
            yield (0, promises_1.writeFile)((0, path_1.join)(appRoot, 'package.json'), JSON.stringify(packageConfigNew, undefined, '  '));
            const templateFilePaths = yield (0, fast_glob_1.default)('**/*', {
                cwd: templateRoot.replace(/\\/g, '/'),
                dot: true,
                ignore: ['.git', 'package.json'],
            });
            yield Promise.all(templateFilePaths.map((path) => __awaiter(this, void 0, void 0, function* () {
                const dest = (0, path_1.join)(appRoot, path);
                yield (0, promises_1.mkdir)((0, path_1.join)(dest, '..'), { recursive: true });
                yield (0, promises_1.copyFile)((0, path_1.join)(templateRoot, path), dest);
            })));
            // 删除临时目录
            yield (0, promises_1.rm)(tempPath, { force: true, recursive: true, maxRetries: 3 });
            logger.success('创建应用成功！');
            // 输出完成信息
            process.stdout.write('\n');
            process.stdout.write('请从以下指令开始：\n');
            process.stdout.write('\n');
            process.stdout.write(`  ${(0, ansi_colors_1.cyan)('cd')} ${appName}\n`);
            process.stdout.write(`  ${(0, ansi_colors_1.cyan)('pnpm install')}\n`);
            process.stdout.write('\n');
            process.stdout.write(`${(0, ansi_colors_1.gray)('更多内容请查看')} README.md ${(0, ansi_colors_1.gray)('文件。')}\n`);
        }
        catch (error) {
            logger.error(error);
        }
    });
}
createApp();
