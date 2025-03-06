"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const utils_1 = require("../utils");
/** 命令 */
class Command {
    /** 默认属性 */
    static defaultProperties = {
        /** 用法占位符 */
        usagePlaceholder: '用法',
        /** 子级占位符 */
        childPlaceholder: '命令',
        /** 选项占位符 */
        optionPlaceholder: '选项'
    };
    /** 获取选项匹配 */
    static getOptionMatch = (name) => `${name.length === 1 ? '-' : '--'}${name}`;
    /** 名称 */
    name;
    /** 别名 */
    alias;
    /** 描述 */
    description;
    /** 版本号 */
    version;
    /** 父级 */
    _parent;
    /** 用法占位符 */
    _usagePlaceholder;
    /** 参数映射 */
    _params = new Map();
    /** 子级占位符 */
    _childPlaceholder;
    /** 子级映射 */
    _children = new Map();
    /** 选项占位符 */
    _optionPlaceholder;
    /** 选项映射 */
    _options = new Map();
    /** 功能 */
    _action;
    /**
     * 命令构造
     * @param name 名称
     * @param alias 别名
     * @param description 描述
     */
    constructor(name, alias, description) {
        this.name = name;
        this.alias = alias;
        this.description = description;
    }
    /**
     * 设置用法占位符
     * @param value 值
     */
    setUsagePlaceholder(value) {
        this._usagePlaceholder = value;
        return this;
    }
    /**
     * 添加必要参数
     * @param name 名称
     * @param description 描述
     * @param placeholder 占位符
     */
    addRequiredParam(name, description, placeholder) {
        this._params.set(name, { name, description, placeholder: placeholder ?? name, required: true });
        return this;
    }
    /**
     * 添加参数
     * @param name 名称
     * @param description 描述
     * @param placeholder 占位符
     */
    addParam(name, description, placeholder) {
        this._params.set(name, { name, description, placeholder: placeholder ?? name });
        return this;
    }
    /**
     * 设置子命令占位符
     * @param value 值
     */
    setChildPlaceholder(value) {
        this._childPlaceholder = value;
        return this;
    }
    /**
     * 添加子命令
     * @param name 名称
     * @param alias 别名
     * @param description 描述
     */
    addChild(name, alias, description) {
        const command = new Command(name, alias, description);
        command._parent = this;
        this._children.set(name, command);
        if (alias) {
            this._children.set(alias, command);
        }
        return command;
    }
    /**
     * 设置选项占位符
     * @param value 值
     */
    setOptionPlaceholder(value) {
        this._optionPlaceholder = value;
        return this;
    }
    /**
     * 添加选项
     * @param name 名称
     * @param alias 别名
     * @param description 描述
     * @param defaultValue 默认值
     */
    addOption(name, alias, description, defaultValue) {
        const option = {
            name: (0, utils_1.getCamelCase)(name),
            alias: alias && (0, utils_1.getCamelCase)(alias),
            description,
            defaultValue,
        };
        this._options.set(Command.getOptionMatch(option.name), option);
        this._options.set(Command.getOptionMatch((0, utils_1.getSeparatorCase)(option.name)), option);
        if (option.alias) {
            this._options.set(Command.getOptionMatch(option.alias), option);
            this._options.set(Command.getOptionMatch((0, utils_1.getSeparatorCase)(option.alias)), option);
        }
        return this;
    }
    /**
     * 设置动作
     * @param handle 句柄
     */
    setAction(handle) {
        this._action = handle;
        return this;
    }
    /** 帮助 */
    help() {
        const helpMessages = [];
        // 生成用法
        let argvString = this.name;
        this._params.forEach(param => {
            argvString += ` ${(0, ansi_colors_1.blackBright)(param.required ? `<${param.placeholder}>` : `[${param.placeholder}]`)}`;
        });
        if (this._children.size > 0) {
            argvString += ` ${(0, ansi_colors_1.blackBright)(`<${this._getPlaceholder('child')}>`)}`;
        }
        let target = this._parent;
        while (target) {
            argvString = `${target.name} ${argvString}`;
            target = target._parent;
        }
        argvString += ` ${(0, ansi_colors_1.blackBright)(`[${this._getPlaceholder('option')}]`)}`;
        const usagePlaceholder = this._getPlaceholder('usage').replace(/^[a-z]/, match => match.toUpperCase());
        helpMessages.push(`${usagePlaceholder}: ${argvString}`);
        helpMessages.push('');
        // 生成描述
        if (this.description) {
            helpMessages.push(this.description);
            helpMessages.push('');
        }
        // 生成参数
        if (this._params.size > 0) {
            this._params.forEach(param => {
                helpMessages.push(`${(0, ansi_colors_1.blackBright)(`${param.placeholder}:`)} ${param.description}`);
            });
            helpMessages.push('');
        }
        // 生成子命令
        if (this._children.size > 0) {
            const childPlaceholder = this._getPlaceholder('child').replace(/^[a-z]/, match => match.toUpperCase());
            helpMessages.push((0, ansi_colors_1.blackBright)(`${childPlaceholder}:`));
            const children = {};
            this._children.forEach(child => {
                children[child.name] = child;
            });
            for (const name in children) {
                const child = children[name];
                let childArgvString = child.name;
                if (child.alias) {
                    childArgvString += `|${child.alias}`;
                }
                helpMessages.push([` ${childArgvString}`, child.description]);
            }
            helpMessages.push('');
        }
        // 生成选项
        const optionPlaceholder = this._getPlaceholder('option').replace(/^[a-z]/, match => match.toUpperCase());
        helpMessages.push((0, ansi_colors_1.blackBright)(`${optionPlaceholder}:`));
        const options = {};
        this._options.forEach(option => {
            options[option.name] = option;
        });
        for (const name in options) {
            const option = options[name];
            let optionArgvString = ` ${Command.getOptionMatch((0, utils_1.getSeparatorCase)(option.name))}`;
            if (option.alias) {
                optionArgvString += `|${Command.getOptionMatch((0, utils_1.getSeparatorCase)(option.alias))}`;
            }
            helpMessages.push([optionArgvString, option.description]);
        }
        if (!options.help) {
            helpMessages.push([' --help|-h', '输出帮助信息']);
        }
        // 对齐信息
        const spacing = 4;
        const getPrintLength = (content) => content.replace(/[^\x00-\xff]/g, '**').length;
        let maxlength = 0;
        helpMessages.forEach(message => {
            if (Array.isArray(message)) {
                const currentLength = getPrintLength(message[0]);
                if (maxlength < currentLength) {
                    maxlength = currentLength;
                }
            }
        });
        helpMessages.forEach((message, index) => {
            if (Array.isArray(message)) {
                const currentLength = getPrintLength(message[0]);
                const spacingLength = maxlength + spacing - currentLength;
                message[0] += ' '.repeat(spacingLength);
                helpMessages[index] = message.join('');
            }
        });
        // 输出帮助
        helpMessages.push('');
        process.stdout.write(helpMessages.join('\n'));
        return this;
    }
    /**
     * 解析
     * @param argvList 命令行参数列表
     */
    parse(argvList) {
        const currentParams = {};
        const currentOptions = {};
        let currentArgvList = argvList;
        let currentCommand = this;
        let errorMessage = null;
        // 查找命令
        if (currentCommand._children.size > 0) {
            while (currentArgvList.length > 0) {
                const segment = currentArgvList[0];
                if (/^-/.test(segment)) {
                    break;
                }
                else {
                    const command = currentCommand._children.get(segment);
                    if (command) {
                        currentCommand = command;
                        currentArgvList = currentArgvList.slice(1);
                        if (currentCommand._children.size === 0) {
                            break;
                        }
                    }
                    else {
                        const childPlaceholder = currentCommand._getPlaceholder('child').replace(/^[a-z]/, match => match.toUpperCase());
                        errorMessage = `${childPlaceholder}不存在“${segment}”！`;
                        break;
                    }
                }
            }
        }
        const helpOption = currentCommand._options.get('--help');
        if (!helpOption && argvList.find(segment => /^(--help|-h)$/.test(segment))) {
            currentCommand.help();
        }
        else {
            // 查找参数
            if (currentCommand._params.size > 0 && !errorMessage) {
                let params = Array.from(currentCommand._params.values());
                while (currentArgvList.length > 0 && params.length > 0) {
                    const segment = currentArgvList[0];
                    const param = params[0];
                    if (/^-/.test(segment)) {
                        if (param.required) {
                            errorMessage = `参数“${param.placeholder}”不可为空！`;
                            break;
                        }
                        else {
                            params = params.slice(1);
                        }
                    }
                    else {
                        const paramName = (0, utils_1.getCamelCase)(param.name);
                        currentParams[paramName] = segment;
                        currentArgvList = currentArgvList.slice(1);
                        params = params.slice(1);
                    }
                }
                const currentArgLength = Object.keys(currentParams).length;
                params = params.filter(param => param.required);
                if (currentArgLength < params.length) {
                    const param = params[currentArgLength];
                    errorMessage = `参数“${param.placeholder}”不可为空！`;
                }
            }
            // 查找选项
            if (currentCommand._options.size > 0 && !errorMessage) {
                while (currentArgvList.length > 0) {
                    const segment = currentArgvList[0];
                    if (/^-/.test(segment)) {
                        const segmentResult = segment.split('=');
                        const name = segmentResult[0];
                        const value = segmentResult[1];
                        const option = currentCommand._options.get(name);
                        if (option) {
                            if (value) {
                                currentOptions[option.name] = value;
                                currentArgvList = currentArgvList.slice(1);
                            }
                            else {
                                if (currentArgvList[1] && !/^-/.test(currentArgvList[1])) {
                                    currentOptions[option.name] = currentArgvList[1];
                                    currentArgvList = currentArgvList.slice(2);
                                }
                                else {
                                    currentOptions[option.name] = option.defaultValue ?? true;
                                    currentArgvList = currentArgvList.slice(1);
                                }
                            }
                        }
                        else {
                            errorMessage = `无效选项“${segment}”！`;
                            break;
                        }
                    }
                    else {
                        errorMessage = `无效参数“${segment}”！`;
                        break;
                    }
                }
            }
            if (errorMessage) {
                throw Error(`${errorMessage} 参见 --help 获得可用命令列表。`);
            }
            else {
                if (currentCommand._action) {
                    try {
                        currentCommand._action({ params: currentParams, options: currentOptions });
                    }
                    catch (error) {
                        process.stdout.write(`${(0, ansi_colors_1.red)(error.message)}\n`);
                    }
                }
                else {
                    currentCommand.help();
                }
            }
        }
    }
    /**
     * 获取命令占位符
     * @param type 类型
     */
    _getPlaceholder(type) {
        let currentCommand = this;
        while (currentCommand) {
            const property = currentCommand[`_${type}Placeholder`];
            if (property)
                return property;
            currentCommand = currentCommand._parent;
        }
        return Command.defaultProperties[`${type}Placeholder`];
    }
}
exports.default = Command;
