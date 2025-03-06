<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent>
        <el-form-item label='' prop="numbers">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.numbers" class="input-with-select" style="width: 440px;" clearable @keyup.enter.native="getData">
            <el-select v-model="multipleForm.queryNumberConditions" slot="prepend" style="width: 110px;">
              <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.selectionWarehouse')}: `" prop="warehouseId">
          <el-select v-model="multipleForm.warehouseId"
            :placeholder="$t('common.placeholder')"
            filterable>
            <el-option
              v-for="item in warehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.billNo')}: `" prop="billNo">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.billNo" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.polCode')}: `" prop="polCode">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.polCode" clearable @keyup.enter.native="getData">
          </el-input>
          <!-- <cargo-advance-select
            ref="polCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.polCode=data.code5
            }" /> -->
        </el-form-item>
        <el-form-item :label="`${$t('planManager.podCode')}: `" prop="podCode">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.podCode" clearable @keyup.enter.native="getData">
          </el-input>
          <!-- <cargo-advance-select
            ref="podCodeSelect"
            :url="url.qf.seaport"
            :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
            :fields="['englishName','code5','chineseName']"
            tag-value="code5"
            tag-name="enPortName"
            remote
            @parentCallBack="(data)=>{
              multipleForm.podCode=data.code5
            }" /> -->
        </el-form-item>
        <el-form-item :label="`${$t('planManager.airAgent')}: `" prop="airAgent">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.airAgent" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.customsAgent')}: `" prop="customsAgent">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.customsAgent" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.outboundCarrier')}: `" prop="outboundCarrier">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.outboundCarrier" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('planManager.operationDate')}: `">
          <CommonPicker
            v-model="opreatorTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="exportInfo">{{$t('packageWarehouse.exportInfo')}}</el-button>
        <el-button type="primary" size="mini" @click="bindVoitureInfo">{{$t('packageWarehouse.bindVoitureInfo')}}</el-button>
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
    <CreateBatchDialog @closeDialog="closeBatch" :showDialog="showBatchDialog" :ids="selectedIds" />
    <BatchModifyDialog ref="batchModifyDialog" @refreshData="getData" />
  </div>
</template>
<script>
import { getBatchListApi, exportBatchInfoApi } from '@/api/planManager'
import { getWarehouseListApi } from '@/api/packageWarehouse'
// import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import URL from '@/api/urlTranslator'
import BatchOpreatorBtn from './components/BatchOpreatorBtn'
import CreateBatchDialog from './components/CreateBatchDialog'
import RedirectBatchBoxList from './components/RedirectBatchBoxList'
import BatchModifyDialog from './components/BatchModifyDialog'
export default {
  name: 'BatchManager',
  components: {
    // cargoAdvanceSelect,
    BatchOpreatorBtn,
    RedirectBatchBoxList,
    CreateBatchDialog,
    BatchModifyDialog
  },
  filters: {},
  data() {
    return {
      url: URL,
      showBatchDialog: false,
      loading: false,
      totalData: 0,
      selectedIds: [],
      dataList: [],
      warehouseList: [],
      defaultTimeStr: ['12:00:00', '12:00:00'],
      multipleForm: {
        productId: null,
        numbers: '',
        queryNumberConditions: 0,
        airAgent: '',
        billNo: '',
        customsAgent: '',
        outboundCarrier: '',
        planTimeBegin: '',
        planTimeEnd: '',
        polCode: '',
        podCode: '',
        warehouseId: '',
        pageSize: 200,
        pageNum: 1
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      orderTypeList: [
        {
          value: 0,
          label: this.$t('packageWarehouse.batchNo')
        },
        {
          value: 1,
          label: this.$t('packageWarehouse.blNo')
        },
        {
          value: 2,
          label: this.$t('packageWarehouse.containerNo')
        },
        {
          value: 3,
          label: this.$t('packageWarehouse.orderNo')
        }
      ],
      opreatorTime: []
    }
  },
  computed: {},
  watch: {
    opreatorTime: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.planTimeBegin = arr[0]
        this.multipleForm.planTimeEnd = arr[1]
      } else {
        this.multipleForm.planTimeBegin = null
        this.multipleForm.planTimeEnd = null
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
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 100})
      if (res && res.ok && res.content) {
        this.warehouseList = [
          {
            label: this.$t('packageWarehouse.statusAll'),
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
      this.multipleForm.numbers = this.multipleForm.numbers.trim()
      const res = await getBatchListApi(this.multipleForm)
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
      return true
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.opreatorTime = []
      this.getData()
    },
    bindVoitureInfo() {
      this.selectedIds = this.gridApi.getSelectedRows().map(item => item.id)
      if (!this.selectedIds || this.selectedIds.length === 0) {
        this.$message.error(this.$t('packageWarehouse.bindBatchSelectedError'))
      } else {
        this.showBatchDialog = true
      }
    },
    async exportInfo() {
      this.loading = true
      const _ids = this.gridApi.getSelectedRows().map(item => item.id)
      const postForm = {...this.multipleForm, ...{ids: _ids}}
      const res = await exportBatchInfoApi(postForm)
      if (res && res.ok) {
        if (res.content) {
          this.downloadFile({
            fileName: `batchInfo_${this.$moment().format('YYYYMMDDHHMM')}`,
            url: res.content
          })
        } else {
          this.$message.error(this.$t('packageWarehouse.emptyUrl'))
        }
      } else {
        this.$message.error(res.errors.message)
      }
      this.loading = false
    },
    modifyBatch(id) {
      this.$refs.batchModifyDialog.opreator = 'edit'
      this.$refs.batchModifyDialog.showModifyDialog(id)
    },
    viewBatch(id) {
      this.$refs.batchModifyDialog.opreator = 'view'
      this.$refs.batchModifyDialog.showModifyDialog(id)
    },
    closeBatch() {
      this.showBatchDialog = false
      this.getData()
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选模式
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
        field: 'batchNo',
        headerName: this.$t('planManager.batchNo'),
        minWidth: 200,
        pinned: 'left',
        cellRendererFramework: 'RedirectBatchBoxList'
      },
      {
        field: 'boxQuantity',
        headerName: this.$t('planManager.boxQuantity'),
        minWidth: 120
      },
      {
        field: 'totalWeight',
        headerName: this.$t('planManager.totalWeight'),
        minWidth: 120
      },
      {
        field: 'totalVolume',
        headerName: this.$t('planManager.totalVolume'),
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
      {
        field: 'billNo',
        headerName: this.$t('planManager.billNo'),
        minWidth: 120
      },
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
        field: 'plateNo',
        headerName: this.$t('planManager.plateNo'),
        minWidth: 120
      },
      {
        field: 'driver',
        headerName: this.$t('planManager.driver'),
        minWidth: 120
      },
      {
        field: 'driverPhone',
        headerName: this.$t('planManager.driverPhone'),
        minWidth: 120
      },
      {
        field: 'carModel',
        headerName: this.$t('planManager.carModel'),
        minWidth: 120
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 200,
        cellRendererFramework: 'BatchOpreatorBtn',
        cellRendererParams: {
          refresh: this.getData,
          modifyBatch: this.modifyBatch,
          viewBatch: this.viewBatch
        }
      }
    ]

    this.getWarehouseList()
    if (this.$route.query.billNo) {
      this.multipleForm.billNo = this.$route.query.billNo
      this.getData()
    } else {
      this.getData()
    }
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.query.opreator === 'refresh') {
        vm.getData()
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
