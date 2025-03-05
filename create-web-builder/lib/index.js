"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.__esModule = true;
var ansi_colors_1 = require("ansi-colors");
var fast_glob_1 = __importDefault(require("fast-glob"));
var child_process_1 = require("child_process");
var promises_1 = require("fs/promises");
var inquirer_1 = require("inquirer");
var os_1 = require("os");
var path_1 = require("path");
var signale_1 = require("signale");
var util_1 = require("util");
var execx = (0, util_1.promisify)(child_process_1.exec);
/**
 * 创建应用
 */
function createApp() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, appName, cwd, appRoot_1, error_1, templateName, tempPath, templateRoot_1, templatePackageConfig, name_1, version, author, homepage, otherConfig, packageConfigNew, templateFilePaths, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new signale_1.Signale({ interactive: true });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, (0, inquirer_1.prompt)([{
                                message: '请输入应用名称:',
                                name: 'appName',
                                type: 'input',
                                validate: function (value) {
                                    if (!value)
                                        return '应用名称不可为空';
                                    if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value))
                                        return '应用名称不合法';
                                    return true;
                                }
                            }])];
                case 2:
                    appName = (_a.sent()).appName;
                    cwd = process.cwd();
                    appRoot_1 = (0, path_1.join)(cwd, appName);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, promises_1.access)(appRoot_1)];
                case 4:
                    _a.sent();
                    logger.error("\u5E94\u7528 ".concat(appName, " \u5DF2\u5B58\u5728\uFF01\n\n").concat((0, ansi_colors_1.gray)('如需升级应用模板，请在应用根目录运行 pnpm run upgrade 命令。')));
                    return [2 /*return*/];
                case 5:
                    error_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, (0, inquirer_1.prompt)([{
                            message: '请选择模板:',
                            name: 'templateName',
                            type: 'list',
                            choices: [
                                { name: '桌面应用', value: 'cortex-app-desktop-template' },
                                { name: '移动应用', value: 'cortex-app-mobile-template' },
                            ]
                        }])];
                case 7:
                    templateName = (_a.sent()).templateName;
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), 'cloudplex-temp-'))];
                case 8:
                    tempPath = _a.sent();
                    // 下载模板
                    logger.await('正在下载');
                    return [4 /*yield*/, execx("git clone --depth=1 https://gitee.com/cloudplex/".concat(templateName, ".git"), { cwd: tempPath })];
                case 9:
                    _a.sent();
                    templateRoot_1 = (0, path_1.join)(tempPath, templateName);
                    templatePackageConfig = require((0, path_1.join)(templateRoot_1, 'package.json'));
                    name_1 = templatePackageConfig.name, version = templatePackageConfig.version, author = templatePackageConfig.author, homepage = templatePackageConfig.homepage, otherConfig = __rest(templatePackageConfig, ["name", "version", "author", "homepage"]);
                    packageConfigNew = __assign({ name: appName, version: '0.0.0', private: true, template: { name: name_1, version: version, author: author, homepage: homepage } }, otherConfig);
                    // 复制文件
                    logger.await('正在安装');
                    return [4 /*yield*/, (0, promises_1.mkdir)(appRoot_1, { recursive: true })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, path_1.join)(appRoot_1, 'package.json'), JSON.stringify(packageConfigNew, undefined, '  '))];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, (0, fast_glob_1["default"])('**/*', {
                            cwd: templateRoot_1.replace(/\\/g, '/'),
                            dot: true,
                            ignore: ['.git', 'package.json']
                        })];
                case 12:
                    templateFilePaths = _a.sent();
                    return [4 /*yield*/, Promise.all(templateFilePaths.map(function (path) { return __awaiter(_this, void 0, void 0, function () {
                            var dest;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        dest = (0, path_1.join)(appRoot_1, path);
                                        return [4 /*yield*/, (0, promises_1.mkdir)((0, path_1.dirname)(dest), { recursive: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, (0, promises_1.copyFile)((0, path_1.join)(templateRoot_1, path), dest)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 13:
                    _a.sent();
                    // 删除临时目录
                    return [4 /*yield*/, (0, promises_1.rm)(tempPath, { force: true, recursive: true, maxRetries: 3 })];
                case 14:
                    // 删除临时目录
                    _a.sent();
                    logger.success('创建应用成功！');
                    // 输出完成信息
                    process.stdout.write('\n');
                    process.stdout.write('请从以下指令开始：\n');
                    process.stdout.write('\n');
                    process.stdout.write("  ".concat((0, ansi_colors_1.cyan)('cd'), " ").concat(appName, "\n"));
                    process.stdout.write("  ".concat((0, ansi_colors_1.cyan)('pnpm install'), "\n"));
                    process.stdout.write('\n');
                    process.stdout.write("".concat((0, ansi_colors_1.gray)('更多内容请查看'), " README.md ").concat((0, ansi_colors_1.gray)('文件。'), "\n"));
                    return [3 /*break*/, 16];
                case 15:
                    error_2 = _a.sent();
                    logger.error(error_2);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
createApp();