"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const dotenv_1 = __importDefault(require("dotenv"));
const deploy_1 = __importDefault(require("../commands/deploy"));
const generateComponent_1 = __importDefault(require("../commands/generateComponent"));
const generateSerivces_1 = __importDefault(require("../commands/generateSerivces"));
const upgrade_1 = __importDefault(require("../commands/upgrade"));
const utils_1 = require("../utils");
const commander_1 = __importDefault(require("./commander"));
dotenv_1.default.config();
(async () => {
    // 捕获错误
    process.on('uncaughtException', (error) => {
        process.stdout.write(`${(0, ansi_colors_1.red)(error.message)}\n`);
        process.exit();
    });
    process.on('unhandledRejection', (error) => {
        process.stdout.write(`${(0, ansi_colors_1.red)(error.message)}\n`);
        process.exit();
    });
    // 加载配置
    const cortexConfigPath = 'cortex.config.ts';
    global.config = (0, utils_1.requirex)(cortexConfigPath);
    // 主命令
    const packageConfig = require('../../package.json');
    const mainCommandName = Object.entries(packageConfig.bin)[0]?.[0];
    const mainCommand = new commander_1.default(mainCommandName);
    mainCommand.addOption('version', 'v', '输出版本号');
    mainCommand.setAction(({ options }) => {
        if (options.version) {
            process.stdout.write(`${packageConfig.version}\n`);
        }
        else {
            mainCommand.help();
        }
    });
    // 生成命令
    const generateCommand = mainCommand.addChild('generate', 'g', '生成');
    generateCommand.setChildPlaceholder('类型');
    // 生成服务命令
    const generateServicesCommand = generateCommand.addChild('services', 's', '生成服务');
    generateServicesCommand.setAction(generateSerivces_1.default);
    // 生成组件命令
    const generateComponentCommand = generateCommand.addChild('component', 'c', '生成组件');
    generateComponentCommand.setAction(generateComponent_1.default);
    // 部署命令
    const deployCommand = mainCommand.addChild('deploy', 'd', '部署');
    deployCommand.setAction(deploy_1.default);
    // 升级命令
    const upgradeCommand = mainCommand.addChild('upgrade', 'u', '升级');
    upgradeCommand.setAction(upgrade_1.default);
    // 解析命令行参数
    mainCommand.parse(process.argv.slice(2));
})();
