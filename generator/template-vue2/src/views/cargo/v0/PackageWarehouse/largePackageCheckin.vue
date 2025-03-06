<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-form :model="packageForm" ref="packageForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`${$t('packageWarehouse.largePackageNo')}: `" prop="boxNo">
                <el-input v-model.trim="packageForm.boxNo" @keyup.enter.native="validateKeyInfo" clearable size="mini" ref="orderNoInput"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :label="`${$t('packageWarehouse.mostWeightVariation')}: `" prop="weight">
                <NumberInput
                v-model.trim="packageForm.weight"
                limitType="positive"
                :limitRange="{digits: 6, decimal: 0}"
                ref="weightInput"
                :change="validateKeyInfo" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item :label="`${$t('packageWarehouse.largePackageWeight')}: `" prop="steelyardWeight">
                <NumberInput
                v-model.trim="packageForm.steelyardWeight"
                :limitRange="{digits: 4, decimal: 3}"
                ref="steelyardWeight"
                :change="validateKeyInfo" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-col :span="3">
              <el-form-item :label="`${$t('packageWarehouse.largePackageWeight')}: `" prop="steelyardWeight">
                <NumberInput
                v-model.trim="packageForm.steelyardWeight"
                :limitRange="{digits: 4, decimal: 3}"
                ref="steelyardWeight"
                :change="validateKeyInfo" />
              </el-form-item>
            </el-col>
          </el-row> -->
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
import { sendLargePackageInfoApi, getBalanceWeightApi, sendDataResultToItoolsApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'LargePackageCheckin',
  mixins: [InnerMixins],
  components: {
    NumberInput
  },
  data() {
    return {
      loading: false,
      resultText: '',
      resultSuccess: false,
      packageForm: {
        weight: '',
        steelyardWeight: '',
        boxNo: ''
      },
      callbackObj: null,
      packageList: [],
      socketPath: 'ws://127.0.0.1:4040',
      socket: null,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      gridHeight: 'height: calc(100vh - 380px);',
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
        weight += Number(item.totalWeight)
      })
      weight = Math.round(weight * 1000) / 1000
      return weight
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
      if (this.packageForm.boxNo.length === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.largePackageNoEmpty'), false)
        this.$refs.orderNoInput.focus()
      } else if (this.packageForm.weight.trim().length === 0 || Number(this.packageForm.weight) === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.mostWeightVariationEmpty'), false)
        this.packageForm.weight = ''
        this.$refs.weightInput.keepFocus()
      } else if (this.packageForm.steelyardWeight.trim().length === 0 || this.packageForm.steelyardWeight.trim() === '.' || Number(this.packageForm.steelyardWeight) === 0) {
        this.soundAOPlay(this.$t('packageWarehouse.largePackageWeightEmpty'), false)
        this.packageForm.steelyardWeight = ''
        this.$refs.steelyardWeight.keepFocus()
      } else {// 非泡货处理
        this.filterFormField()
        this.resultText = ''
        this.submitFormData()
      }
    },
    filterFormField() {
      this.packageForm.steelyardWeight = this.filterWeight(this.packageForm.steelyardWeight)
      this.packageForm.weight = this.filterWeight(this.packageForm.weight)
    },
    filterWeight(str) {
      if (str.indexOf('.') === 0) {return 0 + str}
      if (str.indexOf('.') === str.length - 1) {return str.split('.')[0]}
      return str
    },
    async submitFormData() {
      if (this.loading) {return false}
      this.loading = true
      const res = await sendLargePackageInfoApi(this.packageForm)
      /*
      * 适应连扫操作
      * 立即清空表单
      * 接收下一次输入
      */
      this.resetForm(false)
      if (res && res.ok && res.content) {
        this.resultSuccess = true
        this.resultText = ''
        this.soundObj.weight = ""
        this.soundObj.other = []

        this.packageList.unshift({
          boxNo: res.content.boxNo,
          totalWeight: res.content.totalWeight,
          boxLength: res.content.boxLength,
          boxWidth: res.content.boxWidth,
          boxHeight: res.content.boxHeight,
          boxWeight: res.content.boxWeight
        })

        // 发送给小工具的消息
        this.callbackObj = {"result": true, "message": '成功'}
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
    clearList() {
      this.packageList = []
      this.focusInput()
    },
    resetForm(clearResult = true) {
      this.packageForm.boxNo = ''
      this.packageForm.steelyardWeight = ''
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
          this.packageForm.steelyardWeight = msg.weight ? msg.weight + '' : ''
        } else {
          this.packageForm.boxNo = msg.ticketsNum ? msg.ticketsNum : ''
          this.packageForm.steelyardWeight = msg.weight ? msg.weight + '' : ''
        }

        // 防止快手模式时一直接收电子秤的数据
        if (msg.original === "KS") {
          this.validateKeyInfo()
        }
      }
    },
    async socketSend() {
      if (this.callbackObj) {
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
    }
  },
  mounted() {
    this.createWebsocket()
    // 关闭快进快出/二次称重标签/出库/揽收，避免websocket串台
    this.filterCloseMenu()
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
        field: 'boxNo',
        headerName: this.$t('packageWarehouse.boxNo'),
        minWidth: 200
      },
      {
        field: 'totalWeight',
        headerName: this.$t('packageWarehouse.largePackageWeight'),
        minWidth: 200
      },
      {
        field: 'boxLength',
        headerName: this.$t('packageWarehouse.length'),
        minWidth: 120
      },
      {
        field: 'boxWidth',
        headerName: this.$t('packageWarehouse.width'),
        minWidth: 120
      },
      {
        field: 'boxHeight',
        headerName: this.$t('packageWarehouse.height'),
        minWidth: 120
      },
      {
        field: 'boxWeight',
        headerName: this.$t('packageWarehouse.tare'),
        minWidth: 120
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
#app .el-form-item{
  margin-bottom: 0;
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
