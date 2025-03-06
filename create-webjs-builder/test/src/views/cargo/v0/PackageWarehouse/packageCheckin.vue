<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-radio-group v-model="inputType" style="margin-left: 25px;">
          <el-radio :label="1">{{$t('packageWarehouse.quickHandler')}}</el-radio>
          <el-radio :label="2">{{$t('packageWarehouse.electronicWeigher')}}</el-radio>
        </el-radio-group>
        <el-checkbox v-model="bulkyCargo" style="margin-left: 80px;">{{$t('packageWarehouse.bulkyCargo')}}</el-checkbox>
        <ReportController :channel.sync="channel" />
        <el-form :model="packageForm" style="margin-top: 20px;" ref="packageForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.orderNo')}: `" prop="orderNo">
                <el-input v-model.trim="packageForm.orderNo" @keyup.enter.native="handlerCheckInput" clearable @clear="resetForm" size="mini" ref="orderNoInput"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundWeight')}: `" prop="inboundWeight">
                <NumberInput
                v-model.trim="packageForm.inboundWeight"
                :disabled="!bulkyCargo"
                :limitRange="{digits: 3, decimal: 3}"
                @keyup.enter.native="handlerCheckInput"
                ref="weightInput"/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-checkbox v-model="weightDiffTrigger" style="margin-left: 20px; margin-top: 10px;">{{$t('packageWarehouse.weightDiffTrigger')}}</el-checkbox>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundLength')}: `" prop="inboundLength">
                <NumberInput
                v-model.trim="packageForm.inboundLength"
                limitType="decimal"
                :limitRange="{digits: 3, decimal: 1}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundWidth')}: `" prop="inboundWidth">
                <NumberInput
                v-model.trim="packageForm.inboundWidth"
                limitType="decimal"
                :limitRange="{digits: 3, decimal: 1}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundHeight')}: `" prop="inboundHeight">
                <NumberInput
                v-model.trim="packageForm.inboundHeight"
                limitType="decimal"
                :limitRange="{digits: 3, decimal: 1}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <span>&nbsp;</span>
            </el-col>
            <el-col :span="3" v-show="bulkyCargo === true">
              <!-- <el-button type="primary" size="mini" style="margin-top: 5px;" @click="handlerBulkyCargo">{{$t('common.submitBtn')}}</el-button> -->
              <el-button type="primary" size="mini" style="margin-top: 5px;" @click="handlerBulkyCargo">{{$t('common.confirmBtn')}}</el-button>
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
            <p class="total-weight">
              <span>
                {{$t('packageWarehouse.totalWeight')}}:
                {{totalWeight}} KG
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
import { sendPackageInfoApi, getBalanceWeightApi, sendDataResultToItoolsApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import ReportController from './components/ReportController'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'PackageCheckin',
  mixins: [InnerMixins],
  components: {
    NumberInput,
    ReportController
  },
  data() {
    return {
      loading: false,
      inputType: 1,
      bulkyCargo: false,
      resultText: '',
      resultSuccess: false,
      channel: [0, 3],
      weightDiffTrigger: false,
      lockedNo: '',
      tplOrderNo: '',
      packageForm: {
        orderNo: '',
        inboundWeight: '',
        inboundLength: '',
        inboundWidth: '',
        inboundHeight: '',
        original: ''
      },
      reportList: [
        {
          label: this.$t('packageWarehouse.reportWeight'),
          value: 0
        },
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
      callbackObj: null,
      packageList: [],
      socketPath: 'ws://127.0.0.1:4040',
      socket: null,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      gridHeight: 'height: calc(100vh - 450px);',
      soundObj: {
        weight: '',
        other: []
      }
    }
  },
  computed: {
    scanQuantity: function() {
      return this.packageList.length
    },
    totalWeight: function() {
      let weight = 0
      this.packageList.forEach(item => {
        weight += Number(item.inboundWeight)
      })
      weight = Math.round(weight * 1000) / 1000
      return weight
    }
  },
  watch: {
    inputType: function(val) {
      if (val === 2) {
        this.packageForm.inboundLength = '1'
        this.packageForm.inboundWidth = '1'
        this.packageForm.inboundHeight = '1'
      }
    },
    weightDiffTrigger: function(newVal, oldVal) {
      if (newVal) {
        this.packageForm.inboundFrequency = 1
      } else {
        delete this.packageForm.inboundFrequency
      }
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
    handlerBulkyCargo() {
      this.validateKeyInfo()
    },
    handlerCheckInput() {
      if (!this.bulkyCargo) {
        // if (this.inputType === 1) {
        //   // 快手
        //   this.validateKeyInfo()
        // } else {
        //   // 电子秤
        //   setTimeout(() => {
        //     this.getWeightFromTools()
        //   }, 200)
        // }

        // 输入框回车事件
        this.validateKeyInfo()
      } else {
        // this.soundAOPlay()
        this.resultSuccess = false
        this.resultText = this.$t('packageWarehouse.submitBtnError')
      }
    },
    validateKeyInfo() {
      if (this.packageForm.orderNo.length === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.orderNoEmptyError'), false)
        this.$refs.orderNoInput.focus()
        this.packageForm.inboundWeight = ''
      } else if (this.packageForm.inboundWeight.length === 0 || this.packageForm.inboundWeight === '.' || Number(this.packageForm.inboundWeight) === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.weightEmptyError'), false)
        this.packageForm.inboundWeight = ''
        this.$refs.weightInput.keepFocus()
      } else {// 非泡货处理
        if (!this.bulkyCargo) {
          this.filterFormField()
          this.resultText = ''
          this.submitFormData()
        } else {
          // 泡货情况处理
          // 判断体积是否输入
          if (this.checkBulkyCargoVolume()) {
            this.resultSuccess = true
            this.resultText = ''
            this.filterFormField()
            this.submitFormData()
          } else {
            this.soundAOPlay(this.$t('packageWarehouse.bulkyCargoError'), false)
          }
        }
      }
    },
    filterFormField() {
      this.packageForm.inboundWeight = this.filterWeight(this.packageForm.inboundWeight)
      this.packageForm.inboundLength = this.filterVolume(this.packageForm.inboundLength)
      this.packageForm.inboundWidth = this.filterVolume(this.packageForm.inboundWidth)
      this.packageForm.inboundHeight = this.filterVolume(this.packageForm.inboundHeight)
    },
    filterWeight(str) {
      if (str.indexOf('.') === 0) {return 0 + str}

      if (str.indexOf('.') === str.length - 1) {return str.split('.')[0]}

      return str
    },
    filterVolume(str) {
      if (str) {
        if (Number(str) === 0) {return '1'}
        return Number(str) + ''
      }
      return '1'
    },
    checkBulkyCargoVolume() {
      if (this.packageForm.inboundLength === '.' || this.packageForm.inboundWidth === '.' || this.packageForm.inboundHeight === '.') {
        return false
      } else if (this.packageForm.inboundLength.length === 0 || this.packageForm.inboundWidth.length === 0 || this.packageForm.inboundHeight.length === 0) {
        return false
      } else {
        return true
      }
    },
    // async getWeightFromTools() { // 电子秤 获取重量
    //   if (!!this.packageForm.orderNo) {
    //     const res = await getBalanceWeightApi({numnber: this.packageForm.orderNo, caseNo: ''})
    //     if (res.data === 0) {
    //       setTimeout(() => {
    //         this.getWeightFromTools()
    //       }, 200)
    //     } else {
    //       this.packageForm.inboundWeight = res.data + ''
    //       this.validateKeyInfo()
    //     }
    //   } else {
    //     this.soundAOPlay()
    //     this.resultText = this.$t('packageWarehouse.orderNoEmptyError')
    //     this.$refs.orderNoInput.focus()
    //   }
    // },
    async submitFormData() {
      // 发生第一次重量差异后，判断称重包裹是否与上一次相同
      if (this.lockedNo.length > 0 && this.packageForm.orderNo !== this.lockedNo && this.weightDiffTrigger) {
        this.$alert(this.$t('packageWarehouse.weightDiffFirst'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.confirmBtn'),
          callback: action => {}
        })
        return false
      }
      if (this.loading) {return false}

      // 备份当前orderNo
      this.tplOrderNo = this.packageForm.orderNo
      this.loading = true
      const res = await sendPackageInfoApi(this.packageForm)
      this.callbackObj = this.setCallbackObj(res)
      /*
      * 适应连扫操作
      * 立即清空表单
      * 接收下一次输入
      */
      this.resetForm(false)
      if (res && res.ok && res.content) {
        this.lockedNo = ''
        this.tplOrderNo = ''

        /*
         * 启用首次重量差异播报的情况下
         * 重量差异频次重置为 1
        */
        if (this.packageForm.inboundFrequency) {
          this.packageForm.inboundFrequency = 1
        }

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

          this.packageList.unshift({
            orderNo: res.content.orderNo,
            trackingNo: res.content.trackingNo,
            inboundTime: res.content.inboundTime,
            createWeight: res.content.createWeight,
            declareWeight: res.content.declareWeight,
            inboundWeight: res.content.inboundWeight,
            weightVariation: res.content.weightVariation,
            chineseName: res.content.chineseName,
            countryName: res.content.countryName,
            productName: res.content.productName
          })
        }
      } else {
        if (res.errors) {
          // 重量差异第一次报错
          if (res.errors[0].code === 'ilw.lock.info.type.weight_diff' && this.weightDiffTrigger) {
            this.lockedNo = this.tplOrderNo
            this.soundAOPlay(this.$t('packageWarehouse.weightDiffFirst'), false)
            if (this.packageForm.inboundFrequency) {
              this.packageForm.inboundFrequency++
            }
          } else {
            this.soundAOPlay(res.errors[0].message, true)
          }
        } else {
          this.soundAOPlay(this.$t('packageWarehouse.systemError'), false)
        }
      }
      this.loading = false
      this.socketSend()
    },
    clearList() {
      this.packageList = []
      this.focusInput()
    },
    resetForm(clearResult = true) {
      this.packageForm.orderNo = ''
      this.packageForm.inboundWeight = ''
      this.packageForm.inboundLength = ''
      this.packageForm.inboundWidth = ''
      this.packageForm.inboundHeight = ''
      this.packageForm.original = ''
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
        // 监听socket消息
        this.socket.onmessage = this.getSocketMessage
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
    getSocketMessage(env) {
      if (env.data) {
        const msg = JSON.parse(env.data)
        this.packageForm.original = msg.original ? msg.original : ''

        // 电子秤接收数据只修改重量
        if (this.packageForm.original === 'DZC') {
          this.packageForm.inboundWeight = msg.weight ? msg.weight + '' : ''
        } else {
          this.packageForm.orderNo = msg.ticketsNum ? msg.ticketsNum : ''
          this.packageForm.inboundWeight = msg.weight ? msg.weight + '' : ''
          this.packageForm.inboundLength = msg.length ? msg.length + '' : ''
          this.packageForm.inboundWidth = msg.width ? msg.width + '' : ''
          this.packageForm.inboundHeight = msg.height ? msg.height + '' : ''
        }

        // 防止快手模式时一直接收电子秤的数据
        if (this.inputType === 1 && msg.original === "KS") {
          if (this.bulkyCargo) { // 泡货手动提交
            this.soundAOPlay(this.$t('packageWarehouse.submitBtnError'), false)
          } else { // 非泡货自动提交
            this.validateKeyInfo()
          }
        }
      }
    },
    async socketSend() {
      if (this.inputType === 1 && this.callbackObj) {
        // this.socket.send(JSON.stringify(this.callbackObj))
        const res = await sendDataResultToItoolsApi(this.callbackObj)
        this.callbackObj = null
      }
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
    // const tabArr = this.$store.getters.visitedViews.filter(v => v.name == 'QuicklyInQuicklyOut' || v.name == 'SecondaryMatch' || v.name == 'PackageCheckout' || v.name == 'PackageReceived' || v.name == 'AgentParcelRecived' || v.name == 'BoxPerOrder' || v.name == 'SwapBox')
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
      // rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }

    this.columnFields = [
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
        field: 'inboundTime',
        headerName: this.$t('packageWarehouse.checkinDate'),
        minWidth: 200,
        cellRenderer: params => this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'createWeight',
        headerName: this.$t('packageWarehouse.createWeight'),
        minWidth: 100
      },
      {
        field: 'declareWeight',
        headerName: this.$t('packageWarehouse.declareWeight'),
        minWidth: 100
      },
      {
        field: 'inboundWeight',
        headerName: this.$t('packageWarehouse.inboundWeight'),
        minWidth: 100
      },
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
  },
  destroyed() {
    this.socket.onclose = this.socketClose
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
