import { definePages } from '@/utils';

export default definePages([
  {
    layout: 'BaseLayout',
    title: '用户中心',
    name: 'UserSetting',
    path: '/user-setting',
    component: () => import('./UserSetting.vue'),
  },
]);