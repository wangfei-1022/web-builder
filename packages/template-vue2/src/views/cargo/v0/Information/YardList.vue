<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot filterType="single" :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="singleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
        <el-form-item label="堆场代码：" prop="yardCode">
          <el-input v-model="multipleForm.yardCode" type="text" placeholder="请输入" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item label="堆场名称：" prop="yardName">
          <el-input v-model="multipleForm.yardName" type="text" placeholder="请输入" size="mini" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <el-button type="primary" size="mini" style="margin-top: 10px;" @click="showCreateDialog">新增</el-button>
    <div class="table-wrap no-margin">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="yardList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        style="height:calc(100vh - 360px); margin-top: 10px;"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
    <EditYardDialog
      :id="id"
      ref="editYardDialog"
      :edit="edit"
      :show-dialog="showDialog"
      @closeDialog="closeDialog"
      @refreshData="getData"
    />
  </div>
</template>
<script>
import { getYardListApi } from '@/api/yardManager'
import YardEditBtn from './components/YardEditBtn'
import EditYardDialog from './components/EditYardDialog'
export default {
  name: 'YardList',
  components: {
    YardEditBtn,
    EditYardDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      yardList: [],
      totalData: 0,
      multipleForm: {
        yardCode: '',
        yardName: '',
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
        headerName: '堆场编码',
        minWidth: 160
      },
      {
        field: 'name',
        headerName: '堆场名称',
        minWidth: 160
      },
      {
        field: 'yardType',
        headerName: '堆场/码头',
        minWidth: 120,
        cellRenderer: params => params.data.yardType === 1 ? '堆场' : '码头'
      },
      {
        field: 'countryName',
        headerName: '国家',
        minWidth: 120
      },
      {
        field: 'yardProvince',
        headerName: '州/省/区',
        minWidth: 120
      },
      {
        field: 'yardCity',
        headerName: '城市',
        minWidth: 120
      },
      {
        field: 'yardAddress',
        headerName: '堆场地址',
        minWidth: 120
      },
      {
        field: 'portCode',
        headerName: '港口',
        minWidth: 120
      },
      {
        field: 'contact',
        headerName: '联系人',
        minWidth: 120
      },
      {
        field: 'email',
        headerName: '邮箱',
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'contactPhone',
        headerName: '联系电话',
        minWidth: 120
      },
      {
        field: 'yardType',
        headerName: '操作',
        minWidth: 100,
        pinned: 'right',
        cellRendererFramework: 'YardEditBtn',
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
      const res = await getYardListApi(this.multipleForm)
      if (res.ok) {
        this.yardList = res.content.list
        this.totalData = parseInt(res.content.total)
      } else {
        this.yardList = []
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
      this.$refs.editYardDialog.getYardDetail(val)
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
