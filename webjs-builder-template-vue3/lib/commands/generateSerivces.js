"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signale_1 = require("signale");
const utils_1 = require("../utils");
/**
 * 生成服务
 */
async function generateSerivces() {
    // 选择服务
    let selectedServices;
    switch (config.services?.length ?? 0) {
        case 0:
            (0, signale_1.error)('找不到服务配置，请进入 cortex.config.ts 中配置');
            return;
        case 1:
            selectedServices = config.services;
            break;
        default:
            const selectedService = await (0, utils_1.prompt)({
                message: '请选择服务:',
                type: 'autocomplete',
                source: async (_, keyword) => {
                    return [
                        { name: '<-- 全部服务 -->', value: null },
                        ...config.services
                            .map(service => ({ name: service.name, value: service }))
                            .filter(({ name }) => !keyword || new RegExp(keyword, 'i').test(name)),
                    ];
                },
            });
            selectedServices = selectedService ? [selectedService] : config.services;
    }
    // 生成服务
    await (0, utils_1.generateSerivces)(selectedServices);
}
exports.default = generateSerivces;
