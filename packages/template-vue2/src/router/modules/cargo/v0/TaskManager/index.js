import Layout from '@/layout'

export const TaskManageRouteMap = {
  // 舱位管理
  'mdm:task:monitor': {
    component: Layout,
    alwaysShow: true,
    name: 'taskManage'
  },
  // 抢舱规则
  'mdm:task:monitor:list': {
    component: () => import('@/views/cargo/v0/taskManager/taskList'),
    name: 'TaskList'
  }
}
