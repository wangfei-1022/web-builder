<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('containerManager.containerNumber')}: `" prop="containerNo">
          <el-input v-model="multipleForm.containerNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.contractNo')}: `" prop="contractNo">
          <el-input v-model="multipleForm.contractNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="$t('containerManager.infoList.containerCategory')" prop="containerCategory">
          <el-select v-model="multipleForm.containerCategory" clearable @change="getData">
            <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.infoList.selectStatus')}: `" prop="status">
          <el-select v-model="multipleForm.status" clearable @change="getData">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" v-permission="['ctn:container:add']" @click="createInfo">{{$t('containerManager.createText')}}</el-button>
        <el-button type="primary" size="mini" v-permission="['ctn:container:import']" @click="showUploadDialog = true">{{$t('containerManager.batchImport')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="containerList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
    <UploadDialog :title="$t('containerManager.importTitle')" :visible.sync="showUploadDialog" :excel-file-name="$t('containerManager.infoList.importTemplet')" @uploadSuccess="getData" :orderType="1" />
  </div>
</template>
<script>
import { getContainerListApi } from '@/api/containerManager'
import ConatinerListBtn from './components/ContainerListBtn'
import UploadDialog from './components/UploadDialog'
export default {
  name: 'InfoList',
  components: {
    ConatinerListBtn,
    UploadDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      showUploadDialog: false,
      multipleForm: {
        containerNo: '',
        contractNo: '',
        containerCategory: '',
        status: null,
        pageSize: 50,
        pageNum: 1
      },
      statusList: [
        {
          label: this.$t('containerManager.statusList.using'),
          value: '1'
        },
        {
          label: this.$t('containerManager.statusList.broken'),
          value: '2'
        },
        {
          label: this.$t('containerManager.statusList.loaned'),
          value: '3'
        },
        {
          label: this.$t('containerManager.statusList.returned'),
          value: '4'
        },
        {
          label: this.$t('containerManager.statusList.sale'),
          value: '5'
        }
      ],
      categoryList: [
        {
          label: this.$t('containerManager.categoryList.owner'),
          value: '1'
        },
        {
          label: this.$t('containerManager.categoryList.lease'),
          value: '2'
        },
        {
          label: this.$t('containerManager.categoryList.financing'),
          value: '3'
        }
      ],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      id: '',
      edit: false,
      columnFields: [],
      containerList: []
    }
  },
  computed: {},
  watch: {},
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
        field: 'containerNo',
        headerName: this.$t('containerManager.containerNumber'),
        minWidth: 160
      },
      {
        field: 'ownerName',
        headerName: this.$t('containerManager.ownerName'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'containerCategory',
        headerName: this.$t('containerManager.infoList.containerCategory'),
        minWidth: 100,
        cellRenderer: params => params.value === 1 ? this.$t('containerManager.categoryList.owner') : params.value === 2 ? this.$t('containerManager.categoryList.lease') : this.$t('containerManager.categoryList.financing')
      },
      {
        field: 'containerAge',
        headerName: this.$t('containerManager.infoList.containerAge'),
        minWidth: 160,
        cellRenderer: params => params.value ? `${params.value}D` : ''
      },
      {
        field: 'productionDate',
        headerName: this.$t('containerManager.infoList.productionTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'status',
        headerName: this.$t('containerManager.infoList.isEnabled'),
        minWidth: 100,
        cellRenderer: params => params.value === 1 ? this.$t('containerManager.infoList.enabled') : this.$t('containerManager.infoList.disabled')
      },
      {
        field: 'containerType',
        headerName: this.$t('containerManager.containerType'),
        minWidth: 100
      },
      {
        field: 'containerSituation',
        headerName: this.$t('containerManager.containerSituation'),
        minWidth: 100,
        cellRenderer: params => params.value === null ? '' : params.value === 1 ? this.$t('containerManager.newContainer') : this.$t('containerManager.oldContainer')
      },
      {
        field: 'contractNo',
        headerName: this.$t('containerManager.contractNo'),
        minWidth: 100
      },
      {
        field: 'costPrice',
        headerName: this.$t('containerManager.infoList.costPrice'),
        minWidth: 100,
        cellRenderer: params => params.value === null ? '-' : params.value
      },
      {
        field: 'salvage',
        headerName: this.$t('containerManager.infoList.salvage'),
        minWidth: 100,
        cellRenderer: params => params.value === null ? '-' : params.value
      },
      // {
      //   field: 'containerSituation',
      //   headerName: '残值',
      //   minWidth: 100,
      //   cellRenderer: params => {
      //     return params.data.containerSituation === 1 ? '完好' : '损坏'
      //   }
      // },
      {
        field: 'deliveryPlace',
        headerName: this.$t('containerManager.deliveryPlace'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'deliveryDate',
        headerName: this.$t('containerManager.deliveryDate'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'redeliveryPlace',
        headerName: this.$t('containerManager.redeliveryPlace'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'redeliveryDate',
        headerName: this.$t('containerManager.redeliveryDate'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'status',
        headerName: this.$t('containerManager.status'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.statusList.filter(item => item.value == params.value)[0].label : ''
      },
      {
        field: 'remark',
        headerName: this.$t('containerManager.remark'),
        minWidth: 120,
        cellRenderer: params => params.value.length > 0 ? params.value : '-'
      },
      {
        field: 'tareWeight',
        headerName: this.$t('containerManager.tareWeight'),
        minWidth: 100
      },
      {
        field: 'payload',
        headerName: this.$t('containerManager.payload'),
        minWidth: 120
      },
      {
        field: 'capacity',
        headerName: this.$t('containerManager.capacity'),
        minWidth: 100
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 160,
        pinned: 'right',
        cellRendererFramework: 'ConatinerListBtn',
        cellRendererParams: { refreshData: this.getData }
      }
    ]

    // this.getData()
  },
  mounted() {},
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
      const res = await getContainerListApi(this.multipleForm)
      if (res.ok) {
        this.containerList = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.containerList = []
        this.totalData = 0
      }
      this.loading = false
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.getData()
    },
    createInfo() {
      this.$router.push({ name: 'InfoDetail' })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getData()
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
