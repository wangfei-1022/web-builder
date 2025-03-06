<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent style="max-width: 1000px;">
        <el-form-item :label="`${$t('packageWarehouse.scheduleNo')}: `" prop="scheduleNo">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.scheduleNo" clearable @keyup.enter.native="getData" style="width: 320px;"></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.dutyName')}: `" prop="dutyName">
          <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.dutyName" clearable @keyup.enter.native="getData">
          </el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.status')}: `" prop="scheduleState">
          <el-select v-model="multipleForm.scheduleState" :placeholder="$t('common.placeholder')" clearable>
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <el-button type="primary" size="mini" @click="showCreateDialog = true">{{$t('packageWarehouse.createWarehouseBtn')}}</el-button>
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
    <el-dialog :visible.sync="showCreateDialog" :title="$t('packageWarehouse.createSchedule')" width="500px" :close-on-click-modal="false" :before-close="closeDialog">
      <el-form label-width="80px" :model="scheduleForm" :rules="scheduleFormRule" ref="scheduleForm" size="mini" style="width: 400px;">
        <el-form-item :label="`${$t('packageWarehouse.scheduleOrderNo')}: `" prop="trackingNo">
          <el-input :placeholder="$t('common.placeholder')" v-model="scheduleForm.trackingNo" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.dutyName')}: `" prop="dutyId">
          <el-select v-model="scheduleForm.dutyId" filterable :placeholder="$t('common.placeholder')" style="width: 100%;" @change="getData">
            <el-option
              v-for="item in employeeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.scheduleDesc')}: `" prop="scheduleDesc">
          <el-input :placeholder="$t('common.placeholder')" type="textarea" :rows="4" v-model="scheduleForm.scheduleDesc" />
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getScheduleListApi,
  getOrderListApi,
  employeeDropdownListApi,
  createScheduleApi
} from '@/api/packageWarehouse'
import CreateDistrainDialog from './components/CreateDistrainDialog'
import ScheduleRedirect from './components/ScheduleRedirect'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'ScheduleList',
  components: {
    CreateDistrainDialog,
    ScheduleRedirect
  },
  filters: {},
  data() {
    const validateTrackingNo = async (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error(this.$t('packageWarehouse.orderNoEmptyError')))
      } else {
        const res = await getOrderListApi({numbers: value})
        if (res && res.content && res.content.list.length > 0) {
          callback()
        } else {
          callback(new Error(this.$t('packageWarehouse.scheduleOrderNoInvalid')))
        }
      }
    }
    return {
      loading: false,
      totalData: 0,
      showCreateDialog: false,
      employeeList: [],
      multipleForm: {
        scheduleNo: '',
        dutyName: null,
        scheduleState: null,
        pageSize: 200,
        pageNum: 1
      },
      statusList: [
        {
          value: null,
          label: this.$t('common.all')
        },
        {
          value: 0,
          label: this.$t('packageWarehouse.scheduleStatusList[0]')
        },
        {
          value: 1,
          label: this.$t('packageWarehouse.scheduleStatusList[1]')
        },
        {
          value: 2,
          label: this.$t('packageWarehouse.scheduleStatusList[2]')
        }
      ],
      scheduleForm: {
        trackingNo: '',
        scheduleDesc: '',
        dutyId: ''
      },
      scheduleFormRule: {
        trackingNo: [
          { required: true, validator: validateTrackingNo, trigger: 'blur' }
        ],
        scheduleDesc: [
          { required: true, message: this.$t('packageWarehouse.scheduleDescEmptyError'), trigger: 'blur' }
        ],
        dutyId: [
          { required: true, message: this.$t('packageWarehouse.dutyNameEmptyError'), trigger: 'change' }
        ]
      },
      dataList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      userInfo: null
    }
  },
  computed: {},
  watch: {},
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
    async getEmployeeDropdown() {
      const res = await employeeDropdownListApi()
      if (res && res.ok && res.content) {
        this.employeeList = res.content.map(item => ({
            label: item.userName,
            value: item.id
          }))
      }
    },
    async getData() {
      this.loading = true
      this.multipleForm.scheduleNo = this.multipleForm.scheduleNo.trim()
      const res = await getScheduleListApi(this.multipleForm)
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
      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.distrainDate = []
      this.getData()
    },
    validateForm() {
      this.$refs.scheduleForm.validate(valid => {
        if (valid) {
          this.submitCreateForm()
        }
      })
    },
    closeDialog(done) {
      this.showCreateDialog = false
      this.$refs.scheduleForm.resetFields()
      this.$refs.scheduleForm.clearValidate()
      if (typeof done == 'function') {done()}
      this.scheduleForm.dutyId = this.userInfo.id
    },
    async submitCreateForm() {
      this.loading = true
      const res = await createScheduleApi(this.scheduleForm)
      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.createScheduleSuccess'))
        this.closeDialog()
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
        field: 'scheduleNo',
        headerName: this.$t('packageWarehouse.scheduleNo'),
        minWidth: 160,
        cellRendererFramework: 'ScheduleRedirect'
      },
      {
        field: 'trackingNo',
        headerName: this.$t('packageWarehouse.scheduleOrderNo'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'scheduleDesc',
        headerName: this.$t('packageWarehouse.scheduleDesc'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'createTime',
        headerName: this.$t('packageWarehouse.createTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'handlerTime',
        headerName: this.$t('packageWarehouse.handlerTime'),
        minWidth: 160,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'remark',
        headerName: this.$t('packageWarehouse.scheduleRemark'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'dutyName',
        headerName: this.$t('packageWarehouse.dutyName'),
        minWidth: 100
      },
      {
        field: 'scheduleStateName',
        headerName: this.$t('packageWarehouse.status'),
        minWidth: 100
      }
    ]

    this.getData()
    this.getEmployeeDropdown()
  },
  mounted() {
    this.userInfo = getUserInfo()
    this.scheduleForm.dutyId = this.userInfo.id
  }
}
</script>
<style lang="scss" scoped>
  @import "./mixin/highlight";
</style>
