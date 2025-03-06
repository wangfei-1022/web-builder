import { Message } from 'element-ui'
import i18n from '../lang'

const getGridSelected = function(gridOptions) {
  const selectedRows = gridOptions.api.getSelectedRows()
  console.log('getGridSelected', selectedRows)
  if (selectedRows.length <= 0) {
    return []
  }
  return selectedRows
}

const getGridSelectedIds = function(gridOptions, idName, tipMessage) {
  const rows = getGridSelected(gridOptions)
  const ids = rows.map((value, index, arr) => idName ? value[`${idName}`] : value.id)
  console.log('getGridSelectedIds:', ids)
  return new Promise((resolve, reject) => {
    if (ids.length > 0) {
      resolve(ids)
    } else {
      Message({
        message: tipMessage || i18n.t('common.dataEmptyTips'),
        type: 'error',
        duration: 5 * 1000
      })
      reject(tipMessage || i18n.t('common.dataEmptyTips'))
    }
  })
}

const getGridSelectedIdsV2 = function(gridOptions, idName, tipMessage) {
  const rows = getGridSelected(gridOptions)
  const ids = rows.map((value, index, arr) => idName ? value[`${idName}`] : value.id)
  return new Promise((resolve, reject) => {
    resolve(ids)
  })
}

const browseFolder = function(path) {
  // try {
  //   const Message = '\u8bf7\u9009\u62e9\u6587\u4ef6\u5939' // 选择框提示信息
  //   const Shell = new ActiveXObject('Shell.Application')
  //   new Workbook()
  //   let Folder = Shell.BrowseForFolder(0, Message, 64, 17) // 起始目录为：我的电脑
  //   // var Folder = Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面
  //   if (Folder != null) {
  //     Folder = Folder.items() // 返回 FolderItems 对象
  //     Folder = Folder.item() // 返回 Folderitem 对象
  //     Folder = Folder.Path // 返回路径
  //     if (Folder.charAt(Folder.length - 1) !== '\\') {
  //       Folder = Folder + '\\'
  //     }
  //     document.getElementById(path).value = Folder
  //     return Folder
  //   }
  // } catch (e) {
  //   alert(e.message)
  // }
}

export { getGridSelectedIds, getGridSelectedIdsV2, getGridSelected, browseFolder }
