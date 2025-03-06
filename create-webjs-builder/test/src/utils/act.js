/* 财务模块相关的js*/
import { formatNumberToThousands } from '@/utils'
import {parseTime} from '@/utils/index'
// 财务结算模块-用到的通用费用列（费用明细、追加费用等，核销历史显示费用除外）
export function getActChargeCommonColumnDefs(isHideCheckbox) {
  return [
    {
      headerName: '', width: 55, checkboxSelection: true, pinned: 'left',
      headerCheckboxSelection: true,
      suppressSorting: true, suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
      hide: isHideCheckbox
    }, {
      headerName: 'Id',
      field: 'id',
      hide: true
    }, {
      headerName: '结算单位',
      field: 'customerName'
    }, {
      headerName: '票', width: 100,
      field: 'bInvoice',
      cellRenderer: params => {
        const iconName = params.value ? 'icon-checkmark-circle-outline' : 'icon-guanbi'
        const color = params.value ? '#34B805' : '#929292'
        return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 14px;"></i>`
        // const iconName = params.value ? 'checkbox-checked' : 'checkbox-notChecked'
        // return `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;">
        //       <use xlink:href="#icon-${iconName}"></use></svg>`
      }
    }, {
      headerName: '销', width: 100,
      field: 'bClear',
      cellRenderer: params => {
        const iconName = params.value ? 'icon-checkmark-circle-outline' : 'icon-guanbi'
        const color = params.value ? '#34B805' : '#929292'
        return `<i class="iconfont ${iconName}" style="color: ${color}; font-size: 14px;"></i>`
        // const iconName = params.value ? 'checkbox-checked' : 'checkbox-notChecked'
        // return `<svg class="svg-icon" aria-hidden="true" style="height:1em;width:1em;">
        //       <use xlink:href="#icon-${iconName}"></use></svg>`
      }
    }, {
      headerName: '业务编号',
      field: 'jobNo'
    }, {
      headerName: '主单号',
      field: 'mblNo'
    }, {
      headerName: '委托单位',
      field: 'customerName'
    }, {
      headerName: '委托单位简称',
      field: 'customerAbbreviation'
    }, {
      headerName: '承运人简称',
      field: 'carrierCode'
    }, {
      headerName: '承运人',
      field: 'carrierName'
    }, {
      headerName: '船名航次',
      field: 'vesselVoyage'
    }, {
      headerName: '业务日期',
      field: 'businessDate',
      cellRenderer: params => parseTime(params.value, '{y}-{m}-{d}')
    }, {
      headerName: '起运港/POL',
      field: 'pol'
    }, {
      headerName: '卸货港/POD',
      field: 'discharge'
    }, {
      headerName: '费用项名称',
      field: 'feeItemName'
    }, {
      headerName: '收支',
      field: 'arApDesc'
    }, {
      headerName: '币种',
      field: 'currency'
    }, {
      headerName: '费用金额',
      field: 'amount',
      type: 'numericColumn',
      cellRenderer: params => formatNumberToThousands(params.value)
    }, {
      headerName: 'P/C',
      field: 'ppCcDesc',
      hide: true
    }, {
      headerName: '数量',
      field: 'num',
      hide: true
    }, {
      headerName: '单位',
      field: 'unit',
      hide: true
    }, {
      headerName: '单价',
      field: 'price',
      type: 'numericColumn',
      cellRenderer: params => formatNumberToThousands(params.value),
      hide: true
    }
  ]
}
