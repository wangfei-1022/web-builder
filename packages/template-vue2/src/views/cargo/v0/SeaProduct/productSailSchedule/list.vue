<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">

    <top-search-items-slot :searchFun="list" :resetFun="reset" class="app-main-inner-row more-search-condition">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="90px" size="mini">

            <el-form-item :label="$t('seaProduct.vessel')">
              <el-input v-model.trim="filter.vessel" maxlength="50" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>

            <el-form-item :label="$t('seaProduct.voyage')">
              <el-input v-model.trim="filter.voyage" maxlength="50" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>

            <el-form-item :label="$t('seaProduct.state')">
              <el-select v-model="filter.state" :placeholder="$t('seaProduct.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.pendingEffect')" value=10></el-option>
                <el-option :label="$t('seaProduct.inEffect')" value=20></el-option>
                <el-option :label="$t('seaProduct.soldOut')" value=30></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('seaProduct.etd')" prop="validTimeRange">
              <el-date-picker v-model="filter.validTimeRange" value-format="timestamp" type="daterange"
                range-separator="-" start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
              </el-date-picker>
            </el-form-item>

            <el-form-item :label="$t('seaProduct.dataSource')" prop="dataSource" size="mini">
              <el-select v-model="filter.dataSource" @change="list" clearable>
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.ecommercePlatform')" :value=10></el-option>
                <el-option :label="$t('seaProduct.shipownerContract')" :value=20></el-option>
                <el-option :label="$t('seaProduct.agencyContract')" :value=30></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="top-btn-wrap"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="mb-10 top-btn-wrap">
        <el-button type="primary" size="mini" @click="addFn()" v-permission="['sea:productSailSchedule:add']">
          {{ $t('seaProduct.shipScheduleAdd') }}
        </el-button>
      </div>
    </div>
    <div class="table-wrap">
      <AgGridVue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :column-defs="columnDefs"
        :row-data="rowData" :enable-col-resize="true" :enable-sorting="true" :animate-rows="true" :grid-ready="onReady"
        :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
    </div>

    <add :visible.sync="addFormVisible" @refresh="list" @close="addClose"></add>
    <edit :visible.sync="editFormVisible" :orderId="orderId" :order="orderData" @refresh="list" @close="editClose"></edit>
    <detail :visible.sync="detailFormVisible" :orderId="orderId" :order="orderData" @refresh="list" @close="detailClose"></detail>

  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  getSeaProductSailScheduleListApi, downShelfSeaProductSailScheduleApi, upShelfSeaProductSailScheduleApi
} from "@/api/seaProduct";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import add from "./components/add";
import edit from "./components/edit";
import detail from "./components/detail";

import { parseTime, formatNumberToThousands } from '@/utils/index'
export default {
  name: "SeaProductSailScheduleList",
  components: {
    AgGridVue,
    topSearchItems,
    add,
    edit,
    detail,
    cargoLimitedSelect,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.viewFn(params)" 
        v-permission="['sea:productSailSchedule:view']">
          {{params.context.componentParent.$t('seaProduct.view')}}
        </el-button>
        <el-button  type="text" size="mini" 
        v-if="params.data.state === 10 && params.data.dataSource !== 10" @click="params.context.componentParent.editFn(params)" v-permission="['sea:productSailSchedule:edit']">
          {{params.context.componentParent.$t('seaProduct.edit')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.publishedFn(params)" 
        v-if="params.data.state === 10 && params.data.dataSource !== 10" v-permission="['sea:productSailSchedule:publishedFn']">
          {{params.context.componentParent.$t('seaProduct.publishedFn')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.soldOutFn(params)" 
        v-if="params.data.state === 20 && params.data.dataSource !== 10" v-permission="['sea:productSailSchedule:soldOutFn']">
          {{params.context.componentParent.$t('seaProduct.soldOutFn')}}
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
      serial: 1,
      dataSource: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      orderId: "",
      orderData: {},
      addFormVisible: false,
      editFormVisible: false,
      detailFormVisible: false,
      defaultFilter: defaultFilter,
      selectedIds: [],
      multipleSelection: [],
      activeRow: {},

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
      if (to.name === 'SeaProductSailScheduleList') {
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
        field: "vessel",
        headerName: this.$t("seaProduct.vessel"),
        minWidth: 100
      },
      {
        field: "voyage",
        headerName: this.$t("seaProduct.voyage"),
        minWidth: 130
      },
      {
        field: "routeCode",
        headerName: this.$t("seaProduct.routeCode"),
        minWidth: 100
      },

      {
        field: "etd",
        headerName: this.$t('seaProduct.etd'),
        minWidth: 80
      },
      {
        field: "eta",
        headerName: this.$t('seaProduct.eta'),
        minWidth: 80
      },
      {
        field: "voyageDays",
        headerName: this.$t('seaProduct.voyageDays'),
        minWidth: 80
      },
      {
        field: "scheduleDesc",
        headerName: this.$t('seaProduct.schedule'),
        minWidth: 80
      }, {
        field: "stateDesc",
        headerName: this.$t("seaProduct.state"),
        cellRendererFramework: 'subscriptionStateTem',
        minWidth: 100
      }, {
        field: "dataSourceDesc",
        headerName: this.$t("seaProduct.dataSource"),
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
    window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))

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
    addFn () {
      this.addFormVisible = true;
    },
    addClose () {
      this.addFormVisible = false;
    },
    editFn (row) {
      this.orderId = row.data.id
      this.orderData = row.data
      this.editFormVisible = true;
    },
    editClose () {
      this.editFormVisible = false;
    },

    viewFn (row) {
      this.orderId = row.data.id
      this.orderData = row.data
      this.detailFormVisible = true;
    },
    detailClose () {
      this.detailFormVisible = false;
    },
    publishedFn (row) {
      this.$confirm(this.$t('seaProduct.publishedFnTips'), this.$t('seaProduct.tips'), {
        confirmButtonText: this.$t('seaProduct.determine'),
        cancelButtonText: this.$t('seaProduct.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        upShelfSeaProductSailScheduleApi(row.data.id).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t('seaProduct.upShelfdSuccessfully'))
            this.list();
          }
          this.loading = false
        })
      }).catch(() => {
      })
    },
    soldOutFn (row) {
      this.$confirm(this.$t('seaProduct.soldOutFnTips'), this.$t('seaProduct.tips'), {
        confirmButtonText: this.$t('seaProduct.determine'),
        cancelButtonText: this.$t('seaProduct.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        downShelfSeaProductSailScheduleApi(row.data.id).then(res => {
          if (res && res.ok) {
            this.$message.success(this.$t('seaProduct.downShelfdSuccessfully'))
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

    async list () {
      if (this.$isNotEmpty(this.filter.validTimeRange)) {
        this.filter.etdStart = this.filter.validTimeRange[0];
        this.filter.etdEnd = this.calculateDay(0, new Date(this.filter.validTimeRange[1]), 1);
      } else {
        this.filter.etdStart = "";
        this.filter.etdEnd = "";
      }
      this.loading = true
      const res = await getSeaProductSailScheduleListApi(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.etd = parseTime(v.etd, '{y}-{m}-{d} {h}:{i}:{s}')
            v.eta = parseTime(v.eta, '{y}-{m}-{d} {h}:{i}:{s}')
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
