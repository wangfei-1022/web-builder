<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('packageWarehouse.productCode')}: `" prop="productId">
          <el-select v-model="multipleForm.productId"
            :placeholder="$t('common.placeholder')"
            filterable>
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.exactBoxNo')}: `" label-width="100px" prop="numbers">
          <el-input v-model="multipleForm.numbers" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData"></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.fuzzyBoxNo')}: `" label-width="100px" prop="numberVague">
          <el-input v-model="multipleForm.numberVague" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData"></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.selectionWarehouse')}: `" prop="boxWarehouseId">
          <el-select v-model="multipleForm.boxWarehouseId"
            :placeholder="$t('common.placeholder')"
            filterable>
            <el-option
              v-for="item in warehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.status')}: `" prop="boxState">
          <el-select v-model="multipleForm.boxState"
            :placeholder="$t('common.placeholder')"
            filterable>
            <el-option
              v-for="item in boxStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.destinationCountry')}: `" prop="countryCode">
          <el-select v-model="multipleForm.countryCode"
            :placeholder="$t('common.placeholder')"
            filterable>
            <el-option
              v-for="item in countryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.boundBatchLabel')}: `" prop="boundBatch">
          <el-select v-model="multipleForm.boundBatch"
            :placeholder="$t('common.placeholder')"
            clearable>
            <el-option
              v-for="item in boundBatchList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.boundBatchNo')}: `" prop="batchNo">
          <el-input v-model="multipleForm.batchNo"></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.ilpOMS.searchLabel')}: `" prop="parcelSource">
          <el-select v-model="multipleForm.parcelSource"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in isIlpOMSList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.statusDate')" prop="opreatorTime">
          <CommonPicker
            v-model="opreatorTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap">
        <el-button type="primary" size="mini" @click="batchOutBound">{{$t('packageWarehouse.batchOutBound')}}</el-button>
        <el-button type="primary" size="mini" @click="exportInfo">{{$t('packageWarehouse.exportInfo')}}</el-button>
        <el-button type="primary" size="mini" @click="printBoxTags">{{$t('packageWarehouse.printBoxTags')}}</el-button>
        <el-button type="primary" size="mini" @click="createBatch">{{$t('packageWarehouse.createBatch')}}</el-button>
        <el-button type="primary" size="mini" @click="copySelectedInfo($event)">{{$t('packageWarehouse.copySelectedBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="exportBoxImages">{{$t('packageWarehouse.exportBoxImages')}}</el-button>
        <el-button type="primary" size="mini" @click="removeBatch">{{$t('packageWarehouse.removeBatch')}}</el-button>
        <el-dropdown split-button type="primary" trigger="click" @click="printBoxTagsThirdPart" @command="redirectPrintPage" size="mini">
          {{$t('packageWarehouse.printBoxTagsThirdPart')}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">{{$t('packageWarehouse.redirectPrintPage')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="primary" size="mini" @click="printBoxTagsThirdPart">{{$t('packageWarehouse.printBoxTagsThirdPart')}}</el-button>
        <el-button type="primary" size="mini" @click="redirectPrintPage">{{$t('packageWarehouse.redirectPrintPage')}}</el-button> -->
      </div>
      <ul class="total-info-wrap">
        <li>
          <span class="label">{{$t('packageWarehouse.totalCount')}}</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.netWeight')}}</span>
          <span class="info">{{totalInfo.netWeight}} kg</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.tare')}}</span>
          <span class="info">{{totalInfo.tare}} kg</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.grossHeavy')}}</span>
          <span class="info">{{totalInfo.grossHeavy}} kg</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.inboundChargeWeight')}}</span>
          <span class="info">{{totalInfo.inboundChargeWeight}} kg</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.ticketQuantity')}}</span>
          <span class="info">{{totalInfo.ticketQuantity}} pcs</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.volume')}}</span>
          <span class="info">{{totalInfo.volume}} m³</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.boxDensity')}}</span>
          <span class="info">{{totalInfo.boxDensity}}  kg/m³</span>
        </li>
        <li>
          <span class="label">{{$t('packageWarehouse.boxCount')}}</span>
          <span class="info">{{totalInfo.boxCount}}</span>
        </li>
      </ul>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="boxList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <BatchModifyDialog ref="batchModifyDialog" @refreshData="getData" />
  </div>
</template>
<script>
import {
  getBoxListApi,
  getProductListApi,
  batchOutBoundApi,
  printBoxTagsApi,
  sendThirdPartBoxTagsApi,
  exportBoxApi,
  getWarehouseListApi,
  exportBoxImagesApi,
  submitUnbindBatchApi
} from '@/api/packageWarehouse'
import { numAdd, numSub, numMulti, numDiv } from '@/utils/validate'
import BoxListOpreatorBtn from './components/BoxListOpreatorBtn'
import { roundDecimalNum } from '@/utils'
import printJS from 'print-js'
import clipboard from '@/utils/clipboard'
import BatchModifyDialog from './components/BatchModifyDialog'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'BoxList',
  components: {
    BoxListOpreatorBtn,
    BatchModifyDialog
  },
  filters: {},
  mixins: [InnerMixins],
  data() {
    return {
      loading: false,
      totalData: 0,
      showUploadDialog: false,
      showBatchDialog: false,
      opreatorTime: [],
      boxStateList: [
        {
          value: null,
          label: this.$t('common.all')
        },
        {
          value: 0,
          label: this.$t('packageWarehouse.boxStatusList[0]')
        },
        {
          value: 1,
          label: this.$t('packageWarehouse.boxStatusList[1]')
        },
        {
          value: 2,
          label: this.$t('packageWarehouse.boxStatusList[2]')
        }
      ],
      defaultTimeStr: ['12:00:00', '12:00:00'],
      multipleForm: {
        productId: null,
        numbers: '',
        boundBatch: null,
        batchNo: '',
        parcelSource: null,
        boxStateTimeBegin: null,
        boxStateTimeEnd: null,
        pageSize: 200,
        pageNum: 1,
        countryCode: null,
        boxState: null,
        boxWarehouseId: null,
        numberVague: ''
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      boxList: [],
      productList: [],
      warehouseList: [],
      selectedIds: [],
      totalInfo: {
        netWeight: 0,
        tare: 0,
        grossHeavy: 0,
        inboundChargeWeight: 0,
        ticketQuantity: 0,
        volume: 0,
        boxDensity: 0,
        boxCount: 0
      },
      selectedItems: [],
      countryProductsList: [],
      countryList: [],
      boundBatchList: [
        {
          value: null,
          label: this.$t('common.all')
        },
        {
          value: 1,
          label: this.$t('planManager.boundBatch')
        },
        {
          value: 2,
          label: this.$t('planManager.unbindBatch')
        }
      ],
      countryCodeCompany: [
        'DE,PL',
        'AU,CA'
      ]
    }
  },
  computed: {},
  watch: {
    opreatorTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.boxStateTimeBegin = arr[0]
        this.multipleForm.boxStateTimeEnd = arr[1]
      } else {
        this.multipleForm.boxStateTimeBegin = null
        this.multipleForm.boxStateTimeEnd = null
      }
    },
    "$route.query": function(query) {
      if (query && query.refresh) {
        this.getData()
      }
    }
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      this.resetHeight()
      // window.addEventListener('resize', () => {
      //   this.throttle(this.calcHeight, 200, 300)
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getProductList() {
      const res = await getProductListApi()
      if (res && res.ok && res.content) {
        this.productList = [
          {
            label: this.$t('packageWarehouse.statusAll'),
            value: null
          }
        ]
        res.content.forEach(item => {
          this.productList.push({
            label: item.productName,
            value: item.id
          })
          this.countryProductsList.push({
            countryCode: item.countryCode,
            countryName: item.countryName
          })
        })
        this.setCountryList()
      }
    },
    setCountryList() {
      this.countryList = [{
        label: this.$t('packageWarehouse.statusAll'),
        value: null
      }]
      const _m = new Map()
      const _county = this.countryProductsList.filter(item => !_m.has(item.countryCode) && _m.set(item.countryCode, ''))
      const _list = _county.map(item => ({
          value: item.countryCode,
          label: item.countryName
        }))
      this.countryList = this.countryList.concat(_list)
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
    async getData() {
      this.loading = true
      this.clearTotalCount()
      this.multipleForm.numbers = this.multipleForm.numbers.trim()
      this.multipleForm.numbers = this.multipleForm.numbers.toUpperCase()
      this.multipleForm.numberVague = this.multipleForm.numberVague.toUpperCase()
      const res = await getBoxListApi(this.multipleForm)
      this.boxList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.boxList = res.content.list
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.boxList = []
        this.totalData = 0
      }
      this.loading = false
      return true
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.opreatorTime = []
      this.getData()
    },
    clearTotalCount() {
      this.totalInfo = {
        netWeight: 0,
        tare: 0,
        grossHeavy: 0,
        inboundChargeWeight: 0,
        ticketQuantity: 0,
        volume: 0,
        boxDensity: 0,
        boxCount: 0
      }
    },
    // 一键出库
    batchOutBound() {
      if (this.checkSeleted()) {
        this.$confirm(this.$t('packageWarehouse.batchOutboundConfirm'), this.$t('common.tips'), {
          confirmButtonText: this.$t('packageWarehouse.outBoundBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.submitOutBound()
        }).catch(() => {})
      }
    },
    async submitOutBound() {
      this.loading = true
      const res = await batchOutBoundApi(JSON.stringify({ids: this.selectedIds}))
      if (res && res.ok) {
        this.$message({
          message: this.$t('packageWarehouse.batchOutboundSuccess'),
          type: 'success'
        })
        this.getData()
      } else {
        this.loading = false
      }
    },
    // 导出
    async exportInfo() {
      this.loading = true
      this.selectedIds = this.gridApi.getSelectedRows().map(item => item.id)
      const postForm = {...this.multipleForm, ...{ids: this.selectedIds}}
      const res = await exportBoxApi(postForm)
      if (res && res.ok) {
        if (res.content) {
          this.downloadFile({
            fileName: `boxInfo_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      } else {
        this.$message.error(res.errors.message)
      }
      this.loading = false
    },
    // 导出箱校验图片  exportBoxImagesApi
    async exportBoxImages() {
      this.loading = true
      this.selectedIds = this.gridApi.getSelectedRows().map(item => item.id)
      const postForm = {...this.multipleForm, ...{ids: this.selectedIds}}
      const res = await exportBoxImagesApi(postForm)
      if (res && res.ok) {
        if (res.content) {
          this.downloadFile({
            fileName: `boxImages_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      } else {
        this.$message.error(res.errors.message)
      }
      this.loading = false
    },
    // 打印箱唛
    async printBoxTags() {
      if (this.checkSeleted(true, true)) {
        this.loading = true
        const res = await printBoxTagsApi(JSON.stringify({ids: this.selectedIds}))
        if (res && res.ok) {
          if (res.content) {
            printJS({
              printable: res.content,
              type: 'pdf',
              base64: true
            })
          } else {
            this.$message.error(this.$t('packageWarehouse.emptyUrl'))
          }
        } else {
          this.$message.error(res.errors.message)
        }
        this.loading = false
      }
    },
    redirectPrintPage() {
      this.$router.push({name: 'packagePrintTagsThirdPart'})
    },
    // 点击按钮后出发批量推送尾程箱唛的业务需求
    async printBoxTagsThirdPart() {
      if (this.checkSeleted(true)) {
        this.loading = true
        const res = await sendThirdPartBoxTagsApi(JSON.stringify({ids: this.selectedIds}))
        if (res.ok) {
          this.$confirm(this.$t('packageWarehouse.printBoxTagsThirdPartSuccess'), this.$t('common.submitSuccess'), {
            confirmButtonText: this.$t('common.confirmBtn'),
            showCancelButton: false,
            type: 'success'
          }).then(() => {
            this.getData()
          }).catch(e => {})
        }
        this.loading = false
      }
    },
    checkSeleted(checkStatus = false, sameTag = false, sameCountry = false, hasBatch = false) {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.multipleSelectorEmpty'))
        return false
      }

      if (checkStatus) {
        if (!_selectedRows.every(item => item.boxState === 2 || item.boxState === 1)) {
          this.$message.warning(this.$t('packageWarehouse.printBoxTagsError'))
          return false
        }
      }

      if (sameTag) {
        const tpl_code = _selectedRows[0].labelTemplateCode
        if (!_selectedRows.every(item => item.labelTemplateCode === tpl_code)) {
          this.$message.warning(this.$t('packageWarehouse.chennlDiffrentError'))
          return false
        }
      }

      if (sameCountry) {
        let _countryCode = Array.from(new Set(_selectedRows.map(item => item.countryCode)))
        let _matchCountryCode = this.countryCodeCompany.some(item => _countryCode.sort().toString() === item)
        if (_countryCode.length > 1 && !_matchCountryCode) {
          this.$message.warning(this.$t('packageWarehouse.countryDiffrentError'))
          return false
        }
      }

      if (hasBatch) {
        if (!_selectedRows.every(item => item.batchId === null)) {
          this.$message.warning(this.$t('planManager.hasBatchId'))
          return false
        }
      }

      this.selectedIds = _selectedRows.map(item => item.id)
      return true
    },
    calcTotal() {
      this.loading = true
      let _netWeight = 0
      let _tare = 0
      let _grossHeavy = 0
      let _inboundChargeWeight = 0
      let _ticketQuantity = 0
      let _volume = 0
      let _boxCount = 0

      this.gridApi.getSelectedRows().map(v => {
        _netWeight = numAdd(_netWeight, v.netWeight)
        _tare = numAdd(_tare, v.boxWeight)
        _grossHeavy = numAdd(_grossHeavy, v.totalWeight)
        _inboundChargeWeight = numAdd(_inboundChargeWeight, v.inboundChargeWeight)
        _ticketQuantity = numAdd(_ticketQuantity, v.quantity)
        _volume = numAdd(_volume, v.boxVolumeM3)
        _boxCount++
      })

      let _boxDensity = _volume === 0 ? 0 : numDiv(_grossHeavy, _volume)
      this.totalInfo = {
        netWeight: Math.floor(_netWeight * 1000) / 1000,
        tare: Math.floor(_tare * 1000) / 1000,
        grossHeavy: Math.floor(_grossHeavy * 1000) / 1000,
        inboundChargeWeight: Math.floor(_inboundChargeWeight * 1000) / 1000,
        ticketQuantity: Math.floor(_ticketQuantity * 1000) / 1000,
        volume: Math.floor(_volume * 1000) / 1000,
        boxDensity: Math.floor(_boxDensity * 1000) / 1000,
        boxCount: _boxCount
      }
      this.loading = false
    },
    copySelectedInfo($event) { // 复制汇总数据
      const selectedItems = this.gridApi.getSelectedRows()
      if (!selectedItems || selectedItems.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.multipleSelectorEmpty'))
        return false
      }
      let length = 0
      let width = 0
      let height = 0
      const oriItems = []
      // 按尺寸组成新数组
      selectedItems.forEach(v => {
        oriItems.push({
          type: `${v.boxLength}*${v.boxWidth}*${v.boxHeight}`
        })
      })
      // 按尺寸给新数组分组
      const groupItems = oriItems.reduce((group, item) => {
        const {type} = item
        group[type] = group[type] ? group[type] : []
        group[type].push(item)
        return group
      }, {})
      // 按尺寸计算数量
      // let copyStr = `${this.totalInfo.boxCount}ctnc, ${this.totalInfo.grossHeavy}kg, ${this.totalInfo.inboundChargeWeight}kg, ${this.totalInfo.volume}cbm, ${this.totalInfo.ticketQuantity}\r\n`
      let copyStr = `${this.totalInfo.boxCount}ctnc, ${this.totalInfo.grossHeavy}kg, ${this.totalInfo.volume}cbm, ${this.totalInfo.ticketQuantity}pcs\r\n`
      for (let key in groupItems) {
        copyStr += `${key}/${groupItems[key].length}\r\n`
      }

      clipboard(copyStr, $event, this.$t('packageWarehouse.copySuccess'), this.$t('packageWarehouse.copyFailed'))
    },
    resetHeight() {
      const _height = this.calcHeight() + 30
      this.gridHeight = {
        height: `calc(100vh - ${_height}px)`
      }
    },
    createBatch() {
      if (this.checkSeleted(true, false, true, true)) {
        const _row = this.gridApi.getSelectedRows()
        const _counties = _row.map(item => item.countryCode)
        this.$refs.batchModifyDialog.opreator = 'create'
        this.$refs.batchModifyDialog.showModifyDialog(this.selectedIds, _counties)
      }
    },
    removeBatch() {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.error(this.$t('packageWarehouse.batchSelectedInvalid'))
        return
      }
      if (_selectedRows.some(item => item.batchId === null)) {
        this.$message.error(this.$t('packageWarehouse.batchNeverBoundError'))
        return
      } else {
        this.$confirm(this.$t('packageWarehouse.removeBatchConfirm'), this.$t('common.tips'), {
          confirmButtonText: this.$t('packageWarehouse.removeBatchBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          type: 'warning'
        }).then(() => {
          const _ids = _selectedRows.map(item => item.id)
          this.submitRemoveBatch(_ids)
        }).catch(() => {})
      }
    },
    async submitRemoveBatch(_ids) {
      const res = await submitUnbindBatchApi({ids: _ids})
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.removeBatchSuccess'))
        this.getData()
      }
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      enableRangeSelection: true, // 启用范围选择
      rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
      suppressRowClickSelection: true, // 点击行不触发行选中 - 只选中当前单元格
      onRowSelected: selectorObj => {
        this.loading = true
        setTimeout(() => {
          this.calcTotal()
        }, 200)
        // if (selectorObj.node.selected) {
        //   this.selectedItems.push(selectorObj.data)
        // } else {
        //   const _data = selectorObj.data
        //   const _id = this.selectedItems.findIndex(item => item.id === _data.id)
        //   this.selectedItems.splice(_id, 1)
        // }
      }
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left'
      },
      {
        field: 'boxNo',
        headerName: this.$t('packageWarehouse.boxNo'),
        minWidth: 200,
        pinned: 'left',
        cellRenderer: params => {
          if (params.data.parcelSource === 'ilpOMS') {
            return `${params.value} <p class='ilp-text'>${this.$t('packageWarehouse.ilpOMS.ilpOMSSingle')}</p>`
          }
          return params.value
        }
      },
      {
        field: 'productName',
        headerName: this.$t('packageWarehouse.productName'),
        minWidth: 180
      },
      {
        field: 'countryCode',
        headerName: this.$t('packageWarehouse.targetCountry'),
        minWidth: 80
      },
      {
        field: 'batchId',
        headerName: this.$t('planManager.boundBatchLabel'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$t('planManager.boundBatch') : this.$t('planManager.unbindBatch')
      },
      {
        field: 'batchNo',
        headerName: this.$t('planManager.boundBatchNo'),
        minWidth: 160,
        cellRenderer: params => params.value
      },
      {
        field: 'outboundTime',
        headerName: this.$t('packageWarehouse.outboundTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'netWeight',
        headerName: this.$t('packageWarehouse.netWeight') + '(kg)',
        minWidth: 90
      },
      {
        field: 'boxWeight',
        headerName: this.$t('packageWarehouse.tare') + '(kg)',
        minWidth: 90
      },
      {
        field: 'totalWeight',
        headerName: this.$t('packageWarehouse.grossHeavy') + '(kg)',
        minWidth: 90
      },
      {
        field: 'inboundChargeWeight',
        headerName: this.$t('packageWarehouse.inboundChargeWeight') + '(kg)',
        minWidth: 100
      },
      {
        field: 'boxLength',
        headerName: this.$t('packageWarehouse.length') + '(cm)',
        minWidth: 90
      },

      {
        field: 'boxWidth',
        headerName: this.$t('packageWarehouse.width') + '(cm)',
        minWidth: 90
      },
      {
        field: 'boxHeight',
        headerName: this.$t('packageWarehouse.height') + '(cm)',
        minWidth: 90
      },
      {
        field: 'boxVolumeM3',
        headerName: this.$t('packageWarehouse.volume') + '(m³)',
        minWidth: 100
      },
      {
        field: 'quantity',
        headerName: this.$t('packageWarehouse.ticketQuantity'),
        minWidth: 80
      },
      {
        field: 'boxDensity',
        headerName: this.$t('packageWarehouse.boxDensity') + '(kg/m³)',
        minWidth: 110
      },
      {
        field: 'boxStateName',
        headerName: this.$t('packageWarehouse.status'),
        minWidth: 100
      },
      {
        field: 'lastMilePushStateName',
        headerName: this.$t('packageWarehouse.lastMilePushStateName'),
        minWidth: 120
      },
      {
        field: 'lastMileBoxNo',
        headerName: this.$t('packageWarehouse.lastMileBoxNo'),
        minWidth: 160
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 80,
        cellRendererFramework: 'BoxListOpreatorBtn'
      }
    ]

    this.getData()
    this.getWarehouseList()
    this.getProductList()
  },
  mounted() {
    window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
  }
}
</script>

<style lang="scss" scoped>
@import "./mixin/highlight";
.total-info-wrap{
  height: 30px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  color: #073B70;
  li{
    margin-right: 15px;
  }
  span{
    display: inline-block;
    vertical-align: middle;
    &.info{
      margin-left: 2px;
    }
  }
}
.el-dropdown{
  margin-left: 10px;
}
::v-deep .el-dropdown__caret-button{
  padding-bottom: 6px;
}
</style>
