<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <!-- <el-form-item :label="`${$t('packageWarehouse.productCode')}: `" prop="productId">
          <el-select v-model="multipleForm.productId"
            :placeholder="$t('common.placeholder')"
            filterable>
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="`${$t('packageWarehouse.boxNo')}: `" prop="numbers">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.numbers" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.statusDate')" prop="opreatorTime">
          <CommonPicker
            v-model="createTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr"/>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <!-- <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="exportOrderSearch">{{$t('common.exportBtn')}}</el-button>
      </div> -->
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
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
  </div>
</template>
<script>
import { getLargePackageListApi, getProductListApi, exportOrderSearchApi } from '@/api/packageWarehouse'
import LargePackageOpreatorBtn from './components/LargePackageOpreatorBtn'
export default {
  name: 'LargePackageList',
  components: {
    LargePackageOpreatorBtn
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      showUploadDialog: false,
      createTime: [],
      defaultTimeStr: ['12:00:00', '12:00:00'],
      multipleForm: {
        numbers: '',
        createTimeBegin: null,
        createTimeEnd: null,
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      dataList: []
      // countryProductsList: [],
      // productList: []
    }
  },
  computed: {
  },
  watch: {
    createTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.createTimeBegin = arr[0]
        this.multipleForm.createTimeEnd = arr[1]
      } else {
        this.multipleForm.createTimeBegin = null
        this.multipleForm.createTimeEnd = null
      }
    },
    "$route.query": function(query) {
      if (query && query.refresh) {
        this.getData()
      }
    }
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    // async getProductList() {
    //   const res = await getProductListApi()
    //   if (res && res.ok && res.content) {
    //     res.content.forEach(item => {
    //       this.countryProductsList.push({
    //         countryCode: item.countryCode,
    //         countryName: item.countryName,
    //         id: item.id,
    //         productName: item.productName
    //       })
    //     })
    //     this.setProductList()
    //   }
    // },
    // setProductList() {
    //   this.productList = [{
    //     label: this.$t('packageWarehouse.statusAll'),
    //     value: null
    //   }]

    //   let _list = this.countryProductsList.map(item => ({
    //     label: item.productName,
    //     value: item.id
    //   }))

    //   this.multipleForm.productId = null
    //   this.productList = this.productList.concat(_list)
    //   this.getData()
    // },
    async getData() {

      this.loading = true
      // this.multipleForm.numbers = this.multipleForm.numbers.trim()
      const res = await getLargePackageListApi(this.multipleForm)
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
      return true
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.createTime = []
      this.setProductList()
      this.getData()
    },
    async exportOrderSearch() {
      this.loading = true
      const res = await exportOrderSearchApi(this.multipleForm)
      if (res.ok) {
        if (res.content) {
          // this.$message.success(this.$t('packageWarehouse.exportDetailSuccess'))
          this.downloadFile({
            fileName: `orderDetail_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
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
      // {
      //   headerName: '',
      //   checkboxSelection: true,
      //   headerCheckboxSelection: true,
      //   minWidth: 50,
      //   pinned: 'left'
      // },
      {
        field: 'boxNo',
        headerName: this.$t('packageWarehouse.boxNo'),
        minWidth: 200,
        pinned: 'left'
      },
      {
        field: 'countryCode',
        headerName: this.$t('packageWarehouse.countryCode'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'createTime',
        headerName: this.$t('packageWarehouse.declareTime'),
        minWidth: 200,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'netWeight',
        headerName: this.$t('packageWarehouse.netWeight'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'boxWeight',
        headerName: this.$t('packageWarehouse.tare'),
        minWidth: 120
      },
      {
        field: 'totalWeight',
        headerName: this.$t('packageWarehouse.grossHeavy'),
        minWidth: 120,
        cellRenderer: params => params.value
      },
      {
        field: 'boxLength',
        headerName: this.$t('packageWarehouse.length'),
        minWidth: 120,
        cellRenderer: params => params.value
      },
      {
        field: 'boxWidth',
        headerName: this.$t('packageWarehouse.width'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'boxHeight',
        headerName: this.$t('packageWarehouse.height'),
        minWidth: 120
      },
      {
        field: 'quantity',
        headerName: this.$t('packageWarehouse.ticketQuantity'),
        minWidth: 120,
        cellRenderer: params => params.value
      },
      {
        field: 'boxPredictionStateName',
        headerName: this.$t('packageWarehouse.status'),
        minWidth: 180,
        cellRenderer: params => params.value
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 80,
        cellRendererFramework: 'LargePackageOpreatorBtn'
      }
    ]

    this.getData()
    // this.getProductList()
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
