<template>
  <div v-loading="loading" class="right-main-wrapper">
    <topSearchItems :show-single-input="false">
      <template #single>
        <div class="right-search-input-wrap">
          <el-input v-model="singleSearchStr" size="mini" type="text" @keyup.enter.native="singleSearchSubmit" />
        </div>
      </template>
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('charteredBoat.fleetList.truckName')}: `" prop="truckName">
              <el-input v-model="multipleForm.truckName" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.fleetList.tagNo')}: `" prop="tagNo">
              <el-input v-model="multipleForm.tagNo" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.fleetList.bracketNo')}: `" prop="bracketNo">
              <el-input v-model="multipleForm.bracketNo" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.fleetList.eirId')}: `" prop="eirId">
              <el-input v-model="multipleForm.eirId" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.fleetList.driverName')}: `" prop="driverName">
              <el-input v-model="multipleForm.driverName" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.fleetList.driverMobile')}: `" prop="driverMobile">
              <el-input v-model="multipleForm.driverMobile" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.fleetList.applicationTime')}: `">
              <CommonPicker
                v-model="applicationTime"
                :parent-range-date="applicationTime"
                pikcer-type="daterange"
                clearable
                @clear="topSearch"
              />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.fleetList.queryRange')}: `">
              <CommonPicker
                v-model="queryRange"
                :parent-range-date="queryRange"
                pikcer-type="daterange"
                clearable
                @clear="topSearch"
              />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="topSearch">
          {{$t('common.searchBtn')}}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{$t('common.resetBtn')}}</el-button>
      </div>
    </topSearchItems>
    <div class="table-wrap">
      <el-button type="primary" size="mini" @click="checkSelected">
        {{$t('charteredBoat.fleetList.cancelQuery')}}
      </el-button>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        style="width:100%; height:calc(100vh - 440px); margin-top: 10px;"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="pageSize" :page.sync="currPage" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import topSearchItems from '@/components/Cargo/Common/topSearchItems'
import { getTrailerListApi, cancelTrailersApi } from '@/api/trailer'
import TrailerListOptBtn from './components/trailerListOptBtn'

