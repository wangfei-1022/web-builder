/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export const OpenPlatformRouterMap = {
  // 产品列表
  'opn:platform:product': {
    component: () => import('@/views/openPlatform/product'),
    name: 'OpenPlatformProduct'
  },
  // 接口列表
  'opn:platform:interface': {
    component: () => import('@/views/openPlatform/interface'),
    name: 'OpenPlatformInterface'
  },
  // 签约列表
  'opn:platform:sign': {
    component: () => import('@/views/openPlatform/audit'),
    name: 'OpenPlatformAudit'
  }
}


