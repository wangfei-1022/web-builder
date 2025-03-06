<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('planManager.warehouseId')}: `" prop="warehouseId">
          <el-select v-model="multipleForm.warehouseId"
            clearable>
            <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="`${$t('planManager.billNo')}: `" prop="billNo">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.billNo" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item> -->
        <el-form-item :label="`${$t('planManager.polCode')}: `" prop="polCode">
          <!-- <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.polCode" clearable @keyup.enter.native="getData">
          </el-input> -->
          <cargo-advance-select
            ref="polCodeSelect"
            :url="airPortListUrl"
            :headers="[$t('common.threeCharCode')]"
            :fields="['code3']"
            tag-value="code3"
            tag-name="code3"
            remote
            @parentCallBack="(data) => {
              multipleForm.polCode = data.code3
            }" />
        </el-form-item>
        <el-form-item :label="`${$t('planManager.podCode')}: `" prop="podCode">
          <cargo-advance-select
            ref="podCodeSelect"
            :url="airPortListUrl"
            :headers="[$t('common.threeCharCode')]"
            :fields="['code3']"
            tag-value="code3"
            tag-name="code3"
            remote
            @parentCallBack="(data) => {
              multipleForm.podCode = data.code3
            }" />
        </el-form-item>
        <el-form-item :label="`${$t('planManager.planDate')}: `">
          <CommonPicker
            v-model="opreatorTime"
            pickerFormat="yyyy-MM-dd"
            pikcerType="daterange"
            parentOption="followingDependence"
            :startDependence="startDate"
            :clearable="true" />
        </el-form-item>
        <el-form-item :label="`${$t('planManager.airAgent')}: `" prop="airAgent">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.airAgent" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.customsAgent')}: `" prop="customsAgent">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.customsAgent" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.billOrigin')}: `" prop="billOrigin">
          <el-select v-model="multipleForm.billOrigin"
            clearable>
            <el-option v-for="item in billOriginList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="redirectCreatePage">{{$t('planManager.createPlan')}}</el-button>
        <el-button type="primary" size="mini" @click="bindBatchToPlan" v-show="batchId != ''">{{$t('planManager.bindBatchToPlan')}}</el-button>
        <el-button type="primary" size="mini" @click="createBill">{{$t('planManager.billList.createBill')}}</el-button>
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
    <PlanModifyDialog ref="planModifyDialog" @refreshData="getData" />
    <BillModifyDialog ref="billModifyDialog" opreator="create" />
  </div>
