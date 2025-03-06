<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="$t('packageWarehouse.orderNo')" prop="numbers">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.numbers" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.packageForm.bagNo')" prop="boxNo">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.boxNo" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.scanTime')" prop="opreatorTime">
          <CommonPicker
            v-model="opreatorTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.selectionWarehouse')}: `" prop="operatorWarehouseId">
          <el-select v-model="multipleForm.operatorWarehouseId"
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
        <el-form-item :label="`${$t('packageWarehouse.operatorName')}: `" prop="operatorId">
          <el-select v-model="multipleForm.operatorId" filterable :placeholder="$t('common.placeholder')" style="width: 100%;">
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
        <el-button type="primary" size="mini" style="margin-top: 5px;" @click="importData">{{$t('common.importBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="exportOrderDetail">{{$t('common.exportBtn')}}</el-button>
        <el-button type="danger" size="mini" @click="checkSelected">{{$t('common.deleteBtn')}}</el-button>
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
    <ImportReport :dialogTitle="$t('packageWarehouse.importAgent')" :title="$t('packageWarehouse.importAgent')" :showImgImport="false" :visible.sync="showUploadDialog"  :excel-file-name="$t('packageWarehouse.agentExcelFileName')" @uploadSuccess="getData" :submitType="'agentParcel'" :limit="10" />
  </div>
</template>
<script>
import {
  getAgentParcelRecivedListApi,
  exportAgentParcelRecivedListApi,
  delectAgentParcelRecivedApi,
  employeeDropdownListApi,
  getWarehouseListApi
} from '@/api/packageWarehouse'
import ImportReport from './components/ImportReport'
export default {
  name: 'AgentParcelManager',
  components: { ImportReport },
  filters: {},
  data() {
    return {
      showUploadDialog: false,
      loading: false,
      totalData: 0,
      opreatorTime: [],
      defaultTimeStr: ['12:00:00', '12:00:00'],
      multipleForm: {
        numbers: '',
        boxNo: '',
        createTimeEnd: null,
        createTimeStart: null,
        ids: [],
        operatorId: '',
        operatorWarehouseId: '',
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
      employeeList: []
    }
  },
  computed: {
  },
  watch: {
    opreatorTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.createTimeStart = arr[0]
        this.multipleForm.createTimeEnd = arr[1]
      } else {
        this.multipleForm.createTimeStart = null
        this.multipleForm.createTimeEnd = null
      }
    }
  },
  methods: {
    // 仓库下拉
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
    // 操作人员下拉
    async getEmployeeDropdown() {
      const res = await employeeDropdownListApi()
      if (res && res.ok && res.content) {
        this.employeeList = res.content.map(item => ({
            label: item.chineseName,
            value: item.id
          }))
      }
    },
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
    async getData() {

      this.loading = true
      // this.multipleForm.numbers = this.multipleForm.numbers.trim()
      this.multipleForm.ids = []
      const res = await getAgentParcelRecivedListApi(this.multipleForm)
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
      this.opreatorTime = []
      this.getData()
    },
    async exportOrderDetail() {
      this.loading = true
      this.multipleForm.ids = this.gridApi.getSelectedRows().map(item => item.id)
      const res = await exportAgentParcelRecivedListApi(this.multipleForm)
      if (res && res.ok) {
        if (res.content) {
          this.downloadFile({
            fileName: `agentParcelRecived_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      }
      this.loading = false
    },
    // 导入数据
    importData() {
      this.showUploadDialog = true
    },
    // 检查勾选
    checkSelected() {
      this.multipleForm.ids = this.gridApi.getSelectedRows().map(item => item.id)
      if (this.multipleForm.ids.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.batchDeleteEmpty'))
        return
      } else {
        this.$confirm(this.$t('common.deleteWarnningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.deleted'),
          cancelButtonText: this.$t('packageWarehouse.cancelDrop'),
          type: 'warning'
        })
        .then(async() => {
          this.batchDelete()
        })
        .catch(err => {console.error(err)})
      }
    },
    // 批量删除
    async batchDelete() {
      const res = await delectAgentParcelRecivedApi({ids: this.multipleForm.ids})
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.batchDeleteSuccess'))
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
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        minWidth: 55,
        maxWidth: 55
      },
      {
        field: 'boxNo',
        headerName: this.$t('packageWarehouse.packageForm.bagNo'),
        minWidth: 200
      },
      {
        field: 'parcelNo',
        headerName: this.$t('packageWarehouse.orderNo'),
        minWidth: 200
      },
      {
        field: 'operatorTime',
        headerName: this.$t('packageWarehouse.receivedTime'),
        minWidth: 200,
        cellRenderer: params => this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'operatorWarehouseName',
        headerName: this.$t('packageWarehouse.selectionWarehouse'),
        minWidth: 100
      },
      {
        field: 'operatorName',
        headerName: this.$t('packageWarehouse.operatorName'),
        minWidth: 100
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
.el-form-item__content .el-input-group{
  display: inline-table!important;
}
</style>
