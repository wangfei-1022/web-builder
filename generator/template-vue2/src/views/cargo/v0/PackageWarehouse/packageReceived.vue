<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-form :model="packageForm" ref="packageForm" label-width="80px" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.bagNo')}: `" prop="bagNo">
                <el-input v-model.trim="packageForm.bagNo" @keyup.enter.native="validateKeyInfo" clearable size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.orderNo')}: `" prop="orderNo">
                <el-input v-model.trim="packageForm.orderNo" @keyup.enter.native="validateKeyInfo" clearable @clear="resetForm" size="mini" ref="orderNoInput"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <ReportController :channel.sync="channel" :reportList="reportList" />
            </el-col>
          </el-row>
        </el-form>
        <div :class="['result-text', {'error-text': !resultSuccess}]">
          {{resultText}}
        </div>
      </div>
      <div class="table-wrap">
        <div class="total-info-box">
          <div class="statistics-box">
            <p class="total-quantity">
              <span>
                {{$t('packageWarehouse.scanQuantity')}}:
                {{scanQuantity}} PCS
              </span>
            </p>
          </div>
          <div class="clear-btn-wrap">
            <el-button type="primary" size="mini" style="margin-top: 5px;" @click="clearList">{{$t('packageWarehouse.clearBtn')}}</el-button>
          </div>
        </div>
        <ag-grid-vue
          :locale-text-func="_i18nGridLocalText"
          :grid-options="gridOptions"
          :side-bar="sideBarDefs"
          :column-defs="columnFields"
          :row-data="packageList"
          :enable-col-resize="true"
          :enable-sorting="true"
          :grid-ready="onReady"
          :animate-rows="false"
          :style="gridHeight"
          class="ag-theme-balham" />
      </div>
    </section>
  </div>
