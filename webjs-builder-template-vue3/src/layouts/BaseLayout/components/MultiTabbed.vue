<template>
  <ALayoutContent>
    <ATabs v-if="tabs.length > 0"
           type="card"
           :activeKey="route.path"
           editable
           @tabClick="navigateTo($event as string)"
           @delete="closeTab($event as string)">
      <ATabPane v-for="tab in tabs" :key="tab.path" :title="tab.title" :closable="!tab.resident" />
      <template #extra>
        <ADropdown position="br" v-model:popupVisible="tabActionsVisible" :popupMaxHeight="false">
          <AButton>
            <template #icon>
              <IconUp v-if="tabActionsVisible" />
              <IconDown v-else />
            </template>
          </AButton>
          <template #content>
            <ADoption @click="refreshCurrentTab">
              <template #icon>
                <IconRefresh />
              </template>刷新当前
            </ADoption>
            <ADoption :disabled="closeCurrentTabDisabled" @click="closeCurrentTab">
              <template #icon>
                <IconMinus />
              </template>关闭当前
            </ADoption>
            <ADoption :disabled="closeOtherTabsDisabled" @click="closeOtherTabs">
              <template #icon>
                <IconSwap />
              </template>关闭其它
            </ADoption>
            <ADoption :disabled="closeLeftTabsDisabled" @click="closeLeftTabs">
              <template #icon>
                <IconDoubleLeft />
              </template>关闭左侧
            </ADoption>
            <ADoption :disabled="closeRightTabsDisabled" @click="closeRightTabs">
              <template #icon>
                <IconDoubleRight />
              </template>关闭右侧
            </ADoption>
            <ADoption :disabled="closeAllTabsDisabled" @click="closeAllTabs">
              <template #icon>
                <IconClose />
              </template>关闭全部
            </ADoption>
          </template>
        </ADropdown>
      </template>
    </ATabs>
    <div class="content">
      <div>
        <RouterView #default="{ route, Component }">
          <KeepAlive :include="cacheRouteComponentNames">
            <component :key="route.path" :is="resolveRouteComponent(route, Component)" />
          </KeepAlive>
        </RouterView>
      </div>
    </div>
  </ALayoutContent>
</template>

<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRouteComponentName, resolveRouteComponent } from './MultiTabbed.extra';

const router = useRouter();
const route = useRoute();

// 标签
const tabs = ref<{
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
  /** 完整路径 */
  fullPath: string;
  /** 常驻后台 */
  resident?: boolean;
  /** 缓存 */
  cache: boolean;
  /** 顺序号 */
  sequence: number;
}[]>([]);
const tabCurrent = computed(() => tabs.value.findIndex(tab => tab.path === route.path));
const cacheRouteComponentNames = computed(() => (
  tabs.value
    .filter(({ cache }) => cache)
    .map(({ path }) => getRouteComponentName(path))
));

// 导航至
const navigateTo = (path: string) => {
  const targetTab = tabs.value.find(tab => tab.path === path)!;
  router.push(targetTab.fullPath);
}

// 刷新标签
const refreshTab = (path: string) => {
  const targetTab = tabs.value.find(tab => tab.path === path);
  if (targetTab) {
    targetTab.cache = false;
    if (targetTab.path === route.path) {
      const redirect = encodeURIComponent(targetTab.fullPath);
      router.push({
        name: 'BaseLayoutRefresh',
        query: { redirect },
      });
    }
  }
}

// 关闭标签
const closeTab = (path: string) => {
  const targetTab = tabs.value.find(tab => tab.path === path);
  if (targetTab) {
    tabs.value = tabs.value.filter(tab => tab !== targetTab);
    if (targetTab.path === route.path) {
      const nextTab = tabs.value.slice().sort((tab_0, tab_1) => tab_1.sequence - tab_0.sequence)[0];
      router.push(nextTab?.fullPath || { name: 'BaseLayoutWelcome' });
    }
  }
}

// 设置标签标题
const setTabTitle = (path: string, title: string) => {
  const targetTab = tabs.value.find(tab => tab.path === path);
  if (targetTab) {
    targetTab.title = title;
    if (targetTab.path === route.path) {
      document.title = [title, __APP_NAME__].join(' - ');
    }
  }
}

