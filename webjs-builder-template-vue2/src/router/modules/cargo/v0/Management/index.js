import Layout from '@/layout'


const ManagementRouterMap = {
  // 系统管理
  'sys:manage': {
    component: Layout,
    alwaysShow: true,
    name: 'Management'
  },
  // 公司架构
  'sys:office': {
    component: () => import('@/views/cargo/v0/Management/architecture'),
    name: 'Architecture',
    children: ['sys:office:detail']
  },
  'sys:office:detail': {
    path: 'CompanyDetails',
    component: () => import('@/views/cargo/v0/Management/companyDetails'),
    name: 'CompanyDetails',
    hidden: true,
    meta: { title: '公司详情' }
  },
  // 角色权限
  'sys:role': {
    component: () => import('@/views/cargo/v0/Management/roles'),
    name: 'Roles',
    children: ['sys:role:detail']
  },
  'sys:role:detail': {
    path: 'RoleAuthorize',
    component: () => import('@/views/cargo/v0/Management/roleAuthorize'),
    name: 'RoleAuthorize',
    hidden: true,
    meta: { title: '授权管理' }
  },
  'sys:privilege': {
    path: '/sys/privilege',
    component: () => import('@/views/cargo/v0/Management/roleEdit'),
    name: 'RoleEdit',
    hidden: true,
    meta: { title: '权限管理' }
  },
  // 用户管理
  'sys:user': {
    component: () => import('@/views/cargo/v0/Management/userManagement'),
    name: 'UserManagement',
    children: ['sys:user:modify']
  },
  'sys:user:modify': {
    hidden: true,
    path: 'NewUser',
    component: () => import('@/views/cargo/v0/Management/newUser'),
    name: 'NewUser',
    meta: { title: '用户新增/编辑' }
  },
  // 编号规则
  'sys:rules': {
    component: () => import('@/views/cargo/v0/Management/rules'),
    name: 'Rules'
  },
  // 打印模板
  'sys:template': {
    component: () => import('@/views/cargo/v0/Management/reportTemplateList'),
    name: 'ReportTemplateList',
    children: ['sys:template:config']
  },
  'sys:template:config': {
    path: 'ReportPageView',
    component: () => import('@/views/cargo/v0/Management/reportPageView'),
    name: 'ReportPageView',
    hidden: true,
    meta: { title: '模板设计 / 预览视图', keepAlive: true, showIframe: true }
  },
  // 数据源配置
  'cfg:template:scheme': {
    component: () => import('@/views/cargo/v0/Management/reportTemplateScheme'),
    name: 'ReportScheme'
  },
  'edi:mapping': {
    path: '/edi/mapping',
    component: () => import('@/views/cargo/v0/Management/ediMapping'),
    name: 'EdiMapping',
    meta: { title: 'edi映射' }
  }
}

export default ManagementRouterMap
