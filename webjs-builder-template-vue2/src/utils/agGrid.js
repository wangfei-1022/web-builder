import Cookies from 'js-cookie'
import { i18n_ag_grid as i18nGridEn } from '@/lang/en'
import { i18n_ag_grid as i18nGridZh } from '@/lang/ZH-CN/i18n_ag_grid'
/**
 * 设置Ag-grid表格列自定义宽度（根据内容的多少进行适配）
 * @param self 组件对象
 * @param columnIds 设置自动宽度的列ids
 * @param gridOptions
 * @param isAllAuto 是否全部列自定义
 */
const setAutoSizeColumns = function({ self, columnIds, gridOptions, isAllAuto }) {
  let allColumnIds
  if (gridOptions && isAllAuto) {
    allColumnIds = []
    gridOptions.columnApi.getAllColumns().forEach(function(column) {
      console.log('column.colId', column.colId)
      if (column.colId === 'optColumn') {
        allColumnIds.push(column.colId)
      }
    })
  }
  setTimeout(function() {
    (gridOptions || self.gridOptions).columnApi.autoSizeColumns(columnIds || allColumnIds || ['optColumn'])
  })
}

// 列取适配window窗口
const setSizeColumnsToFit = function(params) {
  setTimeout(function() {
    params.api.sizeColumnsToFit()
  })
}

/**
 * 国际化grid的文本（根据语言返回不同的文本）
 * @param key
 * @param defaultValue
 */
export function i18nGridLocalText(key, defaultValue) {
  const lang = Cookies.get('language') || 'zh'
  let text = defaultValue
  if (lang === 'zh') {
    text = i18nGridZh[key]
  } else {
    text = i18nGridEn[key] || defaultValue
  }
  return text
}

export { setAutoSizeColumns, setSizeColumnsToFit }

