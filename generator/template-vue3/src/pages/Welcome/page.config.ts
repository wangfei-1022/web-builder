import { definePages } from '@/utils';

export default definePages([
  {
    layout: 'BaseLayout',
    title: '欢迎页',
    name: 'Welcome',
    path: '/welcome',
    component: () => import('./Welcome.vue'),
    initOpen: true,
  },
]);