<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent v-show="multipleForm.sailType === '1'">
        <el-form-item :label="`${$t('containerManager.vesselName')}: `" prop="vesselName">
          <el-input v-model="multipleForm.vesselName" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" @clear="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.status')}: `" prop="status">
          <el-select v-model="multipleForm.status" clearable @change="getData">
            <el-option v-for="item in normalStatusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent v-show="multipleForm.sailType === '2'">
        <el-form-item :label="`${$t('containerManager.orderNo')}: `" prop="orderNo">
          <el-input v-model="multipleForm.orderNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" @clear="getData" style="width: 300px;" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.status')}: `" prop="status">
          <el-select v-model="multipleForm.status" clearable @change="getData">
            <el-option v-for="item in socStatusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <el-tabs v-model="multipleForm.sailType" @tab-click="changeTab" class="top-tabs">
      <el-tab-pane :label="this.$t('containerManager.releaseBox')" name="1" />
      <el-tab-pane :label="this.$t('containerManager.releaseSOCBox')" name="2" />
    </el-tabs>
    <div class="table-wrap">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="releasedList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
import { getReleasedListApi } from '@/api/containerReleasedList'
import ReleasedListBtn from './components/ReleasedListBtn'
export default {
  name: 'ReleasedList',
  components: {
    ReleasedListBtn
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      multipleForm: {
        vesselName: '',
        status: null,
        orderNo: '',
        sailType: '1',
        pageSize: 50,
        pageNum: 1
      },
      normalStatusList: [
        {
          label: this.$t('common.all'),
          value: null
        },
        {
          label: this.$t('containerManager.releaseList.unReleased'),
          value: 1
        },
        {
          label: this.$t('containerManager.releaseList.releasedPartOf'),
          value: 2
        },
        {
          label: this.$t('containerManager.releaseList.releasedWhole'),
          value: 3
        },
        {
          label: this.$t('containerManager.releaseList.overReleased'),
          value: 4
        }
      ],
      socStatusList: [
        {
          label: this.$t('common.all'),
          value: null
        },
        {
          label: this.$t('containerManager.releaseList.SOCNormal'),
          value: 5
        },
        {
          label: this.$t('containerManager.releaseList.SOCCancel'),
          value: 6
        },
        {
          label: this.$t('containerManager.releaseList.SOCRejected'),
          value: 7
        }
      ],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      releasedList: [],
      containerTypeList: []
    }
  },
  computed: {},
  watch: {
    "$route.query": function(val) {
      if (val.refresh) {
        this.getData()
      }
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'single',
      animateRows: true,
      suppressRowClickSelection: true
    }
    this.columnFields = [
      {
        field: 'vesselName',
        headerName: this.$t('containerManager.vesselName'),
        minWidth: 120
      },
      {
        field: 'voyageNo',
        headerName: this.$t('containerManager.voyageNo'),
        minWidth: 120
      },
      {
        field: 'vesselOwner',
        headerName: this.$t('containerManager.vesselOwner'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'sailSchedule',
        headerName: this.$t('containerManager.releaseList.sailSchedule'),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'requireQuantity',
        headerName: this.$t('containerManager.releaseList.releasedAndRequire'),
        minWidth: 200,
        cellRenderer: params => {
          if (params.data.releasedQuantity) {
            return `${params.data.releasedQuantity}/${params.value}`
          } else {
            return `0/${params.value}`
          }
        }
      },
      {
        field: 'requireContainerTypeQuantity',
        headerName: this.$t('containerManager.releaseList.requireContainerTypeQuantity'),
        minWidth: 200,
        tooltip: params => params.value ? params.value : ''
      },
      {
        field: 'releasedContainerTypeQuantity',
        headerName: this.$t('containerManager.releaseList.releasedContainerTypeQuantity'),
        minWidth: 200,
        tooltip: params => params.value ? params.value : ''
      },
      {
        field: 'usedContainerTypeQuantity',
        headerName: this.$t('containerManager.releaseList.usedContainerTypeQuantity'),
        minWidth: 200,
        tooltip: params => params.value ? params.value : ''
      },
      {
        field: 'status',
        headerName: this.$t('containerManager.status'),
        minWidth: 100,
        cellRenderer: params => {
          if (this.multipleForm.sailType === '1') {
            return params.value ? this.normalStatusList.filter(item => item.value === params.value)[0].label : ''
          } else {
            const _arr = params.value ? this.socStatusList.filter(item => item.value === params.value) : null
            if (_arr) {
              return _arr[0] ? _arr[0].label : ''
            }
            return ''
          }
        }
      },
      // {
      //   field: 'isPublish',
      //   headerName: '发布状态',
      //   minWidth: 100,
      //   cellRenderer: params => {
      //     return params.value ? '已发布' : '未发布'
      //   }
      // },
      {
        field: 'createTime',
        headerName: this.$t('containerManager.releaseList.opreationTime'),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 160,
        pinned: 'right',
        cellRendererFramework: 'ReleasedListBtn',
        cellRendererParams: { refreshData: this.getData, getSailType: this.getSailType }
      }
    ]

    this.getData()
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
    changeTab() {
      this.multipleForm.status = null
      this.getData()
    },
    getSailType() {
      return this.multipleForm.sailType
    },
    async getData() {
      this.loading = true
      const res = await getReleasedListApi(this.multipleForm)
      if (res.ok) {
        this.releasedList = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.releasedList = []
        this.totalData = 0
      }
      this.loading = false
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
