"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompt = void 0;
const inquirer_1 = require("inquirer");
const inquirer_autocomplete_prompt_1 = __importDefault(require("inquirer-autocomplete-prompt"));
(0, inquirer_1.registerPrompt)('autocomplete', inquirer_autocomplete_prompt_1.default);
/**
 * 提示
 * @param question 问题
 */
async function prompt(question) {
    const { value } = await (0, inquirer_1.prompt)([{ ...question, name: 'value' }]);
    return value;
}
exports.prompt = prompt;
;
