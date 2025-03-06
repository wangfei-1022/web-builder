<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-form :model="packageForm" style="margin-top: 20px;" label-width="100px" size="mini">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.codeNo')}: `">
                <el-input v-model="packageForm.orderNo" ref='orderNoInput' @keyup.enter.native="checkOrderNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.boxSuffix')}: `" prop="boxNoSuffix">
                <el-input ref="suffixInput" @keyup.enter.native="checkSuffix" v-model.trim="packageForm.boxNoSuffix" size="mini" maxlength="5"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label="" label-width="0">
                <ReportController :channel.sync="channel" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label="" label-width="0">
                <el-checkbox v-model="printTrackNo">{{$t('packageWarehouse.printTrackNo')}}</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="$t('packageWarehouse.printDelay')">
                <el-input-number
                  v-model="printDelay"
                  controls-position="right"
                  :min="1"
                  :max="10"
                  :disabled="!this.printTrackNo"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="result-text">
          <span class="text-shwo">{{resultText}}</span>
          <!-- <el-button type="primary" size="mini" @click="recoveryBox" v-show="showRecoveryBtn">{{$t('packageWarehouse.recoveryBox')}}</el-button> -->
        </div>
      </div>
      <div class="table-wrap">
        <div class="total-info-box">
          <div class="statistics-box">
            <!-- <p class="box-number">
              <span>
                {{$t('packageWarehouse.boxNo')}}:
                {{packageForm.boxNo}}
              </span>
            </p> -->
            <p class="total-quantity">
              <span>
                {{$t('packageWarehouse.scanQuantity')}}:
                {{scanQuantity}} PCS
              </span>
            </p>
            <p class="total-weight">
              <span>
                {{$t('packageWarehouse.totalWeight')}}:
                {{packageForm.parcelTotalWeight}} KG
              </span>
            </p>
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
import printJS from 'print-js'
import { boxPerOrderApi, printOutboundTagApi } from '@/api/packageWarehouse'
import RevokeOutboundBtn from './components/RevokeOutboundBtn'
import ReportController from './components/ReportController'
import { deepClone } from '@/utils'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'BoxPerOrder',
  mixins: [InnerMixins],
  components: {
    RevokeOutboundBtn,
    ReportController
  },
  data() {
    return {
      loading: false,
      socket: null,
      socketPath: 'ws://127.0.0.1:4040',
      channel: [0, 3],
      scanCount: 0,
      // showRecoveryBtn: false,
      resultText: '',
      // validateType: 1,
      // productMaxWeight: '',
      // productMinWeight: '',
      singlePrint: true,
      printDelay: 2,
      printTrackNo: false,
      printUrl: '',
      urlTrackNo: '',
      packageForm: {
        orderNo: '',
        boxNoSuffix: ''
      },
      packageList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      gridHeight: 'height: calc(100vh - 300px);',
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
  watch: {
    'packageList': function() {
      let _tpl_total = 0
      this.packageList.forEach(item => {
        _tpl_total += Number(item.inboundWeight)
      })
      this.packageForm.parcelTotalWeight = this.getRound(_tpl_total, 3)
    }
  },
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
    checkSuffix() {
      if (this.packageForm.boxNoSuffix.length === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.boxSuffixEmpty'), true)
        this.$refs.suffixInput.focus()
      } else {
        this.packageForm.boxNoSuffix = this.packageForm.boxNoSuffix.toUpperCase()
        this.resultText = ''
        this.$refs.orderNoInput.focus()
      }
    },
    checkOrderNo() {
      if (this.packageForm.boxNoSuffix.length === 0) { // 后缀为空
        this.soundAOPlay(this.$t('packageWarehouse.boxSuffixEmpty'), false)
        this.$refs.suffixInput.focus()
      } else {
        this.resultText = ''
        this.submitFormData()
      }
    },
    async submitFormData() {
      // if (this.loading) {return false}
      this.loading = true
      /*
      * 适应连扫操作
      * 复制要提交的表单
      * 立即清空表单
      * 接收下一次输入
      */
      const _submitObj = deepClone(this.packageForm)
      this.resetOrderNo()
      const res = await boxPerOrderApi(_submitObj)
      if (res && res.ok) {
        this.soundObj.weight = ""
        this.soundObj.other = []
        // 出库异常
        if (res.content.failMsgName.length > 0) {
          this.soundAOPlay(res.content.failMsgName, true)
        } else { // 正常出库
          // 打印链接
          this.printUrl = res.content.boxUrl ? res.content.boxUrl : ''
          this.urlTrackNo = res.content.trackingNo ? res.content.trackingNo : ''
          // 播报语音
          if (this.channel.length > 0) {
            this.channel.forEach(v => {
              if (v === 0) {
                this.soundObj.weight = res.content.inboundWeight
              }
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

          this.resultText = ""
          this.updatePackageList(res.content)

          // 是否立即打印箱唛
          if (this.singlePrint) {
            this.printTag()
          }
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
    resetOrderNo() {
      this.packageForm.orderNo = ""
    },
    updatePackageList(item) {
      const oldRecord = this.packageList.some(pkg => pkg.id === item.id)
      if (!oldRecord) {
        this.packageList.unshift({
          id: item.id,
          boxNo: item.boxNo,
          orderNo: item.orderNo,
          trackingNo: item.trackingNo,
          boxTime: item.boxTime,
          inboundWeight: item.inboundWeight,
          declareWeight: item.declareWeight,
          weightVariation: item.weightVariation,
          chineseName: item.chineseName,
          countryName: item.countryName,
          productName: item.productName
        })
      }
    },
    async printTag() { // 打印标签
      this.loading = true
      if (this.printUrl !== '') {
        printJS({
          printable: this.printUrl,
          type: 'pdf',
          base64: true,
          onPrintDialogClose: () => {
            if (this.printTrackNo && this.urlTrackNo !== '') {
              setTimeout(() => {
                printJS({
                  printable: `https://www.eshippinggateway.com/ws-uexpress/u_print/order/license?fileType=orderLicense&number=${this.urlTrackNo}`,
                  type: 'pdf'
                })
              }, this.printDelay * 1000)
            }
          }
        })
      }

      if (this.singlePrint) {
        this.$nextTick(() => {
          this.$refs.orderNoInput.focus()
        })
      }
      this.loading = false
    },
    spliceArray(id) { // 撤销出库 - 去掉列表中的数据
      this.loading = true
      this.packageList.splice(this.packageList.findIndex(item => item.id === id), 1)
      this.loading = false
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
    getRound(num, len) {
      return Math.round(num * Math.pow(10, len)) / Math.pow(10, len)
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
    // 关闭快进快出/二次称重标签/出库/揽收，避免websocket串台
    this.filterCloseMenu()
    // const tabArr = this.$store.getters.visitedViews.filter(v => v.name == 'QuicklyInQuicklyOut' || v.name == 'SecondaryMatch' || v.name == 'PackageCheckin' || v.name == 'PackageReceived' || v.name == 'AgentParcelRecived' || v.name == "PackageCheckout" || v.name == 'SwapBox')
    // tabArr.forEach(item => {
    //   this.$store.dispatch('tagsView/delView', item)
    // })
    this.$refs.suffixInput.focus()
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
      // {
      //   field: 'id',
      //   headerName: '',
      //   minWidth: 100,
      //   cellRendererFramework: 'RevokeOutboundBtn',
      //   cellRendererParams: {
      //     showLoading: () => {this.loading = true},
      //     closeLoading: () => {this.loading = false},
      //     showError: msg => {
      //       this.soundAOPlay(msg, false)
      //     },
      //     spliceArray: this.spliceArray
      //   }
      // },
      {
        field: 'boxNo',
        headerName: this.$t('packageWarehouse.boxNo'),
        minWidth: 240
      },
      {
        field: 'orderNo',
        headerName: this.$t('packageWarehouse.orderNo'),
        minWidth: 200
      },
      {
        field: 'trackingNo',
        headerName: this.$t('packageWarehouse.trackingNo'),
        minWidth: 200
      },
      {
        field: 'boxTime',
        headerName: this.$t('packageWarehouse.checkoutDate'),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: 'inboundWeight',
        headerName: this.$t('packageWarehouse.checkinWeight'),
        minWidth: 100
      },
      {
        field: 'declareWeight',
        headerName: this.$t('packageWarehouse.declareWeight'),
        minWidth: 100
      },
      // {
      //   field: 'inboundWeight',
      //   headerName: this.$t('packageWarehouse.inboundWeight'),
      //   minWidth: 100
      // },
      {
        field: 'weightVariation',
        headerName: this.$t('packageWarehouse.weightVariation'),
        minWidth: 100
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.chineseName'),
        minWidth: 120
      },
      {
        field: 'countryName',
        headerName: this.$t('packageWarehouse.consigneeCountry'),
        minWidth: 100
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
  padding: 10px 0 10px 0;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
#app .el-form-item__label{
  font-size: 14px;
}
.result-text{
  font-size: 20px;
  height: 24px;
  padding-left: 60px;
  .text-shwo{
    color: red;
    min-width: 232px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 30px;
  }
}
.box-number{
  min-width: 100px;
}
.total-quantity{
  margin-left: 20px;
}
.table-wrap{
  margin-top: 10px;
}
.total-info-box{
  @include flexTopRow;
  justify-content: space-between;
  width: 80%;
  align-items: center;
  padding: 0 30px;
  margin-bottom: 20px;
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
