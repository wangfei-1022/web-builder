<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
        <el-form-item :label="`${$t('air.orderNumber')}: `" prop="orderNo">
          <el-input v-model.trim="formData.orderNo" maxlength="50" placeholder="" size="mini" clearable
            @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pol')" prop="polCode">
          <type-select v-model="formData.polCode" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pod2')" prop="podCode">
          <type-select v-model="formData.podCode" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('air.requester')" prop="customerId">
          <type-select v-model="formData.customerId" type="customer" @selected="list" />
        </el-form-item>
        <el-form-item label="ETD:" prop="validTimeRange">
          <!-- <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']"
            v-model="formData.validTimeRange" @change="list" clearable></common-picker> -->
          <el-date-picker v-model="formData.validTimeRange" value-format="timestamp" type="daterange" range-separator="-"
            start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
          </el-date-picker>
        </el-form-item>


      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">

      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs"
        :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true"
        :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>

    <makingCargoPlanDialog @refresh="refreshFn" :order="order" :orderType="orderType" :visible="makingCargoPlanVisible"
      @close="makingCargoPlanClose">
    </makingCargoPlanDialog>

  </div>
</template>

<script>
import {
  getAirExportOrderCargoPlanListApi, getAirExportOrderDetailApi
} from "@/api/airExport";

