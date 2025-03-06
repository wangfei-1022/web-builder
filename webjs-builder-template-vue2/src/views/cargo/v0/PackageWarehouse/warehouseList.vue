<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="singleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent style="max-width: 1000px;">
        <el-form-item :label="`${$t('packageWarehouse.warehouseShortName')}: `" prop="shortName">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.shortName" clearable @clear="getData" @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="showWarehouseDialog(null)">{{$t('packageWarehouse.createWarehouseBtn')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="warehouseList"
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
      <el-form label-width="80px" :model="warehouseInfo" :rules="warehouseRule" ref="modifyForm">
        <el-form-item :label="`${$t('packageWarehouse.warehouseCode')}: `" prop="code">
          <el-input :placeholder="$t('common.placeholder')" v-model="warehouseInfo.code" :disabled="!!warehouseInfo.id" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.warehouseName')}: `" prop="name">
          <el-input :placeholder="$t('common.placeholder')" v-model="warehouseInfo.name" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.warehouseShortName')}: `" prop="shortName">
          <el-input :placeholder="$t('common.placeholder')" v-model="warehouseInfo.shortName" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.warehouseAddress')}: `" prop="address">
          <el-input :placeholder="$t('common.placeholder')" v-model="warehouseInfo.address" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.warehouseContact')}: `" prop="contact">
          <el-input :placeholder="$t('common.placeholder')" v-model="warehouseInfo.contact" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.contactMobile')}: `" prop="mobile">
          <el-input :placeholder="$t('common.placeholder')" v-model="warehouseInfo.mobile" />
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
import { getWarehouseListApi, createWarehouseApi, modifyWarehouseApi } from '@/api/packageWarehouse'
import WarehouseOpreationBtn from './components/WarehouseOpreationBtn'
export default {
  name: 'PackageWarehouseList',
  components: {
    WarehouseOpreationBtn
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      showEditDialog: false,
      multipleForm: {
        shortName: '',
        pageSize: 200,
        pageNum: 1
      },
      warehouseInfo: {
        address: '',
        code: '',
        contact: '',
        id: '',
        mobile: '',
        name: '',
        shortName: ''
      },
      warehouseRule: {
        code: [
          {required: true, trigger: 'blur', message: this.$t('packageWarehouse.codeEmptyError')}
        ],
        name: [
          {required: true, trigger: 'blur', message: this.$t('packageWarehouse.nameEmptyError')}
        ],
        shortName: [
          {required: true, trigger: 'blur', message: this.$t('packageWarehouse.shortNameEmptyError')}
        ]
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      warehouseList: [],
      productList: []
    }
  },
  computed: {
    dialogTitle: function() {
      return !this.warehouseInfo.id ? this.$t('packageWarehouse.createWarehouseTitel') : this.$t('packageWarehouse.modifyWarehouseTitle')
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
      this.multipleForm.shortName = this.multipleForm.shortName.trim()
      const res = await getWarehouseListApi(this.multipleForm)
      this.warehouseList = []
      if (res && res.ok && res.content) {
        this.warehouseList = res.content.list
        this.totalData = Number(res.content.total)
      } else {
        this.warehouseList = []
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
    showWarehouseDialog(obj) {
      if (obj) {
        this.warehouseInfo = {...obj}
      }
      this.showEditDialog = true
    },
    validateForm() {
      this.$refs.modifyForm.validate((valid, obj) => {
        if (valid) {
          if (!this.warehouseInfo.id) {
            this.submitCreate()
          } else {
            this.submitModify()
          }
        }
      })
    },
    closeModify(done) {
      this.showEditDialog = false
      this.warehouseInfo = {
        address: '',
        code: '',
        contact: '',
        id: '',
        mobile: '',
        name: '',
        shortName: ''
      }
      this.$refs.modifyForm.resetFields()
      this.$refs.modifyForm.clearValidate()
      if (typeof done == 'function') {
        done()
      }
    },
    async submitModify() {
      this.loading = true
      const res = await modifyWarehouseApi(this.warehouseInfo)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.warehouseModifySuccess'))
        this.closeModify()
        this.getData()
      }
      this.loading = false
    },
    async submitCreate() {
      this.loading = true
      const res = await createWarehouseApi(this.warehouseInfo)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.warehouseCreateSuccess'))
        this.closeModify()
        this.getData()
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
      {
        field: 'code',
        headerName: this.$t('packageWarehouse.warehouseCode'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'shortName',
        headerName: this.$t('packageWarehouse.warehouseShortName'),
        minWidth: 120
      },
      {
        field: 'name',
        headerName: this.$t('packageWarehouse.warehouseName'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'contact',
        headerName: this.$t('packageWarehouse.warehouseContact'),
        minWidth: 100
      },
      {
        field: 'mobile',
        headerName: this.$t('packageWarehouse.contactMobile'),
        minWidth: 100
      },
      {
        field: 'address',
        headerName: this.$t('packageWarehouse.warehouseAddress'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'statusCode',
        headerName: this.$t('packageWarehouse.status'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$t('packageWarehouse.warehouseEnabled') : this.$t('packageWarehouse.warehouseDisabled')
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 80,
        cellRendererFramework: 'WarehouseOpreationBtn',
        cellRendererParams: {
          refresh: this.getData,
          modifyWarehouse: this.showWarehouseDialog
        }
      }
    ]

    this.getData()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
