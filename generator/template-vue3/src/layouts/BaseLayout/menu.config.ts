import { defineMenu } from '@/utils';
import { IconFolder, IconHome } from '@arco-design/web-vue/es/icon';

export default defineMenu([
  { route: 'Welcome', icon: IconHome },
  { icon: IconFolder, type: 'folder', title: '用户管理', children: [
    { route: 'UserSetting', icon: IconHome },
    { route: 'UserListDto', icon: IconHome },
    { route: 'OmcTerminal', icon: IconHome },
  ] },
  
]);