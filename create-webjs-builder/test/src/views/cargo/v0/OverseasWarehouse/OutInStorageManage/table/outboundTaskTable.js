import i18n from '@/lang' // Internationalization

function getZH(key, obj) {
    obj = obj || 'outInStorageManage'
    let str = obj + '.' + key
    return i18n.t(str)
}

export default {
    defaultFlag: true,
    moduleName: '海外仓-出库管理-出库任务管理',
    moduleCode: 'OVL_OUTBOUND_TASK_TABLE_PAGE',
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
            headerName: getZH('customerName', 'common'),
            field: 'customerName',
            width: 140
        },
        {
            headerName: getZH('userOutBoundNo'),
            field: 'customerOutboundNo',
            width: 140
        },
        {
            headerName: getZH('orderTaskStatus'),
            field: 'orderStatusName',
            width: 120
        },
        {
            headerName: getZH('orderOutboundStatus'),
            field: 'orderOutboundStatusName',
            width: 100
        },
        {
            headerName: getZH('callbackStatus'),
            field: 'callbackStatusName',
            width: 100
        },
        {
            field: 'abnormalFlag',
            headerName: getZH('abnormalFlag'),
            width: 100,
            cellRenderer: params => params.value ? getZH('trueText', 'common') : getZH('falseText', 'common')
        },
        {
            field: 'customerUpdate',
            headerName: getZH('updateFlag'),
            width: 100,
            cellRenderer: params => params.value ? getZH('trueText', 'common') : getZH('falseText', 'common')
        },
        {
            headerName: getZH('warehouseName'),
            field: 'warehouseName',
            width: 120
        },
        {
            headerName: getZH('customerWarehouseCode'),
            field: 'customerWarehouseCode',
            width: 160
        },
        {
            field: 'pickup',
            headerName: getZH('isPickup'),
            width: 100,
            cellRenderer: params => params.value ? getZH('trueText', 'common') : getZH('falseText', 'common')
        },
        {
            headerName: getZH('commercialInvoice'),
            field: 'commercialInvoice',
            width: 120
        },
        {
            headerName: getZH('containerNumber'),
            field: 'containerNumber',
            width: 120

        },
        {
            headerName: getZH('palletqty'),
            field: 'trayCount',
            width: 140
        },
        {
            headerName: getZH('cnt'),
            field: 'totalQuantity',
            width: 120
        },
        {
            headerName: getZH('unpackFlag'),
            field: 'unpackFlag',
            width: 120,
            cellRenderer: params => params.value ? 'Y' : 'N'

        },
        {
            headerName: getZH('ediSendTime'),
            field: 'ediSendTimeStr',
            width: 220
        },
        {
            headerName: getZH('planDeliverTime'),
            field: 'planDeliverTimeStr',
            width: 220
        },
        {
            headerName: getZH('planPickTime'),
            field: 'planPickTimeStr',
            width: 220
        },
        {
            headerName: getZH('term'),
            field: 'term',
            width: 160
        },
        {
            headerName: getZH('traceAppoint'),
            field: 'traceAppointFlag',
            width: 140,
            cellRenderer: params => params.value ? 'Y' : 'N'
        },

        {
            field: 'abnormalMessage',
            headerName: getZH('abnormalMessage'),
            width: 100
        },
        {
            headerName: getZH('operation'), pinned: 'right', field: `id`, width: 220,
            cellRendererFramework: 'OperationTaskBtn'
        }
    ]
  }
  
  