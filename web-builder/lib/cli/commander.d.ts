/** 命令 */
export default class Command {
    /** 默认属性 */
    static readonly defaultProperties: {
        /** 用法占位符 */
        usagePlaceholder: string;
        /** 子级占位符 */
        childPlaceholder: string;
        /** 选项占位符 */
        optionPlaceholder: string;
    };
    /** 获取选项匹配 */
    static readonly getOptionMatch: (name: string) => string;
    /** 名称 */
    name: string;
    /** 别名 */
    alias?: string;
    /** 描述 */
    description?: string;
    /** 版本号 */
    version?: string;
    /** 父级 */
    private _parent?;
    /** 用法占位符 */
    private _usagePlaceholder?;
    /** 参数映射 */
    private _params;
    /** 子级占位符 */
    private _childPlaceholder?;
    /** 子级映射 */
    private _children;
    /** 选项占位符 */
    private _optionPlaceholder?;
    /** 选项映射 */
    private _options;
    /** 功能 */
    private _action?;
    /**
     * 命令构造
     * @param name 名称
     * @param alias 别名
     * @param description 描述
     */
    constructor(name: string, alias?: string, description?: string);
    /**
     * 设置用法占位符
     * @param value 值
     */
    setUsagePlaceholder(value: string): this;
    /**
     * 添加必要参数
     * @param name 名称
     * @param description 描述
     * @param placeholder 占位符
     */
    addRequiredParam(name: string, description?: string, placeholder?: string): this;
    /**
     * 添加参数
     * @param name 名称
     * @param description 描述
     * @param placeholder 占位符
     */
    addParam(name: string, description?: string, placeholder?: string): this;
    /**
     * 设置子命令占位符
     * @param value 值
     */
    setChildPlaceholder(value: string): this;
    /**
     * 添加子命令
     * @param name 名称
     * @param alias 别名
     * @param description 描述
     */
    addChild(name: string, alias?: string, description?: string): Command;
    /**
     * 设置选项占位符
     * @param value 值
     */
    setOptionPlaceholder(value: string): this;
    /**
     * 添加选项
     * @param name 名称
     * @param alias 别名
     * @param description 描述
     * @param defaultValue 默认值
     */
    addOption(name: string, alias?: string, description?: string, defaultValue?: string): this;
    /**
     * 设置动作
     * @param handle 句柄
     */
    setAction(handle: (event: CommandEvent) => void | Promise<void>): this;
    /** 帮助 */
    help(): this;
    /**
     * 解析
     * @param argvList 命令行参数列表
     */
    parse(argvList: string[]): void;
    /**
     * 获取命令占位符
     * @param type 类型
     */
    private _getPlaceholder;
}
export declare type CommandParam = {
    /** 名称 */
    name: string;
    /** 描述 */
    description?: string;
    /** 占位符 */
    placeholder?: string;
    /** 必要 */
    required?: boolean;
};
export declare type CommandOption = {
    /** 名称 */
    name: string;
    /** 别名 */
    alias?: string;
    /** 描述 */
    description?: string;
    /** 默认值 */
    defaultValue?: string;
};
export declare type CommandEvent = {
    /** 参数 */
    params: Record<string, string>;
    /** 选项 */
    options: Record<string, string | true>;
};
