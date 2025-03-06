import useUserStore from '@/stores/user';
import { computed, type Component } from 'vue';
import { useRouter } from 'vue-router';
import { mapTreeNode } from './tree';

/**
 * 定义布局
 * @param config 配置
 */
export function defineLayout(config: LayoutConfig) {
  return config;
}

/** 布局配置 */
export interface LayoutConfig {
  /** 名称 */
  name: string;
  /** 路由路径 */
  path: string;
  /** 组件 */
  component: Component;
  /** 欢迎页面组件 */
  welcomePage: Component;
  /** 刷新页面组件 */
  refreshPage?: Component;
}

/**
 * 定义页面
 * @param config 配置
 */
export function definePages(config: PageConfig[]) {
  return config;
}

/** 页面配置 */
export interface PageConfig {
  /** 所属布局 */
  layout?: string;
  /** 标题 */
  title: string;
  /** 路由名称 */
  name: string;
  /** 路由路径 */
  path: string;
  /** 组件 */
  component: Component | (() => Promise<Component>);
  /** 组件属性 */
  props?: Record<string, any>;
  /** 父级路由名称 */
  parentName?: string;
  /** 权限 */
  permission?: string;
  /** 初始化打开 */
  initOpen?: boolean;
  /** 常驻后台 */
  resident?: boolean;
}

/**
 * 定义菜单
 * @param config 配置
 */
export function defineMenu(config: MenuConfig) {
  return config;
}

/** 菜单配置 */
export type MenuConfig = (MenuItemConfig | MenuBlockConfig)[];

/** 菜单项配置 */
export interface MenuItemConfig {
  /** 类型 */
  type?: 'route';
  /** 图标 */
  icon?: Component;
  /** 路由名称 */
  route: string;
}

/** 菜单块配置 */
export interface MenuBlockConfig {
  /** 类型 */
  type: 'folder' | 'group';
  /** 图标 */
  icon?: Component;
  /** 标题 */
  title: string;
  /** 子级 */
  children: MenuConfig;
}

/**
 * 使用菜单
 * @param layout 布局
 * @param config 配置
 */
export function useMenu(layout: string, config: MenuConfig) {
  const router = useRouter();
  const layoutRoutes = router.getRoutes().filter(route => route.meta.layout === layout);
  const userStore = useUserStore();
  return computed<MenuItem[]>(() => {
    return mapTreeNode(
      config,
      ({ item }) => {
        if (item.type === undefined || item.type === 'route') {
          const route = layoutRoutes.find(route => route.name === item.route);
          if (
            !route ||
            !route.meta.permission ||
            (userStore.permissions && userStore.permissions[route.meta.permission as string] !== false)
          ) {
            return {
              type: 'route' as const,
              key: item.route,
              title: route?.meta.title as string || '无效页面',
              icon: item.icon,
            };
          }
        }
        if (item.type === 'folder' || item.type === 'group') {
          return {
            type: item.type,
            key: `${item.type}:${item.title}`,
            title: item.title,
            icon: item.icon,
          };
        }
        return null;
      },
      {
        noChildrenClean: true,
      },
    );
  });
}

/** 菜单项 */
export interface MenuItem {
  /** 类型 */
  type: 'folder' | 'group' | 'route';
  /** key */
  key: string;
  /** 标题 */
  title: string;
  /** 图标 */
  icon?: Component;
  /** 子级 */
  children?: MenuItem[];
}