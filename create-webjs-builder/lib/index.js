"use strict";
const { cyan, gray } = require("ansi-colors");
const fg = require("fast-glob");
const { exec } = require("child_process");
const { access, mkdir, writeFile, copyFile, rm } = require("fs/promises");
const inquirer = require("inquirer");
const { tmpdir } = require("os");
const { join } = require("path");
const { Signale } = require("signale");
const { promisify } = require("util");

const execx = promisify(exec);

/**
 * 创建应用
 */
async function createApp () {
    const logger = new Signale({ interactive: true });
    try {
        const { appName } = await inquirer.prompt([{
            message: '请输入应用名称:',
            name: 'appName',
            type: 'input',
            validate: (value) => {
                if (!value) return '应用名称不可为空';
                if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(value)) return '应用名称不合法';
                return true;
            }
        }]);

        const cwd = process.cwd();
        const appRoot = join(cwd, appName);

        try {
            await access(appRoot);
            logger.error(`应用 ${appName} 已存在！${gray('如需升级应用模板，请在应用根目录运行 pnpm run upgrade 命令。')}`);
            return;
        } catch (error) {
            // 目录不存在，继续执行
        }

        const { templateName } = await inquirer.prompt([{
            message: '请选择模板:',
            name: 'templateName',
            type: 'list',
            choices: [
                { name: '桌面应用', value: 'cortex-app-desktop-template' },
                { name: '移动应用', value: 'cortex-app-mobile-template' },
            ]
        }]);

        const tempPath = await mkdir(tmpdir() + '/cloudplex-temp-', { recursive: true });

        // 下载模板
        logger.await('正在下载');
        await execx(`git clone --depth=1 https://gitee.com/cloudplex/${templateName}.git`, { cwd: tempPath });

        const templateRoot = join(tempPath, templateName);
        const templatePackageConfig = require(join(templateRoot, 'package.json'));
        const { name, version, author, homepage, ...otherConfig } = templatePackageConfig;
        const packageConfigNew = {
            name: appName,
            version: '0.0.0',
            private: true,
            template: { name, version, author, homepage },
            ...otherConfig
        };

        // 复制文件
        logger.await('正在安装');
        await mkdir(appRoot, { recursive: true });
        await writeFile(join(appRoot, 'package.json'), JSON.stringify(packageConfigNew, undefined, '  '));

        const templateFilePaths = await fg('**/*', {
            cwd: templateRoot.replace(/\\/g, '/'),
            dot: true,
            ignore: ['.git', 'package.json']
        });

        await Promise.all(templateFilePaths.map(async (path) => {
            const dest = join(appRoot, path);
            await mkdir(join(dest, '..'), { recursive: true });
            await copyFile(join(templateRoot, path), dest);
        }));

        // 删除临时目录
        await rm(tempPath, { force: true, recursive: true, maxRetries: 3 });

        logger.success('创建应用成功！');

        // 输出完成信息
        process.stdout.write('\n');
        process.stdout.write('请从以下指令开始：\n');
        process.stdout.write('\n');
        process.stdout.write(`  ${cyan('cd')} ${appName}\n`);
        process.stdout.write(`  ${cyan('pnpm install')}\n`);
        process.stdout.write('\n');
        process.stdout.write(`${gray('更多内容请查看')} README.md ${gray('文件。')}\n`);
    } catch (error) {
        logger.error(error);
    }
}

createApp();