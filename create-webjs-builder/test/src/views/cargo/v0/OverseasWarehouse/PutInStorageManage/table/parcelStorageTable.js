import i18n from '@/lang' // Internationalization

function getZH(key, obj) {
    obj = obj || 'putInStorageManage'
    let str = obj + '.' + key
    return i18n.t(str)
}

export default {
    defaultFlag: true,
    moduleName: '海外仓-入库管理-包裹入库',
    moduleCode: 'OVL_PARCEL_STORAGE_TABLE_PAGE',
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
            width: 100,
            pinned: 'left'
        },
        {
            field: 'orderInboundNo',
            headerName: getZH('orderInboundNo'),
            width: 160,
            pinned: 'left'
        },
        {
            field: 'warehouseName',
            headerName: getZH('warehouseId'),
            width: 100
        },
        {
            field: 'deliverModeTypeName',
            headerName: getZH('deliveryMethod'),
            width: 100
        },
        {
            field: 'expectArriveWarehouseTimeStr',
            headerName: getZH('expectArriveWarehouseTime'),
            width: 230
        },
        {
            field: 'orderStateName',
            headerName: getZH('orderState'),
            width: 100
        },
        {
            field: 'abnormalFlag',
            headerName: getZH('abnormalFlag'),
            width: 100,
            cellRenderer: params => params.value ? getZH('YES', 'common') : getZH('NO', 'common')
        },
        {
            field: 'boxQuantity',
            headerName: getZH('parcelQuantity'),
            width: 160
        },
        {
            field: 'skuKindQuantity',
            headerName: getZH('forecastSKUTypes'),
            width: 120,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'skuQuantity',
            headerName: getZH('forecastSKUTotal'),
            width: 120,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'createTimeStr',
            headerName: getZH('createTime'),
            width: 230
        },
        {
            field: 'submitTimeStr',
            headerName: getZH('submitTime'),
            width: 230
        },
        {
            field: 'firstPutawayTimeStr',
            headerName: getZH('firstPutawayTime'),
            width: 120,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'putawayCompleteTimeStr',
            headerName: getZH('putawayCompleteTime'),
            width: 160,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'putawaySkuKindsQuantity',
            headerName: getZH('groupingSkuKindQuantity'),
            width: 160,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'putawaySkuQuantity',
            headerName: getZH('groupingSkuQuantity'),
            width: 100,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'reason',
            headerName: getZH('refuseReason'),
            width: 100,
            cellRenderer: params => {
                if (params.data.orderState === 3 || params.data.pushState === 4 || params.data.orderState === 7) {
                    return params.data.reason
                }
                return '-'
            }
        },
        {
            field: 'abnormalMessage',
            headerName: getZH('abnormalMessage'),
            width: 160,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'remarks',
            headerName: getZH('remark'),
            width: 160,
            cellRenderer: params => params.value || '-'
        },
        {
            field: 'id',
            headerName: getZH('operation', 'common'),
            width: 200,
            pinned: 'right',
            cellRendererFramework: 'ParcelStorageBtn'
        }
    ]
  }
  
  