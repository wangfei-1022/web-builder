<template>
  <ALayoutSider :collapsed="menuCollapsed" collapsible hideTrigger>
    <AMenu breakpoint="xl"
           :popupMaxHeight="false"
           @menuItemClick="navigateMenuHandle"
           v-model:openKeys="menuOpenKeys"
           v-model:selectedKeys="menuSelectedKeys"
           showCollapseButton
           v-model:collapsed="menuCollapsed">
      <SiderMenuContent :menu="menu" />
    </AMenu>
  </ALayoutSider>
</template>

<script lang="ts" setup>
import { someTreeNode, useMenu } from '@/utils';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import menuConfig from '../menu.config';
import SiderMenuContent from './SiderMenuContent.vue';

const router = useRouter();
const route = useRoute();

// 菜单
const menu = useMenu('BaseLayout', menuConfig);
const menuOpenKeys = ref<string[]>();
const menuSelectedKeys = ref<string[]>();
const menuCollapsed = ref(true);
watch(
  [menu, () => route.name],
  () => {
    const name = (route.meta.parentName || route.name) as string;
    const openKeySet = new Set(menuOpenKeys.value);
    someTreeNode(menu.value, ({ item, parent }) => {
      if (item.key === name) {
        let currentParent = parent;
        while (currentParent) {
          openKeySet.add(currentParent.key);
          currentParent = currentParent.parent;
        }
        return true;
      }
    });
    menuOpenKeys.value = Array.from(openKeySet);
    menuSelectedKeys.value = name ? [name] : [];
  },
  { immediate: true },
);

// 跳转菜单
const navigateMenuHandle = (name: string) => {
  if (name !== route.name) {
    router.push({ name });
  }
}
</script>

<style lang="less" scoped>
.@{prefix}-menu {
  height: 100%;
}
</style>