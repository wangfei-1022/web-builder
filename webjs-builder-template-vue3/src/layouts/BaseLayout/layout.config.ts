import { defineLayout } from '@/utils';
import BaseLayout from './BaseLayout.vue';
import BaseLayoutWelcome from './BaseLayoutWelcome.vue';
import BaseLayoutRefresh from './BaseLayoutRefresh.vue';

export default defineLayout({
  name: 'BaseLayout',
  path: '/test',
  component: BaseLayout,
  welcomePage: BaseLayoutWelcome,
  refreshPage: BaseLayoutRefresh,
});