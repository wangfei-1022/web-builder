import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */import InformationRouterMap from './modules/cargo/v0/Information'
import ManagementRouterMap from './modules/cargo/v0/Management'
import { FmsRouterMap } from './modules/financial'
import { SeaExportRouterMap } from './modules/cargo/v0/SeaExport'
import { MemberManagementRouterMap } from './modules/partner'
import CharteredBoatRouteMap from './modules/cargo/v0/CharteredBoat'
import SpaceManagerMap from './modules/cargo/v0/SpaceManager'
import { SeaContractRouterMap } from './modules/cargo/v0/SeaContract'
import { OverseasWarehouseRouteMap } from './modules/cargo/v0/OverseasWarehouse'
import ContainerManagerRouterMap from './modules/cargo/v0/ContainerManager'
import { GoodsManageRouterMap } from './modules/cargo/v0/GoodsManage'
import { PutInStorageManageMap } from './modules/cargo/v0/PutInStorageManage'
import { MessageCenterRouterMap } from './modules/message'
import { InventoryManagerRouterMap } from './modules/cargo/v0/InventoryManager'
import { OutInStorageManageRouterMap } from './modules/cargo/v0/OutInStorageManage'
import { TaskManageRouteMap } from './modules/cargo/v0/TaskManager'
import { AirExportRouterMap } from './modules/airExport'
import { YunCangManageMap } from './modules/cargo/v0/YunCangManage'
import PackageWarehouseMap from './modules/cargo/v0/PackageWarehouse'
import { DomesticTransportationMap } from './modules/cargo/v0/DomesticTransportation'
import { CustomerManagerRouterMap } from './modules/cargo/v0/OverseasManager'
import { OvlBillRouterMap } from './modules/ovlBill'
import { OpenPlatformRouterMap } from './modules/openPlatform'
import { OvlSeaSitManageRouteMap } from './modules/cargo/v0/OvlSeaSitManage'
import { OvlRouteMap } from './modules/cargo/v0/Ovl'
import { OvlReturnBoundManageMap } from './modules/cargo/v0/OvlReturnBoundManage'
import { UExpressRouterMap } from './modules/uexpress'
import { SeaQuotationExportRouterMap } from './modules//cargo/v0/SeaQuotationExport'
import { SeaProductRouterMap } from './modules/cargo/v0/SeaProduct'
import { thirdKindRouterMap } from './modules/thirdKind'

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * */
export const constantRoutes = [
  {
    name: 'Redirect',
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    name: 'AuthRedirect',
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    name: '401',
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    name: 'Index',
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'icon-colorlens', noCache: true, affix: true }
      },
      {
        path: 'demo',
        hidden: true,
        component: () => import('@/views/demo/index'),
        name: 'Demo',
        meta: {
          title: 'Demo'
        }
      }
    ]
  },
  {
    name: 'Refresh',
    path: '/refresh',
    component: () => import('@/views/refresh/index'),
    hidden: true
  },
  {
    path: '/notify/identification/email/:id',
    hidden: true,
    component: () => import('@/views/partner/member/emailIdentification'),
    name: 'EmailIdentification'
  },
  {
    path: '/bi/screen/v2',
    hidden: true,
    component: () => import('@/views/bi/index'),
    name: 'BIV2'
  }, {
    path: '/messageSetting',
    component: Layout,
    redirect: 'noredirect',
    name: 'messageSetting',
    meta: {
      title: 'messageSetting',
      icon: 'iconfont icon-shezhi01'
    },
    children: [
      // 订阅配置
      {
        path: 'subscribeList',
        component: () => import('@/views/message/subscribe'),
        name: 'SubscribeList',
        meta: { title: 'subscribeConfig' }
      },
      // 消息接收人管理
      {
        path: 'receiver',
        component: () => import('@/views/message/receiver'),
        name: 'ReceiverList',
        meta: { title: 'receiverManage' }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: 'noredirect',
    name: 'message',
    alwaysShow: true,
    meta: {
      title: 'messageCenter',
      icon: 'iconfont icon-xiaoxi1'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/message/list'),
        name: 'MessageList',
        meta: { title: 'messageList' }
      },
      {
        path: 'detail',
        component: () => import('@/views/message/detail'),
        name: 'messageDetailBy',
        hidden: true,
        meta: { title: 'messageDetail' }
      }]
  },
  {
    path: '/taskManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'taskManage',
    alwaysShow: true,
    meta: {
      title: '任务管理',
      icon: 'iconfont icon-dashboard'
    },
    children: [
      {
        path: '/task/list',
        component: () => import('@/views/cargo/v0/taskManager/taskList'),
        name: 'TaskList',
        meta: { title: '任务列表' }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: {
      title: 'memberManagement',
      icon: 'icon-user'
    },
    children: [
      {
        path: 'changePassword',
        component: () => import('@/views/partner/userCenter/changePassword'),
        name: 'UserChangePassword',
        hidden: true,
        meta: { title: '修改密码' }
      }
    ]
  },
  {
    path: '/tpl',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: {
      title: 'tpl',
      icon: 'icon-user'
    },
    children: []
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutesMap = {
  ...ManagementRouterMap,
  ...FmsRouterMap,
  ...InformationRouterMap,
  ...CharteredBoatRouteMap,
  ...MemberManagementRouterMap,
  ...MessageCenterRouterMap,
  ...SpaceManagerMap,
  ...SeaContractRouterMap,
  ...SeaExportRouterMap,
  ...OverseasWarehouseRouteMap,
  ...GoodsManageRouterMap,
  ...ContainerManagerRouterMap,
  ...PutInStorageManageMap,
  ...InventoryManagerRouterMap,
  ...TaskManageRouteMap,
  ...OutInStorageManageRouterMap,
  ...AirExportRouterMap,
  ...YunCangManageMap,
  ...DomesticTransportationMap,
  ...PackageWarehouseMap,
  ...OvlBillRouterMap,
  ...CustomerManagerRouterMap,
  ...OpenPlatformRouterMap,
  ...OvlSeaSitManageRouteMap,
  ...OvlRouteMap,
  ...SeaProductRouterMap,
  ...OvlReturnBoundManageMap,
  ...UExpressRouterMap,
  ...SeaQuotationExportRouterMap,
  ...thirdKindRouterMap
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
