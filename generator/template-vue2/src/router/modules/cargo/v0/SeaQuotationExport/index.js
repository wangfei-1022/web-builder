import Layout from '@/layout'

export const SeaQuotationExportRouterMap = {
  // 海运询盘单
  'sea:quotation': {
    component: Layout,
    alwaysShow: true,
    name: 'SeaQuotationExport'
  },

  'sea:quotationExport:list': {
    component: () => import('@/views/cargo/v0/SeaQuotationExport/list'),
    name: 'SeaQuotationExportList',
    children: ['sea:quotationExport:quote', 'sea:quotationExport:view']
  },
   // 报价
   'sea:quotationExport:quote': {
    path: 'seaQuotationExportQuote/quote',
    component: () => import('@/views/cargo/v0/SeaQuotationExport/quote'),
    name: 'SeaQuotationExportQuote',
    hidden: true,
    meta: { title: '询盘报价'}
  },
  // 详情
  'sea:quotationExport:view': {
    path: 'seaQuotationExportQuote/view',
    component: () => import('@/views/cargo/v0/SeaQuotationExport/view'),
    name: 'SeaQuotationExportView',
    hidden: true,
    meta: { title: '报价详情'}
  }

}
