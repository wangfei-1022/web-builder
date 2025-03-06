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
    moduleName: '海外仓-入库管理-入库任务管理',
    moduleCode: 'OVL_INBOUND_TASK_TABLE_PAGE',
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
            field: 'customerName',
            headerName: getZH('customerName', 'common'),
            width: 140
        },
        {
            field: 'inboundNo',
            headerName: getZH('orderInboundNo'),
            width: 120
        },
        {
            field: 'customerInboundNo',
            headerName: getZH('memberNo'),
            width: 160
        },
        {
            field: 'customerInboundLineNo',
            headerName: getZH('customerInboundLineNo'),
            width: 160
        },
        {
            field: 'warehouseName',
            headerName: getZH('warehouseName'),
            width: 120
        },
        {
            field: 'customerWarehouseCode',
            headerName: getZH('costomerWarehouseCode'),
            width: 120
        },
        {
            field: 'commercialInvoice',
            headerName: getZH('commercialinvoice'),
            width: 120
        },
        {
            field: 'unpackFlag',
            headerName: getZH('unpackFlag'),
            width: 120,
            cellRenderer: params => params.value ? getZH('YES', 'common') : getZH('NO', 'common')
        },
        {
            field: 'ediSendTime',
            headerName: getZH('ediSendTime'),
            width: 140,
            cellRenderer: params => params.value ? formatDate(params.value, 'YYYY-MM-DD') : '-'
        },
        {
            field: 'planReceiveTime',
            headerName: getZH('planReceiveTime'),
            width: 140,
            cellRenderer: params => params.value ? formatDate(params.value, 'YYYY-MM-DD') : '-'
        },

        {
            field: 'vessel',
            headerName: getZH('vesselOrVoyage'),
            width: 120
        },
        {
            field: 'shippingLine',
            headerName: getZH('shippingLine'),
            width: 120
        },
        {
            field: 'containerNumber',
            headerName: getZH('containerNo'),
            width: 120
        },
        {
            field: 'sealNumber',
            headerName: getZH('sealNumber'),
            width: 120
        },
        {
            field: 'blNumber',
            headerName: getZH('blNo'),
            width: 120
        },
        {
            field: 'terminal',
            headerName: getZH('terminal'),
            width: 120
        },
        {
            field: 'recompletionTime',
            headerName: getZH('recompletionTime'),
            width: 140,
            cellRenderer: params => params.value ? formatDate(params.value, 'YYYY-MM-DD') : '-'
        },
        {
            field: 'orderStatusName',
            headerName: getZH('orderState'),
            width: 120
        },
        {
            field: 'abnormalFlag',
            headerName: getZH('abnormalFlag'),
            width: 100,
            cellRenderer: params => params.value ? getZH('trueText', 'common') : getZH('falseText', 'common')
        },
        {
            field: 'abnormalMessage',
            headerName: getZH('abnormalMessage'),
            width: 100
        },
        {
            field: 'id',
            headerName: getZH('operation', 'common'),
            width: 120,
            pinned: 'right',
            cellRendererFramework: 'inboundTaskOperation'
        }
    ]
  }
  
  