<template>
  <AForm ref="form" :model="formValue" layout="vertical">
    <AFormItem label="当前密码"
               field="currentPassword"
               :rules="[
                 { required: true, message: '此项为必填项' },
               ]">
      <AInputPassword placeholder="请输入"
                      autocomplete="new-password"
                      v-model="formValue.currentPassword"
                      allowClear />
    </AFormItem>
    <AFormItem label="新密码"
               field="newPassword"
               :rules="[
                 { required: true, message: '此项为必填项' },
                 { minLength: 6, message: '最少6个字符' },
                 { maxLength: 18, message: '最多18个字符' },
               ]">
      <AInputPassword placeholder="请输入"
                      autocomplete="new-password"
                      v-model="formValue.newPassword"
                      allowClear
                      @change="changeNewPasswordHandle" />
    </AFormItem>
    <AFormItem label="确认密码"
               field="newPasswordConfirm"
               :rules="[
                 { required: true, message: '此项为必填项' },
                 { validator: (value, callback) => callback(formValue.newPassword === value ? undefined : '密码不一致') },
               ]">
      <AInputPassword placeholder="请输入"
                      autocomplete="new-password"
                      v-model="formValue.newPasswordConfirm"
                      allowClear />
    </AFormItem>
  </AForm>
</template>

<script lang="ts" setup>
import type { ChangePasswordVM } from '@/services/demo-service';
import type { FormInstance } from '@arco-design/web-vue';
import { cloneDeep } from 'lodash';
import { reactive, ref } from 'vue';

const form = ref<FormInstance>();

// 表单值
const formInitialValue = {
  /** 当前密码 */
  currentPassword: undefined as string | undefined,
  /** 新密码 */
  newPassword: undefined as string | undefined,
  /** 确认密码 */
  newPasswordConfirm: undefined as string | undefined,
};
const formValue = reactive(cloneDeep(formInitialValue));

// 关联校验确认密码
const changeNewPasswordHandle = () => {
  if (formValue.newPasswordConfirm) {
    form.value?.validateField('newPasswordConfirm');
  }
};

// 暴露实例
defineExpose({
  /**
   * 校验表单
   */
  validate: async () => {
    const errors = await form.value?.validate();
    if (errors) throw errors;
    const { newPasswordConfirm, ..._formValue } = formValue;
    const modelPatch = {
      ..._formValue,
    };
    return modelPatch as OptimizeForm<typeof modelPatch, ChangePasswordVM>;
  },
});
</script>