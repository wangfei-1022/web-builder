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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineMockAPI = exports.defineService = exports.defineConfig = void 0;
__exportStar(require("./utils"), exports);
/**
 * 定义配置
 * @param config 配置
 */
function defineConfig(config) {
    return config;
}
exports.defineConfig = defineConfig;
/**
 * 定义服务
 * @param config 配置
 */
function defineService(config) {
    return config;
}
exports.defineService = defineService;
/**
 * 定义虚拟API
 * @param config 配置
 */
function defineMockAPI(config) {
    return config;
}
exports.defineMockAPI = defineMockAPI;
