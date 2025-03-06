<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">


    <top-search-items-slot :searchFun="list" :resetFun="reset" class="app-main-inner-row more-search-condition">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap" style="bottom: 12px;">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px" size="mini">
            <el-form-item :label="$t('air.entityNo')">
              <el-input v-model.trim="filter.planNo" maxlength="50" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('air.pol')">
              <type-select v-model="filter.polCode" type="airport" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('air.pod2')">
              <type-select v-model="filter.podCode" type="airport" @selected="list" clearable />
            </el-form-item>
            <el-form-item :label="$t('air.requester')">
              <type-select v-model="filter.customerId" type="customer" @selected="list" />
            </el-form-item>
            <el-form-item label="ETD:" prop="validTimeRange">
              <el-date-picker v-model="filter.validTimeRange" value-format="timestamp" type="daterange"
                range-separator="-" start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
              </el-date-picker>
            </el-form-item>

            <el-form-item :label="$t('air.ShippingState')">
              <el-select v-model="filter.planState" :placeholder="$t('air.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('air.all')" value=""></el-option>
                <el-option :label="$t('air.cargoPlan')" value="10"></el-option>
                <el-option :label="$t('air.portionCargoPlan')" value="20"></el-option>
                <el-option :label="$t('air.planAdjustment')" value="30"></el-option>
                <el-option :label="$t('air.accomplishCargoPlan')" value="40"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="table-wrap">
      <AgGridVue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :column-defs="columnDefs"
        :row-data="rowData" :enable-col-resize="true" :enable-sorting="true" :animate-rows="true" :grid-ready="onReady"
        :style="listGridStyle" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  getAirConfirmationManagementList
} from "@/api/airExport";
import { getSalesListApi } from "@/api/partner/customerManage";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";

