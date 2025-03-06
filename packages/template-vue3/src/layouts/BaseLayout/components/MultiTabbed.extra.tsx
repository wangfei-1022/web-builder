import { usePermission } from '@/stores/user';
import { getPascalCase } from '@/utils';
import { Result } from '@arco-design/web-vue';
import { defineComponent, type DefineComponent, type VNode } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

const routeComponentRecord: { [componentName: string]: DefineComponent } = {};

/**
 * 获取路由组件名称
 * @param path 路径
 */
export function getRouteComponentName(path: string) {
  return `RouteOf${getPascalCase(path)}`;
}

/**
 * 解析路由组件
 * @param route 路由
 * @param content 内容
 */
export function resolveRouteComponent(
  route: RouteLocationNormalizedLoaded,
  content: VNode,
) {
  const componentName = getRouteComponentName(route.path);
  if (!routeComponentRecord[componentName]) {
    routeComponentRecord[componentName] = defineComponent({
      name: componentName,
      setup: () => {
        const permission = usePermission(route.meta.permission as string);
        return () => permission.value ? content : (
          <Result status="403" subtitle="您无权访问此页面" />
        );
      },
    });
  }
  return routeComponentRecord[componentName];
}