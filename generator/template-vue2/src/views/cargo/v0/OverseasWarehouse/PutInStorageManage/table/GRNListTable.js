import i18n from '@/lang' // Internationalization

function getZH(key, obj) {
    obj = obj || 'putInStorageManage'
    let str = obj + '.' + key
    return i18n.t(str)
}

export default {
    defaultFlag: true,
    moduleName: '海外仓-入库管理-入库单',
    moduleCode: 'OVL_GRNLIST_TABLE_PAGE',
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
            field: 'customerName',
            headerName: getZH('customerName', 'common'),
            width: 100
        },
        {
            field: 'orderInboundNo',
            headerName: getZH('orderInboundNo'),
            width: 120
        },
        {
            field: 'appointInboundNo',
            headerName: getZH('storageReservationNumber'),
            width: 160
        },
        {
            field: 'warehouseName',
            headerName: getZH('warehouse'),
            width: 120
        },
        {
            field: 'createTimeStr',
            headerName: getZH('createTime'),
            width: 160
        },
        {
            field: 'pushTimeStr',
            headerName: getZH('pushTime'),
            width: 160
        },
        {
            field: 'orderStateName',
            headerName: getZH('orderState'),
            width: 100

            // orderState.operatorDealStatus==10
        },
        {
            field: 'skuKindQuantity',
            headerName: getZH('forecastSKUTypes'),
            width: 120
        },
        {
            field: 'skuQuantity',
            headerName: getZH('forecastSKUTotal'),
            width: 120
        },
        {
            field: 'deliverCargoStartTimeStr',
            headerName: getZH('deliverCargoBeginTime'),
            width: 160
        },
        {
            field: 'deliverCargoEndTimeStr',
            headerName: getZH('deliverCargoCompleteTime'),
            width: 160
        },
        {
            field: 'putawaySkuKindsQuantity',
            headerName: getZH('groupingSkuKindQuantity'),
            width: 100
        },
        {
            field: 'putawaySkuQuantity',
            headerName: getZH('groupingSkuQuantity'),
            width: 100
        },
        {
            field: 'firstPutawayTimeStr',
            headerName: getZH('firstPutawayTime'),
            width: 160
        },
        {
            field: 'putawayCompleteTimeStr',
            headerName: getZH('putawayCompleteTime'),
            width: 160
        },
        {
            field: 'etaStr',
            headerName: getZH('ETA'),
            width: 160
        },
        {
            field: 'submitTimeStr',
            headerName: getZH('submitTime'),
            width: 160
        },
        {
            field: 'inWarehouseTypeName',
            headerName: getZH('inWarehouseType'),
            width: 100
        },
        {
            field: 'deliverTypeName',
            headerName: getZH('deliverType'),
            width: 100
        },
        {
            field: 'pushStateName',
            headerName: getZH('push_status'),
            width: 100
        },
        {
            field: 'containerNo',
            headerName: getZH('containerNo'),
            width: 100
        },
        {
            field: 'reason',
            headerName: getZH('rejectReason'),
            width: 100,
            cellRenderer: params => {
                if (params.data.orderState === 3 || params.data.pushState === 4 || params.data.orderState === 7) {
                    return params.data.reason
                }
                return ''
            }
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
            width: 300
        },
        {
            field: 'sellerName',
            headerName: getZH('sellerName', 'outInStorageManage'),
            width: 150
        },
        {
            field: 'id',
            headerName: getZH('operation', 'common'),
            width: 200,
            pinned: 'right',
            cellRendererFramework: 'grnViewDetailBtn'
        }
    ]
  }
  
  