<template>
  <div v-loading="loading" class="right-main-wrapper">
    <h3 class="content-title">{{title}}</h3>
    <div class="table-wrap">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
import { getLogContainerDetailApi } from '@/api/containerDynamic'
export default {
  name: 'ViewDynamicSubDetail',
  filters: {},
  data() {
    return {
      loading: false,
      gridHeight: null,
      insideYardFields: [],
      outsideYardFields: [],
      pageSize: 50,
      pageNum: 1,
      list: [],
      totalData: 0,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      selectedItems: []
    }
  },
  components: {},
  computed: {
    columnFields: function() {
      return this.$route.params.type === 1 ? this.insideYardFields : this.outsideYardFields
    },
    searchObj: function() {
      return {type: this.$route.params.type, operationYard: this.$route.params.yard, operationCode: this.$route.params.code}
    },
    title: function(val) {
      return this.$route.params.type === 1 ? this.$t('containerManager.dynamicDetail.insideDetail') : this.$t('containerManager.dynamicDetail.outsideDetail')
    },
    daysText: function() {
      let reg = RegExp(/MT|OH|OC/)
      if (this.$route.params.code.match(reg)) {
        return this.$t('containerManager.insideYardDays')
      } else {
        return this.$t('containerManager.insidePortDays')
      }
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }

    this.insideYardFields = [
      {
        field: 'operationYard',
        headerName: this.$t('containerManager.operationYardCode'),
        minWidth: 80
      },
      {
        field: 'operationYardName',
        headerName: this.$t('containerManager.operationYardName'),
        minWidth: 80
      },
      {
        field: 'containerNo',
        headerName: this.$t('containerManager.containerNumber'),
        minWidth: 80
      },
      {
        field: 'logContainerSituation',
        headerName: this.$t('containerManager.containerSituation'),
        minWidth: 80,
        cellRenderer: params => params.value === 1 ? this.$t('containerManager.dynamicDetail.logContainerSituationAV') : this.$t('containerManager.dynamicDetail.logContainerSituationDM')
      },
      {
        field: 'containerType',
        headerName: this.$t('containerManager.containerType'),
        minWidth: 80
      },
      {
        field: 'operationTime',
        headerName: this.$t('containerManager.arriveTime'),
        minWidth: 80,
        cellRenderer: params => {
          const _gmt = params.data.timeZone ? params.data.timeZone >= 0 ? `GMT+${params.data.timeZone}` : `GMT-${params.data.timeZone}` : ''
          return params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm')} ${_gmt}` : ''
        }
      },
      {
        field: 'days',
        headerName: this.daysText,
        minWidth: 80
      }
    ]

    this.outsideYardFields = [
      {
        field: 'operationYard',
        headerName: this.$t('containerManager.operationYardCode'),
        minWidth: 80
      },
      {
        field: 'operationYardName',
        headerName: this.$t('containerManager.operationYardName'),
        minWidth: 80
      },
      {
        field: 'containerNo',
        headerName: this.$t('containerManager.containerNumber'),
        minWidth: 80
      },
      {
        field: 'containerType',
        headerName: this.$t('containerManager.containerType'),
        minWidth: 80
      },
      {
        field: 'operationTime',
        headerName: this.$t('containerManager.operationTime'),
        minWidth: 80,
        cellRenderer: params => {
          const _gmt = params.data.timeZone ? params.data.timeZone >= 0 ? `GMT+${params.data.timeZone}` : `GMT-${params.data.timeZone}` : ''
          return params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm')} ${_gmt}` : ''
        }
      },
      {
        field: 'days',
        headerName: this.$t('containerManager.outsideDays'),
        minWidth: 80
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
      this.setGridHeight()
    },
    async getData() {
      this.loading = true
      const _searchObj = {...this.searchObj, ...{pageNum: this.pageNum, pageSize: this.pageSize}}
      const res = await getLogContainerDetailApi(_searchObj)
      if (res.ok) {
        this.list = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.list = []
        this.totalData = 0
      }
      this.loading = false
    },
    setGridHeight() {
      const _otherHeight = this.calcHeight() + 10
      this.gridHeight = {
        height: `calc(100vh - ${_otherHeight}px)`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .content-title{
    margin: 0;
    margin-bottom: 10px;
  }
</style>
