
import { exportOutboundsShipmentApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
import { handlerTimeStr } from '@/utils'
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant'
export default {
  data() {
    return {
      timeoutImg: require('@/assets/icon_overtime.png')
    }
  },
  computed: {
    filterDataList() {
      let arr = this.dataList
      let status = [215, 325, 330, 340, 345, 350]
      let currentTime = new Date().getTime() - 2 * 24 * 60 * 60 * 1000
      arr.forEach(item => {
        item.timeoutImg = this.timeoutImg
        let timeoutFlag = currentTime > item.createTime && status.includes(item.status)
        this.$set(item, 'timeoutFlag', timeoutFlag)
        let zone = this.isCurrentZone ? this.currentZone : item.warehouseZone
        let createTimeStr = handlerTimeStr(item.createTime, zone)
        this.$set(item, 'createTimeStr', createTimeStr)
        let outTimeStr = handlerTimeStr(item.outTime, zone)
        this.$set(item, 'outTimeStr', outTimeStr)
        let submitTimeStr = handlerTimeStr(item.submitTime, zone)
        this.$set(item, 'submitTimeStr', submitTimeStr)
      })
      return this.$extends(true, [], arr)
    }
  },
  methods: {
    /**
   * 面单导出
   */
    batchExportShipmentSaved(type, formData) {
      const _selectedRows = this.gridApi.getSelectedRows()
      let saveData = {}
      let data = { exportFileNameWay: type }
      let ids = []
      if (this.$isNotEmpty(_selectedRows)) {
        _selectedRows.forEach(item => {
          ids.push(item.id)
        })
        saveData = { ...{ ids, type: formData.type }, ...data }
      } else {
        saveData = { ...this.handlerQuery(), ...data }
      }
      this.loading = true
      exportOutboundsShipmentApi(saveData).then(res => {
        if (res.ok) {
          if (formData.type === 3) {
            // 添加日志 记录数据
            this.logBtnSend({
              origin: logOrigin.SYSTEM_OPERATION,
              logCode: type === 1 ? pointOvl.OVL_INBOUND_MERGE_PACK_ORDER_EXPORT : pointOvl.OVL_INBOUND_MERGE_PACK_EXPRESS_SHEET_EXPORT,
              serviceName: logServiceName.OVL_SERVICE,
              businessType: type === 1 ? pointOvl.OVL_INBOUND_MERGE_PACK_ORDER_EXPORT : pointOvl.OVL_INBOUND_MERGE_PACK_EXPRESS_SHEET_EXPORT,
              content: {
                ...saveData
              }
            })
          }
          this.$alert(`<div><span class="fc-red fs-16">${this.$t('outInStorageManage.handlerTime')}</span><span class="fs-16">,${this.$t('outInStorageManage.handlerRes')}</span></div>`, this.$t('outInStorageManage.handlerTips'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t('common.theKnow'),
            callback: () => {
              this.loading = false
            }
          })
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    /**
     * 处理异常文件
     */
    handleAbnormal(data) {
      this.activeId = data.id
      this.activeOrderNo = data.orderNo
      this.dialog.visible = true
    }
  }
}
