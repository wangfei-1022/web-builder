<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="singleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent style="max-width: 1000px;">
        <el-form-item :label="`${$t('packageWarehouse.employeeName')}: `" prop="userChineseName">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.userChineseName" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.warehouseShortName')}: `" prop="shortName">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.shortName" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="modifyEmployee(null)">{{$t('packageWarehouse.createWarehouseBtn')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="employeeTable"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <el-dialog :visible.sync="showEditDialog" :title="dialogTitle" width="550px" :close-on-click-modal="false" :before-close="closeModify">
      <el-form label-width="80px" :model="employeeInfo" :rules="employeeRule" ref="modifyForm">
        <el-form-item :label="`${$t('packageWarehouse.employeeAccount')}: `" prop="userId">
          <el-select :disabled="!!employeeInfo.id" v-model="employeeInfo.userId" filterable :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in employeeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.employeeDepartment')}: `" prop="warehouseId">
          <el-select v-model="employeeInfo.warehouseId" filterable :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in warehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.employeeRemark')}: `" prop="remarks">
          <el-input type="textarea" :rows="2" :placeholder="$t('common.placeholder')" v-model="employeeInfo.remarks" />
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getEmployeeListApi, createEmployeeApi, modifyEmployeeApi, employeeDropdownListApi, getWarehouseListApi } from '@/api/packageWarehouse'
import EmployeeOpreationBtn from './components/EmployeeOpreationBtn'
export default {
  name: 'EmplyoeeList',
  components: {
    EmployeeOpreationBtn
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      showEditDialog: false,
      multipleForm: {
        shortName: '',
        userChineseName: '',
        pageSize: 200,
        pageNum: 1
      },
      employeeInfo: {
        id: '',
        userId: '',
        warehouseId: '',
        remarks: ''
      },
      employeeRule: {
        userId: [
          {required: true, trigger: 'blur', message: this.$t('packageWarehouse.codeEmptyError')}
        ],
        warehouseId: [
          {required: true, trigger: 'blur', message: this.$t('packageWarehouse.nameEmptyError')}
        ]
      },
      employeeList: [],
      warehouseList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      employeeTable: []
    }
  },
  computed: {
    dialogTitle: function() {
      return !this.employeeInfo.id ? this.$t('packageWarehouse.createEmployee') : this.$t('packageWarehouse.modifyEmployee')
    }
  },
  watch: {},
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      // window.addEventListener('resize', function() {
      //   setTimeout(function() {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getData() {
      this.loading = true
      this.multipleForm.userChineseName = this.multipleForm.userChineseName.trim()
      this.multipleForm.shortName = this.multipleForm.shortName.trim()
      const res = await getEmployeeListApi(this.multipleForm)
      this.employeeTable = []
      if (res && res.ok && res.content) {
        this.employeeTable = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.employeeTable = []
        this.totalData = 0
      }
      this.loading = false
      return true
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }
      this.getData()
    },
    modifyEmployee(obj) {
      if (obj) {
        this.employeeInfo = {...obj}
      }
      this.showEditDialog = true
    },
    validateForm() {
      this.$refs.modifyForm.validate((valid, obj) => {
        if (valid) {
          if (this.employeeInfo.id && this.employeeInfo.id.length > 0) {
            this.submitModify()
          } else {
            this.submitCreate()
          }
        }
      })
    },
    closeModify(done) {
      this.showEditDialog = false
      this.employeeInfo = {
        id: '',
        userId: '',
        warehouseId: '',
        remarks: ''
      }
      this.$refs.modifyForm.resetFields()
      this.$refs.modifyForm.clearValidate()
      if (typeof done == 'function') {done()}
    },
    async submitModify() {
      this.loading = true
      const res = await modifyEmployeeApi(this.employeeInfo)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.warehouseModifySuccess'))
        this.closeModify()
        this.getData()
      }
      this.loading = false
    },
    async submitCreate() {
      this.loading = true
      const res = await createEmployeeApi(this.employeeInfo)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.warehouseCreateSuccess'))
        this.closeModify()
        this.getData()
      }
      this.loading = false
    },
    async getEmployeeDropdown() {
      const res = await employeeDropdownListApi()
      if (res && res.ok && res.content) {
        this.employeeList = res.content.map(item => ({
            label: item.userName,
            value: item.id
          }))
      }
    },
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 999})
      if (res && res.ok && res.content && res.content.list) {
        this.warehouseList = res.content.list.map(item => ({
            label: item.name,
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
        field: 'userName',
        headerName: this.$t('packageWarehouse.employeeAccount'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'userChineseName',
        headerName: this.$t('packageWarehouse.employeeName'),
        minWidth: 120
      },
      {
        field: 'shortName',
        headerName: this.$t('packageWarehouse.employeeDepartment'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'userMobile',
        headerName: this.$t('packageWarehouse.contactMobile'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'remarks',
        headerName: this.$t('packageWarehouse.employeeRemark'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'userStatus',
        headerName: this.$t('packageWarehouse.status'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$t('packageWarehouse.warehouseEnabled') : this.$t('packageWarehouse.warehouseDisabled')
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 80,
        cellRendererFramework: 'EmployeeOpreationBtn',
        cellRendererParams: {
          refresh: this.getData,
          modifyEmployee: this.modifyEmployee
        }
      }
    ]
    this.getData()
    this.getEmployeeDropdown()
    this.getWarehouseList()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