</template>
<script>
import { getWarehouseListApi } from '@/api/packageWarehouse'
import { getPlanListApi, batchBindPlanApi } from '@/api/planManager'
import URL from '@/api/urlTranslator'
import PlanOpreatorBtn from './components/PlanOpreatorBtn'
// import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PlanModifyDialog from './components/PlanModifyDialog'
import BillModifyDialog from './components/BillModifyDialog'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
export default {
  name: 'PlanList',
  components: {
    PlanOpreatorBtn,
    // cargoAdvanceSelect,
    PlanModifyDialog,
    BillModifyDialog,
    cargoAdvanceSelect
  },
  filters: {},
  data() {
    return {
      showDialog: false,
      url: URL,
      loading: false,
      totalData: 0,
      opreatorTime: [this.$moment().add(-15, 'd').valueOf(), this.$moment().add(5, 'd').valueOf()],
      defaultTimeStr: ['12:00:00', '12:00:00'],
      multipleForm: {
        warehouseId: null,
        // billNo: '',
        billOrigin: null,
        polCode: '',
        podCode: '',
        planTimeBegin: '',
        planTimeEnd: '',
        airAgent: '',
        customsAgent: '',
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      dataList: [],
      warehouseList: [],
      billOriginList: [
        {
          label: this.$t('planManager.outsidePurchase'),
          value: 0
        },
        {
          label: this.$t('planManager.airDelivery'),
          value: 1
        }
      ],
      batchId: '',
      startDate: this.$moment().add(-15, 'd').valueOf(),
      airPortListUrl: '/api/mdm-service/dmn/airport/pages'
    }
  },
  computed: {
  },
  watch: {
    opreatorTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.planTimeBegin = arr[0]
        this.multipleForm.planTimeEnd = arr[1]
      } else {
        this.multipleForm.planTimeBegin = null
        this.multipleForm.planTimeEnd = null
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
      // window.addEventListener('resize', () => {
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 100})
      if (res && res.ok && res.content) {
        this.warehouseList = [
          {
            label: this.$t('common.all'),
            value: null
          }
        ]

        res.content.list.forEach(item => {
          this.warehouseList.push({
            label: item.name,
            value: item.id
          })
        })
      }
    },
    async getData() {
      this.loading = true
      const res = await getPlanListApi(this.multipleForm)
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
    redirectCreatePage() {
      this.$router.push({name: 'CreatePlan'})
    },
    editPlan(id) {
      this.$refs.planModifyDialog.showModifyDialog(id)
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.opreatorTime = [this.$moment().add(-15, 'd').valueOf(), this.$moment().add(5, 'd').valueOf()]
      this.getData()
    },
    bindBatchToPlan() {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.warning(this.$t('planManager.selectedIdEmptyWarning'))
        return false
      } else if (_selectedRows.length > 1) {
        this.$message.warning(this.$t('planManager.selectedIdLimitWarning'))
        return false
      } else {
        this.submitBindInfo(_selectedRows)
      }
    },
    async submitBindInfo(selectedArr) {
      this.loading = true
      const planId = selectedArr[0].id
      const res = await batchBindPlanApi({planId: planId, batchId: this.batchId})
      if (res && res.ok) {
        this.$message.success(this.$t('planManager.batchBoundPlanSuccess'))
        const currRoute = this.$store.getters.visitedViews.filter(item => item.name === 'PlanList')
        this.$store.dispatch('tagsView/delView', currRoute[0])
        this.$router.push({name: 'BatchManager', query: {opreator: 'refresh'}})
      }
      this.loading = false
    },
    createBill() {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.warning(this.$t('planManager.selectedIdEmptyWarning'))
        return false
      } else if (_selectedRows.length > 1) {
        this.$message.warning(this.$t('planManager.selectedIdLimitWarning'))
        return false
      } else if (_selectedRows[0].billOrigin === 1) {
        this.$message.warning(this.$t('planManager.billList.billOriginWarning'))
        return false
      } else {
        this.$refs.billModifyDialog.showModifyDialog(_selectedRows[0].id)
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
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left'
      },
      {
        field: 'planNo',
        headerName: this.$t('planManager.planNo'),
        minWidth: 200,
        pinned: 'left'
      },
      {
        field: 'planTime',
        headerName: this.$t('planManager.planDate'),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'billOriginName',
        headerName: this.$t('planManager.billOrigin'),
        minWidth: 100,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'warehouseName',
        headerName: this.$t('planManager.warehouseName'),
        minWidth: 120
      },
      {
        field: 'countryName',
        headerName: this.$t('planManager.countryName'),
        minWidth: 120
      },
      {
        field: 'lastMailCarrier',
        headerName: this.$t('planManager.lastMailCarrier'),
        minWidth: 120
      },
      {
        field: 'cargoType',
        headerName: this.$t('planManager.cargoType'),
        minWidth: 120
      },
      {
        field: 'outboundCarrier',
        headerName: this.$t('planManager.outboundCarrier'),
        minWidth: 120
      },
      {
        field: 'customsAgent',
        headerName: this.$t('planManager.customsAgent'),
        minWidth: 120
      },
      {
        field: 'airAgent',
        headerName: this.$t('planManager.airAgent'),
        minWidth: 120
      },
      // {
      //   field: 'billNo',
      //   headerName: this.$t('planManager.billNo'),
      //   minWidth: 200,
      //   tooltip: params => params.value
      // },
      {
        field: 'etd',
        headerName: this.$t('planManager.etd'),
        minWidth: 120,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
      },
      {
        field: 'flightNo',
        headerName: this.$t('planManager.flightNo'),
        minWidth: 120
      },
      {
        field: 'polCode',
        headerName: this.$t('planManager.polCode'),
        minWidth: 120
      },
      {
        field: 'podCode',
        headerName: this.$t('planManager.podCode'),
        minWidth: 120
      },
      {
        field: 'customsClearance',
        headerName: this.$t('planManager.customsClearance'),
        minWidth: 120
      },
      {
        field: 'density',
        headerName: this.$t('planManager.density'),
        minWidth: 120
      },
      {
        field: 'boxQuantity',
        headerName: this.$t('planManager.boxQuantity'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'totalWeight',
        headerName: this.$t('planManager.totalWeight'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'totalVolume',
        headerName: this.$t('planManager.totalVolume'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'timeliness',
        headerName: this.$t('planManager.timeliness'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 100,
        cellRendererFramework: 'PlanOpreatorBtn',
        cellRendererParams: {
          refresh: this.getData,
          modifyPlan: this.editPlan
        }
      }
    ]

    this.getData()
    this.getWarehouseList()
  },
  mounted() {
    if (this.$route.query.batchId) {
      this.batchId = this.$route.query.batchId
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
  .el-form-item__content .el-input-group{
    display: inline-table!important;
  }
</style>
