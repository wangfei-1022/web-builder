<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item label='' prop="numbers">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.numbers" class="input-with-select" style="width: 440px;" clearable >
            <el-select v-model="multipleForm.queryNumberConditions" slot="prepend" style="width: 110px;">
              <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageTransfer.tplParcelNo')}: `" prop="requisitionNos">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.requisitionNos" clearable >
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageTransfer.transferList.transferTime')}: `" prop="transferTime">
          <CommonPicker
            v-model="transferTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr"/>
        </el-form-item>
        <el-form-item :label="`${$t('packageTransfer.transferList.loadingWarehouseId')}: `" prop="loadingWarehouseId">
          <el-select v-model="multipleForm.loadingWarehouseId">
            <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageTransfer.transferList.destinationWarehouseId')}: `" prop="destinationWarehouseId">
          <el-select v-model="multipleForm.destinationWarehouseId">
            <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageTransfer.transferList.requisitionState')}: `" prop="requisitionState">
          <el-select v-model="multipleForm.requisitionState">
            <el-option v-for="item in requisitionStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageTransfer.transferList.loadingPersonId')}: `" prop="loadingPersonId">
          <el-select v-model="multipleForm.loadingPersonId" filterable :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in employeeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageTransfer.transferList.destinationPersonId')}: `" prop="destinationPersonId">
          <el-select v-model="multipleForm.destinationPersonId" filterable :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in employeeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="batchArrived">{{$t('packageTransfer.batchArrived')}}</el-button>
        <el-button type="primary" size="mini" @click="exportTransferredList">{{$t('common.exportBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="exportTransferredDetail">{{$t('packageTransfer.exportDetail')}}</el-button>
        <el-button type="primary" size="mini" @click="printTag">{{$t('packageWarehouse.printTag')}}</el-button>
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
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
  </div>
</template>
<script>
import { getTransferredListApi, exportTransferredListApi, batchArrivedApi, printTransferredApi, exportTransferredDetailApi } from '@/api/packageTransfer'
import { getWarehouseListApi, employeeDropdownListApi } from '@/api/packageWarehouse'
import TransferredOpreatorBtn from './components/TransferredOpreatorBtn'
import ImportReport from './components/ImportReport'
import printJS from 'print-js'
export default {
  name: 'TransferredList',
  components: {
    ImportReport,
    TransferredOpreatorBtn
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      transferTime: [],
      defaultTimeStr: ['12:00:00', '12:00:00'],
      multipleForm: {
        numbers: '',
        queryNumberConditions: 0,
        requisitionNos: '',
        requisitionTimeStart: null,
        requisitionTimeEnd: null,
        requisitionState: null,
        loadingWarehouseId: '',
        destinationWarehouseId: '',
        loadingPersonId: '',
        destinationPersonId: '',
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      orderList: [],
      warehouseList: [],
      employeeList: [],
      requisitionStateList: [
        {
          label: this.$t('common.all'),
          value: null
        },
        {
          label: this.$t('packageWarehouse.requisitioning'),
          value: 0
        },
        {
          label: this.$t('packageWarehouse.onRequisition'),
          value: 5
        },
        {
          label: this.$t('packageWarehouse.requisitionFinished'),
          value: 10
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
      ]
    }
  },
  computed: {
  },
  watch: {
    transferTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.requisitionTimeStart = arr[0]
        this.multipleForm.requisitionTimeEnd = arr[1]
      } else {
        this.multipleForm.requisitionTimeStart = null
        this.multipleForm.requisitionTimeEnd = null
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
    },
    async batchArrived() {
      let selectedRows = this.gridApi.getSelectedRows()
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("packageTransfer.noneSelectedRows"))
        return
      }
      const _ids = selectedRows.map(v => v.id)
      const res = await batchArrivedApi({ids: _ids})
      if (res && res.ok) {
        this.$message.success(this.$t("packageTransfer.operatorSuccess"))
        this.getData()
      }
    },
    async getData() {
      this.loading = true
      // this.multipleForm.numbers = this.multipleForm.numbers.trim()
      const res = await getTransferredListApi(this.multipleForm)
      this.orderList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.orderList = res.content.list
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
      this.transferTime = []
      this.getData()
    },
    async exportTransferredList() {
      this.loading = true
      const res = await exportTransferredListApi(this.multipleForm)
      if (res.ok) {
        if (res.content) {
          // this.$message.success(this.$t('packageWarehouse.exportDetailSuccess'))
          this.downloadFile({
            fileName: `transferred_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      }
      this.loading = false
    },
    async exportTransferredDetail() {
      this.loading = true
      const res = await exportTransferredDetailApi(this.multipleForm)
      if (res.ok) {
        if (res.content) {
          this.downloadFile({
            fileName: `transferred_detail_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      }
      this.loading = false
    },
    async printTag() { // 打印标签
      let selectedRows = this.gridApi.getSelectedRows()
      if (selectedRows.length > 0) {
        this.loading = true
        const res = await printTransferredApi({ids: selectedRows.map(item => item.id)})
        if (res && res.ok && res.content) {
          printJS({
            printable: res.content,
            type: 'pdf',
            base64: true
          })
        }
        this.loading = false
      } else {
        this.$message.warning(this.$t('packageTransfer.noIdError'))
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
    async getEmployeeDropdown() {
      const res = await employeeDropdownListApi()
      if (res && res.ok && res.content) {
        this.employeeList = res.content.map(item => ({
            label: item.chineseName,
            value: item.id
          }))
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
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        pinned: 'left'
      },
      {
        field: 'requisitionNo',
        headerName: `${this.$t('packageTransfer.tplParcelNo')}/${this.$t('packageTransfer.boxNo')}`,
        minWidth: 200,
        pinned: 'left'
      },
      {
        field: 'loadingWarehouseName',
        headerName: this.$t('packageTransfer.transferList.loadingWarehouseId'),
        minWidth: 120
      },
      {
        field: 'destinationWarehouseName',
        headerName: this.$t('packageTransfer.transferList.destinationWarehouseId'),
        minWidth: 120
      },
      {
        field: 'requisitionTime',
        headerName: this.$t('packageTransfer.transferList.transferTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:ss:mm') : ''
      },
      {
        field: 'requisitionStateName',
        headerName: this.$t('packageTransfer.transferList.requisitionState'),
        minWidth: 100
      },
      {
        field: 'loadingPersonName',
        headerName: this.$t('packageTransfer.transferList.loadingPersonId'),
        minWidth: 120
      },
      {
        field: 'destinationPersonName',
        headerName: this.$t('packageTransfer.transferList.destinationPersonId'),
        minWidth: 120
      },
      {
        field: 'id',
        headerName: this.$t('packageTransfer.transferList.operationBtn'),
        minWidth: 100,
        cellRendererFramework: 'TransferredOpreatorBtn'
      }
    ]

    this.getData()
    this.getWarehouseList()
    this.getEmployeeDropdown()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
