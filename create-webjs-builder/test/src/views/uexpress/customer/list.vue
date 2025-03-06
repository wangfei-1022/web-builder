<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getData" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label="`${$t('uexpressCustomer.customerId')}: `" prop="customerId">
              <type-select v-model="formData.customerId" type="customer" />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressCustomer.salesName')}: `" prop="salesId">
              <el-select filterable clearable v-model="formData.salesId" size="mini" @change="getData">
                <el-option v-for="item in salesList" :key="item.id" :label="item.chineseName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('uexpressCustomer.settlementMode')}: `" prop="settlementMode">
              <el-select v-model="formData.settlementMode" size="mini" @change="getData">
                <el-option v-for="item in settlementModeList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('uexpressCustomer.customerState')}: `" prop="customerState">
              <el-select v-model="formData.customerState" size="mini" @change="getData">
                <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('uexpressCustomer.customerService')}: `" prop="customerServiceId">
              <base-select v-model="formData.customerServiceId" type="customerService" addALL filterable clearable/>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="exportFn">{{ $t("uexpressCustomer.exportAmount") }}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getData" />
    </div>
    <ConfigurationDialog :data-obj="configObj" :showConfigDialog.sync="showConfigDialog" :refreshData="getData" />
  </div>
</template>

<script>
import { getCustomerListApi, getSalesListApi, exportCustomerListApi, getCustomerDetailApi, getDictListApi, customerExportBalanceApi } from '@/api/uexpress/customerManager'
import CustomerListOptionBtn from './components/ListOptionBtn'
import ConfigurationDialog from './components/ConfigurationDialog'
export default {
  name: "UexpressCustomerList",
  components: {
    CustomerListOptionBtn,
    ConfigurationDialog
  },
  data() {
    return {
      loading: false,
      formData: {
        customerId: '',
        salesId: null,
        settlementMode: null,
        customerState: null,
        customerServiceId: ''
      },
      pageSize: 50,
      pageNum: 0,
      total: 0,
      statusList: [],
      salesList: [],
      settlementModeList: [],
      dataList: [],
      columnFields: null,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      configObj: {
        customerName: '',
        customerCode: '',
        shortName: '',
        salesName: '',
        registerTime: ''
      },
      showConfigDialog: false
    }
  },
  activated() {
    this.getData()
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
        field: "customerCode",
        headerName: this.$t("uexpressCustomer.customerCode"),
        minWidth: 100
      },
      {
        field: "customerName",
        headerName: this.$t("uexpressCustomer.customerName"),
        minWidth: 200
      },
      {
        field: "shortName",
        headerName: this.$t("uexpressCustomer.shortName"),
        minWidth: 120
      },
      {
        field: "salesName",
        headerName: this.$t("uexpressCustomer.salesName"),
        minWidth: 120
      },
      {
        field: "customerServiceName",
        headerName: this.$t("uexpressCustomer.customerService"),
        minWidth: 120
      },
      {
        field: "settlementModeName",
        headerName: this.$t("uexpressCustomer.settlementMode"),
        minWidth: 120
      },
      {
        field: "customerStateName",
        headerName: this.$t("uexpressCustomer.customerState"),
        minWidth: 100
      },
      {
        field: "registerTime",
        headerName: this.$t("uexpressCustomer.registerTime"),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: "customerId",
        headerName: this.$t("common.operation"),
        cellRendererFramework: "CustomerListOptionBtn",
        cellRendererParams: {refreshData: this.getData, showConfigurationDailog: this.showConfigurationDailog},
        minWidth: 100
      }
    ]

    this.getData()
    this.getBaseDataFn()
  },
  methods: {
    getBaseDataFn() {
      Promise.all([getSalesListApi(), getDictListApi(9), getDictListApi(17)]).then(results => {
        const salesRes = results[0];
        const statusRes = results[1]
        const settlementRes = results[2]
        if (salesRes.ok) {
          this.salesList = salesRes.content;
          this.salesList.unshift({
            chineseName: this.$t('common.all'),
            id: null
          })
        }

        if (statusRes.ok) {
          this.statusList = statusRes.content;
          this.statusList.unshift({
            name: this.$t('common.all'),
            code: null
          })
        }

        if (settlementRes.ok) {
          this.settlementModeList = settlementRes.content;
          this.settlementModeList.unshift({
            name: this.$t('common.all'),
            code: null
          })
        }
      })
    },
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    exportFn() {
      const params = {
        ...this.formData
      };
      this.loading = true
      customerExportBalanceApi(params).then(res => {
        if (res.ok) {
          window.location.href = res.content
        }
        this.loading = false
      });
    },
    async getData() {
      this.loading = true;
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      const res = await getCustomerListApi(params)
      if (res && res.ok && res.content) {
        this.dataList = res.content.list
        this.total = Number(res.content.total)
      } else {
        this.dataList = []
        this.total = 0
      }
      this.loading = false;
    },
    reset() {
      this.$refs.formData.resetFields();
      this.getData();
    },
    createMember() {},
    async showConfigurationDailog(customerId) {
      this.loading = true
      const res = await getCustomerDetailApi(customerId)
      if (res && res.ok && res.content) {
        this.configObj = res.content
        this.showConfigDialog = true
      }
      this.loading = false
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 0px;
}
.customer-input {
  width: 230px;
}
</style>
