import { definePages } from '@/utils';
import Login from './Login.vue';

export default definePages([
  {
    title: '登录',
    name: 'Login',
    path: '/login',
    component: Login,
  },
]);