"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const promises_1 = require("fs/promises");
const signale_1 = require("signale");
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const util_1 = require("util");
const utils_1 = require("../utils");
const execx = (0, util_1.promisify)(child_process_1.exec);
/**
 * 部署
 */
async function deploy() {
    const cwd = process.cwd();
    const logger = new signale_1.Signale({ interactive: true });
    if (!config.deploy)
        throw '未进行部署配置';
    const { SSH_USER_NAME, SSH_PASSWORD } = process.env;
    const { branch = 'master', dir = 'dist', path, base = '', ...sshOptions } = {
        ...config.deploy,
        username: SSH_USER_NAME,
        password: SSH_PASSWORD,
    };
    try {
        // 检查代码提交状态
        const { stdout: uncommitResult } = await execx('git status --short');
        if (uncommitResult)
            throw '工作区包含尚未提交的代码';
        // 检查当前分支
        const { stdout: currentBranchResult } = await execx('git rev-parse --abbrev-ref HEAD');
        if (branch !== currentBranchResult.split('\n')[0])
            throw `请切换至 <${branch}> 分支部署`;
        // 检查更新
        const packageConfig = require((0, utils_1.joinPath)(cwd, 'package.json'));
        let hasUpdate;
        try {
            if (packageConfig.version) {
                const { stdout: diffResult } = await execx(`git diff ${packageConfig.version} --name-only`);
                hasUpdate = !!diffResult;
            }
            else {
                hasUpdate = true;
            }
        }
        catch (error) {
            if (error.code !== 128)
                throw error;
            hasUpdate = true;
        }
        if (!hasUpdate) {
            logger.info('无应用更新。');
            return;
        }
        // 检查构建
        const indexPath = (0, utils_1.joinPath)(dir, 'index.html');
        const indexContent = await (0, promises_1.readFile)(indexPath, 'utf8');
        if (!indexContent.includes('__APP_VERSION__') ||
            !indexContent.includes('__APP_LAST_MODIFIED_TIME__')) {
            throw '请重新构建后再进行部署';
        }
        // 更新版本信息
        const [major, minor, patch] = [0, 0, 0].concat(packageConfig.version?.match(/([0-9]+)/g)?.map((item) => Number(item)) ?? []).slice(-3);
        const patchVersion = [major, minor, patch + 1].join('.');
        const minorVersion = [major, minor + 1, 0].join('.');
        const majorVersion = [major + 1, 0, 0].join('.');
        const selectedVersion = await (0, utils_1.prompt)({
            message: `请选择一个新版本 (当前版本 ${packageConfig.version}) :`,
            type: 'list',
            choices: [
                { name: `Patch (${patchVersion})`, value: patchVersion },
                { name: `Minor (${minorVersion})`, value: minorVersion },
                { name: `Major (${majorVersion})`, value: majorVersion },
                { name: '自定义版本', value: null },
            ],
        });
        if (selectedVersion) {
            packageConfig.version = selectedVersion;
        }
        else {
            const customVersion = await (0, utils_1.prompt)({
                message: '请输入版本:',
                type: 'input',
            });
            packageConfig.version = customVersion;
        }
        await (0, promises_1.writeFile)('package.json', JSON.stringify(packageConfig, undefined, '  '));
        // 提交代码
        logger.await('正在提交');
        await execx('git add package.json');
        await execx(`git commit --message "chore(release): 发布版本 - ${packageConfig.version}"`);
        const { stdout: remoteResult } = await execx('git remote');
        const remotes = remoteResult.split('\n').filter(remote => remote);
        logger.await(`正在推送 ${branch} 分支`);
        await Promise.all(remotes.map(remote => execx(`git push ${remote} ${branch}`)));
        // 创建标签
        if (!packageConfig.version.startsWith('0')) {
            logger.await(`正在创建 ${packageConfig.version} 标签`);
            await execx(`git tag ${packageConfig.version}`);
            logger.await(`正在推送 ${packageConfig.version} 标签`);
            await Promise.all(remotes.map(remote => execx(`git push ${remote} ${packageConfig.version}`)));
        }
        // 更新应用信息
        const currDate = new Date();
        const lastModifiedTime = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()} ${currDate.getHours()}:${currDate.getMinutes()}:${currDate.getSeconds()}`;
        const newIndexContent = indexContent
            .replace(/__APP_VERSION__/g, packageConfig.version)
            .replace(/__APP_LAST_MODIFIED_TIME__/g, lastModifiedTime);
        await (0, promises_1.writeFile)(indexPath, newIndexContent);
        // 上传服务器
        const ssh = new ssh2_sftp_client_1.default();
        logger.await('正在连接服务器');
        await ssh.connect(sshOptions);
        const currPath = (0, utils_1.joinPath)(path, base).replace(/\/+$/, '');
        if (await ssh.exists(currPath)) {
            const prevPath = `${currPath}_prev`;
            const nextPath = `${currPath}_next`;
            logger.await('正在上传服务器');
            if (await ssh.exists(nextPath))
                await ssh.rmdir(nextPath, true);
            await ssh.uploadDir(dir, nextPath);
            logger.await('正在部署');
            if (await ssh.exists(prevPath))
                await ssh.rmdir(prevPath, true);
            await ssh.rename(currPath, prevPath);
            await ssh.rename(nextPath, currPath);
        }
        else {
            logger.await('正在上传服务器');
            await ssh.uploadDir(dir, currPath);
        }
        await ssh.end();
        logger.success('部署成功！');
    }
    catch (error) {
        logger.error(error);
    }
}
exports.default = deploy;
