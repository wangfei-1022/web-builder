<template>
  <ASpace direction="vertical" size="medium" fill>
    <ACard :bordered="false">
      <ARow :gutter="[36, 8]" justify="center" align="center">
        <ACol flex="none">
          <AAvatar :size="64">
            <img v-if="passport?.avatarUrl" :src="passport?.avatarUrl" />
            <template v-else>{{ passport?.name?.[0] || '用户' }}</template>
          </AAvatar>
        </ACol>
        <ACol flex="none" style="flex: 0 1 640px;">
          <Descriptions :cols="{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }"
                        :data="passport"
                        :columns="[
                          { title: '用户名', dataIndex: 'name' },
                          { title: '账号', dataIndex: 'account' },
                          { title: '组织机构', dataIndex: 'organizationPath' },
                          { title: '注册时间', dataIndex: 'createdTime' },
                        ]" />
        </ACol>
        <ACol flex="1" />
      </ARow>
    </ACard>

    <ACard v-if="passport" :bordered="false">
      <AList :bordered="false">
        <AListItem>
          <AListItemMeta>
            <template #avatar>账户密码</template>
            <template #description>
              <ARow justify="space-between" align="center" :gutter="16">
                <ACol flex="none">
                  <span>已设置</span>
                </ACol>
                <ACol flex="none">
                  <ALink @click="showUpdatePasswordHandle">修改</ALink>
                </ACol>
              </ARow>
            </template>
          </AListItemMeta>
        </AListItem>

        <!-- <AListItem>
          <AListItemMeta>
            <template #avatar>绑定手机</template>
            <template #description>
              <ARow justify="space-between" :gutter="16">
                <ACol flex="none">
                  <span v-if="passport.mobileNumber">{{ passport.mobileNumber }}</span>
                  <span v-else class="placeholder">暂未绑定手机</span>
                </ACol>
                <ACol flex="none">
                  <ALink v-if="passport.mobileNumber">修改</ALink>
                  <ALink v-else>绑定</ALink>
                </ACol>
              </ARow>
            </template>
          </AListItemMeta>
        </AListItem> -->
      </AList>
    </ACard>
  </ASpace>
</template>

<script lang="tsx" setup>
import Descriptions from '@/components/Descriptions';
import { changePassword } from '@/services/demo-service';
import { usePassport } from '@/stores/user';
import { getErrorMessage } from '@/utils';
import { Message, Modal } from '@arco-design/web-vue';
import { ref } from 'vue';
import UpdatePasswordForm from './components/UpdatePasswordForm.vue';

const passport = usePassport();

// 修改密码
const showUpdatePasswordHandle = () => {
  const formRef = ref<InstanceType<typeof UpdatePasswordForm>>();
  Modal.open({
    title: '修改密码',
    content: () => (
      <UpdatePasswordForm ref={instance => formRef.value = instance as any} />
    ),
    width: 318,
    maskClosable: false,
    onBeforeOk: async () => {
      try {
        const modelPatch = await formRef.value!.validate();
        const modelValue = {
          ...modelPatch,
        };
        try {
          await changePassword(modelValue);
          Message.success('修改密码成功');
          return true;
        } catch (error) {
          Message.error(getErrorMessage(error));
          return false;
        }
      } catch (error) {
        return false;
      }
    },
  });
};
</script>

<style lang="less" scoped>
:deep(.arco-list-item) {
  border-bottom: none !important;
}

:deep(.@{prefix}-list-item-meta) {
  padding: 0;
}

:deep(.arco-list-item-meta-avatar) {
  color: @color-text-2;
  margin-bottom: 13px;
}

:deep(.arco-list-item-meta-content) {
  flex: 1;
  border-bottom: 1px solid @color-fill-3;
  padding-bottom: 12px;
}

:deep(.arco-list-item-meta-description) {
  color: @color-text-1;
}

// .placeholder {
//   color: @gray-4;
// }
</style>