import i18n from '@/lang' // Internationalization
import moment from 'moment'

function getZH(key, obj) {
    obj = obj || 'putInStorageManage'
    let str = obj + '.' + key
    return i18n.t(str)
}

function formatDate(date, fmt) {
    if (!date) {
      return ''
    }
    date = Number(date)
    fmt = fmt || 'YYYY-MM-DD HH:mm'
    return moment(Number(date)).format(fmt)
}

export default {
    defaultFlag: true,
    moduleName: '海外仓-入库管理-提单集装箱明细列表 ',
    moduleCode: 'OVL_INBOUND_BL_LIST_TABLE_PAGE',
    schemeName: '默认表头',
    schemeContent: [
        {
            field: 'index',
            width: 55,
            pinned: 'left',
            suppressSorting: true,
            checkboxSelection: true,
            suppressMenu: true,
            suppressSizeToFit: true,
            suppressResize: true,
            headerCheckboxSelection: true
        },
        {
            headerName: getZH('rowIndex', 'common'),
            width: 70,
            cellRenderer: params => params.rowIndex + 1
        },
        {
            field: 'blNo',
            headerName: getZH('blNo'),
            width: 140
        },
        {
            field: 'containerNo',
            headerName: getZH('containerNo'),
            width: 120
        },
        {
            field: 'createTime',
            headerName: getZH('exporTime'),
            width: 120,
            cellRenderer: params => params.value ? formatDate(params.value, 'YYYY-MM-DD') : '-'
        },
        {
            field: 'createByName',
            headerName: getZH('exportUser'),
            width: 120
        },
        {
            field: 'inboundTaskNo',
            headerName: getZH('taskInboundNo'),
            width: 120
        },
        {
            field: 'inboundTaskStatusName',
            headerName: getZH('taskState'),
            width: 120
        },
        {
            field: 'statusName',
            headerName: getZH('pushState'),
            width: 120
        }
    ]
  }
  
  