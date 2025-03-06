<template>
  <div v-loading="loading" class="right-main-wrapper">
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
        style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ViewConatinerList',
  filters: {},
  data() {
    return {
      loading: false,
      list: [],
      totalData: 0,
      multipleForm: {
        orderNo: '',
        contractNo: '',
        pageSize: 50,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      selectedItems: []
    }
  },
  computed: {
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'single', // 设置多行可选
      animateRows: true,
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }

    const _insideFields = [
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.containerSituation'),
        minWidth: 80
      },
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.containerType'),
        minWidth: 80
      },
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.arriveTime'),
        minWidth: 80,
        cellRenderer: params => `${this.$moment(params.value).format('YYYY-MM-DD HH:mm')} ${params.data.gmt}`
      },
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.insideYardDays'),
        minWidth: 80
      }
    ]

    const _outsideFields = [
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.containerType'),
        minWidth: 80
      },
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.opreatorTime'),
        minWidth: 80,
        cellRenderer: params => `${this.$moment(params.value).format('YYYY-MM-DD HH:mm')} ${params.data.gmt}`
      },
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.outsideDays'),
        minWidth: 80
      }
    ]

    let _commonFields = [
      {
        field: 'orderNo',
        headerName: this.$t('containerManager.operationYardCode'),
        minWidth: 80
      },
      {
        field: 'orderType',
        headerName: this.$t('containerManager.operationYardName'),
        minWidth: 80
      },
      {
        field: 'contractNo',
        headerName: this.$t('containerManager.containerNumber'),
        minWidth: 80
      }
    ]

    this.columnFields = this.$route.params.viewType === 'inside' ? _commonFields.concat(_insideFields) : _commonFields.concat(_outsideFields)

    this.getData()
  },
  mounted() { },
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
      // const res = await getOrderListApi(this.multipleForm)
      // if (res.ok) {
      //   this.list = res.content.list
      //   this.totalData = parseInt(res.content.total)
      // } else {
      //   this.list = []
      //   this.totalData = 0
      // }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
