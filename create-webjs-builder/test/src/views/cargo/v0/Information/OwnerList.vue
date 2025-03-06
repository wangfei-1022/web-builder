<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot  :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="singleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
        <el-form-item label="箱主代码：" prop="ownerCode">
          <el-input v-model="multipleForm.ownerCode" type="text" placeholder="请输入" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item label="箱主名称：" prop="ownerName">
          <el-input v-model="multipleForm.ownerName" type="text" placeholder="请输入" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
      </el-form>
      <!-- <div slot="searchBtn" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="getData">
          {{ $t('table.search') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{ $t('table.resetColumns') }}</el-button>
      </div> -->
    </top-search-items-slot>
    <el-button type="primary" size="mini" style="margin-top: 10px;" @click="showCreateDialog">新增</el-button>
    <div class="table-wrap no-margin">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="ownerList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        style="height:calc(100vh - 360px); margin-top: 10px;"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
    <EditOwnerDialog
      :id="id"
      ref="editOwnerDialog"
      :edit="edit"
      :show-dialog="showDialog"
      @closeDialog="closeDialog"
      @refreshData="getData"
    />
  </div>
</template>
<script>
import { getOwnerListApi } from '@/api/containerManager'
import OwnerEditBtn from './components/OwnerEditBtn'
import EditOwnerDialog from './components/EditOwnerDialog'
export default {
  name: 'OwnerList',
  components: {
    OwnerEditBtn,
    EditOwnerDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      ownerList: [],
      totalData: 0,
      multipleForm: {
        ownerCode: '',
        ownerName: '',
        pageSize: 50,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      id: '',
      showDialog: false,
      edit: false
    }
  },
  computed: {},
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'single', // 设置多行可选
      animateRows: true,
      suppressRowClickSelection: true // 选中单元格后可以复制内容
      // suppressCellSelection: true, //点击不选中单元格
    }
    this.columnFields = [
      {
        field: 'code',
        headerName: '代码',
        minWidth: 160
      },
      {
        field: 'name',
        headerName: '名称',
        minWidth: 160
      },
      {
        field: 'shortName',
        headerName: '简称',
        minWidth: 120
      },
      {
        field: 'countryName',
        headerName: '国家',
        minWidth: 120
      },
      {
        field: 'ownerProvince',
        headerName: '州/省/区',
        minWidth: 120
      },
      {
        field: 'ownerCity',
        headerName: '城市',
        minWidth: 120
      },
      {
        field: 'appointStatus',
        headerName: '操作',
        minWidth: 100,
        pinned: 'right',
        cellRendererFramework: 'OwnerEditBtn',
        cellRendererParams: { refreshData: this.getData, showEditDialog: this.showEditDialog }
      }
    ]
  },
  mounted() {
    this.getData()
  },
  methods: {
    // AG GRID
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
    async getData() {
      this.loading = true
      const res = await getOwnerListApi(this.multipleForm)
      if (res.ok) {
        this.ownerList = res.content.list
        this.totalData = parseInt(res.content.total)
      } else {
        this.ownerList = []
        this.totalData = 0
      }
      this.loading = false
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.getData()
    },
    showEditDialog(val) {
      this.edit = true
      this.showDialog = true
      this.$refs.editOwnerDialog.getOwnerDetail(val)
    },
    showCreateDialog() {
      this.edit = false
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
