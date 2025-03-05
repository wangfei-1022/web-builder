import { type Answers, type CheckboxQuestion, type ConfirmQuestion, type EditorQuestion, type ExpandQuestion, type InputQuestion, type ListQuestion, type NumberQuestion, type PasswordQuestion, type RawListQuestion } from 'inquirer';
import { type AutocompleteQuestionOptions } from 'inquirer-autocomplete-prompt';
/**
 * 提示
 * @param question 问题
 */
export declare function prompt<Result = any>(question: Question<{
    value: Result;
}>): Promise<Result>;
/** 问题 */
export declare type Question<T extends Answers = Answers> = Omit<InputQuestion<T>, 'name'> | Omit<PasswordQuestion<T>, 'name'> | Omit<NumberQuestion<T>, 'name'> | Omit<ListQuestion<T>, 'name'> | Omit<RawListQuestion<T>, 'name'> | Omit<ExpandQuestion<T>, 'name'> | Omit<CheckboxQuestion<T>, 'name'> | Omit<ConfirmQuestion<T>, 'name'> | Omit<EditorQuestion<T>, 'name'> | Omit<AutocompleteQuestionOptions<T>, 'name'>;
/** 问题选项 */
export interface QuestionOption {
    /** 名称 */
    name: string;
    /** 值 */
    value: any;
}
