<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">


    <top-search-items-slot :searchFun="list" :resetFun="reset" class="app-main-inner-row more-search-condition">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px" size="mini">

            <el-form-item :label="$t('seaProduct.priceCardNo')">
              <el-input v-model.trim="filter.priceCardNo" maxlength="50" size="mini" clearable
                @keyup.enter.native="list" />
            </el-form-item>

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

            <!-- 中转类型 -->
            <el-form-item :label="$t('seaProduct.transType')" prop="transType" size="mini">
              <el-select v-model="filter.transType" @change="list" clearable>
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.through')" :value=10></el-option>
                <el-option :label="$t('seaProduct.transfer')" :value=20></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('seaProduct.containerType')" prop="transType" size="mini">
              <el-select v-model="filter.ctnTypeList" @change="list" multiple clearable>
                <el-option label="20Gp" :value=1></el-option>
                <el-option label="40GP" :value=2></el-option>
                <el-option label="40HQ" :value=3></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('seaProduct.state')">
              <el-select v-model="filter.state" :placeholder="$t('seaProduct.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.pendingEffect')" value=10></el-option>
                <el-option :label="$t('seaProduct.inEffect')" value=20></el-option>
                <el-option :label="$t('seaProduct.lostEfficacy')" value=30></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('seaProduct.shelfState')">
              <el-select v-model="filter.shelfState" :placeholder="$t('seaProduct.placeholder')" size="mini"
                @change="list">
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
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="app-main-inner-row search-bar search-item-row"
      style="padding-top: 5px !important; padding-bottom: 5px !important">
      <div class="mb-10 top-btn-wrap" style="padding-left: 0px">
        <el-tooltip class="item" effect="light" v-for="(item, index) in orderTypeList" :key="index" :content="item.tip"
          placement="bottom">
          <el-button :type="item.active ? 'primary' : 'text'" size="mini"
            :style="{ color: item.active ? '#fff' : '#979797' }" @click="toFilterByDateRange(item.value, index)">
            {{ item.name }}
          </el-button>
        </el-tooltip>
        <el-dropdown @command="handleCommand" style="margin-left:7px">
          <span class="el-dropdown-link">
            <el-button :type="orderCtnSort ? 'primary' : 'text'" size="mini"
              :style="{ color: orderCtnSort ? '#fff' : '#979797' }">
              {{ orderCtnTypeSortDesc }} {{ $t('seaProduct.cheapest') }}
            </el-button>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.value" v-for="(item, index) in orderCtnTypeList" :key="index"> {{ item.name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </div>

    <div class="table-wrap no-margin">
      <div :style="gridHeight" v-if="rowData.length > 0" class="grid-content">
        <el-row  v-for="item in rowData" :key="item.id" class="list-content">
          <el-col :span="9" >
            <el-col :span="6" style="font-weight: bold;color: #027BF0;font-size: 20px;">
              <div>{{ item.carrierName }} </div>

            </el-col>
            <el-col :span="6" style="font-weight: bold;font-size: 13px;">
              ETD：{{ item.sailScheduleDTO == null ? "--" : item.sailScheduleDTO.etd }}
            </el-col>
            <el-col :span="6">
              {{ $t('seaProduct.voyageDays') }} ：{{ item.sailScheduleDTO == null ? "--" : item.sailScheduleDTO.voyageDays }}
            </el-col>
            <el-col :span="6" style="font-weight: bold;font-size: 13px;">
              ETA：{{ item.sailScheduleDTO == null ? "--" : item.sailScheduleDTO.eta }}
            </el-col>
            <el-col :span="6" class="text-content"> {{ item.priceCardNo }}</el-col>
            <el-col :span="6" class="text-content"> {{ item.pol }}</el-col>
            <el-col :span="6" class="text-content"> {{ item.transTypeDesc }}</el-col>
            <el-col :span="6" class="text-content"> {{ item.pod }}</el-col>

          </el-col>
          <el-col :span="6" :offset="2" style="font-size: 15px;">
            <el-col :span="7" :offset="3"> {{ $t('seaProduct.twentyGPSort') }}</el-col>
            <el-col :span="7"> {{ $t('seaProduct.fortyGPSort') }}</el-col>
            <el-col :span="7"> {{ $t('seaProduct.fortyHQSort') }}</el-col>
            <el-col :span="7" :offset="3" class="text-content"
              style="font-weight: bold;color: #D9001B;">{{ item.twentyGp
              }} </el-col>
            <el-col :span="7" class="text-content" style="font-weight: bold;color: #D9001B;"> {{
              item.fortyGp }}</el-col>
            <el-col :span="7" class="text-content" style="font-weight: bold;color: #D9001B;"> {{
              item.fortyHq }}</el-col>
          </el-col>
          <el-col :span="5" :offset="2" style="text-align:right">
            <el-col :span="24" style="margin-top: -10px;text-align:right">
              <el-button type="primary" size="mini" @click="priceComputeFn(item)">
                {{ $t('seaProduct.priceCompute') }}
              </el-button>
            </el-col>
            <el-col :span="24" style="margin-top: 10px;">
              <el-button type="primary" size="mini" @click="costDetailsFn(item)">
                {{ $t('seaProduct.costDetails') }}
              </el-button></el-col>

          </el-col>
          <el-col :span="24" >
            <el-col :span="16" >
              <div  class="text-content">
                  {{ $t('seaProduct.vessel') }}： {{ item.sailScheduleDTO == null ? "--" : item.sailScheduleDTO.vessel }}
                  | {{ $t('seaProduct.lineCode') }}：{{ item.sailScheduleDTO == null ? "--" : item.sailScheduleDTO.routeCode }}
                  | {{ $t('seaProduct.voyage') }}：{{ item.sailScheduleDTO == null ? "--" : item.sailScheduleDTO.voyage }}

                <span  v-if="item.transType === 20" style="margin-left: 15px;">
                  {{ $t('seaProduct.transitPort') }}：{{item.transitPortDesc }}
                </span>
              </div>
            </el-col>
            <el-col :span="8" >
              <div  class="text-content" style="text-align:right">
                    *{{ $t('seaProduct.freightEffectiveDate') }}： {{ item.expiryDateStart }} -- {{ item.expiryDateEnd }} |
                    {{ $t('seaProduct.updateTime') }} ：{{ item.refreshTime }}
              </div>
            </el-col>
          </el-col>
        </el-row>

      </div>
      <div v-else :style="gridHeight" class="grid-content text-center">
        {{ $t('seaProduct.noQueryResult') }}
      </div>
      <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
    </div>

    <sailScheduleDetails :visible.sync="sailScheduleVisible" @close="sailScheduleClose" :priceCardId="priceCardId">
    </sailScheduleDetails>

    <costDetails :visible.sync="costDetailsVisible" @close="costDetailsClose" :priceCardId="priceCardId"
      :dataSource="dataSource">
    </costDetails>

    <priceCompute :visible.sync="priceComputeVisible" @close="priceComputeClose" :priceCardId="priceCardId"
      :dataSource="dataSource">
    </priceCompute>

  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  getSeaProductPriceCardListApi
} from "@/api/seaProduct";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";

