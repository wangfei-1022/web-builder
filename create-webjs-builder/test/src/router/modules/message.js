import Layout from '@/layout'

export const MessageCenterRouterMap = {
  // 站内消息
  'comm:message': {
    component: Layout,
    alwaysShow: true,
    name: 'message'
  },
  // 全部消息
  'comm:message:list': {
    component: () => import(/* webpackChunkName: 'message' */'@/views/message/list'),
    name: 'MessageList'
  },
  // 全部消息-详情
  'comm:message:list:detail': {
    path: 'detail',
    component: () => import(/* webpackChunkName: 'message' */'@/views/message/detail'),
    name: 'messageDetailBy',
    hidden: true,
    meta: { title: 'messageDetail' }
  },
  // 消息设置
  'comm:msgSetting': {
    component: Layout,
    name: 'messageSetting'
  }
}
