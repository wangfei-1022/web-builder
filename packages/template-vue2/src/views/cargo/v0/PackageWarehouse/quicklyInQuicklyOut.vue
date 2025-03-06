<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-radio-group v-model="validateType" style="margin-left: 25px;">
          <el-radio :label="1">{{$t('packageWarehouse.validateChannel')}}</el-radio>
          <el-radio :label="3">{{$t('packageWarehouse.validatePartner')}}</el-radio>
          <el-radio :label="2">{{$t('packageWarehouse.validatePrefix')}}</el-radio>
        </el-radio-group>
        <el-checkbox v-model="packageForm.checkArea" style="margin-left: 25px;">{{$t('packageWarehouse.checkAreaText')}}</el-checkbox>
        <span style="font-size: 14px; padding-left: 10px;">
          {{$t('packageWarehouse.ifWithElectric')}}:
          <el-radio-group v-model="packageForm.boxParcelType">
            <el-radio :label="0">{{$t('packageWarehouse.withoutElectric')}}</el-radio>
            <el-radio :label="1">{{$t('packageWarehouse.withElectric')}}</el-radio>
            <el-radio :label="2">{{$t('packageWarehouse.mixinElectric')}}</el-radio>
          </el-radio-group>
        </span>
        <el-radio-group v-model="inputType" style="margin-left: 40px;">
          <el-radio :label="1">{{$t('packageWarehouse.quickHandler')}}</el-radio>
          <el-radio :label="2">{{$t('packageWarehouse.electronicWeigher')}}</el-radio>
        </el-radio-group>
        <ReportController :channel.sync="channel" />
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
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundWeight')}: `" prop="inboundWeight">
                <NumberInput
                v-model.trim="packageForm.inboundWeight"
                disabled
                :limitRange="{digits: 3, decimal: 3}"
                @keyup.enter.native="handlerCheckInput"
                ref="weightInput"/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundLength')}: `" prop="inboundLength">
                <NumberInput
                disabled
                v-model.trim="packageForm.inboundLength"
                limitType="decimal"
                :limitRange="{digits: 3, decimal: 1}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundWidth')}: `" prop="inboundWidth">
                <NumberInput
                disabled
                v-model.trim="packageForm.inboundWidth"
                limitType="decimal"
                :limitRange="{digits: 3, decimal: 1}" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.packageForm.inboundHeight')}: `" prop="inboundHeight">
                <NumberInput
                disabled
                v-model.trim="packageForm.inboundHeight"
                limitType="decimal"
                :limitRange="{digits: 3, decimal: 1}" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div :class="['result-text', {'error-text': !resultSuccess}]">
          <span class="text-shwo">{{resultText}}</span>
          <el-button type="primary" size="mini" @click="recoveryBox" v-show="showRecoveryBtn">{{$t('packageWarehouse.recoveryBox')}}</el-button>
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
import { getBoxInfoApi, getBoxTypeApi, quicklyInQuicklyOutApi, printOutboundTagApi, recoveryBoxApi, sendDataResultToItoolsApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import RevokeOutboundBtn from './components/RevokeOutboundBtn'
import ReportController from './components/ReportController'
import InnerMixins from './mixin/InnerMixins'
// import axios from 'axios'
export default {
  name: 'QuicklyInQuicklyOut',
  mixins: [InnerMixins],
  components: {
    NumberInput,
    RevokeOutboundBtn,
    ReportController
  },
  data() {
    return {
      loading: false,
      channel: [0, 3],
      scanCount: 0,
      showRecoveryBtn: false,
      resultText: '',
      resultSuccess: false,
      validateType: 1,
      inputType: 1,
      productMaxWeight: '',
      productMinWeight: '',
      socket: null,
      socketPath: 'ws://127.0.0.1:4040',
      packageForm: {
        boxId: '',
        checkProduct: true,
        checkNumberPre: false,
        checkCarrier: false,
        checkArea: false,
        boxParcelType: 0,
        orderNo: '',
        boxNo: '',
        boxType: '',
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
        boxWeightTare: '',
        parcelTotalWeight: 0,
        inboundWeight: '',
        inboundLength: '',
        inboundWidth: '',
        inboundHeight: '',
        original: ''
      },
      boxTypeList: [],
      boxSizeList: [],
      packageList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      gridHeight: 'height: calc(100vh - 540px);',
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
      return localStorage.getItem('quicklyBoxType') ? localStorage.getItem('quicklyBoxType') : 'others'
    }
  },
  watch: {
    'validateType': function(val) {
      if (val === 1) {
        this.packageForm.checkProduct = true
        this.packageForm.checkNumberPre = false
        this.packageForm.checkCarrier = false
      } else if (val === 2) {
        this.packageForm.checkProduct = false
        this.packageForm.checkNumberPre = true
        this.packageForm.checkCarrier = false
      } else {
        this.packageForm.checkProduct = false
        this.packageForm.checkNumberPre = false
        this.packageForm.checkCarrier = true
      }
    },
    inputType: function(val) {
      if (val === 2) {
        this.packageForm.inboundLength = '1'
        this.packageForm.inboundWidth = '1'
        this.packageForm.inboundHeight = '1'
      }
    },
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
      localStorage.setItem('quicklyBoxType', val)
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
        this.packageForm.boxNo = this.packageForm.boxNo.toUpperCase()
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
            this.packageForm.boxType = !res.content.boxType ? res.content.boxType : this.storageBoxType
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
      if (this.loading) {return false}
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
        this.handlerCheckInput()
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
    handlerCheckInput() {
      // if (this.inputType === 1) {
      //   // 快手
      //   this.validateKeyInfo()
      // } else {
      //   // 电子秤
      //   setTimeout(() => {
      //     this.getWeightFromTools()
      //   }, 200)
      // }
      this.validateKeyInfo()
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
      } else {
        this.filterFormField()
        this.resultText = ''
        this.submitFormData()
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
    //     const res = await axios.get('http://127.0.0.1:4040/getBalanceWeight', {params: {numnber: this.packageForm.orderNo, caseNo: ''}})
    //     if (res.data === 0) {
    //       setTimeout(() => {
    //         this.getWeightFromTools()
    //       }, 200)
    //     } else {
    //       this.packageForm.inboundWeight = res.data+''
    //       this.validateKeyInfo()
    //     }
    //   } else {
    //     this.soundAOPlay()
    //     this.resultText = this.$t('packageWarehouse.orderNoEmptyError')
    //     this.$refs.orderNoInput.focus()
    //   }
    // },
    async submitFormData() {
      // if (this.loading) return false
      this.loading = true
      const res = await quicklyInQuicklyOutApi(this.packageForm)
      /*
      * 适应连扫操作
      * 立即清空表单
      * 接收下一次输入
      */
      this.resetOrderNo()
      if (res && res.ok) {
        // 出库异常
        if (res.content.failMsgName.length > 0) {
          this.soundAOPlay(res.content.failMsgName, true)

          // 发送给小工具的消息
          this.callbackObj = {"result": false, "message": res.content.failMsgName}
        } else if (res.content.lockType) {
          this.soundObj.weight = ''
          this.soundObj.other = ['sound_ao', this.$t('packageWarehouse.checkoutFailedText')]
          this.soundTrigger()
          this.resultSuccess = false
          this.resultText = this.$t('packageWarehouse.specialLockTypeError')

          // 发送给小工具的消息
          this.callbackObj = {"result": false, "message": this.$t('packageWarehouse.specialLockTypeError')}
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

          this.packageForm.boxId = res.content.boxId
          this.productMaxWeight = res.content.productMaxWeight
          this.productMinWeight = res.content.productMinWeight
          this.resultText = ''
          this.updatePackageList(res.content)
          this.callbackObj = {"result": true, "message": '成功'}
        }
      } else {
        if (res.errors) {
          this.soundAOPlay(res.errors[0].message, true)
          this.callbackObj = {"result": false, "message": res.errors[0].message}
        } else {
          this.soundAOPlay(this.$t('packageWarehouse.systemError'), false)
          this.callbackObj = {"result": false, "message": this.$t('packageWarehouse.systemError')}
        }
      }
      this.loading = false
      this.socketSend()
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
      this.packageForm.inboundWeight = ''
      this.packageForm.inboundLength = ''
      this.packageForm.inboundWidth = ''
      this.packageForm.inboundHeight = ''
      this.packageForm.original = ''
      this.$nextTick(() => {
        this.$refs.orderNoInput.focus()
      })
    },
    async printTag() { // 打印标签
      this.loading = true
      const res = await printOutboundTagApi(this.packageForm.boxId, this.packageForm)
      if (res && res.ok && !!res.content) {
        printJS({
          printable: res.content,
          type: 'pdf',
          base64: true
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
    getRound(num, len) {
      return Math.round(num * Math.pow(10, len)) / Math.pow(10, len)
    },
    async recoveryBox() {
      const res = await recoveryBoxApi(this.packageForm.boxNo)
      if (res.ok) {
        this.packageForm.boxId = res.content.id
        this.packageForm.boxType = res.content.boxType ? res.content.boxType : this.storageBoxType
        this.productMaxWeight = res.content.productMaxWeight
        this.productMinWeight = res.content.productMinWeight
        this.packageForm.boxWeightTare = res.content.boxWeight + ''
        this.packageForm.boxLength = res.content.boxLength + ''
        this.packageForm.boxWidth = res.content.boxWidth + ''
        this.packageForm.boxHeight = res.content.boxHeight + ''
        if (res.content.parcelDTOList) {
          this.$message.success(this.$t('packageWarehouse.recoverySuccess'))
          this.resultText = ""
          this.showRecoveryBtn = false
          this.packageList = []
          res.content.parcelDTOList.forEach(item => {
            this.updatePackageList(item)
          })
        }
      }
    },
    soundAOPlay(errorText, isExtend) {
      this.soundObj.weight = ''
      this.soundObj.other = isExtend ? ['sound_ao', errorText] : ['sound_ao']
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
    // const tabArr = this.$store.getters.visitedViews.filter(v => v.name == 'PackageCheckin' || v.name == 'SecondaryMatch' || v.name == 'PackageCheckout' || v.name == 'PackageReceived' || v.name == 'AgentParcelRecived' || v.name == 'BoxPerOrder' || v.name == 'SwapBox')
    // tabArr.forEach(item => {
    //   this.$store.dispatch('tagsView/delView', item)
    // })

    this.$refs.boxNoInput.focus()
    this.getBoxType()
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
        field: 'id',
        headerName: '',
        minWidth: 100,
        cellRendererFramework: 'RevokeOutboundBtn',
        cellRendererParams: {
          showLoading: () => {this.loading = true},
          closeLoading: () => {this.loading = false},
          showError: msg => {
            this.soundAOPlay(msg, false)
          },
          spliceArray: this.spliceArray
        }
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
  .text-shwo{
    min-width: 232px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 30px;
  }
}
.error-text{
  color: red;
}
.box-number{
  min-width: 100px;
}
.total-quantity{
  margin-left: 60px;
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
