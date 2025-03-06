<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">

    <div class="app-main-inner-row search-bar search-item-row"
      style="padding-top: 5px !important; padding-bottom: 5px !important">
      <div class="mb-10 top-btn-wrap" style="padding-left: 0px">
        <el-button v-for="(item, index) in stateList" :type="item.active ? 'primary' : 'text'" :key="index" size="mini"
          :style="{ color: item.active ? '#fff' : '#979797' }" @click="toFilterByDateRange(item.value, index)">
          {{ item.name }}
        </el-button>
      </div>
    </div>

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


            <el-form-item :label="$t('seaProduct.shelfState')">
              <el-select v-model="filter.shelfState" :placeholder="$t('seaProduct.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.draft')" value=10></el-option>
                <el-option :label="$t('seaProduct.published')" value=20></el-option>
                <el-option :label="$t('seaProduct.soldOut')" value=30></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('seaProduct.dataSource')" prop="dataSource" size="mini">
              <el-select v-model="filter.dataSource" @change="list" clearable>
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.ecommercePlatform')" :value=10></el-option>
                <el-option :label="$t('seaProduct.shipownerContract')" :value=20></el-option>
                <el-option :label="$t('seaProduct.agencyContract')" :value=30></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item :label="$t('seaProduct.effectiveDate')" prop="validTimeRange">
              <el-date-picker v-model="filter.validTimeRange" value-format="timestamp" type="daterange"
                range-separator="-" start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
              </el-date-picker>
            </el-form-item> -->
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="top-btn-wrap"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="mb-10 top-btn-wrap">
        <el-button type="primary" size="mini" @click="addFn()" v-permission="['sea:productExtraPriceCard:add']">
          {{ $t('seaProduct.productPriceCardAdd') }}
        </el-button>
      </div>
    </div>

    <div class="table-wrap">
      <AgGridVue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :column-defs="columnDefs"
        :row-data="rowData" :enable-col-resize="true" :enable-sorting="true" :animate-rows="true" :grid-ready="onReady"
        :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
    </div>


  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  getSeaProductExtraPriceCardListApi, downShelfSeaExtraPriceCardApi, upShelfSeaExtraPriceCardApi
} from "@/api/seaProduct";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";

import { parseTime, formatNumberToThousands } from '@/utils/index'


