<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-form :model="packageForm" style="margin-top: 20px;" label-width="100px" size="mini">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.boxNo')}: `" prop="boxNo">
                <el-input v-model.trim="packageForm.boxNo" @keyup.enter.native="handleBoxNoInput" size="mini" ref="boxNoInput"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.productMaxWeight')}: `" prop="productMaxWeight">
                <el-input style="min-width: 65px;" v-model.trim="productMaxWeight" disabled size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.productMinWeight')}: `" prop="productMinWeight">
                <el-input style="min-width: 65px;" v-model.trim="productMinWeight" disabled size="mini"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item :label="`${$t('packageWarehouse.boxType')}: `" prop="boxType">
                <el-radio-group v-model="packageForm.boxType" @change="saveBoxType">
                  <el-radio v-for="item in boxTypeList" :key="item" :label="item">{{item}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.length')}: `" prop="boxLength">
                <NumberInput
                v-model.trim="packageForm.boxLength"
                :limitRange="{digits: 3, decimal: 1}"
                :disabled="packageForm.boxType != 'others'"
                ref="boxLength"
                :change="() => {switchToNextNumberInput('boxWidth')}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.width')}: `" prop="boxWidth">
                <NumberInput
                v-model.trim="packageForm.boxWidth"
                :limitRange="{digits: 3, decimal: 1}"
                :disabled="packageForm.boxType != 'others'"
                ref="boxWidth"
                :change="() => {switchToNextNumberInput('boxHeight')}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.height')}: `" prop="boxHeight">
                <NumberInput
                v-model.trim="packageForm.boxHeight"
                :limitRange="{digits: 3, decimal: 1}"
                :disabled="packageForm.boxType != 'others'"
                ref="boxHeight"
                :change="() => {switchToNextNumberInput('boxWeightTare')}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.tare')}: `" prop="boxWeightTare">
                <NumberInput
                v-model.trim="packageForm.boxWeightTare"
                :limitRange="{digits: 3, decimal: 3}"
                :disabled="packageForm.boxType != 'others'"
                ref="boxWeightTare"
                :change="() => {$refs.orderNoInput.focus()}" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.codeNo')}: `">
                <el-input v-model="packageForm.orderNo" ref='orderNoInput' @keyup.enter.native="checkOrderNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <ReportController :channel.sync="channel" style="margin-left: 60px;" />
            </el-col>
          </el-row>
        </el-form>
        <div class="result-text">
          <span class="text-shwo">{{resultText}}</span>
        </div>
      </div>
      <div class="table-wrap">
        <div class="total-info-box">
          <div class="statistics-box">
            <p class="box-number">
              <span>
                {{$t('packageWarehouse.boxNo')}}:
                {{packageForm.boxNo}}
              </span>
            </p>
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
          <div class="clear-btn-wrap">
            <el-button type="primary" size="mini" style="margin-top: 5px;" @click="printTag">{{$t('packageWarehouse.printTag')}}</el-button>
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
import { getBoxInfoApi, getBoxTypeApi, orderSwapBoxApi, printOutboundTagApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import ReportController from './components/ReportController'
import { deepClone } from '@/utils'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'SwapBox',
  mixins: [InnerMixins],
  components: {
    NumberInput,
    ReportController
  },
  data() {
    return {
      loading: false,
      socket: null,
      socketPath: 'ws://127.0.0.1:4040',
      channel: [0, 3],
      scanCount: 0,
      showRecoveryBtn: false,
      resultText: '',
      validateType: 1,
      productMaxWeight: '',
      productMinWeight: '',
      packageForm: {
        boxId: '',
        orderNo: '',
        boxNo: '',
        boxType: '',
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
        boxWeightTare: '',
        parcelTotalWeight: 0
      },
      boxTypeList: [],
      boxSizeList: [],
      packageList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      gridHeight: 'height: calc(100vh - 480px);',
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
    storageBoxType: function() {
      return localStorage.getItem('checkoutBoxType') ? localStorage.getItem('checkoutBoxType') : 'others'
    }
  },
  watch: {
    'packageForm.boxType': function(val) {
      if (val === 'others') {
        setTimeout(() => {
          this.$refs.boxLength.keepFocus()
        }, 200)
      } else {
        const _tpl = this.boxSizeList[this.boxTypeList.findIndex(item => item === val)]
        this.packageForm = {...this.packageForm, ..._tpl}
      }
    },
    'packageForm.boxNo': function(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.packageList = []
        this.resetForm()
      }
    },
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
    switchToNextNumberInput(name) {
      this.$refs[name].keepFocus()
    },
    saveBoxType(val) {
      localStorage.setItem('checkoutBoxType', val)
    },
    async getBoxType() {
      const res = await getBoxTypeApi({
        pageNum: 1,
        pageSize: 999
      })
      if (res && res.ok) {
        this.boxTypeList = []
        this.boxSizeList = []
        if (res.content && res.content.list && res.content.list.length > 0) {
          res.content.list.forEach(item => {
            this.boxTypeList.push(item.packingCode)
            this.boxSizeList.push({
              boxLength: item.length + '',
              boxWidth: item.width + '',
              boxHeight: item.height + '',
              boxWeightTare: item.weightTare + ''
            })
          })
        }
      }
      this.boxTypeList.push('others')
      this.boxSizeList.push({
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
        boxWeightTare: ''
      })

      this.packageForm.boxType = this.storageBoxType
    },
    async handleBoxNoInput() {
      if (this.loading) {return false}
      this.loading = true
      // 请求箱号数据
      if (this.packageForm.boxNo.length === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.boxNoEmptyError'), false)
      } else {
        const res = await getBoxInfoApi(this.packageForm.boxNo)
        if (res && res.ok && res.content) {
          // 已封箱
          if (res.content.boxState !== 0) {
            this.soundAOPlay(this.$t('packageWarehouse.boxSafekeeping'), false)
            this.showRecoveryBtn = true
          } else {
            this.showRecoveryBtn = false
            this.resultText = ''
            this.packageForm.boxId = res.content.id
            this.packageForm.boxType = res.content.boxType ? res.content.boxType : this.storageBoxType
            this.productMaxWeight = res.content.productMaxWeight
            this.productMinWeight = res.content.productMinWeight
            this.packageForm.boxWeightTare = res.content.boxWeight + ''
            this.packageForm.boxLength = res.content.boxLength + ''
            this.packageForm.boxWidth = res.content.boxWidth + ''
            this.packageForm.boxHeight = res.content.boxHeight + ''
            if (res.content.parcelDTOList) {
              res.content.parcelDTOList.forEach(item => {
                this.updatePackageList(item)
              })
            }
          }
        } else if (res.ok) { // 新箱子
          this.resultText = ''
          this.packageForm.boxType = this.storageBoxType
        } else {
          // 接口错误
          if (res.errors) {
            this.soundAOPlay(res.errors[0].message, true)
          } else {
            this.soundAOPlay(this.$t('packageWarehouse.systemError'), false)
          }
        }
      }
      this.loading = false
    },
    checkOrderNo() {
      if (this.packageForm.boxNo.length === 0) { // 箱号为空
        this.soundAOPlay(this.$t('packageWarehouse.boxNoEmptyError'), false)
        this.$refs.boxNoInput.focus()
      } else if (this.packageForm.boxType.length === 0) { // 箱型为空
        this.soundAOPlay(this.$t('packageWarehouse.boxTypeEmptyError'), false)
      } else if (!this.checkVolume()) { // 体积不正确
        this.soundAOPlay(this.$t('packageWarehouse.boxVolumeError'), false)
      } else if (!this.checkTare()) { // 皮重不正确
        this.soundAOPlay(this.$t('packageWarehouse.boxTareError'), false)
      } else if (this.packageList.length > 0 && this.packageForm.parcelTotalWeight > this.productMaxWeight) { // 重量超限
        this.soundAOPlay(this.$t('packageWarehouse.limitedWeightError'), false)
      } else {
        this.resultText = ''
        this.submitFormData()
      }
    },
    checkVolume() {
      if (this.packageForm.boxLength.length === 0 || this.packageForm.boxWidth.length === 0 || this.packageForm.boxHeight.length === 0) {
        return false
      } else if (this.packageForm.boxLength === '.' || this.packageForm.boxWidth === '.' || this.packageForm.boxHeight === '.') {
        return false
      } else {
        this.filterNumberInput('boxLength')
        this.filterNumberInput('boxWidth')
        this.filterNumberInput('boxHeight')
        return true
      }
    },
    checkTare() {
      if (this.packageForm.boxWeightTare === '.' || this.packageForm.boxWeightTare.length === 0) {
        return false
      } else {
        this.filterNumberInput('boxWeightTare')
        return true
      }
    },
    filterNumberInput(name) {
      let _value = this.packageForm[name]
      if (_value.indexOf('.') === 0) {
        this.packageForm[name] = 0 + _value
      }

      if (_value.indexOf('.') === _value.length - 1) {
        this.packageForm[name] = _value.split('.')[0]
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
      const res = await orderSwapBoxApi(_submitObj)
      if (res && res.ok) {
        this.soundObj.weight = ""
        this.soundObj.other = []
        // 出库异常
        if (res.content.failMsgName.length > 0) {
          this.soundAOPlay(res.content.failMsgName, true)
        } else { // 正常出库
          this.soundObj.weight = ""
          this.soundObj.other = []
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
          this.packageForm.boxId = res.content.boxId
          this.productMaxWeight = res.content.productMaxWeight
          this.productMinWeight = res.content.productMinWeight
          this.updatePackageList(res.content)
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
    updatePackageList(item) {
      const oldRecord = this.packageList.some(pkg => pkg.id === item.id)
      if (!oldRecord) {
        this.packageList.unshift({
          id: item.id,
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
    resetForm() {
      this.packageForm.boxId = ''
      this.productMaxWeight = ''
      this.productMinWeight = ''
      // this.packageForm.boxWeightTare = ''
      // this.packageForm.boxLength = ''
      // this.packageForm.boxWidth = ''
      // this.packageForm.boxHeight = ''
    },
    resetOrderNo() {
      this.packageForm.orderNo = ""
    },
    async printTag() { // 打印标签
      this.loading = true
      const res = await printOutboundTagApi(this.packageForm.boxId, this.packageForm)
      if (res && res.ok && res.content) {
        printJS({
          printable: res.content,
          type: 'pdf',
          base64: true
        })
        this.packageList = []
      }
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
        // 监听socket错误信息http://s3m4.fenxi.com/galileo/47c2796cbb9a7dd79aa35e4be68b1cc7.gif
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
    // const tabArr = this.$store.getters.visitedViews.filter(v => v.name == 'QuicklyInQuicklyOut' || v.name == 'SecondaryMatch' || v.name == 'PackageCheckout' || v.name == 'PackageCheckin' || v.name == 'AgentParcelRecived' || v.name == 'BoxPerOrder' || v.name == 'PackageReceived')
    // tabArr.forEach(item => {
    //   this.$store.dispatch('tagsView/delView', item)
    // })

    this.getBoxType()
    this.$refs.boxNoInput.focus()
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
  padding: 20px 0 10px 0;
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
  margin-left: 60px;
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
