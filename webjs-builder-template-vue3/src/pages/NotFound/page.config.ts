import { definePages } from '@/utils';
import NotFound from './NotFound.vue';

export default definePages([
  {
    title: '找不到该页面',
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
]);