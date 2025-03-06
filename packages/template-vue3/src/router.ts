import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import useUserStore from './stores/user';
import type { LayoutConfig, PageConfig, ResponseError } from './utils';

// 导入布局
const layoutConfigRecord = import.meta.glob<true, string, LayoutConfig>('./layouts/*/layout.config.ts', { eager: true, import: 'default' });
const layoutRouteRecord: Record<string, RouteRecordRaw> = {};
Object.values(layoutConfigRecord).forEach(({ name, path, component, welcomePage, refreshPage }) => {
  const children: RouteRecordRaw[] = [
    {
      name: `${name}Welcome`,
      path: '',
      component: welcomePage,
      meta: { welcome: true },
    },
  ];
  if (refreshPage) {
    children.push({
      name: `${name}Refresh`,
      path: 'refresh',
      component: refreshPage,
      meta: { title: '刷新中...' },
    });
  }
  layoutRouteRecord[name] = {
    name,
    path: path.startsWith('/') ? path : `/${path}`,
    component: component,
    children,
  };
});

// 导入页面
const routes = Object.values(layoutRouteRecord);
const pageConfigRecord = import.meta.glob<true, string, PageConfig[]>('./pages/*/page.config.ts', { eager: true, import: 'default' });
console.log(pageConfigRecord)
Object.values(pageConfigRecord).forEach(pageConfigRaws => {
  pageConfigRaws.forEach(({ layout, name, path, component, props, ...meta }) => {
    const pageRoute: RouteRecordRaw = { name, path, component, props, meta } as any;
    const layoutRoute = layout && layoutRouteRecord[layout];
    if (layoutRoute) {
      pageRoute.meta!.layout = layout;
      if (pageRoute.path.startsWith('/')) {
        pageRoute.path = pageRoute.path.replace(/^\/+/, '');
      }
      layoutRoute.children!.push(pageRoute);
    } else {
      if (!pageRoute.path.startsWith('/')) {
        pageRoute.path = `/${pageRoute.path}`;
      }
      routes.push(pageRoute);
    }
  });
});

/** 路由器 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 自动登录
router.beforeEach(async to => {
  try {
    const userStore = useUserStore();
    if (typeof to.query.token === 'string') {
      userStore.logout();
      if (to.query.token) {
        await userStore.login(to.query.token);
      }
    } else {
      const token = localStorage.getItem(__TOKEN_STORAGE_KEY__);
      if (token && !userStore.passport) {
        await userStore.login();
      }
    }
  } catch (error) {
    if ((error as ResponseError)?.response?.status !== 401) return false;
    localStorage.removeItem(__TOKEN_STORAGE_KEY__);
  }
});

// 更新标题
router.afterEach(to => {
  document.title = [to.meta.title as string, __APP_NAME__].filter(title => title).join(' - ');
});

export default router;