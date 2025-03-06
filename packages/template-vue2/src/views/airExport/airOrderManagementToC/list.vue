<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">

    <div class="app-main-inner-row search-bar search-item-row"
      style="padding-top: 5px !important; padding-bottom: 5px !important">
      <div class="search-bar-left" style="padding-left: 0px"></div>
      <div class="search-bar-right">
        <el-input v-model="filter.mblNo" @keyup.enter.native="simSearch" size="mini"
          style="vertical-align: middle;width:260px;" :placeholder="$t('air.placeholderTip')" />

        <el-button size="mini" @click="expandMoreSearchCondition" v-show="true">{{ $t('air.seachMore') }}
          <i :class="isShowingMoreSearchCondition
            ? 'el-icon-arrow-up el-icon--right'
            : 'el-icon-arrow-down el-icon--right'
            "></i>
        </el-button>
      </div>
    </div>
    <top-search-items-slot :searchFun="list" :resetFun="reset" v-show="isShowingMoreSearchCondition"
      class="app-main-inner-row more-search-condition">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="filter" label-width="80px" size="mini">
            <el-form-item :label="$t('air.entityNo')">
              <el-input v-model.trim="filter.orderNo" maxlength="50" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('air.pol')">
              <type-select v-model="filter.polCode" type="airport" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('air.pod2')">
              <type-select v-model="filter.podCode" type="airport" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('air.airline')">
              <type-select placeholder="" v-model="filter.airlineName" type="airLine" style="width: 100%;"
                @selected="setAirCustomerInfo" clearable />
            </el-form-item>
            <el-form-item :label="$t('air.orderState')">
              <el-select v-model="filter.orderState" :placeholder="$t('air.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('air.all')" value=""></el-option>
                <el-option :label="$t('air.forCargo')" value="5"></el-option>
                <el-option :label="$t('air.toBeBooked')" value="10"></el-option>
                <el-option :label="$t('air.toBePrepared')" value="30"></el-option>
                <el-option :label="$t('air.toTakeOff')" value="40"></el-option>
                <el-option :label="$t('air.inTransit')" value="50"></el-option>
                <el-option :label="$t('air.toArrivalAtPort')" value="60"></el-option>
                <el-option :label="$t('air.toFinished')" value="95"></el-option>
                <el-option :label="$t('air.toCanceled')" value="100"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('air.mblNoName')}: `">
              <el-input v-model.trim="filter.mblNo" maxlength="50" placeholder="" size="mini" clearable
                @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('air.flightNo')">
              <el-input v-model.trim="filter.flightNo" maxlength="50" placeholder="" size="mini" clearable
                @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('air.packetChannel')">
              <el-input v-model.trim="filter.bagChannel" maxlength="70" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="$t('air.dataSource')">
              <el-select v-model="filter.dataSource" :placeholder="$t('air.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('air.all')" value=""></el-option>
                <el-option :label="$t('air.bagOldSystem')" value="1"></el-option>
                <el-option :label="$t('air.bagNewSystem')" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('air.feesPayable')">
              <el-select v-model="filter.payableState" :placeholder="$t('air.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('air.all')" value=""></el-option>
                <el-option :label="$t('air.toMaintained')" value="10"></el-option>
                <el-option :label="$t('air.toBeenMaintained')" value="20"></el-option>
                <el-option :label="$t('air.toConfirmed')" value="30"></el-option>
                <el-option :label="$t('air.toAdjusted')" value="40"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="ETD:" prop="validTimeRange">
              <div style="width: 52%">
                <CommonPicker pikcerType="daterange" v-model="filter.validTimeRange" @change="list" clearable
                  :defaultTime="['00:00:00', '23:59:59']" />
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>


    <!-- <div class="top-btn-wrap"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="mb-10 top-btn-wrap">
        <el-button type="primary" size="mini" @click="edit()" v-permission="['air:order:exportToC:create']">
          {{ $t('air.newOrders') }}
        </el-button>
      </div>
    </div> -->
    <div class="table-wrap">
      <AgGridVue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :column-defs="columnDefs"
        :row-data="rowData" :enable-col-resize="true" :enable-sorting="true" :animate-rows="true" :grid-ready="onReady"
        :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
    </div>
    <el-dialog :title="$t('air.finished')" :visible.sync="takeDeliveryVisible" width="400px">
      <div>
        {{ $t('air.finishedBeCareful') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="takeDeliveryVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitDeliveryFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="$t('air.cancellationOfOrder')" :visible.sync="cancellationOfOrderVisible" width="400px">
      <div>
        {{ $t('air.cancellationOfOrderTip') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellationOfOrderVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitCancellationOfOrderFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import URL from '@/api/urlTranslator'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems"
import {
  getAirOrderExportc2cQueryList,
  updateAirExportOrderMergeApi,
  deliveryAirExportOrderListApi,
  bookingAirExportOrderApi,
  getCustomerAirExportCreate,
  cancelAirExportApi
} from "@/api/airExport"
import { getSalesListApi } from "@/api/partner/customerManage"

import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common"
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: "AirOrderManagementToC",
  components: {
    AgGridVue,
    topSearchItems,

    // <el-button  type="text" size="mini" v-permission="['air:order:exportToC:copy']" @click="params.context.componentParent.copyOrder(params.data.id)">
    // {{params.context.componentParent.$t('air.copy')}}
    // </el-button>
    // <el-button  type="text" size="mini" v-permission="['air:order:exportToC:arrived']" @click="params.context.componentParent.takeDelivery(params.data)"  v-if="
    //     params.data.orderState !== 100 &&
    //     params.data.orderState !== 95 &&
    //     params.data.orderState !== 10
    //     ">{{params.context.componentParent.$t('air.finished')}} </el-button>

    //     <el-button  type="text" size="mini" v-permission="['air:order:exportToC:cancellationOfOrder']" @click="params.context.componentParent.cancellationOfOrder(params.data)"  v-if="
    //     params.data.orderState !== 95 && params.data.orderState !== 100 && params.data.orderState !== 50
    //     ">{{params.context.componentParent.$t('air.cancellationOfOrder')}} </el-button>
    cargoLimitedSelect,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.showDetailFn(params)" v-permission="['air:order:exportToC:view']">
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
      orderNo: "",
      podCode: "",
      polCode: "",
      etdStart: "",
      etdEnd: "",
      bagChannel: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    }
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
  computed: {
    url () {
      return URL
    },
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
    this.columnDefs = [
      {
        headerName: '', width: 40, pinned: 'left',
        suppressSorting: true, checkboxSelection: true,
        suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
        headerCheckboxSelection: true
      },
      {
        field: "orderNo",
        headerName: this.$t('air.entityNo'),
        minWidth: 100
      },
      {
        field: "mblNo",
        headerName: this.$t('air.mblNoName'),
        minWidth: 130
      },
      {
        field: "dataSourceDesc",
        headerName: this.$t('air.dataSource'),
        minWidth: 130
      },
      {
        field: "bagChannel",
        headerName: this.$t('air.packetChannel'),
        minWidth: 130
      },
      {
        field: "bookingAgentName",
        headerName: this.$t('air.nationalEncouragementscholarship'),
        minWidth: 130
      },
      {
        field: "airlineScacCode",
        headerName: this.$t('air.airlineName'),
        minWidth: 90
      },
      // {
      //   field: "productAirlineName",
      //   headerName: this.$t('air.productLine'),
      //   minWidth: 130
      // },
      {
        field: "flightNo",
        headerName: this.$t('air.flightNo'),
        minWidth: 100
      },
      {
        field: "pol",
        headerName: this.$t('air.pol'),
        cellRenderer: params => `<div>${params.data.polCode}</div>`,
        minWidth: 80
      }, {
        field: "pod",
        headerName: this.$t('air.pod2'),
        cellRenderer: params => `<div>${params.data.podCode}</div>`,
        minWidth: 80
      }, {
        field: "receipt",
        headerName: this.$t('air.receipt'),
        cellRenderer: params => `<div>${params.data.receiptCode}</div>`,
        minWidth: 80
      },
      {
        field: "actualQuantity",
        headerName: this.$t('air.actualQuantity'),
        cellRenderer: params => `<span>
            <span> ${params.data.orderQuantity || "--"}  </span>/
            <span> ${params.data.actualQuantity || "--"}  </span>
          </span>`,

        minWidth: 130
      }, {
        field: "actualGrossWeight",
        headerName: this.$t('air.actualGrossWeight'),
        cellRenderer: params => `<span>
            <span> ${params.data.orderGrossWeight || "--"}  </span>/
            <span> ${params.data.actualGrossWeight || "--"}  </span>
          </span>`,
        minWidth: 130
      }, {
        field: "actualVolume",
        headerName: this.$t('air.actualVolume'),
        cellRenderer: params => `<span>
            <span> ${params.data.orderVolume || "--"}  </span>/
            <span> ${params.data.actualVolume || "--"}  </span>
          </span>`,
        minWidth: 130
      },
      {
        field: "orderStateDesc",
        headerName: this.$t('air.orderStateDesc'),
        minWidth: 100
      },
      {
        field: "payableStateDesc",
        headerName: this.$t('air.feesPayableState'),
        minWidth: 100
      },
      {
        field: "etd",
        headerName: "ETD",
        minWidth: 130
      },
      {
        field: "createByName",
        headerName: this.$t('air.createByName'),
        minWidth: 100
      },
      {
        field: "createTime",
        headerName: this.$t('air.createTime'),
        minWidth: 130
      },
      {
        field: "updateByName",
        headerName: this.$t('air.updateByName'),
        minWidth: 100
      },
      {
        field: "updateTime",
        headerName: this.$t('air.updateTime'),
        minWidth: 130
      },
      {
        headerName: this.$t("air.operating"),
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 80
      }
    ]
    this.airExportCreateByList()
    // 初始化ETD 当前时间-15,当前时间+15
    this.filter.validTimeRange = [this.$moment().subtract(15, 'days').startOf('day').valueOf(), this.$moment().add(15, 'days').endOf('day').valueOf()]
    this.list()
    window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'AirOrderManagementToC') {
        this.list()
      }
    }
  },
  methods: {
    copyOrder (id) {
      this.$router.push({ name: `AirOrderManagementToCEdit`, query: { id, type: 'copy' } })
    },
    /**
     * 新增编辑页面
    */
    edit (id) {
      this.$router.push({ name: `AirOrderManagementToCEdit`, query: { id } })
    },
    showDetailFn (row) {
      this.$router.push({
        name: `AirOrderManagementToCOrderDetail`,
        query: { id: row.data.id }
      })
    },
    takeDelivery (row) {
      this.activeRow = row
      this.takeDeliveryVisible = true
    },
    cancellationOfOrder (row) {
      this.activeRow = row
      if (this.activeRow.receivableState !== 10 || this.activeRow.payableState !== 10) {
        this.$message.warning(this.$t('air.cancellationOfOrderWarm'))
        return
      }
      this.cancellationOfOrderVisible = true
    },

    airExportCreateByList () {
      getCustomerAirExportCreate().then(res => {
        if (res && res.ok) {
          this.createByList = res.content;
        }
      })

      getSalesListApi().then(res => {
        if (res && res.ok) {
          this.salesList = res.content;
        }
      })

    },


    setAirCustomerInfo (customer) {
      this.filter.airlineId = customer.id
      this.filter.airlineName = customer.chineseName
      this.list()
    },
    setCreateByInfo (createBy) {
      this.filter.createById = createBy.id
      this.filter.createByName = createBy.chineseName
      this.list()
    },
    reset () {
      this.filter = this.$extends({}, this.defaultFilter)
      this.list()
    },
    expandMoreSearchCondition () {
      this.isShowingMoreSearchCondition = !this.isShowingMoreSearchCondition
      const self = this
      setTimeout(() => {
        self.searchItemHeight = document.querySelector('.more-search-condition').offsetHeight
      })
    },
    submitDeliveryFn () {
      this.takeDeliveryVisible = false;
      deliveryAirExportOrderListApi(this.activeRow.id).then(res => {
        if (res && res.ok) {
          this.list();
          this.$message.success(this.$t('air.successfulEnd'));
        }
      })
    },
    submitCancellationOfOrderFn () {
      this.cancellationOfOrderVisible = false;
      // 取消接口
      cancelAirExportApi(this.activeRow.id).then(res => {
        if (res && res.ok) {
          this.list();
          this.$message.success(this.$t('air.cancellationOfOrderEnd'));
        }
      })
    },

    simSearch () {
      this.filter.validTimeRange = []
      this.list()
    },

    async list () {
      this.loading = true
      if (this.$isNotEmpty(this.filter.validTimeRange)) {
        this.filter.etdStart = this.filter.validTimeRange[0]
        if (this.$isNotEmpty(this.filter.validTimeRange[1])) {
          this.filter.etdEnd = this.$moment(parseInt(this.filter.validTimeRange[1], 10)).endOf('day').valueOf()
        } else {
          this.filter.etdEnd = this.filter.validTimeRange[1]
        }
      } else {
        this.filter.etdStart = "";
        this.filter.etdEnd = "";
      }
      const res = await getAirOrderExportc2cQueryList(this.filter)
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
    },
    // 获取表格选中的数据集合
    getSelectData () {
      let arr = []
      getGridSelected(this.gridOptions).forEach(function (v) {
        arr.push(v.id)
      })
      this.selectedIds = arr
      this.multipleSelection = getGridSelected(this.gridOptions)
    }
    // table end *************
  }
}
</script>
<style  lang="scss" scoped></style>