export default {
  name: "SeaProductExtraPriceCardList",
  components: {
    AgGridVue,
    topSearchItems,

    cargoLimitedSelect,

    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.view(params)"
        v-permission="['sea:productExtraPriceCard:view']">
          {{params.context.componentParent.$t('seaProduct.view')}}
        </el-button>

        <el-button  v-if="params.data.dataSource !== 10"  type="text" size="mini" @click="params.context.componentParent.copy(params)"
        v-permission="['sea:productPriceCard:add']" >
          {{params.context.componentParent.$t('seaProduct.copy')}}
        </el-button>

        <el-button  v-if="params.data.shelfState === 10 && params.data.dataSource !== 10"  type="text" size="mini" @click="params.context.componentParent.edit(params)"
        v-permission="['sea:productExtraPriceCard:edit']">
          {{params.context.componentParent.$t('seaProduct.edit')}}
        </el-button>
        <el-button  type="text" size="mini" @click="params.context.componentParent.publishedFn(params)" 
        v-if="params.data.shelfState === 10 && params.data.dataSource !== 10" v-permission="['sea:productExtraPriceCard:publishedFn']">
          {{params.context.componentParent.$t('seaProduct.publishedFn')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.soldOutFn(params)" 
        v-if="params.data.shelfState === 20 && params.data.dataSource !== 10" v-permission="['sea:productExtraPriceCard:soldOutFn']">
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
      <span v-else-if="params.data.state===20" style="color:#02830F">{{params.data.stateDesc}}</span>
      <span v-else-if="params.data.state===30" style="color:#D9001B">{{params.data.stateDesc}}</span>
      <span v-else>{{params.data.stateDesc}}</span>
      </div>`,
      methods: {}
    },
    'shelfStateTem': {
      template: `
      <div class="status-text ">
      <span v-if="params.data.shelfState===10 " style="color: #027BF0">
        {{params.data.shelfStateDesc}}
      </span>
      <span v-else-if="params.data.shelfState===20" style="color:#02830F">{{params.data.shelfStateDesc}}</span>
      <span v-else-if="params.data.shelfState===30" style="color:#D9001B">{{params.data.shelfStateDesc}}</span>
      <span v-else>{{params.data.shelfStateDesc}}</span>
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
      orderType: "",
      transType: "",
      shelfState: "",
      dataSource: 20,
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      priceCardId: "",
      sailScheduleVisible: false,
      costDetailsVisible: false,
      priceComputeVisible: false,
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
      total: 0,
      // table end,
      stateList: [{
        name: this.$t('seaProduct.all'),
        value: '',
        active: true
      }, {
        name: this.$t('seaProduct.pendingEffect'),
        value: '10',
        active: false
      }, {
        name: this.$t('seaProduct.inEffect'),
        value: '20',
        active: false
      }, {
        name: this.$t('seaProduct.lostEfficacy'),
        value: '30',
        active: false
      }
      ]
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'SeaProductExtraPriceCardList') {
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
        field: "carrierName",
        headerName: this.$t("seaProduct.shippingCompany"),
        minWidth: 100
      },
      {
        field: "pol",
        headerName: this.$t("seaProduct.pol"),
        minWidth: 80
      },
      {
        field: "pod",
        headerName: this.$t("seaProduct.pod"),
        minWidth: 80
      },
      {
        field: "supplierName",
        headerName: this.$t('seaProduct.supplierName'),
        minWidth: 80
      },
      {
        field: "routeCode",
        headerName: this.$t('seaProduct.routeCode'),
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
      },
      {
        field: "dataSourceDesc",
        headerName: this.$t('seaProduct.dataSource'),
        minWidth: 80
      },

      {
        field: "stateDesc",
        headerName: this.$t("seaProduct.state"),
        cellRendererFramework: 'subscriptionStateTem',
        minWidth: 100
      },
      {
        field: "shelfStateDesc",
        headerName: this.$t("seaProduct.shelfState"),
        cellRendererFramework: 'shelfStateTem',
        minWidth: 100
      },
      {
        field: "id",
        headerName: this.$t("seaProduct.operating"),
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 200
      }
    ]
    this.list()
    window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
  },

  methods: {
    toFilterByDateRange (code, index) {
      this.stateList.map((item, i) => {
        if (index === i) {
          item.active = true
        } else {
          item.active = false
        }
      })
      this.filter.state = code
      this.list()
    },
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
    view (row) {
      this.$router.push({
        name: `SeaExtraProductPriceCardDetail`,
        query: { id: row.data.id }
      });
    },
    addFn () {
      this.$router.push({
        name: `SeaExtraProductPriceCardAdd`
      });
    },
    edit (row) {
      this.$router.push({
        name: `SeaExtraProductPriceCardEdit`,
        query: { id: row.data.id }
      });
    },
    copy (row) {
      this.$router.push({
        name: `SeaExtraProductPriceCardEdit`,
        query: { id: row.data.id, type: 'copy' }
      });
    },
    publishedFn (row) {
      this.$confirm(this.$t('seaProduct.publishedFnTips'), this.$t('seaProduct.tips'), {
        confirmButtonText: this.$t('seaProduct.determine'),
        cancelButtonText: this.$t('seaProduct.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        upShelfSeaExtraPriceCardApi(row.data.id).then(res => {
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
        downShelfSeaExtraPriceCardApi(row.data.id).then(res => {
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
        this.filter.expiryDateStart = this.filter.validTimeRange[0];
        this.filter.expiryDateStartEnd = this.calculateDay(0, new Date(this.filter.validTimeRange[1]), 1);
      } else {
        this.filter.expiryDateStart = "";
        this.filter.expiryDateStartEnd = "";
      }
      this.loading = true

      const res = await getSeaProductExtraPriceCardListApi(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.expiryDateStart = parseTime(v.expiryDateStart, '{y}-{m}-{d} {h}:{i}:{s}')
            v.expiryDateEnd = parseTime(v.expiryDateEnd, '{y}-{m}-{d} {h}:{i}:{s}')
            if (!v.twentyGp || v.twentyGp === 0) {
              v.twentyGp = "--"
            }
            if (!v.fortyGp || v.fortyGp === 0) {
              v.fortyGp = "--"
            }
            if (!v.fortyHq || v.fortyHq === 0) {
              v.fortyHq = "--"
            }
            let transJsonList = v.transJson ? JSON.parse(v.transJson) : []
            let transJson = ""
            transJsonList.forEach(tran => {
              transJson += tran.trans + ","
            })
            v.transitPortDesc = transJson

            if (v.dataSource !== 10) {
              let routeJsonList = v.routeJson ? JSON.parse(v.routeJson) : []
              let routeJson = ""
              routeJsonList.forEach(route => {
                routeJson += route.routeCode + ","
              })
              v.routeCode = routeJson
            }

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
