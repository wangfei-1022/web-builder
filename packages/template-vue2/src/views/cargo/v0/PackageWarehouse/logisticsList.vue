<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('packageWarehouse.logisticManager.memberId')}: `" prop="memberId">
          <TypeSelect v-model="multipleForm.memberId" type="user" :placeholder="$t('charteredBoat.memberPlaceholder')" style="width: 300px;"></TypeSelect>
          <!-- <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getMemberApi" style="width: 300px;" /> -->
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.logisticManager.logisticsNos')}: `" prop="logisticsNos">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.logisticsNos" clearable >
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.operatorName')}: `" prop="updateBy">
          <el-select v-model="multipleForm.updateBy" filterable clearable :placeholder="$t('common.placeholder')">
            <el-option :label="$t('common.all')" :value="null"></el-option>
            <el-option
              v-for="item in employeeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.warehouseId')}: `" prop="warehouseId">
          <el-select v-model="multipleForm.warehouseId"
            clearable>
            <el-option :label="$t('common.all')" :value="null"></el-option>
            <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.logisticManager.receivedTime')}: `" prop="receivedTime">
          <CommonPicker
            v-model="receivedTimeRange"
            pickerFormat="yyyy-MM-dd HH:mm"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr"/>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="createLogistics">{{$t('packageWarehouse.logisticManager.createLogistics')}}</el-button>
        <el-button type="primary" size="mini" @click="showImportDialog = true">{{$t('packageWarehouse.logisticManager.importLogistics')}}</el-button>
        <el-button type="primary" size="mini" @click="checkBindList">{{$t('packageWarehouse.logisticManager.bindParentOrder')}}</el-button>
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
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <CreateLogisticsDialog ref="createLogisticsRef" :visible.sync="showCreateDialog" :getLogisticsListApi="getMemberApi" :warehouseList="warehouseList" @refreshData="getData" :parentLoading.sync="loading" />
    <LogisticsImportDialog :visible.sync="showImportDialog" @refreshData="getData" :parentLoading.sync="loading"/>
    <LogisticsStatusDialog :visible.sync="showUpgradeDialog" @refreshData="getData" :parentLoading.sync="loading" :modifyInfo="logisticsInfo" />
    <BindParentLogisticsDialog :visible.sync="showBindDialog" @refreshData="getData" :parentLoading.sync="loading" :childIdList="childIdList" />
  </div>
