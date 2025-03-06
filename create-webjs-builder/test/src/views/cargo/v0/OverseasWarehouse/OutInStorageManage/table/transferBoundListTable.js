import i18n from '@/lang' // Internationalization

function getZH(key, obj) {
    obj = obj || 'outInStorageManage'
    let str = obj + '.' + key
    return i18n.t(str)
}

export default {
    defaultFlag: true,
    moduleName: '海外仓-出库管理-转运列表',
    moduleCode: 'OVL_TRANSFER_BOUND_TABLE_PAGE',
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
            headerName: getZH('customerName', 'common'),
            field: 'customerName',
            width: 140
        },
        {
            headerName: getZH('orderNo'),
            field: 'orderNo',
            width: 180,
            cellRenderer: params => {
                let divElement = document.createElement("div")
                divElement.className = "flex-box"
                let spanElement = document.createElement("span")
                spanElement.innerText = params.value
                divElement.appendChild(spanElement)
                if (params.data.timeoutFlag) {
                    let imageElement = document.createElement("img")
                    imageElement.src = params.data.timeoutImg
                    imageElement.title = "超48小时未出库"
                    imageElement.style.width = "16px"
                    imageElement.style.height = "16px"
                    imageElement.style.marginLeft = "10px"
                    divElement.appendChild(imageElement)
                }
                return divElement
            }
        },
        {
            headerName: getZH('abnormalFlag'),
            field: 'abnormalFlag',
            width: 120,
            cellRenderer: params => params.data.abnormalFlag ? getZH('isTrue') : getZH('isFalse')
        },
        {
            headerName: getZH('userOutBoundNo'),
            field: 'outOrderNo',
            width: 180
        },
        {
            headerName: getZH('loadingReference'),
            field: 'loadingReference',
            width: 120
        },
        {
            headerName: getZH('commercialInvoice'),
            field: 'commercialInvoice',
            width: 120
        },
        {
            headerName: getZH('tradeNo'),
            field: 'tradeNo',
            width: 120
        },
        {
            headerName: getZH('warehouse'),
            field: 'warehouseName',
            width: 120
        },
        {
            headerName: getZH('carrier'),
            field: 'carrierName',
            width: 120

        },
        {
            headerName: getZH('logicProductName'),
            field: 'productName',
            width: 120

        },
        {
            headerName: getZH('trackNo'),
            field: 'shipmentNos',
            width: 140,
            cellRendererFramework: 'ShipmentNos'
        },
        {
            headerName: getZH('orderType'),
            field: 'typeName',
            width: 120

        },
        {
            headerName: getZH('transportMode'),
            field: 'transportModeName',
            width: 120
        },
        {
            headerName: getZH('pickupType'),
            field: 'pickup',
            width: 140,
            cellRenderer: params => params.data.pickup ? getZH('isTrue') : getZH('isFalse')
        },
        {
            headerName: getZH('status'),
            field: 'statusName',
            width: 110
        },
        {
            headerName: getZH('skuSpecies'),
            field: 'skuKindsQuantity',
            width: 110
        },
        {
            headerName: getZH('theDelivery'),
            field: 'skuQuantity',
            width: 120
        },
        {
            headerName: getZH('outTime'),
            field: 'outTimeStr',
            width: 220
        },
        {
            headerName: getZH('submitTime'),
            field: 'submitTimeStr',
            width: 220
        },
        {
            headerName: getZH('createTime'),
            field: 'createTimeStr',
            width: 220
        },
        {
            headerName: getZH('arrivalContact'),
            field: 'arrivalContact',
            width: 120
        },
        {
            headerName: getZH('arrivalNormalized'),
            field: 'cityDetail',
            width: 160
        },
        {
            headerName: getZH('arrivalZipcode'),
            field: 'arrivalZipcode',
            width: 160
        },
        {
            headerName: getZH('email'),
            field: 'arrivalContactEmail',
            width: 160
        },
        {
            headerName: getZH('rejectMessage'),
            field: 'rejectMessage',
            width: 140
        },

        {
            headerName: getZH('abnormalMessage'),
            field: 'abnormalMessage',
            width: 150
        },
        {
            field: 'sellerName',
            headerName: getZH('sellerName'),
            width: 150
        },
        {
            headerName: getZH('operation'), pinned: 'right', field: `id`, width: 255,
            cellRendererFramework: 'OperationBtn'
        }
    ]
  }
  
  