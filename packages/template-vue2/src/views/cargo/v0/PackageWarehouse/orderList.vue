<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="checkSearchForm" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item label='' prop="numbers">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.numbers" class="input-with-select" style="width: 440px;" clearable>
            <el-select v-model="multipleForm.queryNumberConditions" slot="prepend" style="width: 110px;">
              <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.companyName')" prop="memberId">
          <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getMemberApi" style="width: 300px;" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.countryCode')}: `" prop="countryCode">
          <el-select v-model="multipleForm.countryCode"
            :placeholder="$t('common.placeholder')"
            filterable
            @change="setProductList">
            <el-option
              v-for="item in countryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item :label="`${$t('packageWarehouse.status')}: `" prop="parcelState">
          <el-select v-model="multipleForm.parcelState"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.transferStatus')}: `" prop="queryRequisitionState">
          <el-select v-model="multipleForm.queryRequisitionState"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in requisitionStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.inboundWarehouse')}: `" prop="inboundWarehouseId">
          <el-select v-model="multipleForm.inboundWarehouseId"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in warehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
            :defaultTime="defaultTimeStr"/>
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.declareTime')" prop="declareTime">
          <CommonPicker
            v-model="declareTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr"/>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="showImportReport = true">{{$t('packageWarehouse.importReport')}}</el-button>
        <el-button type="primary" size="mini" @click="exportOrderDetail">{{$t('packageWarehouse.exportOrderDetail')}}</el-button>
        <el-button type="primary" size="mini" @click="exportOrderSearch">{{$t('packageWarehouse.exportOrderSearch')}}</el-button>
        <el-button type="primary" size="mini" @click="exportOrderImages">{{$t('packageWarehouse.exportOrderImages')}}</el-button>
        <el-button type="primary" size="mini" @click="showUpdateChannelDialog = true">{{$t('packageWarehouse.updateChannelBtn')}}</el-button>
        <!-- <el-dropdown type="primary" @command="handleCommand">
          <el-button type="primary" size="mini">
            {{$t('packageWarehouse.exportBtnList')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="exportOrderDetail">{{$t('packageWarehouse.exportOrderDetail')}}</el-dropdown-item>
            <el-dropdown-item command="exportOrderSearch">{{$t('packageWarehouse.exportOrderSearch')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="orderList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="checkSearchForm" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <!-- 导入预报 -->
    <ImportReport :dialogTitle="$t('packageWarehouse.importReportDialogTitle')" :title="$t('packageWarehouse.importReportDialogTitle')" :showImgImport="false" :visible.sync="showImportReport" :excel-file-name="templateFileName" :submitType="'order'" :limit="10" />
    <!-- 修改渠道 -->
    <ImportReport :dialogTitle="$t('packageWarehouse.updateChannelTitle')" :title="$t('packageWarehouse.updateChannelTitle')" :showImgImport="false" :visible.sync="showUpdateChannelDialog" :excel-file-name="templateFileName" :submitType="'updateChannel'" :limit="1" />
  </div>
</template>
<script>
import { getOrderListApi, getProductListApi, exportOrderDetailApi, exportOrderSearchApi, getWarehouseListApi, exportOrderImagesApi } from '@/api/packageWarehouse'
import { getRemoteMemberApi } from '@/api/user'
import ImportReport from './components/ImportReport'
import OrderListOpreatorBtn from './components/OrderListOpreatorBtn'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'PackageOrderList',
  components: {
    ImportReport,
    OrderListOpreatorBtn,
    RemoteSearchSelector
  },
  mixins: [InnerMixins],
  filters: {},
  data() {
    return {
      loading: false,
      remoteLoading: false,
      totalData: 0,
      showImportReport: false,
      showUpdateChannelDialog: false,
      opreatorTime: [],
      declareTime: [],
      defaultTimeStr: ['12:00:00', '12:00:00'],
      searchTypeText: this.$t('packageWarehouse.trackingNo'),
      templateFileName: this.$t('packageWarehouse.excelFileName'),
      statusList: [
        {
          value: null,
          label: this.$t('packageWarehouse.statusAll')
        },
        {
          value: 6,
          label: this.$t('packageWarehouse.statusList[8]')
        },
        {
          value: 0,
          label: this.$t('packageWarehouse.statusList[0]')
        },
        {
          value: 1,
          label: this.$t('packageWarehouse.statusList[1]')
        },
        {
          value: 2,
          label: this.$t('packageWarehouse.statusList[2]')
        },
        {
          value: 3,
          label: this.$t('packageWarehouse.statusList[3]')
        },
        {
          value: 4,
          label: this.$t('packageWarehouse.statusList[4]')
        },
        {
          value: 10,
          label: this.$t('packageWarehouse.statusList[5]')
        },
        {
          value: 11,
          label: this.$t('packageWarehouse.statusList[6]')
        },
        {
          value: 12,
          label: this.$t('packageWarehouse.statusList[7]')
        }
      ],
      orderTypeList: [
        {
          value: 0,
          label: this.$t('packageWarehouse.trackingNo')
        },
        {
          value: 1,
          label: this.$t('packageWarehouse.orderNo')
        },
        {
          value: 2,
          label: this.$t('packageWarehouse.customerRefNo')
        },
        {
          value: 3,
          label: this.$t('packageWarehouse.containerNo')
        },
        {
          value: 4,
          label: this.$t('packageWarehouse.trackingNo2')
        }
      ],
      requisitionStateList: [
        {
          label: this.$t('common.all'),
          value: -1
        },
        {
          label: this.$t('packageWarehouse.unRequisition'),
          value: 0
        },
        {
          label: this.$t('packageWarehouse.onRequisition'),
          value: 1
        },
        {
          label: this.$t('packageWarehouse.requisitionFinished'),
          value: 2
        }
      ],
      multipleForm: {
        numbers: '',
        countryCode: null,
        productId: null,
        memberId: '',
        queryNumberConditions: 0,
        parcelState: null,
        queryRequisitionState: -1,
        parcelSource: null,
        inboundWarehouseId: null,
        parcelStateTimeBegin: null,
        parcelStateTimeEnd: null,
        declareTimeBegin: null,
        declareTimeEnd: null,
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      orderList: [],
      countryProductsList: [],
      countryList: [],
      productList: [],
      warehouseList: []
    }
  },
  computed: {
    getMemberApi: function() {
      return getRemoteMemberApi
    }
  },
  watch: {
    opreatorTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.parcelStateTimeBegin = arr[0]
        this.multipleForm.parcelStateTimeEnd = arr[1]
      } else {
        this.multipleForm.parcelStateTimeBegin = null
        this.multipleForm.parcelStateTimeEnd = null
      }
    },
    declareTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.declareTimeBegin = arr[0]
        this.multipleForm.declareTimeEnd = arr[1]
      } else {
        this.multipleForm.declareTimeBegin = null
        this.multipleForm.declareTimeEnd = null
      }
    },
    showImportReport: function(val) {
      if (val) {
        this.templateFileName = this.$t('packageWarehouse.excelFileName')
      }
    },
    showUpdateChannelDialog: function(val) {
      if (val) {
        this.templateFileName = this.$t('packageWarehouse.updateChannelFileName')
      }
    }
    // "$route.query": function(query) {
    //   if (query && query.refresh) {
    //     this.getData()
    //   }
    // }
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      // window.addEventListener('resize', () => {
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
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
    async getProductList() {
      const res = await getProductListApi()
      if (res && res.ok && res.content) {
        res.content.forEach(item => {
          this.countryProductsList.push({
            countryCode: item.countryCode,
            countryName: item.countryName,
            id: item.id,
            productName: item.productName
          })
        })
        this.setCountryList()
        this.setProductList()
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
    setProductList() {
      this.productList = [{
        label: this.$t('packageWarehouse.statusAll'),
        value: null
      }]

      let _list = []
      if (this.multipleForm.countryCode) {
        this.countryProductsList.forEach(item => {
          if (item.countryCode === this.multipleForm.countryCode) {
            _list.push({
              label: item.productName,
              value: item.id
            })
          }
        })
      } else {
        _list = this.countryProductsList.map(item => ({
          label: item.productName,
          value: item.id
        }))
      }
      this.multipleForm.productId = null
      this.productList = this.productList.concat(_list)
    },
    checkSearchForm() {
      if (this.multipleForm.countryCode !== null || this.multipleForm.productId !== null || this.multipleForm.parcelState !== null || this.multipleForm.queryRequisitionState !== -1 || this.multipleForm.inboundWarehouseId !== null || this.multipleForm.parcelSource !== null) {
        this.getData()
      } else if (this.multipleForm.numbers.trim().length > 0 || this.multipleForm.memberId.trim().length > 0 || this.multipleForm.parcelStateTimeBegin !== null || this.multipleForm.declareTimeBegin !== null) {
        this.getData()
      } else {
        this.$message.warning(this.$t('packageWarehouse.unContentSearch'))
      }
    },
    async getData() {
      this.loading = true
      const res = await getOrderListApi(this.multipleForm)
      this.orderList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.orderList = res.content.list
          this.orderList.map(item => {
            item.parcelCreateTime = item.stateDetailDTO.parcelCreateTime
            item.inboundTime = item.stateDetailDTO.inboundTime
            item.boxTime = item.stateDetailDTO.boxTime
            item.outboundTime = item.stateDetailDTO.outboundTime
            item.inboundPersonName = item.stateDetailDTO.inboundPersonName
            item.boxPersonName = item.stateDetailDTO.boxPersonName
            item.outboundPersonName = item.stateDetailDTO.outboundPersonName
          })
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.orderList = []
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
      this.declareTime = []
      this.setProductList()
      this.orderList = []
    },
    handleCommand(command) {
      if (command === 'exportOrderDetail') {
        this.exportOrderDetail()
      }
      if (command === 'exportOrderSearch') {
        this.exportOrderSearch()
      }
    },
    async exportOrderDetail() {
      this.loading = true
      const res = await exportOrderDetailApi(this.multipleForm)
      if (res.ok) {
        if (res.content) {
          // this.$message.success(this.$t('packageWarehouse.exportDetailSuccess'))
          this.downloadFile({
            fileName: `orderDetail_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      }
      this.loading = false
    },
    async exportOrderSearch() {
      this.loading = true
      const res = await exportOrderSearchApi(this.multipleForm)
      if (res.ok) {
        if (res.content) {
          // this.$message.success(this.$t('packageWarehouse.exportDetailSuccess'))
          this.downloadFile({
            fileName: `orderDetail_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      }
      this.loading = false
    },
    async exportOrderImages() {
      this.loading = true
      const res = await exportOrderImagesApi(this.multipleForm)
      if (res.ok) {
        if (res.content) {
          // this.$message.success(this.$t('packageWarehouse.exportDetailSuccess'))
          this.downloadFile({
            fileName: `orderImages_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      }
      this.loading = false
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
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }
    this.columnFields = [
      // {
      //   headerName: '',
      //   checkboxSelection: true,
      //   headerCheckboxSelection: true,
      //   minWidth: 50,
      //   pinned: 'left'
      // },
      {
        field: 'orderNo',
        headerName: this.$t('packageWarehouse.orderNo'),
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
        field: 'trackingNo',
        headerName: this.$t('packageWarehouse.trackingNo'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'trackingNo2',
        headerName: this.$t('packageWarehouse.oldNo'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'customerRefNo',
        headerName: this.$t('packageWarehouse.customerRefNo'),
        minWidth: 160
      },
      {
        field: 'parcelStateName',
        headerName: this.$t('packageWarehouse.status'),
        minWidth: 100
      },
      {
        field: 'requisitionStateName',
        headerName: this.$t('packageWarehouse.transferResult'),
        minWidth: 100,
        cellRenderer: params => params.value === '' ? this.$t('packageWarehouse.unRequisition') : params.value
      },
      {
        field: 'lockFlag',
        headerName: this.$t('packageWarehouse.fastening'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$t('packageWarehouse.locked') : this.$t('packageWarehouse.unlock')
      },
      {
        field: 'productName',
        headerName: this.$t('packageWarehouse.deliveryName'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'productCode',
        headerName: this.$t('packageWarehouse.deliveryCode'),
        minWidth: 120
      },
      {
        field: 'parcelCreateTime',
        headerName: this.$t('packageWarehouse.orderedDate'),
        minWidth: 180,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'inboundTime',
        headerName: this.$t('packageWarehouse.checkinDate'),
        minWidth: 180,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'boxTime',
        headerName: this.$t('packageWarehouse.boxDate'),
        minWidth: 180,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'outboundTime',
        headerName: this.$t('packageWarehouse.checkoutDate'),
        minWidth: 180,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'declareTime',
        headerName: this.$t('packageWarehouse.declareTime'),
        minWidth: 180,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'boxNo',
        headerName: this.$t('packageWarehouse.boxNo'),
        minWidth: 120
      },
      {
        field: 'countryCode',
        headerName: this.$t('packageWarehouse.countryCode'),
        minWidth: 100
      },
      {
        field: 'countryName',
        headerName: this.$t('packageWarehouse.countryName'),
        minWidth: 100
      },
      {
        field: 'createWeight',
        headerName: this.$t('packageWarehouse.customerOrderWeight'),
        minWidth: 120
      },
      {
        field: 'declareWeight',
        headerName: this.$t('packageWarehouse.customerDeclareWeight'),
        minWidth: 100
      },
      {
        field: 'inboundWeight',
        headerName: this.$t('packageWarehouse.customerInboundWeight'),
        minWidth: 100
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.companyName'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'machine',
        headerName: this.$t('packageWarehouse.machine'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'inboundPersonName',
        headerName: this.$t('packageWarehouse.inboundPersonName'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'boxPersonName',
        headerName: this.$t('packageWarehouse.boxPersonName'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'outboundPersonName',
        headerName: this.$t('packageWarehouse.outboundPersonName'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 80,
        cellRendererFramework: 'OrderListOpreatorBtn'
      }
    ]
    this.getWarehouseList()
    this.getProductList()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