</template>
<script>
import {
  getLogisticsListApi,
  getWarehouseListApi,
  employeeDropdownListApi
} from '@/api/packageWarehouse'
import { getRemoteMemberApi } from '@/api/user'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import CreateLogisticsDialog from './components/CreateLogisticsDialog'
import LogisticsImportDialog from './components/LogisticsImportDialog'
import LogisticsStatusDialog from './components/LogisticsStatusDialog'
import LogisticsOpreatorBtn from './components/LogisticsOpreatorBtn'
import BindParentLogisticsDialog from './components/BindParentLogisticsDialog'
export default {
  name: 'LogisticsList',
  components: {
    RemoteSearchSelector,
    CreateLogisticsDialog,
    LogisticsImportDialog,
    LogisticsOpreatorBtn,
    LogisticsStatusDialog,
    BindParentLogisticsDialog
  },
  filters: {},
  data() {
    return {
      loading: false,
      showCreateDialog: false,
      showImportDialog: false,
      showUpgradeDialog: false,
      showBindDialog: false,
      receivedTimeRange: [],
      defaultTimeStr: ['00:00:00', '00:00:00'],
      multipleForm: {
        memberId: '',
        warehouseId: null,
        logisticsNos: '',
        updateBy: null,
        receivedTimeStart: null,
        receivedTimeEnd: null,
        pageSize: 200,
        pageNum: 1
      },
      totalData: 0,
      dataList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      logisticsInfo: null,
      childIdList: [],
      employeeList: [],
      warehouseList: []
    }
  },
  computed: {
    getMemberApi: function() {
      return getRemoteMemberApi
    }
  },
  watch: {
    receivedTimeRange: function(newVal, oldVal) {
      if (newVal.length > 0) {
        this.multipleForm.receivedTimeStart = newVal[0]
        this.multipleForm.receivedTimeEnd = newVal[1]
      } else {
        this.multipleForm.receivedTimeStart = null
        this.multipleForm.receivedTimeEnd = null
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
      //   this.throttle(this.calcHeight, 200, 300)
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getData() {
      this.loading = true
      const res = await getLogisticsListApi(this.multipleForm)
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
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 100})
      if (res && res.ok && res.content) {
        this.warehouseList = []

        res.content.list.forEach(item => {
          this.warehouseList.push({
            label: item.name,
            value: item.id
          })
        })
      }
    },
    async getEmployeeDropdown() {
      const res = await employeeDropdownListApi()
      if (res && res.ok && res.content) {
        this.employeeList = res.content.map(item => ({
            label: item.chineseName,
            value: item.id
          }))
      }
    },
    createLogistics() {
      this.$refs.createLogisticsRef.init()
      this.showCreateDialog = true
    },
    clearSearchForm() {
      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
        this.receivedTimeRange = []
      }
      this.distrainDate = []
      this.getData()
    },
    showLoading(val) {
      this.loading = val
    },
    // 显示更新状态弹窗
    showUpgradeStatus(info) {
      this.logisticsInfo = info
      this.showUpgradeDialog = true
    },
    // 显示编辑弹窗
    showEditInfo(info) {
      this.$refs.createLogisticsRef.init(info)
      this.showCreateDialog = true
    },
    // 绑定前先确认是否符合绑定条件
    checkBindList() {
      const _arr1 = this.gridApi.getSelectedRows()
      if (_arr1.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.logisticManager.selectedInvalid'))
        return
      }
      const _arr2 = _arr1.map(item => item.memberId)
      const _arr3 = Array.from(new Set(_arr2))
      if (_arr3.length === 1) {
        this.childIdList = _arr1.map(item => item.id)
        this.showBindDialog = true
      } else {
        this.$confirm(this.$t('packageWarehouse.logisticManager.diffMemberErr'), this.$t('common.tips'), {
          confirmButtonText: this.$t('packageWarehouse.logisticManager.recheckSelected'),
          cancelButtonText: this.$t('common.closed'),
          type: 'warning'
        }).then(() => {}).catch(() => {})
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
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        cellRendererParams: {
          checkbox: function(params) {
            params.node.selectable = !params.data.parentId
            return !params.data.parentId
          }
        },
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left'
      },
      {
        field: 'logisticsNo',
        headerName: this.$t('packageWarehouse.logisticManager.logisticsNos'),
        minWidth: 200
      },
      {
        field: 'providerName',
        headerName: this.$t('packageWarehouse.providerName'),
        minWidth: 120
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.logisticManager.chineseName'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'receivedTime',
        headerName: this.$t('packageWarehouse.logisticManager.receivedTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'estimateArrivalTime',
        headerName: this.$t('packageWarehouse.logisticManager.estimateArrivalTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'realArrivalTime',
        headerName: this.$t('packageWarehouse.logisticManager.realArrivalTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'estimateLogisticsAmount',
        headerName: this.$t('packageWarehouse.logisticManager.estimateLogisticsAmount'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : 0
      },
      {
        field: 'realLogisticsAmount',
        headerName: this.$t('packageWarehouse.logisticManager.realLogisticsAmount'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : 0
      },
      {
        field: 'estimateParcelAmount',
        headerName: this.$t('packageWarehouse.logisticManager.estimateParcelAmount'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : 0
      },
      {
        field: 'realParcelAmount',
        headerName: this.$t('packageWarehouse.logisticManager.realParcelAmount'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : 0
      },
      {
        field: 'estimateWeight',
        headerName: this.$t('packageWarehouse.logisticManager.estimateWeight'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'logisticsStateName',
        headerName: this.$t('packageWarehouse.logisticManager.logisticsStateName'),
        minWidth: 120
      },
      {
        field: 'warehouseName',
        headerName: this.$t('planManager.warehouseId'),
        minWidth: 120
      },
      {
        field: 'updateByName',
        headerName: this.$t('packageWarehouse.operatorName'),
        minWidth: 120
      },
      {
        field: 'id',
        pinned: 'right',
        headerName: this.$t('common.operation'),
        minWidth: 240,
        cellRendererFramework: 'LogisticsOpreatorBtn',
        cellRendererParams: {
          refreshData: this.getData,
          showParentLoading: this.showLoading,
          updateStatus: this.showUpgradeStatus,
          modifyInfo: this.showEditInfo
        }
      }
    ]

    this.getData()
    this.getWarehouseList()
    this.getEmployeeDropdown()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
@import "./mixin/highlight";
</style>
