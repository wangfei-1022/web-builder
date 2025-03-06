<template>
  <ALayoutHeader>
    <div class="logo">
      <img src="@/assets/logo.svg" />
      <h1>{{ appName }}</h1>
    </div>

    <ASpace>
      <ADropdown>
        <AAvatar :size="32">
          <img v-if="userStore.passport?.avatarUrl" :src="userStore.passport?.avatarUrl" />
          <template v-else>{{ userStore.passport?.name?.[0] || '用户' }}</template>
        </AAvatar>
        <template #content>
          <ADoption @click="$router.push({ name: 'UserSetting' })">
            <template #icon>
              <IconUser />
            </template>用户中心
          </ADoption>
          <ADoption @click="logoutHandle">
            <template #icon>
              <IconExport />
            </template>退出登录
          </ADoption>
          <ADivider :margin="4" />
          <ADoption @click="showAboutHandle">
            <template #icon>
              <IconInfoCircle />
            </template>关于
          </ADoption>
        </template>
      </ADropdown>
    </ASpace>
  </ALayoutHeader>
</template>

<script lang="tsx" setup>
import Descriptions from '@/components/Descriptions';
import useUserStore from '@/stores/user';
import { Modal } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const appName = __APP_NAME__;

// 退出登录
const logoutHandle = () => {
  Modal.confirm({
    title: '操作确认',
    content: '是否确定退出登录？',
    onOk: () => {
      userStore.logout();
      router.push({ name: 'Login' });
    },
  });
};

// 关于
const showAboutHandle = () => {
  const data = {
    version: document.querySelector('meta[name="version"]')?.attributes.getNamedItem('content')?.value,
    lastModifiedTime: document.querySelector('meta[name="last-modified-time"]')?.attributes.getNamedItem('content')?.value,
  };
  Modal.info({
    title: appName,
    content: () => (
      <Descriptions
        cols={1}
        data={data}
        columns={[
          { title: '应用版本', dataIndex: 'version' },
          { title: '最后更新', dataIndex: 'lastModifiedTime' },
        ]}
      />
    ),
  });
};
</script>

<style lang="less" scoped>
.@{prefix}-layout-header {
  background-color: @color-bg-2;
  border-bottom: 1px solid @color-border;
  padding: 0 16px;
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;

  img {
    height: 40px;
  }

  h1 {
    margin: 0 0 0 8px;
    font-size: 20px;
    font-weight: bold;
    color: @color-text-1;
  }
}

.@{prefix}-avatar {
  cursor: pointer;
}
</style>