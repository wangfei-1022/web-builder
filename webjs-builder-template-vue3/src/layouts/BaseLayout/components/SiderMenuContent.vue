<template>
  <template v-for="menuItem in props.menu" :key="menuItem.key">
    <template v-if="menuItem.type === 'folder'">
      <ASubMenu :key="menuItem.key">
        <template v-if="menuItem.icon" #icon>
          <component :is="menuItem.icon"></component>
        </template>
        <template #title>{{ menuItem.title }}</template>
        <SiderMenuContent v-if="menuItem.children" :menu="menuItem.children" />
      </ASubMenu>
    </template>

    <template v-else-if="menuItem.type === 'group'">
      <AMenuItemGroup :key="menuItem.key">
        <template #title>{{ menuItem.title }}</template>
        <SiderMenuContent v-if="menuItem.children" :menu="menuItem.children" />
      </AMenuItemGroup>
    </template>

    <template v-else>
      <AMenuItem :key="menuItem.key">
        <template v-if="menuItem.icon" #icon>
          <component :is="menuItem.icon"></component>
        </template>
        <template #default>{{ menuItem.title }}</template>
      </AMenuItem>
    </template>
  </template>
</template>

<script lang="ts" setup>
import type { MenuItem } from '@/utils';
import type { PropType } from 'vue';

// 定义属性
const props = defineProps({
  /** 菜单 */
  menu: {
    type: Array as PropType<MenuItem[]>,
    required: true,
  },
});
</script>