import makingCargoPlanDialog from "./operation/makingCargoPlanDialog"
import optionBtn from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
export default {
  name: "AirMakingCargoPlan",
  components: {
    AgGridVue,
    cargoLimitedSelect,
    optionBtn,
    makingCargoPlanDialog
  },
  data () {

    return {
      airCustomerMethod: airLineListApi,
      makingCargoPlanVisible: false,

      orderType: "",
      formData: {
        customerId: "",
        orderNo: '',
        polCode: '', // 装货港
        podCode: '', // 卸货港
        validTimeRange: []
      },
      order: {
        spaceDTO: {},
        addressDTO: {},
        cargoDTO: {},
        baseDTO: {}
      },
      pageSizeRange: [10, 20, 30, 50],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      amountTotal: [], // 统计
      columnFields: [],
      sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
      gridOptions: {
        rowSelection: "multiple", // 设置多行可选
        animateRows: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      gridApi: {},
      loading: false
    }
  },
  created () {
    // this.formData.validTimeRange = [this.calculateDay(0, new Date(), 2), this.calculateDay(7, new Date(), 1)]

    this.list()
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'AirMakingCargoPlan') {
        this.list();
      }
    }
  },
  methods: {
    /**
 * @param {*} dayNumber 天数
 * @param {*} date 日期
 * @param {*} type 1加 2减
 */
    calculateDay (dayNumber, date, type) {
      let ms = dayNumber * (1000 * 60 * 60 * 24)
      let newDate
      if (type === 1) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), "23", "59", "59");
        newDate = new Date(date.getTime() + ms);
      } else {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        newDate = new Date(date.getTime() - ms);
      }

      return newDate.valueOf();
    },
    exportFn () {
      let ids = []
      let rows = this.gridApi.getSelectedRows()
      rows.forEach(v => {
        ids.push(v.id)
      })
      if (!ids.length) {
        this.$message.error(this.$t('air.leastOneLineToExport'))
        return
      }
      // 根据查询条件进行批量打印
      this.reportDialog.typeCode = 'AIR_DEBIT_NOTE'
      this.reportDialog.data = { jobId: null, entityIdList: ids }
      // this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
      this.reportDialog.isShow = true
    },
    getFields () {
      return [{
        headerName: '', width: 40, pinned: 'left',
        suppressSorting: true, checkboxSelection: true,
        suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
        headerCheckboxSelection: true
      }, {
        field: "orderNo",
        headerName: this.$t("air.orderNumber"),
        minWidth: 100
      },
      {
        field: "orderType",
        headerName: this.$t("air.orderType"),
        minWidth: 100
      },
      {
        field: "customerName",
        headerName: this.$t("air.requester"),
        minWidth: 200
      },
      {
        field: "etd",
        headerName: "ETD",
        minWidth: 100
      },
      {
        field: "polCode",
        headerName: this.$t('air.pol'),
        minWidth: 80
      }, {
        field: "potCode",
        headerName: this.$t('air.transitPort'),
        minWidth: 80
      }, {
        field: "podCode",
        headerName: this.$t('air.pod2'),
        minWidth: 80
      }, {
        field: "receiptCode",
        headerName: this.$t("air.receipt"),
        minWidth: 80
      }, {
        field: "orderQuantity",
        headerName: this.$t("air.estimatedNumber"),
        minWidth: 100
      }, {
        field: "orderGrossWeight",
        headerName: this.$t("air.estimatedGrossWeight"),
        minWidth: 100
      }, {
        field: "orderVolume",
        headerName: this.$t("air.estimatedVolume"),
        minWidth: 100
      }, {
        field: "bookingReceivable",
        headerName: this.$t("air.joeBookPrices"),
        minWidth: 100
      }, {
        field: "palletSizes",
        headerName: this.$t("air.palletSizes"),
        minWidth: 100
      },
      {
        field: "bookingRemark",
        headerName: this.$t("air.remarks"),
        minWidth: 150
      },
      {
        field: "sellerName",
        headerName: this.$t("air.ownedSales"),
        minWidth: 100
      },
      {
        field: "createByName",
        headerName: this.$t("air.createdBy"),
        minWidth: 100
      },
      {
        field: "createTime",
        headerName: this.$t("air.createTime"),
        minWidth: 130
      },
      {
        field: "id",
        headerName: this.$t("air.operating"),
        cellRendererFramework: "optionBtn",
        pinned: 'right',
        minWidth: 100
      }]
    },
    onReady (params) {
      this.gridApi = params.api
      params.api.sizeColumnsToFit()
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit()
        })
      })
    },
    async list () {
      this.loading = true
      if (this.formData.validTimeRange) {
        this.formData.etdStart = this.formData.validTimeRange[0];
        this.formData.etdEnd = this.formData.validTimeRange[1];
      } else {
        this.formData.validTimeRange = []
        this.formData.etdStart = "";
        this.formData.etdEnd = "";
      }

      const _params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }


      const res = await getAirExportOrderCargoPlanListApi(_params)
      if (res.ok) {
        this.total = parseInt(res.content.total, 10)


        res.content.list.forEach(v => {
          try {
            v.etd = parseTime(v.etd, '{y}-{m}-{d}')
            v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            if (v.orderType === 1) {
              v.orderType = "2B"
            } else if (v.orderType === 2) {
              v.orderType = "2C"
            }
          } catch (e) {
            console.log(e)
          }
        })

        let arr = this.getFields()

        this.columnFields = arr
        this.dataList = res.content.list

        // 触发resize
        let ev = document.createEvent('Event')
        ev.initEvent('resize', true, true)
        window.dispatchEvent(ev)
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false
    },
    handleSizeChange (size) {
      this.pageSize = size
      this.list()
    },
    handleCurrentChange (page) {
      this.pageNum = page
      this.list()
    },
    reset () {// 搜索重置
      this.$refs.formData.resetFields()
      this.formData.validTimeRange = []
      this.list()
    },

    refreshFn () {
      this.list();
    },
    setAirCustomerInfo (customer) {
      this.filter.airlineId = customer.id;
      this.filter.airlineName = customer.chineseName;
      this.list();
    },
    makingCargoPlan (row) {
      getAirExportOrderDetailApi(row.id).then(res => {
        if (res.content) {
          this.orderType = row.orderType
          this.order = res.content
          this.makingCargoPlanVisible = true
        }
      })

    },
    makingCargoPlanClose () {
      this.makingCargoPlanVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper {
  overflow: auto;
  padding: 20px 20px 0 20px;
}

.total {
  background: rgba(16, 142, 233, 0.1);
  color: #108ee9;
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;

  .value-item {
    display: inline-block;
    margin-right: 30px;

    .value {
      display: inline-block;
      margin-right: 5px;
    }
  }
}

.pagination-container {
  margin-top: 0px;
}
</style>