export default {
  name: 'FleetList',
  components: {
    topSearchItems,
    TrailerListOptBtn
  },
  data() {
    return {
      gridApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      loading: false,
      singleSearchStr: '',
      queryRange: [],
      applicationTime: [],
      multipleForm: {
        truckName: '',
        tagNo: '',
        bracketNo: '',
        eirId: '',
        driverName: '',
        driverMobile: ''
      },
      rowData: [],
      totalData: 0,
      pageSize: 50,
      currPage: 1,
      selectedItems: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // this.getList()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // if (from.name === 'BLInfo') {

      // }
      vm.getList()
    })
  },
  created() {
    const _self = this
    this.gridOptions = {
      context: {
        componentParent: _self
      },
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
      // suppressCellSelection: true //点击不选中单元格
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: 'left',
        width: 60
      },
      {
        field: 'eirId',
        headerName: 'EIR-ID',
        pinned: 'left',
        width: 200,
        tooltipField: 'eirId'
      },
      {
        field: 'containerType',
        headerName: this.$t('charteredBoat.containerType'),
        width: 90
      },
      {
        field: 'truckName',
        headerName: this.$t('charteredBoat.fleetList.truckName'),
        width: 200,
        tooltipField: 'truckName'
      },
      {
        field: 'tagNo',
        headerName: this.$t('charteredBoat.fleetList.tagNo'),
        width: 160
      },
      {
        field: 'bracketNo',
        headerName: this.$t('charteredBoat.fleetList.bracketNo'),
        width: 160
      },
      {
        field: 'driverName',
        headerName: this.$t('charteredBoat.fleetList.driverName'),
        width: 120
      },
      {
        field: 'driverIdCardNo',
        headerName: this.$t('charteredBoat.fleetList.driverIdCardNo'),
        width: 200
        // cellRenderer: params => {
        //   return params.value.trim().length > 0 ? params.value.replace(/^(.{4})(?:\d+)(.{4})$/,"$1******$2") : ''
        // }
      },
      {
        field: 'driverMobile',
        headerName: this.$t('charteredBoat.fleetList.driverMobile'),
        width: 200
        // cellRenderer: params => {
        //   return params.value.trim().length > 0 ? params.value.replace(/^(.{3})(?:\d+)(.{4})$/,"$1****$2") : ''
        // }
      },
      {
        field: 'createTime',
        headerName: this.$t('charteredBoat.fleetList.applicationTime'),
        width: 200,
        tooltipField: 'createTime',
        cellRenderer: params => params.value === '' ? '' : this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'pickUpTime',
        headerName: this.$t('charteredBoat.fleetList.queryRange'),
        width: 200,
        tooltipField: 'pickUpTime',
        cellRenderer: params => params.value === '' ? '' : this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'pickUpAddress',
        headerName: this.$t('charteredBoat.fleetList.pickUpAddress'),
        width: 200,
        tooltipField: 'pickUpAddress'
      },
      {
        field: 'returnAddress',
        headerName: this.$t('charteredBoat.fleetList.returnAddress'),
        width: 200,
        tooltipField: 'returnAddress'
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        cellRendererFramework: 'TrailerListOptBtn',
        width: 200
      }
    ]
  },
  methods: {
    onReady(params) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    singleSearchSubmit() {},
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.queryRange = []
      this.applicationTime = []
      this.currPage = 1
      this.getList()
    },
    topSearch() {
      this.currPage = 1
      this.getList()
    },
    refreshData() {
      this.getList()
    },
    async getList() {
      this.loading = true
      console.log(this.applicationTime)
      const _data = {
        pageNum: this.currPage,
        pageSize: this.pageSize,
        pickUpTimeStart: this.queryRange ? this.queryRange[0] : null,
        pickUpTimeEnd: this.queryRange && this.queryRange.length > 1 ? this.queryRange[1] + 24 * 60 * 60 * 1000 - 1 : null,
        createTimeStart: this.applicationTime ? this.applicationTime[0] : null,
        createTimeEnd: this.applicationTime && this.applicationTime.length > 1 ? this.applicationTime[1] + 24 * 60 * 60 * 1000 - 1 : null,
        ...this.multipleForm
      }
      const _res = await getTrailerListApi(_data)
      if (_res.ok && _res.content) {
        this.rowData = _res.content.list
        this.totalData = parseInt(_res.content.total)
      }
      this.loading = false
    },
    researchData(_obj) {
      this.pageSize = _obj.size
      this.currPage = _obj.page
      this.getList()
    },
    checkSelected() {
      this.selectedItems = this.gridApi.getSelectedRows()
      if (!this.selectedItems || this.selectedItems.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('charteredBoat.fleetList.selectedDataEmpty')
        })
      } else {
        this.$confirm(this.$t('charteredBoat.fleetList.trailersConfirmTips'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirmBtn'),
          confirmButtonClass: 'el-button--danger',
          cancelButtonText: this.$t('charteredBoat.fleetList.thinkOver'),
          cancelButtonClass: 'el-button--primary',
          type: 'warning'
        }).then(() => {
          this.cancelOrderList()
        }).catch(() => {})
      }
    },
    // 批量删除条件检查
    async cancelOrderList(_arr) {
      let _count = 0
      const _ids = []
      for (const item of this.selectedItems) {
        if (item.trailerStatus !== 3) {
          _count++
          this.$message({
            type: 'error',
            message: this.$t('charteredBoat.fleetList.cancelOrderFailed')
          })
          break
        } else {
          _ids.push(item.id)
        }
      }

      if (_count === 0) {
        const _res = await cancelTrailersApi({ ids: _ids })
        if (_res.ok) {
          this.$message.success(this.$t('charteredBoat.fleetList.cancelQuerySuccess'))
          this.refreshData()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import './styles/table.scss';
</style>
