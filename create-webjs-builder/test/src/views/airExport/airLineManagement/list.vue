<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">

    <!-- <div class="app-main-inner-row search-bar search-item-row"
      style="padding-top: 5px !important; padding-bottom: 5px !important">
      <div class="search-bar-left" style="padding-left:0px;">
        <slot name="search-right">
          <el-button v-for="(item, index) in airTimeList" :type="item.active ? 'primary' : 'text'" :key="index"
            size="mini" :style="{ color: item.active ? '#fff' : '#979797' }"
            @click="toFilterByDateRange(item.value, index)">
            {{ item.name }}
          </el-button>
        </slot>
      </div>
      <div class="search-bar-right">
        <el-input v-model="filter.mblNo" @keyup.enter.native="simSearch" size="mini"
          style="vertical-align: middle;width:260px;" :placeholder="$t('air.placeholderTip')" />

        <el-button size="mini" @click="expandMoreSearchCondition" v-show="true">{{ $t('air.seachMore') }}
          <i :class="
            isShowingMoreSearchCondition
              ? 'el-icon-arrow-up el-icon--right'
              : 'el-icon-arrow-down el-icon--right'
          "></i>
        </el-button>
      </div>
    </div> -->
    <!-- v-show="isShowingMoreSearchCondition" -->
    <top-search-items-slot :searchFun="list" :resetFun="reset" class="app-main-inner-row more-search-condition">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px" size="mini">

            <el-form-item :label="$t('air.etd')" prop="validTimeRange">

              <el-row style="margin-top:-10px">
                <el-col :span="6">
                  <el-select v-model="value" @change="toFilterByDateRange">
                    <el-option v-for="(item, index)  in airTimeList" :key="index" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="18">
                  <CommonPicker pikcerType="daterange" v-model="filter.validTimeRange" :disabled="value !== 0"
                    @change="list" clearable :defaultTime="['00:00:00', '23:59:59']" />
                </el-col>
              </el-row>

            </el-form-item>

            <!-- 产品航线 -->
            <el-form-item :label="$t('air.productLine')" prop="productAirlineId" size="mini" style="margin-left:-14px">
              <el-select filterable clearable v-model="filter.productAirlineId" :placeholder="$t('air.placeholder')"
                @change="list">
                <el-option v-for="(item, index) in productAirlineNameList" :label="item.productName" :value="item.id"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 计划创建人 -->
            <el-form-item :label="$t('air.planCreator')" prop="createBy" size="mini">
              <el-select filterable clearable v-model="filter.createBy" :placeholder="$t('air.placeholder')"
                @change="list">
                <el-option v-for="(item, index) in flightPlanCreateByList" :label="item.createByName"
                  :value="item.createBy" :key="index">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('air.flightStatus')" prop="flightStatus" size="mini">
              <el-select v-model="filter.planStatus" :placeholder="$t('air.placeholder')" size="mini" clearable
                @change="list">
                <el-option v-for="(item, index)  in flightStatus" :key="index" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>


        </div>
      </template>
    </top-search-items-slot>


    <div class="operate-buttons"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="operate-buttons-left">
        <el-button type="primary" size="mini" @click="exportFn()" v-permission="['air:airLineManagement:export']">
          {{ $t('air.export') }}
        </el-button>

        <el-button type="primary" size="mini" @click="newFlightSchedule()"
          v-permission="['air:airLineManagement:newFlightSchedule']">
          {{ $t('air.newFlightSchedule') }}
        </el-button>
      </div>
    </div>

    <AgGridVue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :column-defs="columnDefs"
      :row-data="rowData" :enable-col-resize="true" :enable-sorting="true" :animate-rows="true" :grid-ready="onReady"
      :style="listGridStyle" class="ag-theme-balham" />
    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />

    <adjustPlanDialog @refresh="list" :visible="adjustPlanVisible" @close="adjustPlanClose" :order="selectedData">
    </adjustPlanDialog>

    <el-dialog :title="$t('air.cancelPlan')" :visible.sync="cancelPlanVisible" width="400px">
      <div>
        {{ msg }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPlanVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="cancelPlan" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  airFlightPlanList,
  getAirLineList,
  delAirFlightPlan,
  airFlightPlanOccupied,
  airFlightPlanCreateByList,
  airFlightPlanExport
} from "@/api/airExport";
import { getSalesListApi } from "@/api/partner/customerManage";