</template>
<script>
import { receivedPackageApi } from '@/api/packageWarehouse'
import ReportController from './components/ReportController'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'PackageReceived',
  mixins: [InnerMixins],
  components: {
    ReportController
  },
  data() {
    return {
      loading: false,
      socket: null,
      socketPath: 'ws://127.0.0.1:4040',
      resultText: '',
      resultSuccess: false,
      channel: [1, 3],
      packageForm: {
        orderNo: '',
        bagNo: ''
      },
      reportList: [
        {
          label: this.$t('packageWarehouse.reportCountry'),
          value: 1
        },
        {
          label: this.$t('packageWarehouse.reportProduct'),
          value: 2
        },
        {
          label: this.$t('packageWarehouse.reportArea'),
          value: 3
        }
      ],
      packageList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      gridHeight: 'height: calc(100vh - 320px);',
      soundObj: {
        weight: '',
        other: []
      }
    }
  },
  computed: {
    scanQuantity: function() {
      return this.packageList.length
    }
  },
  watch: {},
  methods: {
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    validateKeyInfo() {
      if (this.packageForm.orderNo.length === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.orderNoEmptyError'), false)
        this.$refs.orderNoInput.focus()
      } else {
        this.resultText = ''
        this.submitFormData()
      }
    },
    async submitFormData() {
      this.loading = true
      const res = await receivedPackageApi(this.packageForm)
      /*
      * 适应连扫操作
      * 立即清空表单
      * 接收下一次输入
      */
      this.resetForm(false)
      if (res && res.ok && res.content) {
        if (res.content.lockType < 0 || this.failArr.includes(res.content.lockType)) {
          // 入库失败
          this.soundAOPlay(res.content.lockTypeName, true)
        } else {
          this.resultSuccess = true
          this.resultText = ''
          this.soundObj.weight = ""
          this.soundObj.other = []
          if (res.content.lockTypeName) {
            this.resultText = res.content.lockTypeName
            this.soundObj.other.push(res.content.lockTypeName)
          }
          // 播报语音
          if (this.channel.length > 0) {
            this.channel.forEach(v => {
              if (v === 1) {
                this.soundObj.other.push(res.content.countryName)
              }
              if (v === 2) {
                this.soundObj.other.push(res.content.productName)
              }
              if (v === 3 && res.content.productExtData !== "") {
                const _json = JSON.parse(res.content.productExtData)
                if (_json.area) {
                  this.soundObj.other.push(_json.area)
                }
              }
            })
            this.soundTrigger()
          }

          this.packageList.unshift({
            bagNo: res.content.bagNo,
            orderNo: res.content.orderNo,
            customerRefNo: res.content.customerRefNo,
            trackingNo: res.content.trackingNo,
            receivedTime: res.content.receivedTime,
            chineseName: res.content.chineseName,
            productName: res.content.productName
          })
        }
      } else {
        if (res.errors) {
          this.soundAOPlay(res.errors[0].message, true)
        } else {
          this.soundAOPlay(this.$t('packageWarehouse.systemError'), false)
        }
      }
      this.loading = false
    },
    clearList() {
      this.packageList = []
      this.focusInput()
    },
    resetForm(clearResult = true) {
      this.packageForm.orderNo = ''
      if (clearResult) {
        this.resultText = ''
      }
      this.focusInput()
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.orderNoInput.focus()
      })
    },
    createWebsocket() {
      if (typeof WebSocket === "undefined") {
        console.log("WebSocket undefined")
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.socketPath)
        // 监听socket连接
        this.socket.onopen = this.socketOpen
        // 监听socket错误信息
        this.socket.onerror = this.socketError
        // socket close
        this.socket.onclose = this.socketClose
      }
    },
    socketOpen(env) {
      console.log('socket contented')
    },
    socketError(err) {
      console.log(err)
    },
    socketClose() {
      console.log('socket closed')
    },
    soundAOPlay(errorText, isExt) {
      this.soundObj.weight = ''
      this.soundObj.other = isExt ? ['sound_ao', errorText] : ['sound_ao']
      this.soundTrigger()
      this.resultSuccess = false
      this.resultText = errorText
    },
    soundTrigger() {
      this.socket.send(JSON.stringify(this.soundObj))
    },
    initGridHeight() {
      const _topBoxHeight = document.querySelector('.top-box').offsetHeight
      const _totalInfoBox = document.querySelector('.total-info-box').offsetHeight
      this.resetHeight(_topBoxHeight + _totalInfoBox)
    }
  },
  mounted() {
    this.initGridHeight()
    this.createWebsocket()
    // 关闭快进快出/入库标签，避免websocket串台
    this.filterCloseMenu()
    // const tabArr = this.$store.getters.visitedViews.filter(v => v.name == 'QuicklyInQuicklyOut' || v.name == 'SecondaryMatch' || v.name == 'PackageCheckout' || v.name == 'PackageCheckin' || v.name == 'AgentParcelRecived' || v.name == 'BoxPerOrder' || v.name == 'SwapBox')
    // tabArr.forEach(item => {
    //   this.$store.dispatch('tagsView/delView', item)
    // })

    this.focusInput()
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      // rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }

    this.columnFields = [
      {
        field: 'bagNo',
        headerName: this.$t('packageWarehouse.packageForm.bagNo'),
        minWidth: 200
      },
      {
        field: 'orderNo',
        headerName: this.$t('packageWarehouse.orderNo'),
        minWidth: 200
      },
      {
        field: 'customerRefNo',
        headerName: this.$t('packageWarehouse.customerRefNo'),
        minWidth: 200
      },
      {
        field: 'trackingNo',
        headerName: this.$t('packageWarehouse.trackingNo'),
        minWidth: 200
      },
      {
        field: 'receivedTime',
        headerName: this.$t('packageWarehouse.receivedTime'),
        minWidth: 200,
        cellRenderer: params => this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.chineseName'),
        minWidth: 120
      },
      {
        field: 'productName',
        headerName: this.$t('packageWarehouse.productName'),
        minWidth: 140
      }
    ]
  }
}
</script>
<style lang="scss" scoped>
@mixin flexTopRow{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
}
@mixin flexWrapRow{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}
.top-box{
  padding: 20px 0 10px 0;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
#app .el-form-item__label{
  font-size: 14px;
}
#app .el-form-item{
  margin-bottom: 10px;
}
.result-text{
  height: 24px;
  font-size: 20px;
  padding-left: 25px;
  color: #409EFF;
}
.error-text{
  color: red;
}
.total-info-box{
  @include flexTopRow;
  justify-content: space-between;
  width: 80%;
  align-items: center;
  padding: 0 30px;
}
.statistics-box{
  @include flexTopRow;
  justify-content: flex-start;
  align-items: center;
  p{
    font-size: 16px;
    color: #409eff;
  }
  .total-weight{
    margin-left: 60px;
  }
}
</style>
