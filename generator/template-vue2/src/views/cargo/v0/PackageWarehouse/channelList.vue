<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="100px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('packageWarehouse.chaneelSearchLabel')}: `" prop="searchStr">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.searchStr" clearable @clear="getData" @keyup.enter.native="getData" />
        </el-form-item>
        <!-- <el-form-item :label="`${$t('packageWarehouse.countryCode')}: `" prop="countryCode">
          <el-select v-model="multipleForm.countryCode"
            :placeholder="$t('common.placeholder')"
            filterable
            @change="setProductList">
            <el-option
              v-for="item in countryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.productCode')}: `" prop="productId">
          <el-select v-model="multipleForm.productId"
            :placeholder="$t('common.placeholder')"
            filterable
            @change="getData">
            <el-option
              v-for="item in productList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="exportChannel">{{$t('packageWarehouse.exportChannel')}}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="channelList"
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
import { getProductListApi, exportProductListApi } from '@/api/packageWarehouse'
export default {
  name: 'ChannelList',
  components: {},
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      multipleForm: {
        searchStr: '',
        countryCode: null,
        productId: null,
        pageNum: 1,
        pageSize: 200
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      channelList: [],
      countryProductsList: [],
      countryList: [],
      productList: []
    }
  },
  computed: {
    arrayStart() {
      return (this.multipleForm.pageNum - 1) * this.multipleForm.pageSize
    },
    arrayEnd() {
      return this.multipleForm.pageNum * this.multipleForm.pageSize
    }
  },
  watch: {
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
      // window.addEventListener('resize', () => {
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getProductList() {
      const res = await getProductListApi()
      if (res && res.ok && res.content) {
        res.content.forEach(item => {
          this.countryProductsList = res.content
        })
        this.getData()
        // this.setCountryList()
        // this.setProductList()
      }
    },
    setCountryList() {
      this.countryList = [{
        label: this.$t('packageWarehouse.statusAll'),
        value: null
      }]
      const _m = new Map()
      const _county = this.countryProductsList.filter(item => !_m.has(item.countryCode) && _m.set(item.countryCode, ''))
      const _list = _county.map(item => ({
          value: item.countryCode,
          label: item.countryName
        }))
      this.countryList = this.countryList.concat(_list)
    },
    setProductList() {
      this.productList = [{
        label: this.$t('packageWarehouse.statusAll'),
        value: null
      }]

      let _list = []
      if (this.multipleForm.countryCode) {
        this.countryProductsList.forEach(item => {
          if (item.countryCode === this.multipleForm.countryCode) {
            _list.push({
              label: item.productName,
              value: item.id
            })
          }
        })
      } else {
        _list = this.countryProductsList.map(item => ({
            label: item.productName,
            value: item.id
          }))
      }
      this.multipleForm.productId = null
      this.productList = this.productList.concat(_list)
      this.getData()
    },
    getData() {
      this.loading = true
      // if (this.multipleForm.productId) {
      //   this.channelList = this.countryProductsList.filter(item => item.id == this.multipleForm.productId)
      // } else if (this.multipleForm.countryCode) {
      //   this.channelList = this.countryProductsList.filter(item => item.countryCode == this.multipleForm.countryCode)
      // } else {
      //   this.channelList = this.countryProductsList
      // }
      this.channelList = this.countryProductsList
      if (this.multipleForm.searchStr.length > 0) {
        this.channelList = this.channelList.filter(item => item.countryName.includes(this.multipleForm.searchStr) || item.productName.includes(this.multipleForm.searchStr))
      }
      this.totalData = this.channelList.length
      this.channelList = this.channelList.slice(this.arrayStart, this.arrayEnd)
      this.loading = false
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.getData()
    },
    // 导出渠道列表
    async exportChannel() {
      const res = await exportProductListApi()
      if (res && res.ok) {
        this.downloadFile({fileName: '', url: res.content})
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
        field: 'countryName',
        headerName: this.$t('packageWarehouse.countryName'),
        minWidth: 100,
        pinned: 'left'
      },
      {
        field: 'countryCode',
        headerName: this.$t('packageWarehouse.countryCode'),
        minWidth: 100,
        pinned: 'left'
      },
      {
        field: 'productName',
        headerName: this.$t('packageWarehouse.productName'),
        minWidth: 100,
        pinned: 'left'
      },
      {
        field: 'productCode',
        headerName: this.$t('packageWarehouse.productCodeText'),
        minWidth: 100,
        pinned: 'left'
      },
      {
        field: 'demand',
        headerName: this.$t('packageWarehouse.demandLabel'),
        minWidth: 100,
        tooltip: params => params.value,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'mark',
        headerName: this.$t('packageWarehouse.markLabel'),
        minWidth: 100,
        tooltip: params => params.value,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'parcelLength',
        headerName: this.$t('packageWarehouse.length') + '(cm)',
        minWidth: 100
      },
      {
        field: 'parcelWidth',
        headerName: this.$t('packageWarehouse.width') + '(cm)',
        minWidth: 100
      },
      {
        field: 'parcelHeight',
        headerName: this.$t('packageWarehouse.height') + '(cm)',
        minWidth: 100
      },
      {
        field: 'parcelVolume',
        headerName: this.$t('packageWarehouse.volume') + '(cm³)',
        minWidth: 100
      },
      {
        field: 'parcelWeight',
        headerName: this.$t('packageWarehouse.weight') + '(kg)',
        minWidth: 100
      },
      {
        field: 'productMaxWeight',
        headerName: this.$t('packageWarehouse.productMaxWeight') + '(kg)',
        minWidth: 120
      },
      {
        field: 'productMinWeight',
        headerName: this.$t('packageWarehouse.productMinWeight') + '(kg)',
        minWidth: 120
      },
      {
        field: 'parcelLockWeight',
        headerName: this.$t('packageWarehouse.parcelLockWeight') + '(kg)',
        minWidth: 120
      },
      {
        field: 'lockTypeName',
        headerName: this.$t('packageWarehouse.lockTypeName'),
        minWidth: 120
      },
      {
        field: 'extData',
        headerName: this.$t('packageWarehouse.extData'),
        minWidth: 100,
        cellRenderer: params => {
          if (params.value) {
            const _obj = JSON.parse(params.value)
            return _obj.area ? _obj.area : ''
          } else {
            return ''
          }
        }
      },
      {
        field: 'grid',
        headerName: this.$t('packageWarehouse.grid'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'batteryFlag',
        headerName: this.$t('packageWarehouse.batteryFlag'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$t('packageWarehouse.locked') : this.$t('packageWarehouse.unlock')
      },
      {
        field: 'numberPre',
        headerName: this.$t('packageWarehouse.numberPre'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      }
    ]
    this.getProductList()
  },
  mounted() { }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
