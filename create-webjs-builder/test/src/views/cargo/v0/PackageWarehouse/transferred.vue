<template>
  <div v-loading="loading" class="right-main-wrapper">
    <section class="info-form">
      <div class="top-box">
        <el-radio-group v-model="transferType" style="margin-left: 25px;" @change="handlerTypeChange">
          <el-radio :label="1">{{$t('packageTransfer.transferByPackage')}}</el-radio>
          <el-radio :label="2">{{$t('packageTransfer.transferByBox')}}</el-radio>
        </el-radio-group>
        <el-form :model="transferForm" style="margin-top: 20px;" ref="transferForm" label-width="100px" size="mini">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-form-item :label="`${$t('packageTransfer.warehouseList')}: `" prop="destinationWarehouseId">
                <el-select v-model="transferForm.destinationWarehouseId">
                  <el-option v-for="warehouse in warehouseList" :key="warehouse.value" :value="warehouse.value" :label="warehouse.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="`${$t('packageTransfer.tplParcelNo')}: `" prop="requisitionNo" v-show="parcelTransfer">
                <el-input v-model="transferForm.requisitionNo" disabled></el-input>
              </el-form-item>
              <el-form-item :label="`${$t('packageTransfer.boxNo')}: `" prop="boxNo" v-show="!parcelTransfer">
                <el-input v-model="transferForm.boxNo" ref="boxNoInput" @keyup.enter.native="validateKeyInfo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-show="parcelTransfer">
            <el-col :span="10">
              <el-form-item :label="`${$t('packageTransfer.orderNo')}: `" prop="orderNo">
                <el-input v-model="transferForm.orderNo" ref="orderNoInput" @keyup.enter.native="validateKeyInfo"></el-input>
              </el-form-item>
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
            <el-button type="primary" size="mini" style="margin-top: 5px;" @click="printTag" v-show="parcelTransfer">{{$t('packageWarehouse.printTag')}}</el-button>
            <el-button type="primary" size="mini" style="margin-top: 5px;" @click="clearList">{{$t('packageWarehouse.clearBtn')}}</el-button>
          </div>
        </div>
        <ag-grid-vue
          :locale-text-func="_i18nGridLocalText"
          :grid-options="gridOptions"
          :side-bar="sideBarDefs"
          :column-defs="dataColumnFields"
          :row-data="dataList"
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
import { getWarehouseListApi } from '@/api/packageWarehouse'
import { transferByParcelApi, transferByBoxApi, createJobNoApi, printTagsApi } from '@/api/packageTransfer'
import RevokeTransferredBtn from './components/RevokeTransferredBtn'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import InnerMixins from './mixin/InnerMixins'
import printJS from 'print-js'
export default {
  name: 'Transferred',
  mixins: [InnerMixins],
  components: {
    NumberInput,
    RevokeTransferredBtn
  },
  data() {
    return {
      loading: false,
      transferType: 1,
      resultText: '',
      resultSuccess: false,
      transferForm: {
        destinationWarehouseId: '',
        requisitionNo: '',
        orderNo: '',
        boxNo: ''
      },
      callbackObj: null,
      warehouseList: [],
      parcelList: [],
      boxList: [],
      socketPath: 'ws://127.0.0.1:4040',
      socket: null,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      parcelColumnFields: [],
      boxColumnFields: [],
      gridHeight: 'height: calc(100vh - 450px);',
      soundObj: {
        weight: '',
        other: []
      }
    }
  },
  computed: {
    parcelTransfer: function() {
      return this.transferType === 1
    },
    scanQuantity: function() {
      return this.parcelTransfer ? this.parcelList.length : this.boxList.length
    },
    totalWeight: function() {
      let weight = 0
      if (this.parcelTransfer) {
        this.parcelList.forEach(item => {
          weight += Number(item.inboundWeight)
        })
      } else {
        this.boxList.forEach(item => {
          weight += Number(item.netWeight)
        })
      }
      weight = Math.round(weight * 1000) / 1000
      return weight
    },
    dataList: function() {
      return this.parcelTransfer ? this.parcelList : this.boxList
    },
    dataColumnFields: function() {
      return this.parcelTransfer ? this.parcelColumnFields : this.boxColumnFields
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
    async getBagNo() {
      const res = await createJobNoApi()
      if (res && res.ok) {
        this.transferForm.requisitionNo = res.content
      }
    },
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 100})
      if (res && res.ok && res.content) {
        this.warehouseList = [
          {
            label: this.$t('packageWarehouse.statusAll'),
            value: null
          }
        ]

        res.content.list.forEach(item => {
          this.warehouseList.push({
            label: item.name,
            value: item.id
          })
        })
      }
    },
    transferTypeChange() {
      if (this.transferType === 1) {
        this.getBagNo()
      } else {
        this.transferForm.requisitionNo = ''
      }
    },
    validateKeyInfo() {
      if (!this.transferForm.destinationWarehouseId) {
        this.soundAOPlay(this.$t('packageTransfer.warehouseEmptyError'), false)
        return false
      }

      if (this.parcelTransfer) {
        if (this.transferForm.orderNo.length === 0) {
          this.soundAOPlay(this.$t('packageTransfer.orderNoEmptyError'), false)
          this.focusInput()
          return false
        }
      } else {
        if (this.transferForm.boxNo.length === 0) {
          this.soundAOPlay(this.$t('packageTransfer.boxNoEmptyError'), false)
          this.focusInput()
          return false
        }
      }

      this.submitFormData()
    },
    async submitFormData() {
      if (this.loading) {return false}
      this.loading = true
      let res = null
      if (this.parcelTransfer) {
        res = await transferByParcelApi(this.transferForm)
      } else {
        res = await transferByBoxApi(this.transferForm)
      }

      /*
      * 适应连扫操作
      * 立即清空表单
      * 接收下一次输入
      */
      this.resetForm()
      if (res && res.ok && res.content) {
        this.resultSuccess = true
        this.resultText = ''
        if (this.parcelTransfer) {
          this.parcelList.push(res.content)
        } else {
          this.boxList.push(res.content)
        }
        this.focusInput()
        // 发送给小工具的消息
        // this.callbackObj = {"result": true, "message": '成功'}
        this.soundObj = {
          weight: res.content.inboundWeight,
          other: []
        }
        this.soundTrigger()
      } else {
        if (res.errors) {
          this.soundAOPlay(res.errors[0].message, true)
          // this.callbackObj = {"result": false, "message": res.errors[0].message}
        } else {
          this.soundAOPlay(this.$t('packageTransfer.systemError'), false)
          // this.callbackObj = {"result": false, "message": this.$t('packageTransfer.systemError')}
        }
      }
      this.loading = false
      // this.socketSend()
    },
    async printTag() { // 打印标签
      if (this.parcelList.length > 0) {
        this.loading = true
        const res = await printTagsApi(this.parcelList[0].id)
        if (res && res.ok && res.content) {
          printJS({
            printable: res.content,
            type: 'pdf',
            base64: true
          })
          if (this.singlePrint) {
            this.focusInput()
          }
        }
        this.loading = false
      } else {
        this.$message.warning(this.$t('packageTransfer.noIdError'))
      }
    },
    clearList() {
      if (this.parcelTransfer) {
        this.parcelList = []
        this.getBagNo()
      } else {
        this.boxList = []
      }
    },
    resetForm() {
      this.transferForm.orderNo = ''
      this.transferForm.boxNo = ''
      this.resultText = ''
    },
    focusInput() {
      this.$nextTick(() => {
        if (this.parcelTransfer) {
          this.$refs.orderNoInput.focus()
        } else {
          this.$refs.boxNoInput.focus()
        }
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
        this.transferForm.original = msg.original ? msg.original : ''

        // 电子秤接收数据只修改重量
        if (this.transferForm.original === 'DZC') {
          this.transferForm.inboundWeight = msg.weight ? msg.weight + '' : ''
        } else {
          this.transferForm.orderNo = msg.ticketsNum ? msg.ticketsNum : ''
          this.transferForm.inboundWeight = msg.weight ? msg.weight + '' : ''
          this.transferForm.inboundLength = msg.length ? msg.length + '' : ''
          this.transferForm.inboundWidth = msg.width ? msg.width + '' : ''
          this.transferForm.inboundHeight = msg.height ? msg.height + '' : ''
        }

        // 防止快手模式时一直接收电子秤的数据
        if (this.parcelTransfer && msg.original === "KS") {
          this.validateKeyInfo()
        }
      }
    },
    // socketSend() {
    //   if (this.callbackObj) {
    //     this.socket.send(JSON.stringify(this.callbackObj))
    //     this.callbackObj = null
    //   }
    // },
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
    handlerTypeChange() {
      // const allColumnIds = []
      // // this.columnApi.getColumns().forEach((column) => {
      // //   allColumnIds.push(column.getId())
      // // })
      // // this.columnApi.autoSizeColumns(allColumnIds)
      // this.columnApi.autoSizeColumns()
      this.initGridHeight()
    },
    initGridHeight() {
      // this.transferTypeChange()
      const _topBoxHeight = document.querySelector('.top-box').offsetHeight
      const _totalInfoBox = document.querySelector('.total-info-box').offsetHeight
      this.resetHeight(_topBoxHeight + _totalInfoBox)
    },
    spliceArray(id) { // 撤销出库 - 去掉列表中的数据
      this.loading = true
      this.parcelList.splice(this.parcelList.findIndex(item => item.id === id), 1)
      this.loading = false
    }
  },
  mounted() {
    this.initGridHeight()
    this.createWebsocket()
    // 关闭快进快出/二次称重标签/出库/揽收，避免websocket串台
    this.filterCloseMenu()
  },
  created() {
    this.getBagNo()
    this.getWarehouseList()
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      // rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }

    this.parcelColumnFields = [
      {
        field: 'parcelId',
        headerName: '',
        minWidth: 100,
        cellRendererFramework: 'RevokeTransferredBtn',
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
        headerName: this.$t('packageTransfer.transferList.orderNo'),
        minWidth: 200
      },
      {
        field: 'trackingNo',
        headerName: this.$t('packageTransfer.transferList.trackingNo'),
        minWidth: 200
      },
      {
        field: 'inboundTime',
        headerName: this.$t('packageTransfer.transferList.inboundTime'),
        minWidth: 200,
        cellRenderer: params => this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'requisitionNo',
        headerName: this.$t('packageTransfer.transferList.tplParcelNo'),
        minWidth: 200
      },
      {
        field: 'loadingWarehouseName',
        headerName: this.$t('packageTransfer.transferList.loadingWarehouseName'),
        minWidth: 100
      },
      {
        field: 'destinationWarehouseName',
        headerName: this.$t('packageTransfer.transferList.destinationWarehouseName'),
        minWidth: 100
      },
      {
        field: 'productName',
        headerName: this.$t('packageTransfer.transferList.channel'),
        minWidth: 100
      }
    ]

    this.boxColumnFields = [
      {
        field: 'requisitionNo',
        headerName: this.$t('packageTransfer.transferList.requisitionNo'),
        minWidth: 200
      },
      {
        field: 'requisitionTime',
        headerName: this.$t('packageTransfer.transferList.requisitionTime'),
        minWidth: 200,
        cellRenderer: params => this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'loadingWarehouseName',
        headerName: this.$t('packageTransfer.transferList.loadingWarehouseName'),
        minWidth: 200
      },
      {
        field: 'destinationWarehouseName',
        headerName: this.$t('packageTransfer.transferList.destinationWarehouseName'),
        minWidth: 100
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
