import { i18nGridLocalText } from '@/utils/agGrid'
import { isNumber, toSimulateRefreshingListBackingTo, formatNumberToThousands } from '@/utils'
import { getToken, getUserInfo } from '@/utils/auth'
import Bus from '@/utils/eventBus.js'
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant'
export default {
  data() {
    return {
      dialog: {
        visible: false,
        title: ''
      },
      logServiceName,
      logOrigin,
      pointOvl,
      gridHeight: null,
      tableHeight: 0
    }
  },
  filters: {
    formatNumberToThousandsFilter(number) {
      return formatNumberToThousands(number)
    }
  },
  methods: {
    _i18nGridLocalText(key, defaultValue) {
      return i18nGridLocalText(key, defaultValue)
    },
    _isNumber(val) {
      return isNumber(val)
    },
    _toSimulateRefreshingListBackingTo: toSimulateRefreshingListBackingTo,
    /**
     *表单提交定位
     *
     * @return {*}
     */
    mixinsFormScrollIntoView() {
      this.$nextTick(() => {
        const isError = document.getElementsByClassName('is-error')
        if (!isError[0]) {
          return
        }
        let input = isError[0].getElementsByTagName('input')
        if (!input || input.length === 0) {
          input = isError[0].getElementsByTagName('textarea')
        }
        if (input[0]) {
          input[0].focus()
        }
        isError[0].scrollIntoView({
          // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: 'center',
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: 'smooth'
        })
      })
    },
    /**
     *
     * @param {*} date 时间戳
     * @param {*} fmt 目标字符串格式 默认 YYYY-MM-DD HH:mm
     * @returns
     */
    formatDate(date, fmt) {
      if (this.$isEmpty(date)) {
        return ''
      }
      date = Number(date)
      fmt = fmt || 'YYYY-MM-DD HH:mm'
      return this.$moment(Number(date)).format(fmt)
    },
    /**
    * 节流器
    */
    throttle(fn, delay, minTime) {
      if (typeof fn !== 'function') { return new Function() }
      let timer = null
      let startTime = null
      return () => {
        let now = +new Date()
        !startTime && (startTime = now)
        if (minTime && now - startTime > minTime) {
          fn()
          startTime = now
        } else {
          clearTimeout(timer)
          timer = setTimeout(() => {
            fn()
            startTime = null
          }, delay)
        }
      }
    },
    /**
    * 下载模板
    */
    downloadExcel(fileName) {
      if (!fileName) {
        return
      }
      const _fileName = fileName
      const link = document.createElement('a')
      link.download = _fileName
      link.href = encodeURI(`${process.env.VUE_APP_BASE_API}/api/mdm-service/template/excel/download?templateName=${_fileName}&Authorization=${getToken()}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    /**
    * 下载文件
    * fileObj: {filename, url}
    */
    downloadFile(fileObj) {
      const link = document.createElement('a')
      link.setAttribute('href', fileObj.url)
      link.setAttribute('target', '_blank')
      link.setAttribute('download', fileObj.fileName || ''); // 注意，一定要加这个
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    /*
    * 页面结构复杂时
    * 返回基本数值
    * 再根据页面具体情况进行加减
    */
    calcHeight(searchFormHeight) {
      /*
      * 针对一个页面多个Tabs
      * 并且多个Tabs下有多个不同的Search控件作兼容
      * 请以保持当多Tabs包含多Search及AGgrid时
      * 页面结构与 财务结算 - 税票开票管理等页面相同
      * 如再有复杂结构页面，请自行在对应页面计算高度值
      * 控件考虑的是通用情况，不应该包含所有情况作涵盖
      * 否则不利维护且对效率有影响
      */
      // 获取当前激活的Tab页
      const containerObj = document.querySelector('.top-tabs .el-tab-pane:not([style*="display: none"]):not([style*="display:none"])')
      // 获取激活的Tab页下相关控件占用的高度，非Tab下的控件从 document 获取
      let searchHeightObj = null
      let topBtnObj = null
      let pageTotalObj = null
      let paginationObj = null
      // 存在Tab控件的页面
      // if (tabObj && tabObj.length > 0) {
      if (containerObj) {
        searchHeightObj = containerObj.querySelector('.page-search') || document.querySelector('.page-search')
        topBtnObj = containerObj.querySelector('.top-btn-wrap') || document.querySelector('.top-btn-wrap')
        pageTotalObj = containerObj.querySelector('.page-total') || document.querySelector('.page-total')
        paginationObj = containerObj.querySelector('.pagination-container') || document.querySelector('.pagination-container')
      } else { // 没有Tab控件的页面
        searchHeightObj = document.querySelector('.page-search')
        topBtnObj = document.querySelector('.top-btn-wrap')
        pageTotalObj = document.querySelector('.page-total')
        paginationObj = document.querySelector('.pagination-container')
      }

      // 通用高度
      const topMenuHeight = document.querySelector('.top-menu-wrap') ? document.querySelector('.top-menu-wrap').offsetHeight : 0
      const fixedHeaderHeight = document.querySelector('.fixed-header') ? document.querySelector('.fixed-header').offsetHeight : 0
      const tabsHeight = document.querySelector('.top-tabs .el-tabs__header') ? document.querySelector('.top-tabs .el-tabs__header').offsetHeight : 0
      const middleTabsHeight = document.querySelector('.middle-tabs .el-tabs__header') ? document.querySelector('.middle-tabs .el-tabs__header').offsetHeight : 0

      // 统计各控件高度，计算出最终高度
      const optBtnWrapHeight = topBtnObj ? topBtnObj.offsetHeight : 0
      const searchHeight = searchHeightObj ? searchHeightObj.offsetHeight : 0
      const pageTotalHeight = pageTotalObj ? pageTotalObj.offsetHeight : 0
      const paginationHeight = paginationObj ? paginationObj.offsetHeight : 0
      let searchHeightCalc = searchFormHeight || searchHeight
      /*
      * 30 - table-wrap margin-top 20px + top-btn-wrap margin-bottom 10px;
      * 40 - right-main-wrapper padding: 20px + bottom space: 20px;
      */

      return topMenuHeight + fixedHeaderHeight + searchHeightCalc + optBtnWrapHeight + tabsHeight + middleTabsHeight + pageTotalHeight + paginationHeight + 30 + 40
    },
    /*
    * 通用调用
    * 为有顶部查询的页面计算列表高度
    * 返回一个css 对象
    */
    resetHeight(searchFormHeight) {
      const _height = this.calcHeight(searchFormHeight)
      this.gridHeight = {
        height: `calc(100vh - ${_height}px)`
      }

      // 计算给到el-table 使用
      const offsetHei = document.documentElement.clientHeight
      this.tableHeight = offsetHei - _height
    },
    /*
      用于AgGridVue计算剩余宽度的列，动态撑满空间
    */
    calcRemainingWidth(colums) {
      let bodyWidth = document.querySelector('.ag-theme-balham').clientWidth
      let width = 0
      colums.forEach(v => {
        width += Number(v.width || 0)
      })
      // 预留40的空间给到右侧的设置列功能
      let calc = Number(bodyWidth - width - 40).toFixed(0)
      // 假如不幸计算出来没有空间给到
      // 默认设置个一百吧
      return parseInt(calc, 10) < 0 ? 100 : parseInt(calc, 10)
    },
    /*
     多tab标签下有多个Search
    */
    calcPageSearchArr(_arr) {
      console.log(_arr)
    },

    /*
  用于点击按钮的业务数据收集。
*/
    logBtnSend(data) {
      // 添加日志 记录数据
      this.$webTracker.send({
        logType: 'business',
        logName: '按钮埋点',
        elementType: 'button',
        event: 'click',
        dateTime: Date.now(), // 操作时间
        userId: getUserInfo().id, // 操作用户id
        ...data
      })
    },
    // 用于二次提交确认
    async confirmTips(tipsMssage) {
      tipsMssage = tipsMssage || this.$t('common.deleteTips')
      await this.$confirm(tipsMssage, this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      })

    }
  },
  mounted() {
    Bus.$on('resetTopMenu', menuShow => {
      this.resetHeight()
    })
  }
}
