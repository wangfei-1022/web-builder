import { cloneDeep } from 'lodash';
import { parseJsonString } from './data';

/**
 * 使用表单转换
 * @param rules 规则
 */
export function useFormTransform<
  FormValue extends Record<string, any> = Record<string, any>,
  ModelValue extends Partial<Record<keyof FormValue, any>> = Record<keyof FormValue, any>,
  >(
    rules: {
      /** 转换字段 */
      fields: (keyof FormValue)[],
      /**
       * 转换至表单字段值
       * @param modelFieldValue 模型字段值
       */
      toFormFieldValue(modelFieldValue: any): any,
      /**
       * 转换至模型字段值
       * @param formFieldValue 表单字段值
       */
      toModelFieldValue(formFieldValue: any): any,
    }[],
) {
  return {
    /**
     * 转换至表单补丁
     * @param modelPatch 模型补丁
     */
    toFormPatch: <Data extends PartialModel<ModelValue>>(modelPatch: Data) => {
      const formPatch = cloneDeep(modelPatch) as { [Key in keyof Data]: Key extends keyof FormValue ? FormValue[Key] : Data[Key] };
      rules.forEach(({ fields, toFormFieldValue }) => {
        fields.filter(field => field in modelPatch).forEach(field => {
          formPatch[field] = toFormFieldValue(modelPatch[field]);
        });
      });
      return formPatch;
    },
    /**
     * 转换至模型补丁
     * @param formPatch 表单补丁
     */
    toModelPatch: <Data extends PartialModel<FormValue>>(formPatch: Data) => {
      const modelPatch = cloneDeep(formPatch) as { [Key in keyof Data]: Key extends keyof ModelValue ? ModelValue[Key] : Data[Key] };
      rules.forEach(({ fields, toModelFieldValue }) => {
        fields.filter(field => field in formPatch).forEach(field => {
          modelPatch[field] = toModelFieldValue(formPatch[field]);
        });
      });
      return modelPatch;
    },
  };
}

/**
 * 更新表单
 * @param formValue 表单值
 * @param formPatch 表单补丁
 */
export function updateForm(formValue: Record<string, any>, formPatch: any) {
  if (formPatch instanceof Object) {
    Object.keys(formValue).forEach(key => {
      if (key in formPatch) {
        formValue[key] = formPatch[key] ?? undefined;
      }
    });
  }
}

/**
 * 重置表单
 * @param formValue 表单值
 * @param initialValue 初始值
 */
export function resetForm(formValue: Record<string, any>, initialValue: any) {
  Object.keys(formValue).forEach(key => {
    if (initialValue instanceof Object && key in initialValue) {
      formValue[key] = initialValue[key] ?? undefined;
    } else {
      formValue[key] = undefined;
    }
  });
}

/**
 * 数值格式器
 * @param value 数值
 */
export function numberFormatter(value: string) {
  const numberSegments = value.split('.');
  numberSegments[0] = numberSegments[0]
    .replace(/(\d{3})+$/, groups => groups.replace(/\d{3}/g, group => `,${group}`))
    .replace(/^,/, '');
  return numberSegments.join('.');
}

/**
 * 数值解析器
 * @param value 数值
 */
export function numberParser(value: string) {
  return value.replace(/,/g, '');
}

/**
 * 获取模型文件更新
 * @param options 选项
 */
export function getModelFilesUpdate(options: {
  /** 模型补丁 */
  modelPatch: Record<string, any>;
  /** 模型值 */
  modelValue?: Record<string, any>;
  /** 文件字段 */
  fields: string[];
}) {
  const { modelPatch, modelValue = {}, fields } = options;
  const patchFileIds = fields.map(field => parseJsonString<number[]>(modelPatch[field]) ?? []).flat();
  const valueFileIds = fields.map(field => parseJsonString<number[]>(modelValue[field]) ?? []).flat();
  return {
    addLocalFiles: patchFileIds.filter(id => !valueFileIds.includes(id)),
    removeLocalFiles: valueFileIds.filter(id => !patchFileIds.includes(id)),
  };
}