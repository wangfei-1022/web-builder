<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <!-- <el-form-item :label="`${$t('packageWarehouse.applicationManager.appName')}: `" prop="appName">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.appName" clearable @clear="getData" >
          </el-input>
        </el-form-item> -->
        <el-form-item :label="`${$t('packageWarehouse.applicationManager.appName')}: `" prop="appCode">
          <el-select v-model="multipleForm.appCode"
            :placeholder="$t('common.placeholder')"
            clearable >
            <el-option
              v-for="item in appTypeList"
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
        <el-button type="primary" size="mini" @click="showUploadAppDialog = true">{{$t('packageWarehouse.applicationManager.uploadApp')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[20, 50, 100, 200]" />
    </div>
    <UploadAppDialog :title="$t('packageWarehouse.applicationManager.upgradeVersion')" :visible.sync="showUploadAppDialog" :appTypeList="appTypeList" @refreshData="getData" />
  </div>
</template>
<script>
import { getApplicationListApi, getApplicationUrlApi } from '@/api/packageWarehouse'
import ApplicationDownloadBtn from './components/ApplicationDownloadBtn'
import UploadAppDialog from './components/UploadAppDialog'
export default {
  name: 'ApplicationManager',
  components: {
    ApplicationDownloadBtn,
    UploadAppDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      showUploadAppDialog: false,
      dataList: [],
      appTypeList: [
        {
          value: null,
          label: this.$t('common.all')
        },
        {
          value: 0,
          label: this.$t('packageWarehouse.applicationManager.appTypeList[0]')
        },
        {
          value: 1,
          label: this.$t('packageWarehouse.applicationManager.appTypeList[1]')
        }
      ],
      multipleForm: {
        appCode: null,
        pageSize: 20,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      this.resetHeight()
    },
    async getData() {
      this.loading = true
      const res = await getApplicationListApi(this.multipleForm)
      this.dataList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.dataList = res.content.list
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.dataList = []
        this.totalData = 0
      }
      this.loading = false
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
    async downloadApp(id) {
      this.loading = true
      const res = await getApplicationUrlApi(id)
      if (res && res.ok) {
        this.downloadFile({fileName: '', url: res.content.url})
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
      rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }
    this.columnFields = [
      {
        field: 'appCodeName',
        headerName: this.$t('packageWarehouse.applicationManager.appName'),
        minWidth: 200
      },
      {
        field: 'appVersion',
        headerName: this.$t('packageWarehouse.applicationManager.version'),
        minWidth: 120
      },
      {
        field: 'remark',
        headerName: this.$t('packageWarehouse.applicationManager.remark'),
        minWidth: 120
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 120,
        cellRendererFramework: 'ApplicationDownloadBtn',
        cellRendererParams: {
          downloadApp: this.downloadApp
        }
      }
    ]
    this.getData()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
