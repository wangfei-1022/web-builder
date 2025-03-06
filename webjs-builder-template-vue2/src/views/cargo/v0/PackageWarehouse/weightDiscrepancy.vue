<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="singleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent style="max-width: 1000px;">
        <el-form-item :label="`${$t('packageWarehouse.companyName')}: `" prop="memberId">
          <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getMemberApi" style="width: 300px;" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="showModifyDialog(null)">{{$t('packageWarehouse.createWarehouseBtn')}}</el-button>
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
    <el-dialog :visible.sync="showEditDialog" :title="dialogTitle" width="550px" :close-on-click-modal="false" :before-close="closeModify">
      <el-form label-width="160px" :model="infoForm" :rules="infoRules" ref="modifyForm">
        <el-form-item :label="`${$t('packageWarehouse.chineseName')}: `" prop="memberId" v-show="!isModify">
          <RemoteSearchSelector v-model="infoForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getMemberApi" style="width: 300px;" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.chineseName')}: `" v-show="isModify">
          <el-input v-model="infoForm.chineseName" type="text" disabled size="mini" style="width:300px;" />
        </el-form-item>
        <el-form-item label="" prop="checkWeightFlag">
          <el-checkbox v-model="infoForm.ignoreDeclareFlag">{{$t('packageWarehouse.ignoreDeclare')}}</el-checkbox>
          <el-checkbox v-model="infoForm.nonDeclareLockFlag" :disabled="!infoForm.ignoreDeclareFlag">{{$t('packageWarehouse.nonDeclareLockFlag')}}</el-checkbox>
          <el-checkbox v-model="infoForm.checkWeightFlag">{{$t('packageWarehouse.validateDiscrepancy')}}</el-checkbox>
        </el-form-item>
        <el-form-item label="" prop="checkType" v-show="infoForm.checkWeightFlag">
          <el-radio v-model="infoForm.checkType" :label="1">{{$t('packageWarehouse.validateDeclareWeight')}}</el-radio>
          <el-radio v-model="infoForm.checkType" :label="2">{{$t('packageWarehouse.validateOrderWeight')}}</el-radio>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.autoDiscrepancyWeight')}: `" prop="weight" v-show="infoForm.checkWeightFlag">
          <NumberInput
            style="width: 100px;"
            v-model.trim="infoForm.weight"
            limitType="positive"
            :limitRange="{digits: 3, decimal: 0}" />
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getWeightDiscrepancyApi, createWeightDiscrepancyApi, modifyWeightDiscrepancyApi } from '@/api/packageWarehouse'
import { getRemoteMemberApi } from '@/api/user'
import DiscrepancyOpreationBtn from './components/DiscrepancyOpreationBtn'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
export default {
  name: 'WeightDiscrepancy',
  components: {
    NumberInput,
    DiscrepancyOpreationBtn,
    RemoteSearchSelector
  },
  filters: {},
  data() {
    return {
      loading: false,
      totalData: 0,
      showEditDialog: false,
      isModify: false,
      multipleForm: {
        memberId: '',
        pageSize: 200,
        pageNum: 1
      },
      infoForm: {
        memberId: '',
        checkWeightFlag: true,
        nonDeclareLockFlag: false,
        ignoreDeclareFlag: false,
        checkType: 1,
        weight: '',
        chineseName: ''
      },
      infoRules: {
        memberId: [
          {required: true, trigger: 'change', message: this.$t('packageWarehouse.abbreviationEmptyError')}
        ],
        weight: [
          {required: true, trigger: 'blur', message: this.$t('packageWarehouse.autoDiscrepancyWeightEmptyError')}
        ]
      },
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      gridHeight: null,
      dataList: [],
      productList: []
    }
  },
  computed: {
    dialogTitle: function() {
      return !this.infoForm.memberId ? this.$t('packageWarehouse.createWarehouseTitel') : this.$t('packageWarehouse.modifyWarehouseTitle')
    },
    getMemberApi: function() {
      return getRemoteMemberApi
    }
  },
  watch: {
    'infoForm.checkWeightFlag': function(val) {
      if (val) {
        if (this.infoForm.checkType === null) {
          this.infoForm.checkType = 1
        }
        this.infoRules = {
          memberId: [
            {required: true, trigger: 'change', message: this.$t('packageWarehouse.abbreviationEmptyError')}
          ],
          weight: [
            {required: true, trigger: 'blur', message: this.$t('packageWarehouse.autoDiscrepancyWeightEmptyError')}
          ]
        }
      } else {
        this.infoRules = {
          memberId: [
            {required: true, trigger: 'change', message: this.$t('packageWarehouse.abbreviationEmptyError')}
          ]
        }
      }

      this.$nextTick(() => {
        this.$refs.modifyForm.clearValidate()
      })
    }
  },
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
      const res = await getWeightDiscrepancyApi(this.multipleForm)
      this.dataList = []
      if (res && res.ok && res.content) {
        this.dataList = res.content.list
        this.totalData = Number(res.content.total)
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
      this.getData()
    },
    showModifyDialog(obj) {
      if (obj) {
        this.infoForm = {
          memberId: obj.memberId,
          checkWeightFlag: obj.checkWeightFlag,
          ignoreDeclareFlag: obj.ignoreDeclareFlag,
          nonDeclareLockFlag: obj.nonDeclareLockFlag,
          checkType: obj.checkType,
          weight: obj.weight,
          chineseName: obj.chineseName
        }
        this.isModify = true
      }
      this.showEditDialog = true
    },
    validateForm() {
      this.$refs.modifyForm.validate((valid, obj) => {
        if (valid) {
          if (this.isModify) {
            this.submitModify()
          } else {
            this.submitCreate()
          }
        }
      })
    },
    closeModify(done) {
      this.showEditDialog = false
      this.infoForm = {
        memberId: '',
        ignoreDeclareFlag: false,
        checkWeightFlag: true,
        checkType: 1,
        weight: ''
      }
      this.isModify = false
      this.$refs.modifyForm.resetFields()
      if (typeof done == 'function') {
         done()
      }
      this.$nextTick(() => {
        this.$refs.modifyForm.clearValidate()
      })
    },
    async submitModify() {
      this.loading = true
      let _form = {}
      if (this.infoForm.checkWeightFlag) {
        _form = this.infoForm
      } else {
        _form = {
          memberId: this.infoForm.memberId,
          ignoreDeclareFlag: this.infoForm.ignoreDeclareFlag,
          checkWeightFlag: false
        }
      }
      const res = await modifyWeightDiscrepancyApi(_form)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.warehouseModifySuccess'))
        this.closeModify()
        this.getData()
      }
      this.loading = false
    },
    async submitCreate() {
      this.loading = true
      let _form = {}
      if (this.infoForm.checkWeightFlag) {
        _form = this.infoForm
      } else {
        _form = {
          memberId: this.infoForm.memberId,
          ignoreDeclareFlag: this.infoForm.ignoreDeclareFlag,
          checkWeightFlag: false
        }
      }
      const res = await createWeightDiscrepancyApi(_form)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.warehouseCreateSuccess'))
        this.closeModify()
        this.getData()
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
      {
        field: 'abbreviation',
        headerName: this.$t('packageWarehouse.chineseName'),
        minWidth: 120
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.companyName'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'ignoreDeclareFlag',
        headerName: this.$t('packageWarehouse.isIgnoreDeclare'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$t('packageWarehouse.locked') : this.$t('packageWarehouse.unlock')
      },
      {
        field: 'checkWeightFlag',
        headerName: this.$t('packageWarehouse.isValidateDiscrepancy'),
        minWidth: 100,
        cellRenderer: params => params.value ? this.$t('packageWarehouse.locked') : this.$t('packageWarehouse.unlock')
      },
      {
        field: 'checkType',
        headerName: this.$t('packageWarehouse.isDeclareWeight'),
        minWidth: 100,
        cellRenderer: params => params.value === 1 ? this.$t('packageWarehouse.locked') : this.$t('packageWarehouse.unlock')
      },
      {
        field: 'checkType',
        headerName: this.$t('packageWarehouse.isOrderWeight'),
        minWidth: 100,
        cellRenderer: params => params.value === 2 ? this.$t('packageWarehouse.locked') : this.$t('packageWarehouse.unlock')
      },
      {
        field: 'weight',
        headerName: this.$t('packageWarehouse.autoDiscrepancyWeight'),
        minWidth: 120
      },
      {
        field: 'phone',
        headerName: this.$t('packageWarehouse.telphone'),
        minWidth: 120
      },
      {
        field: 'address',
        headerName: this.$t('packageWarehouse.address'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        minWidth: 80,
        cellRendererFramework: 'DiscrepancyOpreationBtn',
        cellRendererParams: {
          refresh: this.getData,
          showModifyDialog: this.showModifyDialog
        }
      }
    ]

    this.getData()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