import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import { parseTime, formatNumberToThousands } from '@/utils/index'
import adjustPlanDialog from "./operation/adjustPlanDialog";
export default {
  name: "AirLineManagement",
  components: {
    AgGridVue,
    topSearchItems,
    cargoLimitedSelect,
    adjustPlanDialog,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.showDetailFn(params.data)"
        v-permission="['air:airLineManagement:view']"
        >
        {{params.context.componentParent.$t('air.view')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.adjustPlan(params.data)"
        v-if="params.data.planStatus !== 3 "
        v-permission="['air:airLineManagement:adjustPlan']"
        >
        {{params.context.componentParent.$t('air.adjustPlan')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.cancelPlanFn(params.data)"
        v-if="params.data.planStatus !== 3 && params.data.planStatus !== 4"
        v-permission="['air:airLineManagement:cancelPlan']"
        >
        {{params.context.componentParent.$t('air.cancelPlan')}}
        </el-button>

        
      </span>
      `,
      methods: {

      }
    }
  },
  data () {
    const defaultFilter = {
      planStatus: "",
      productAirlineId: "",
      createBy: "",
      validTimeRange: [],
      etdStart: "",
      etdEnd: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      cancelPlanVisible: false,
      msg: "",
      selectedData: {},
      adjustPlanVisible: false,
      productAirlineNameList: [],
      flightPlanCreateByList: [],
      value: 1,
      airTimeList: [{
        name: this.$t('air.next7Days'),
        value: 1,
        active: false
      }, {
        name: this.$t('air.thisWeek'),
        value: 2,
        active: false
      }, {
        name: this.$t('air.firstHalfOfAMonth'),
        value: 3,
        active: false
      }, {
        name: this.$t('air.secondHalfOfAMonth'),
        value: 4,
        active: false
      }, {
        name: this.$t('air.currentMonth'),
        value: 5,
        active: false
      }, {
        name: this.$t('air.appointedDay'),
        value: 0,
        active: false
      }
      ], // 航线数据
      salesList: [],
      defaultFilter: defaultFilter,
      selectedIds: [],
      multipleSelection: [],
      activeRow: {},
      flightStatus: [
        {
          name: this.$t('air.all'),
          value: ""
        }, {
          name: this.$t('air.inTheWorks'),
          value: 1
        }, {
          name: this.$t('air.inTheFreight'),
          value: 2
        }, {
          name: this.$t('air.haveBeenCancelled'),
          value: 3
        }, {
          name: this.$t('air.hasBeenTakeOff'),
          value: 4
        }],
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
      if (to.name === 'AirLineManagement') {
        this.list();
      }
    }
  },
  computed: {
    dynamicHeightFactor () { // 用于动态计算列表高度
      let least = 235
      if (this.isShowingMoreSearchCondition) {
        least += this.searchItemHeight
      }
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
    // 产品航线列表
    getAirLineList().then(res => {
      this.productAirlineNameList = res.content
    })
    airFlightPlanCreateByList().then(res => {
      this.flightPlanCreateByList = res.content
    })

    this.columnDefs = [
      {
        headerName: '', width: 40, pinned: 'left',
        suppressSorting: true, checkboxSelection: true,
        suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
        headerCheckboxSelection: true
      },
      {
        field: "productAirlineName",
        headerName: this.$t('air.productLine'),
        minWidth: 150
      },
      {
        field: "flightNo",
        headerName: this.$t('air.flightNo'),
        minWidth: 90
      },
      {
        field: "etd2",
        headerName: this.$t('air.etd'),
        minWidth: 130
      },
      {
        field: "etdDayWeek",
        headerName: this.$t('air.week'),
        minWidth: 100
      }, {
        field: "palletSideName",
        headerName: this.$t('air.palletSide'),
        minWidth: 100
      },
      {
        field: "planStatusName",
        headerName: this.$t('air.flightStatus'),
        minWidth: 100
      },
      {
        field: "assessWeight",
        headerName: this.$t('air.assessmentBasisWeight'),
        minWidth: 100
      }, {
        field: "theoryVolume",
        headerName: this.$t('air.loadableVolume'),
        minWidth: 100
      }, {
        field: "surplusAssessWeight",
        headerName: this.$t('air.estimatedResidualBaseWeight'),
        minWidth: 120
      },
      {
        field: "surplusTheoryVolume",
        headerName: this.$t('air.estimatedResidualVolume'),
        minWidth: 120
      },
      {
        field: "actualAssessWeight",
        headerName: this.$t('air.actualResidualBaseWeight'),
        minWidth: 120
      }, {
        field: "actualTheoryVolume",
        headerName: this.$t('air.actualResidualVolume'),
        minWidth: 120
      }, {
        field: "assessWeightRatio",
        headerName: this.$t('air.actualBaseWeightRate'),
        minWidth: 120
      },
      {
        field: "theoryVolumeRatio",
        headerName: this.$t('air.actualVolumeUtilization'),
        minWidth: 130
      },
      {
        headerName: this.$t("air.operating"),
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 200
      }
    ]

    // 初始化ETD 当前时间-15,当前时间+15
    this.filter.validTimeRange = [this.calculateDay(0, new Date(), 2), this.calculateDay(7, new Date(), 1)]
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
    // 时间选择
    toFilterByDateRange (index) {
      console.log("index", index)
      if (index === 0) {
        this.filter.validTimeRange = []
      }
      // 未来7 天
      if (index === 1) {
        this.filter.validTimeRange = [this.calculateDay(0, new Date(), 2), this.calculateDay(7, new Date(), 1)]
        this.list()
      }
      // 本周
      if (index === 2) {
        // 本周开始
        let weekBegin = new Date(new Date().toLocaleDateString()).getTime() - (new Date().getDay() - 1) * 24 * 60 * 60 * 1000;
        this.filter.validTimeRange = [weekBegin, this.calculateDay(6, new Date(weekBegin), 1)]
        this.list()
        return
      }

      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = new Date(year, month, 0);
      let time = Math.floor(day.getDate() / 2);
      console.log("time", time)
      // 上半月
      let monthBegin = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
      if (index === 3) {
        this.filter.validTimeRange = [monthBegin, this.calculateDay(time - 1, new Date(monthBegin), 1)]
        this.list()
        return
      }
      // 下半月
      let monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() + 24 * 60 * 60 * 1000 - 1 * 1000;
      if (index === 4) {
        this.filter.validTimeRange = [this.calculateDay(time, new Date(monthBegin), 1, 1), monthEnd]
        this.list()
        return
      }
      // 本月
      if (index === 5) {
        this.filter.validTimeRange = [monthBegin, monthEnd]
        this.list()
        return
      }

    },

    exportFn () {
      if (this.filter.validTimeRange) {
        this.filter.etdStart = this.filter.validTimeRange[0];
        this.filter.etdEnd = this.filter.validTimeRange[1];
      }
      airFlightPlanExport(this.filter).then(res => {
        if (res && res.ok) {
          window.location.href = res.content
          this.$message.success(this.$t('air.exportSuccess'))
        }
      })
    },
    newFlightSchedule () {
      this.$router.push({ name: `AddFlightSchedule` });

    },
    showDetailFn (row) {
      this.$router.push({
        name: `AirLineManagementDetail`,
        query: { id: row.id }
      });
    },
    cancelPlan () {
      delAirFlightPlan(this.selectedData.id).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t('air.cancelSuccess'))
          this.cancelPlanVisible = false
          this.list()
        }
        this.loading = false
      })
    },
    cancelPlanFn (row) {
      console.log("row", row)
      this.selectedData = row

      airFlightPlanOccupied(this.selectedData.id).then(res => {
        if (res && res.ok && res.content) {
          this.msg = this.$t('air.cancelPlanBusinessWarm')
        } else {
          this.msg = this.$t('air.cancelPlanWarm')
        }
        this.cancelPlanVisible = true
      })

    },
    adjustPlan (row) {
      console.log("row", row)
      this.selectedData = row
      this.adjustPlanVisible = true
    },
    adjustPlanClose () {
      this.adjustPlanVisible = false
    },
    setAirCustomerInfo (customer) {
      this.filter.airlineId = customer.id;
      this.filter.airlineName = customer.chineseName;
      this.list();
    },
    setCreateByInfo (createBy) {
      this.filter.createById = createBy.id;
      this.filter.createByName = createBy.chineseName;
      this.list();
    },
    reset () {
      this.filter = this.$extends({}, this.defaultFilter);
      this.value = 1
      this.filter.validTimeRange = [this.calculateDay(0, new Date(), 2), this.calculateDay(7, new Date(), 1)]
      this.list();
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
      if (this.filter.validTimeRange) {
        this.filter.etdStart = this.filter.validTimeRange[0];
        this.filter.etdEnd = this.filter.validTimeRange[1];
      }
      console.log("this.filter.validTimeRange", this.filter.validTimeRange)
      const res = await airFlightPlanList(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.etd2 = parseTime(v.etd, '{y}-{m}-{d} {h}:{i}')
            v.assessWeightRatio = v.assessWeightRatio + "%"
            v.theoryVolumeRatio = v.theoryVolumeRatio + "%"
            if (v.palletSide === 1) {
              v.palletSideName = this.$t('air.inThePlate')
            } else if (v.palletSide === 2) {
              v.palletSideName = this.$t('air.offBoard')
            }

            switch (v.planStatus) {
              case 1:
                v.planStatusName = this.$t('air.inTheWorks')
                break
              case 2:
                v.planStatusName = this.$t('air.inTheFreight')
                break
              case 3:
                v.planStatusName = this.$t('air.haveBeenCancelled')
                break
              case 4:
                v.planStatusName = this.$t('air.hasBeenTakeOff')
                break
              default:
                return
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