// 标签操作
const tabActionsVisible = ref(false);
const refreshCurrentTab = () => refreshTab(route.path);
const closeCurrentTabDisabled = computed(() => !!route.meta.resident);
const closeCurrentTab = () => {
  if (closeCurrentTabDisabled.value) return;
  closeTab(route.path);
};
const closeOtherTabsDisabled = computed(() => {
  const otherTabs = tabs.value.filter(tab => !tab.resident && tab.path !== route.path);
  return otherTabs.length === 0;
});
const closeOtherTabs = () => {
  if (closeOtherTabsDisabled.value) return;
  tabs.value = tabs.value.filter(tab => !(!tab.resident && tab.path !== route.path));
};
const closeLeftTabsDisabled = computed(() => {
  const leftTabs = tabs.value.filter((tab, tabIndex) => !tab.resident && tabIndex < tabCurrent.value);
  return leftTabs.length === 0;
});
const closeLeftTabs = () => {
  if (closeLeftTabsDisabled.value) return;
  tabs.value = tabs.value.filter((tab, tabIndex) => !(!tab.resident && tabIndex < tabCurrent.value));
};
const closeRightTabsDisabled = computed(() => {
  const rightTabs = tabs.value.filter((tab, tabIndex) => !tab.resident && tabIndex > tabCurrent.value);
  return rightTabs.length === 0;
});
const closeRightTabs = () => {
  if (closeRightTabsDisabled.value) return;
  tabs.value = tabs.value.filter((tab, tabIndex) => !(!tab.resident && tabIndex > tabCurrent.value));
};
const closeAllTabsDisabled = computed(() => {
  const allTabs = tabs.value.filter(tab => !tab.resident);
  return allTabs.length === 0;
});
const closeAllTabs = () => {
  if (closeAllTabsDisabled.value) return;
  tabs.value = tabs.value.filter(tab => !!tab.resident);
  const nextTab = tabs.value.slice().sort((tab_0, tab_1) => tab_1.sequence - tab_0.sequence)[0];
  router.push(nextTab?.fullPath || { name: 'BaseLayoutWelcome' });
};

// 初始化标签
const layoutRoutes = router.getRoutes().filter(route => route.meta.layout === 'BaseLayout');
Array
  .from(new Set([
    ...layoutRoutes.filter(route => route.meta.resident),
    ...(
      route.meta.welcome
        ? layoutRoutes.filter(route => route.meta.initOpen)
        : []
    ),
  ]))
  .forEach((route, routeIndex) => {
    tabs.value.push({
      title: route.meta.title as string,
      path: route.path,
      fullPath: route.path,
      resident: route.meta.resident as boolean,
      cache: true,
      sequence: routeIndex,
    });
  });
if (route.meta.welcome) {
  const lastInitRoute = layoutRoutes.filter(route => route.meta.initOpen).slice(-1)[0];
  if (lastInitRoute) {
    router.replace(lastInitRoute.path);
  }
}

// 更新标签数据
watch(
  () => route.fullPath,
  () => {
    const currentTab = tabs.value.find(tab => tab.path === route.path);
    if (currentTab) {
      currentTab.fullPath = route.fullPath;
      currentTab.cache = true;
      currentTab.sequence = Infinity;
      setTabTitle(currentTab.path, currentTab.title);
    } else if (route.meta.layout) {
      tabs.value.push({
        title: route.meta.title as string,
        path: route.path,
        fullPath: route.fullPath,
        resident: route.meta.resident as boolean,
        cache: true,
        sequence: Infinity,
      });
    } else {
      return;
    }
    tabs.value
      .slice()
      .sort((tab_0, tab_1) => tab_0.sequence - tab_1.sequence)
      .forEach((tab, tabIndex) => {
        tab.sequence = tabIndex;
      });
  },
  { immediate: true },
);

// 向子页面提供使用多页签接口
provide('multiTabbed', () => {
  const routePath = route.path;
  return {
    refreshCurrentTab: () => refreshTab(routePath),
    closeCurrentTab: () => closeTab(routePath),
    setCurrentTabTitle: (title: string) => setTabTitle(routePath, title),
  };
});
</script>

<style lang="less" scoped>
.@{prefix}-layout-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.@{prefix}-tabs {
  padding: 8px 16px;

  :deep(.@{prefix}-tabs-nav) {
    &::before {
      content: none;
    }

    .@{prefix}-tabs-nav-button {
      height: 32px;
      display: flex;
      align-items: center;
      color: @color-text-3;
      background-color: @color-bg-1;
      padding: 0px 4px;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.1s cubic-bezier(0, 0, 1, 1);

      &.@{prefix}-tabs-nav-button-disabled {
        color: @color-text-4;
        cursor: not-allowed;
      }

      &:not(.@{prefix}-tabs-nav-button-disabled):hover {
        background-color: @color-fill-3;
      }

      &.@{prefix}-tabs-nav-button-left {
        margin-left: 0;
      }

      .@{prefix}-icon-hover {
        cursor: unset;

        &:hover::before {
          background-color: transparent;
        }
      }
    }

    .@{prefix}-tabs-nav-tab {
      .@{prefix}-tabs-nav-tab-list {
        margin: 0 -4px;

        .@{prefix}-tabs-tab {
          background-color: @color-bg-1;
          margin: 0 4px;
          border: none;
          border-radius: 2px;

          &:not(.@{prefix}-tabs-tab-active):hover {
            .@{prefix}-tabs-tab-title {
              color: @color-text-1;
            }
          }

          .@{prefix}-icon-hover {
            &:hover::before {
              background-color: @color-fill-3;
            }
          }
        }
      }
    }

    .@{prefix}-tabs-nav-extra {
      .@{prefix}-btn {
        background-color: @color-bg-1;
        border-radius: 2px;

        &:hover {
          background-color: @color-fill-3;
        }
      }
    }
  }

  :deep(.@{prefix}-tabs-content) {
    display: none;
  }
}

.content {
  flex: 1;
  overflow: auto;
  padding: 0 16px 16px 16px;

  &>div {
    position: relative;
    overflow: hidden;
    min-height: 100%;
  }
}

.@{prefix}-result {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: @color-bg-1;
  overflow: auto;
}
</style>