import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: "AirConfirmationManagement",
  components: {
    AgGridVue,
    topSearchItems,

    cargoLimitedSelect,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.orderConfirmationFn(params)" 
        v-permission="['air:airConfirmationManagement:view']"
        >
          {{params.context.componentParent.$t('air.view')}}
        </el-button>
      
      </span>
      `,
      methods: {

      }
    }
  },
  data () {
    const defaultFilter = {
      validTimeRange: [],
      airlineId: "",
      airlineName: "",
      mblNo: "",
      hblNo: "",
      orderState: "",
      planNo: "",
      podCode: "",
      polCode: "",
      etdStart: "",
      etdEnd: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      takeDeliveryVisible: false,
      cancellationOfOrderVisible: false,
      createByList: [],
      defaultFilter: defaultFilter,
      selectedIds: [],
      multipleSelection: [],
      activeRow: {},

      airCustomerMethod: airLineListApi,
      loading: false,
      searchItemHeight: 0,
      isShowingMoreSearchCondition: false,
      // table
      columnDefs: null,
      rowData: [],
      // gridOptions: null,
      selectedItems: [], // 列表选择
      gridOptions: {
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      filter: this.$extends({}, defaultFilter),
      total: 0
      // table end,

    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'AirConfirmationManagement') {
        this.list();
      }
    }
  },
  computed: {
    dynamicHeightFactor () { // 用于动态计算列表高度
      let least = 300

      return least
    },
    listGridStyle () {
      const s = {
        width: '100%',
        height: `calc(100vh - ${this.dynamicHeightFactor}px)`
      }
      return s
    }
  },
  created () {
    this.columnDefs = [
      {
        headerName: '', width: 40, pinned: 'left',
        suppressSorting: true, checkboxSelection: true,
        suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
        headerCheckboxSelection: true
      },
      {
        field: "planNo",
        headerName: this.$t("air.orderNumber"),
        minWidth: 100
      },
      {
        field: "planStateDesc",
        headerName: this.$t("air.ShippingState"),
        minWidth: 100
      },
      // {
      //   field: "customerName",
      //   headerName: this.$t("air.requester"),
      //   minWidth: 200
      // },
      {
        field: "etd",
        headerName: "ETD",
        minWidth: 100
      },
      {
        field: "polCode",
        headerName: this.$t('air.pol'),
        minWidth: 80
      },
      {
        field: "potCode",
        headerName: this.$t('air.transitPort'),
        minWidth: 80
      },
      {
        field: "receiptCode",
        headerName: this.$t('air.receipt'),
        minWidth: 80
      },
      {
        field: "podCode",
        headerName: this.$t('air.pod2'),
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
        field: "orderChargeableWeight",
        headerName: this.$t("air.entrustedChargingWeight"),
        minWidth: 100
      },
      //  {
      //   field: "bookingReceivable",
      //   headerName: this.$t("air.joeBookPrices"),
      //   minWidth: 100
      // }, {
      //   field: "palletSizes",
      //   headerName: this.$t("air.palletSizes"),
      //   minWidth: 100
      // },
      {
        field: "remark",
        headerName: this.$t("air.remark"),
        minWidth: 150
      },
      // {
      //   field: "sellerName",
      //   headerName: this.$t("air.ownedSales"),
      //   minWidth: 100
      // },
      {
        field: "timeliness",
        headerName: this.$t("air.timeliness"),
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
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 100
      }
    ]
    // 初始化ETD 当前时间-15,当前时间+15
    // this.filter.validTimeRange = [this.calculateDay(15, new Date(), 2), this.calculateDay(15, new Date(), 1)]
    this.list()

  },

  methods: {
    /**
     * @param {*} dayNumber 天数
     * @param {*} date 日期
     * @param {*} type 1加 2减
     * @param {*} end 23:59:59 结尾
     */
    calculateDay (dayNumber, date, type, end) {
      let ms = dayNumber * (1000 * 60 * 60 * 24)
      let newDate
      if (type === 1) {
        if (end === 1) {
          date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        } else {
          date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), "23", "59", "59");
        }
        newDate = new Date(date.getTime() + ms);
      } else {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        newDate = new Date(date.getTime() - ms);
      }

      return newDate.valueOf();
    },

    reset () {
      this.filter = this.$extends({}, this.defaultFilter);
      this.list();
    },

    orderConfirmationFn (row) {
      this.$router.push({
        name: `AirOrderConfirmation`,
        query: { id: row.data.id }
      });
    },
    expandMoreSearchCondition () {
      this.isShowingMoreSearchCondition = !this.isShowingMoreSearchCondition;
      const self = this
      setTimeout(() => {
        self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
      })
    },
    resetHeight () {
      const self = this
      setTimeout(() => {
        self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
      })
    },

    async list () {
      this.loading = true
      if (this.$isNotEmpty(this.filter.validTimeRange)) {
        this.filter.etdStart = this.filter.validTimeRange[0];
        this.filter.etdEnd = this.calculateDay(0, new Date(this.filter.validTimeRange[1]), 1);
      } else {
        this.filter.etdStart = "";
        this.filter.etdEnd = "";
      }
      const res = await getAirConfirmationManagementList(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.etd = parseTime(v.etd, '{y}-{m}-{d} {h}:{i}:{s}')
            v.atd = parseTime(v.atd, '{y}-{m}-{d} {h}:{i}:{s}')
            v.eta = parseTime(v.eta, '{y}-{m}-{d} {h}:{i}:{s}')
            v.ata = parseTime(v.ata, '{y}-{m}-{d} {h}:{i}:{s}')
            v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            v.updateTime = parseTime(v.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
          } catch (e) {
            console.log(e)
          }
        })

        this.rowData = res.content.list
        this.total = Number(res.content.total)
      } else {
        this.rowData = []
        this.total = 0
      }
    },


    // table
    onReady (params) {
      const self = this
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      this.resetHeight()
      // window.addEventListener('resize', function () {
      //   setTimeout(function () {
      //     self.onFirstDataRendered()
      //   })
      // })
    },
    // onFirstDataRendered () {
    //   const self = this
    //   const allColumnIds = []
    //   self.gridOptions.columnApi.getAllColumns().forEach(function (column) {
    //     allColumnIds.push(column.colId)
    //   })
    //   setTimeout(function () {
    //     self.gridOptions.columnApi.autoSizeColumns(allColumnIds)
    //   })
    // },
    // 获取表格选中的数据集合
    getSelectData () {
      let arr = [];
      getGridSelected(this.gridOptions).forEach(function (v) {
        arr.push(v.id);
      });
      this.selectedIds = arr;
      this.multipleSelection = getGridSelected(this.gridOptions)
    }
    // table end *************
  }
}
</script>
<style  lang="scss" scoped></style>
