"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signale_1 = __importDefault(require("signale"));
const utils_1 = require("../utils");
/**
 * 生成组件
 */
async function generateComponent() {
    try {
        const { components = [] } = global.config.template;
        const generator = await (0, utils_1.prompt)({
            message: '请选择模板:',
            type: 'autocomplete',
            source: async (_, keyword) => (components
                ?.map(({ name, generator }) => ({ name, value: generator }))
                .filter(({ name }) => !keyword || new RegExp(keyword, 'i').test(name))
                ?? []),
        });
        const templates = await (0, utils_1.requirex)(generator)();
        await (0, utils_1.generateFiles)(templates);
    }
    catch (error) {
        signale_1.default.error(error);
    }
}
exports.default = generateComponent;
