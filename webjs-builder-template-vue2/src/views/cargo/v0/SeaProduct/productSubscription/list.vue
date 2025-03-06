<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">

    <top-search-items-slot :searchFun="list" :resetFun="reset" class="app-main-inner-row more-search-condition">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px" size="mini">

            <el-form-item :label="$t('seaProduct.pol')">
              <type-select v-model="filter.polCode" type="seaport" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('seaProduct.pod')">
              <type-select v-model="filter.podCode" type="seaport" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('seaProduct.shippingCompany')">
              <cargo-limited-select placeholder="" :select-label="filter.carrierName" size="mini"
                :select-value="filter.carrierName" type="carrier" style="width: 100%;" @set="selectedCarrier" clearable />
            </el-form-item>

            <el-form-item :label="$t('seaProduct.subscriptionState')">
              <el-select v-model="filter.state" :placeholder="$t('seaProduct.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.waitSubscribed')" value="10"></el-option>
                <el-option :label="$t('seaProduct.subscribedProcessing')" value="20"></el-option>
                <el-option :label="$t('seaProduct.cancelSubscription')" value="30"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('seaProduct.effectiveDate')" prop="validTimeRange">
              <el-date-picker v-model="filter.validTimeRange" value-format="timestamp" type="daterange"
                range-separator="-" start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="operate-buttons"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="operate-buttons-left">
        <el-button type="primary" size="mini" @click="add()" v-permission="['sea:productSubscription:add']">
          {{ $t('seaProduct.add') }}
        </el-button>
      </div>
    </div>
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
  getSeaProductSubscriptionListApi, unsubscribeSeaProductSubscriptionApi
} from "@/api/seaProduct";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";

import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: "SeaProductSubscriptionList",
  components: {
    AgGridVue,
    topSearchItems,

    cargoLimitedSelect,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.view(params)" 
        v-permission="['sea:productSubscription:detail']"
        >
          {{params.context.componentParent.$t('seaProduct.view')}}
        </el-button>
        <el-button  type="text" size="mini" @click="params.context.componentParent.edit(params)" 
        v-if="params.data.state === 10" v-permission="['sea:productSubscription:edit']">
          {{params.context.componentParent.$t('seaProduct.edit')}}
        </el-button>
        
        <el-button  type="text" size="mini" @click="params.context.componentParent.cancelFn(params)" 
        v-if="params.data.state === 10 || params.data.state === 20" v-permission="['sea:productSubscription:cancel']">
          {{params.context.componentParent.$t('seaProduct.cancel')}}
        </el-button>
      </span>
      `,
      methods: {

      }
    },

    'subscriptionStateTem': {
      template: `
      <div class="status-text ">
      <span v-if="params.data.state===10 " style="color: #027BF0">
        {{params.data.stateDesc}}
      </span>
      <span v-else-if="params.data.state===20" style="color:#F59A23">{{params.data.stateDesc}}</span>
      <span v-else-if="params.data.state===30" style="color:#D9001B">{{params.data.stateDesc}}</span>
      <span v-else>{{params.data.stateDesc}}</span>
      </div>`,
      methods: {}
    }

  },
  data () {
    const defaultFilter = {
      validTimeRange: [],
      expiryDateStart: "",
      expiryDateStartEnd: "",
      polCode: "",
      podCode: "",
      state: "",
      carrierId: "",
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
      if (to.name === 'SeaProductSubscriptionList') {
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
        field: "subscriptionName",
        headerName: this.$t("seaProduct.subscriptionName"),
        minWidth: 100
      },
      {
        field: "cycleWeekDesc",
        headerName: this.$t("seaProduct.cycleWeek"),
        minWidth: 130
      },
      {
        field: "cycleTimeDesc",
        headerName: this.$t("seaProduct.cycleTime"),
        minWidth: 100
      },

      {
        field: "carrierNameList",
        headerName: this.$t('seaProduct.subscriptionShipCompany'),
        minWidth: 80
      },
      {
        field: "routeCodeList",
        headerName: this.$t('seaProduct.subscriptionLine'),
        minWidth: 80
      },
      {
        field: "expiryDateStart",
        headerName: this.$t('seaProduct.effectiveDate'),
        minWidth: 80
      },
      {
        field: "expiryDateEnd",
        headerName: this.$t('seaProduct.expiryDate'),
        minWidth: 80
      }, {
        field: "stateDesc",
        headerName: this.$t("seaProduct.subscriptionState"),
        cellRendererFramework: 'subscriptionStateTem',
        minWidth: 100
      },
      {
        field: "id",
        headerName: this.$t("seaProduct.operating"),
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 100
      }
    ]
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
    add () {
      this.$router.push({
        name: `SeaProductSubscriptionAdd`
      });
    },
    view (row) {
      this.$router.push({
        name: `SeaProductSubscriptionDetail`,
        query: { id: row.data.id }
      });
    },
    edit (row) {
      this.$router.push({
        name: `SeaProductSubscriptionEdit`,
        query: { id: row.data.id }
      });
    },
    cancelFn (row) {
      this.$confirm(this.$t('seaProduct.unsubscribeTips'), this.$t('seaProduct.tips'), {
        confirmButtonText: this.$t('seaProduct.determine'),
        cancelButtonText: this.$t('seaProduct.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        unsubscribeSeaProductSubscriptionApi(row.data.id).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t('seaProduct.unsubscribeSuccess'))
            this.list();
          }
          this.loading = false
        })
      }).catch(() => {
      })
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
      if (this.$isNotEmpty(this.filter.validTimeRange)) {
        this.filter.expiryDateStart = this.filter.validTimeRange[0];
        this.filter.expiryDateStartEnd = this.calculateDay(0, new Date(this.filter.validTimeRange[1]), 1);
      } else {
        this.filter.expiryDateStart = "";
        this.filter.expiryDateStartEnd = "";
      }
      this.loading = true
      const res = await getSeaProductSubscriptionListApi(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.expiryDateStart = parseTime(v.expiryDateStart, '{y}-{m}-{d} {h}:{i}:{s}')
            v.expiryDateEnd = parseTime(v.expiryDateEnd, '{y}-{m}-{d} {h}:{i}:{s}')
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

    selectedCarrier (carrier) {
      this.filter.carrierId = carrier.id
      this.filter.carrierCode = carrier.scacCode
      this.filter.carrierName = carrier.englishShortname
      this.list()
    },
    // table
    onReady (params) {
      const self = this
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      this.resetHeight()
    },

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