import { parseTime, formatNumberToThousands } from '@/utils/index'
import sailScheduleDetails from "./components/sailScheduleDetails";
import costDetails from "./components/costDetails";
import priceCompute from "./components/priceCompute";
import { logServiceName, seaLogBusinessType, logOrigin } from '@/utils/constant'

export default {
  name: "SeaProductPriceQueryList",
  components: {
    AgGridVue,
    topSearchItems,

    cargoLimitedSelect,
    sailScheduleDetails,
    costDetails,
    priceCompute,
    'shipScheduleFn': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.shipScheduleDetails(params)"
        >
          {{params.context.componentParent.$t('seaProduct.shipScheduleDetails')}}
        </el-button>
      </span>
      `,
      methods: {

      }
    },
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.priceComputeFn(params)">
          {{params.context.componentParent.$t('seaProduct.priceCompute')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.costDetailsFn(params)">
          {{params.context.componentParent.$t('seaProduct.costDetails')}}
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
      priceCardNo: "",
      validTimeRange: [],
      expiryDateStart: "",
      expiryDateStartEnd: "",
      polCode: "",
      podCode: "",
      state: "20",
      shelfState: "20",
      dataSource: "",
      carrierId: "",
      orderType: "",
      transType: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      orderCtnSort: false,
      orderCtnTypeSortDesc: "",
      priceCardId: "",
      dataSource: "",
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
      orderTypeList: [{
        name: this.$t('seaProduct.latestDeparture'),
        value: '5',
        active: false,
        tip: this.$t('seaProduct.etdSortTip')
      }, {
        name: this.$t('seaProduct.shortestTime'),
        value: '4',
        active: false,
        tip: this.$t('seaProduct.voyageSortTip')
      }
      ],
      orderCtnTypeList: [{
        name: this.$t('seaProduct.defaultSort'),
        value: '',
        active: true,
        tip: this.$t('seaProduct.defaultSortTip')
      }, {
        name: this.$t('seaProduct.twentyGPSort'),
        value: '1',
        active: false,
        tip: this.$t('seaProduct.twentyGPSortTip')
      }, {
        name: this.$t('seaProduct.fortyGPSort'),
        value: '2',
        active: false,
        tip: this.$t('seaProduct.fortyGPSortTip')
      }, {
        name: this.$t('seaProduct.fortyHQSort'),
        value: '3',
        active: false,
        tip: this.$t('seaProduct.fortyHQSortTip')
      }
      ]
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'SeaProductPriceQueryList') {
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
        field: "priceCardNo",
        headerName: this.$t("seaProduct.priceCardNo"),
        minWidth: 100
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
        field: "routeCode",
        headerName: this.$t("seaProduct.routeCode"),
        minWidth: 80
      },
      {
        field: "transTypeDesc",
        headerName: this.$t('seaProduct.transType'),
        minWidth: 80
      },
      {
        field: "transitPortDesc",
        headerName: this.$t('seaProduct.transitPort'),
        minWidth: 80
      },
      {
        field: "twentyGp",
        headerName: '20GP',
        minWidth: 80
      },
      {
        field: "fortyGp",
        headerName: '40GP',
        minWidth: 80
      },
      {
        field: "fortyHq",
        headerName: '40HQ',
        minWidth: 80
      },
      {
        field: "id",
        headerName: this.$t("seaProduct.shipSchedule"),
        cellRendererFramework: "shipScheduleFn",
        minWidth: 100
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
    handleCommand (code) {
      this.orderTypeList.map((item, i) => {
        item.active = false
      })
      if (this.$isEmpty(code)) {
        this.orderCtnSort = false
        this.orderCtnTypeSortDesc = ""
      } else {
        this.orderCtnSort = true
        this.orderCtnTypeList.map((item, i) => {
          if (Number(code) === Number(i)) {
            this.orderCtnTypeSortDesc = item.name
          }
        })
      }

      this.filter.orderType = code
      this.list()
    },
    toFilterByDateRange (code, index) {
      this.orderTypeList.map((item, i) => {
        if (index === i) {
          item.active = true
        } else {
          item.active = false
        }
      })
      this.orderCtnSort = false
      this.orderCtnTypeSortDesc = ""
      this.filter.orderType = code
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
    priceComputeFn (row) {
      this.priceCardId = row.id
      this.dataSource = row.dataSource
      this.priceComputeVisible = true;
    },
    priceComputeClose () {
      this.priceComputeVisible = false;
    },
    costDetailsFn (row) {
      this.priceCardId = row.id
      this.dataSource = row.dataSource
      this.costDetailsVisible = true;
    },
    costDetailsClose () {
      this.costDetailsVisible = false;
    },
    shipScheduleDetails (row) {
      this.priceCardId = row.data.id
      this.sailScheduleVisible = true;
    },
    sailScheduleClose () {
      this.sailScheduleVisible = false;
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
      // 添加日志 记录数据
      this.logBtnSend({
        origin: logOrigin.SYSTEM_OPERATION,
        logCode: seaLogBusinessType.PRODUCT_PRICE_CARD_QUERY,
        serviceName: logServiceName.SEA_SERVICE,
        businessType: seaLogBusinessType.PRODUCT_PRICE_CARD_QUERY,
        content: {
          ...this.filter
        }
      })
      const res = await getSeaProductPriceCardListApi(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.expiryDateStart = parseTime(v.expiryDateStart, '{y}-{m}-{d}')
            v.expiryDateEnd = parseTime(v.expiryDateEnd, '{y}-{m}-{d}')
            v.refreshTime = parseTime(v.refreshTime, '{y}-{m}-{d}')
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
            transJson = transJson.substring(0, transJson.length - 1);
            v.transitPortDesc = transJson
            if (!this.$isEmpty(v.sailScheduleDTO)) {
              v.sailScheduleDTO.etd = this.$isEmpty(v.sailScheduleDTO.etd) ? "--" : parseTime(v.sailScheduleDTO.etd, '{y}-{m}-{d}')
              v.sailScheduleDTO.eta = this.$isEmpty(v.sailScheduleDTO.eta) ? "--" : parseTime(v.sailScheduleDTO.eta, '{y}-{m}-{d}')
              v.sailScheduleDTO.voyageDays = this.$isEmpty(v.sailScheduleDTO.voyageDays) ? "--" : v.sailScheduleDTO.voyageDays
              v.sailScheduleDTO.vessel = this.$isEmpty(v.sailScheduleDTO.vessel) ? "--" : v.sailScheduleDTO.vessel
              v.sailScheduleDTO.voyage = this.$isEmpty(v.sailScheduleDTO.voyage) ? "--" : v.sailScheduleDTO.voyage
              v.sailScheduleDTO.routeCode = this.$isEmpty(v.sailScheduleDTO.routeCode) ? "--" : v.sailScheduleDTO.routeCode
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
<style  lang="scss" scoped>
.grid-content {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue";
  background-color: #FBFBFB;
}

.list-content {
  padding: 10px;
  padding-left: 50px;
  padding-right: 50px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;
}

.text-content {
  margin-top: 0px;
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
