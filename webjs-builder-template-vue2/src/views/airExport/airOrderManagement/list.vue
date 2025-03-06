<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">

    <div class="app-main-inner-row search-bar search-item-row"
      style="padding-top: 5px !important; padding-bottom: 5px !important">
      <div class="search-bar-left" style="padding-left: 0px">
        <el-button v-for="(item, index) in airStateList" :type="item.active ? 'primary' : 'text'" :key="index" size="mini"
          :style="{ color: item.active ? '#fff' : '#979797' }" @click="toFilterByDateRange(item.value, index)">
          {{ item.name }}
        </el-button>
      </div>
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
            <el-form-item :label="$t('air.requester')">
              <type-select v-model="filter.customerId" type="customer" @selected="list" />
            </el-form-item>
            <el-form-item :label="$t('air.airline')">
              <!-- <cargo-limited-select placeholder="" :method="airCustomerMethod" :select-label="filter.airlineName"
                :select-value="filter.airlineId" type="customer" style="width: 100%" @set="setAirCustomerInfo" clearable
                @selected="list" /> -->

              <type-select placeholder="" v-model="filter.airlineName" type="airLine" style="width: 100%;"
                @selected="setAirCustomerInfo" clearable />
            </el-form-item>
            <el-form-item :label="$t('air.orderState')">
              <el-select v-model="filter.orderStateListCode" multiple :placeholder="$t('air.placeholder')" size="mini"
                clearable @change="changeStage" collapse-tags	>
                <el-option :label="$t('air.all')" value=""></el-option>
                <el-option :label="$t('air.toBeQuoted')" value="0"></el-option>
                <el-option :label="$t('air.toBeConfirmed')" value="3"></el-option>
                <el-option :label="$t('air.refusalOfBooking')" value="4"></el-option>
                <el-option :label="$t('air.forCargo')" value="5"></el-option>
                <el-option :label="$t('air.toBeBooked')" value="10"></el-option>
                <el-option :label="$t('air.toBePrepared')" value="30"></el-option>
                <el-option :label="$t('air.toTakeOff')" value="40"></el-option>
                <el-option :label="$t('air.inTransit')" value="50"></el-option>
                <el-option :label="$t('air.toArrivalAtPort')" value="60"></el-option>
                <el-option :label="$t('air.toFinished')" value="95"></el-option>
                <el-option :label="$t('air.exitCustoms2')" value="99"></el-option>
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
            <!-- <el-form-item label="创建人:">
              <el-select v-model="filter.createByName" filterable placeholder="请选择创建人" size="mini" clearable>
                <el-option v-for="(item, index) in createByList" :key="index" :label="item.createByName"
                  :value="item.createByName">
                </el-option>
              </el-select>
            </el-form-item> -->

            <el-form-item :label="$t('air.createByName')">
              <cargo-limited-select placeholder="" :select-label="filter.createByName" :select-value="filter.createByName"
                type="user" style="width: 100%" @set="setCreateByInfo" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('air.operationalStaff')">
              <cargo-limited-select placeholder="" :select-label="filter.operationName"
                :select-value="filter.operationName" type="user" :methodParams="{ range: ['OPERATOR'] }"
                style="width: 100%" @set="setOperationalByInfo" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('air.feesReceivable')">
              <el-select v-model="filter.receivableState" :placeholder="$t('air.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('air.all')" value=""></el-option>
                <el-option :label="$t('air.toMaintained')" value="10"></el-option>
                <el-option :label="$t('air.toBeenMaintained')" value="20"></el-option>
                <el-option :label="$t('air.toConfirmed')" value="30"></el-option>
                <el-option :label="$t('air.toAdjusted')" value="40"></el-option>
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
            <el-form-item :label="`${$t('air.salesperson')}: `" prop="sellerName">
              <el-select filterable clearable v-model="filter.sellerId" size="mini" @change="list">
                <el-option v-for="(item, index) in salesList" :key="index" :label="item.chineseName" :value="item.id" />
              </el-select>
            </el-form-item>


            <el-form-item label="ETD:" prop="validTimeRange">
              <!-- <CommonPicker pikcerType="daterange" v-model="filter.validTimeRange"
                :parentRangeDate="filter.validTimeRange" @change="list" clearable
                :defaultTime="['00:00:00', '23:59:59']" /> -->
              <el-date-picker v-model="filter.validTimeRange" value-format="timestamp" type="daterange"
                range-separator="-" start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('air.orderLockStateName')">
              <el-select v-model="filter.lockOrderState" size="mini">
                <el-option :label="$t('air.all')" value=""></el-option>
                <el-option v-for="(item, index) in orderLockStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>


    <div class="operate-buttons"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="operate-buttons-left">
        <el-button type="primary" size="mini" @click="edit()" v-permission="['air:order:export:create']">
          {{ $t('air.newOrders') }}
        </el-button>
        <!--<el-button type="primary" size="mini" @click="mergeFn()" v-permission="['air:order:export:merge']">合并</el-button>-->
        <!-- <el-button type="primary" size="mini" @click="changeShippingSpace()"
          v-permission="['air:order:export:modificationSpace']">{{ $t('air.toMatch') }}</el-button> -->
        <el-button type="primary" size="mini" @click="atdFn()" v-permission="['air:order:export:atd']">
          {{ $t('air.takeOff') }}</el-button>
        <el-button type="primary" size="mini" @click="ataFn()" v-permission="['air:order:export:ata']">
          {{ $t('air.arrivalAtPort') }}</el-button>

        <el-popover placement="bottom" trigger="click" ref="popoverRef" style="margin-left:10px"
          v-permission="['air:order:export:export']">
          <el-button slot="reference" size="mini" type="primary">{{ $t('air.export') }}<i
              class="el-icon-arrow-down el-icon--right"></i></el-button>
          <template>
            <div v-for="item in exportTemplates" :key="item.code" style="margin-bottom: 6px;">
              <el-link type="primary" @click="exportFn(item.code)">{{ item.chineseName }}</el-link>
            </div>
          </template>
        </el-popover>
      </div>
    </div>

    <!--:first-data-rendered="onFirstDataRendered"  -->
    <AgGridVue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :column-defs="columnDefs"
      :row-data="rowData" :enable-col-resize="true" :enable-sorting="true" :animate-rows="true" :grid-ready="onReady"
      :style="listGridStyle" class="ag-theme-balham" />
    <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />


    <atd v-if="atdFormVisible" @refresh="list" :visible="atdFormVisible" @close="atdClose" :jobIds="[]"
      :orderIds="selectedIds" atd=""></atd>
    <ata v-if="ataFormVisible" @refresh="list" :visible="ataFormVisible" @close="ataClose" :jobIds="[]"
      :orderIds="selectedIds" ata=""></ata>
    <shipping-space-batch v-if="shippingSpaceVisible" @refresh="list" :visible="shippingSpaceVisible"
      @close="shippingSpaceClose" :jobIds="[]" :orderIds="selectedIds"></shipping-space-batch>

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
        <el-form ref="cancellationForm" :model="cancellation" label-width="95px" label-position="left"
          style="margin-top: -5px;">
          <el-form-item :label="$t('air.cancellationReason')" prop="cancelReasonType"
            :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]">
            <el-select v-model="cancellation.cancelReasonType" placeholder="请选择" size="mini">
              <el-option v-for="item in cancellationList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div>{{ $t('air.cancellationOfOrderTip') }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellationOfOrderVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitCancellationOfOrderFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('air.exitCustoms')" :visible.sync="exitCustomsVisible" width="400px">
      <div>
        {{ $t('air.exitCustomsTip') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitCustomsVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitExitCustomsVisibleFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="$t('air.bookingTip')" :visible.sync="bookingVisible" width="400px">
      <div>
        {{ $t('air.bookingTip1') }}{{ activeRow.orderNo }}{{ $t('air.bookingTip2') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bookingVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="bookingFile" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>

    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data"
      :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow = false" />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'
import URL from '@/api/urlTranslator'
import { getUserInfo } from "@/api/login"
import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  getAirExportOrderListApi,
  updateAirExportOrderMergeApi,
  deliveryAirExportOrderListApi,
  bookingAirExportOrderApi,
  getCustomerAirExportCreate,
  cancelAirExportApi,
  exportAirOrderExportApi,
  shoutoutsAirExportApi
} from "@/api/airExport";
import { getSalesListApi } from "@/api/partner/customerManage";
import operationBtn from "./operationBtn.vue";
import shippingSpaceBatch from "./operation/shippingSpaceBatchDialog";
import ata from "./operation/ataDialog";
import atd from "./operation/atdDialog";
import reportListDialog from "@/components/Cargo/Report/reportListDialog";
import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: "AirOrderManagement",
  components: {
    AgGridVue,
    topSearchItems,
    operationBtn,
    shippingSpaceBatch,
    ata,
    atd,
    reportListDialog,
    cargoLimitedSelect,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.showDetailFn(params)">
        {{params.context.componentParent.$t('air.view')}}
        </el-button>
        <el-button  type="text" size="mini" v-permission="['air:order:export:copy']" @click="params.context.componentParent.copyOrder(params.data.id)">
        {{params.context.componentParent.$t('air.copy')}}
        </el-button>
        <el-button  type="text" size="mini" v-permission="['air:order:export:booking']" @click="params.context.componentParent.bookingFn(params.data)"  
        v-if="params.data.orderState == 10  || params.data.orderState == 30 || params.data.orderState == 40">
         {{params.context.componentParent.$t('air.booking')}}</el-button>
        <el-button  type="text" size="mini" v-permission="['air:order:export:arrived']" @click="params.context.componentParent.takeDelivery(params.data)"  v-if="
        params.data.orderState != 100 &&
        params.data.orderState != 95 &&
        params.data.orderState == 60
        ">{{params.context.componentParent.$t('air.finished')}} </el-button>

        <el-button  type="text" size="mini" v-permission="['air:order:export:cancellationOfOrder']" @click="params.context.componentParent.cancellationOfOrder(params.data)"  v-if="
        params.data.orderState != 95 && params.data.orderState != 100 && params.data.orderState != 50 && params.data.orderState != 60 && params.data.orderState != 99
        ">{{params.context.componentParent.$t('air.cancellationOfOrder')}} </el-button>

        <el-button  type="text" size="mini" v-permission="['air:order:export:exitCustoms']" @click="params.context.componentParent.exitCustoms(params.data)"  v-if="
        params.data.orderState == 10 || params.data.orderState == 30 || params.data.orderState == 40
        ">{{params.context.componentParent.$t('air.exitCustoms')}} </el-button>
      </span>
      `,
      methods: {

      }
    },
    'orderStateTem': {
      template: `
      <div class="status-text ">
      <span v-if="params.data.orderState==0 || params.data.orderState==3 || params.data.orderState==5 || params.data.orderState==30 || params.data.orderState==40 || params.data.orderState==50 || params.data.orderState==60" style="color: #027BF0">
        {{params.data.orderStateDesc}}
      </span>
      <span v-else-if="params.data.orderState==10" style="color:#8400FF">{{params.data.orderStateDesc}}</span>
      <span v-else-if="params.data.orderState==95" style="color:#02830F">{{params.data.orderStateDesc}}</span>
      <span v-else-if="params.data.orderState==99" style="color:#AAAAAA">{{params.data.orderStateDesc}}</span>
      <span v-else-if="params.data.orderState==100 || params.data.orderState==4" style="color:#D9001B">{{params.data.orderStateDesc}}</span>
      <span v-else>{{params.data.orderStateDesc}}</span>

      </div>`,
      methods: {}
    }
  },
  data () {
    const defaultFilter = {
      sellerId: "",
      validTimeRange: [],
      orderStateListCode: [],
      responsiblePersonId: '',
      airlineId: "",
      airlineName: "",
      customerId: "",
      customerName: "",
      operationId: "",
      operationName: "",
      mblNo: "",
      hblNo: "",
      orderStateList: "",
      receivableState: "",
      payableState: "",
      orderNo: "",
      podCode: "",
      polCode: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null,
      lockOrderState: ""
    };
    return {
      orderLockStateList: [
        { "label": "未锁单", "value": 0 },
        { "label": "调整中", "value": 30 },
        { "label": "已调整", "value": 40 },
        { "label": "已锁单", "value": 50 }
      ],
      cancellation: {
        cancelReasonType: ""
      },
      cancellationList: [{
        value: '10',
        label: this.$t('air.priceProblem')
      }, {
        value: '20',
        label: this.$t('air.deliveryTimeProblem')
      }, {
        value: '30',
        label: this.$t('air.shippingSpaceProblem')
      }, {
        value: '99',
        label: this.$t('air.otherProblem')
      }],
      exportTemplates: [{
        code: "charge",
        chineseName: this.$t('air.charge')
      }, {
        code: "business",
        chineseName: this.$t('air.business')
      }], // 导出的下拉
      salesList: [],
      reportDialog: {
        // 打印报表对话框
        isShow: false,
        typeCode: "",
        data: {
          jobId: "",
          assistInfo: "",
          definedInfo: "",
          entityIdList: [],
          remark: ""
        }
      },
      bookingVisible: false,
      shippingSpaceVisible: false,
      atdFormVisible: false,
      ataFormVisible: false,
      takeDeliveryVisible: false,
      cancellationOfOrderVisible: false,
      exitCustomsVisible: false,
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
      total: 0,
      // table end,
      airStateList: [{
        name: this.$t('air.all'),
        value: '',
        active: false
      }, {
        name: this.$t('air.haveInHand'),
        value: '0,3,4,5,10,30,40,50,60',
        active: true
      }, {
        name: this.$t('air.completed'),
        value: '95',
        active: false
      }, {
        name: this.$t('air.cancelled'),
        value: '99,100',
        active: false
      }
      ]

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
  async created () {
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
        field: "productAirlineName",
        headerName: this.$t('air.productLine'),
        minWidth: 130
      },
      {
        field: "blModeDesc",
        headerName: this.$t('air.blModeDesc'),
        minWidth: 90
      },
      {
        field: "mblNo",
        headerName: this.$t('air.mblNoName'),
        minWidth: 130
      }, {
        field: "hblNo",
        headerName: this.$t('air.hblNoName'),
        minWidth: 130
      }, {
        field: "orderStateDesc",
        headerName: this.$t('air.orderStateDesc'),
        minWidth: 100,
        cellRendererFramework: 'orderStateTem'
      },
      {
        field: "customerName",
        headerName: this.$t('air.customerName'),
        minWidth: 250
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
        field: "airlineScacCode",
        headerName: this.$t('air.airlineName'),
        minWidth: 90
      }, {
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
      }, {
        field: "flightNo",
        headerName: this.$t('air.flightNo'),
        minWidth: 100
      }, {
        field: "etd",
        headerName: "ETD",
        minWidth: 130
      }, {
        field: "atd",
        headerName: "ATD",
        minWidth: 130
      }, {
        field: "eta",
        headerName: "ETA",
        minWidth: 130
      }, {
        field: "ata",
        headerName: "ATA",
        minWidth: 130
      }, {
        field: "cancelReasonTypeDesc",
        headerName: this.$t('air.cancellationReason'),
        minWidth: 130
      },
      {
        field: "sellerName",
        headerName: this.$t('air.ownedSales'),
        minWidth: 100
      },
      {
        field: "operationName",
        headerName: this.$t('air.operationalStaff'),
        minWidth: 100
      },
      { 
        headerName: this.$t('air.orderLockStateName'), 
        field: 'lockOrderStateDesc', 
        minWidth: 100 
      },
      {
        field: "createByName",
        headerName: this.$t('air.createByName'),
        minWidth: 100
      },
      {
        field: "createTime",
        headerName: this.$t('air.createTime'),
        // cellRenderer: params => this.formatDate(params.value),
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
        // cellRenderer: params => this.formatDate(params.value),
        minWidth: 130
      },
      {
        headerName: this.$t("air.operating"),
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 250
      }
    ]
    this.userInfo = await getUserInfo()
    this.filter.operationName = this.userInfo.chineseName
    this.filter.operationId = this.userInfo.id
    console.log('this.userInfo,', this.userInfo)
    this.airExportCreateByList();
    // 初始化ETD 当前时间-15,当前时间+15
    this.filter.orderStateListCode = "0,3,4,5,10,30,40,50,60".split(',')
    this.filter.validTimeRange = [this.calculateDay(15, new Date(), 2), this.calculateDay(15, new Date(), 1)]
    this.list()

  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'AirOrderManagement') {
        this.list();
      }
    }
  },
  methods: {
    changeStage () {
      this.airStateList = [{
        name: this.$t('air.all'),
        value: '',
        active: false
      }, {
        name: this.$t('air.haveInHand'),
        value: '0,3,4,5,10,30,40,50,60',
        active: false
      }, {
        name: this.$t('air.completed'),
        value: '95',
        active: false
      }, {
        name: this.$t('air.cancelled'),
        value: '99,100',
        active: false
      }
      ]
      this.list()
    },
    toFilterByDateRange (lineCode, index) {
      this.airStateList.map((item, i) => {
        if (index === i) {
          item.active = true
        } else {
          item.active = false
        }
      })
      console.log(lineCode, lineCode.split(','))
      this.filter.orderStateListCode = lineCode.split(',')
      console.log(999, this.filter.orderStateListCode)
      this.list()
    },
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
    async exportFn (code) {
      if (this.$isNotEmpty(this.filter.validTimeRange)) {
        this.filter.etdStart = this.filter.validTimeRange[0];
        this.filter.etdEnd = this.calculateDay(0, new Date(this.filter.validTimeRange[1]), 1);
      } else {
        this.$message.warning(this.$t('air.exportWarmETD'))
        this.$refs.popoverRef.doToggle()
        return
      }
      this.filter.exportCode = code
      const res = await exportAirOrderExportApi(this.filter)
      if (res && res.ok) {
        this.$message.success(this.$t('air.exportTaskSuccess'))
        this.$refs.popoverRef.doToggle()
      }
    },
    copyOrder (id) {
      this.$router.push({ name: `AirOrderManagementEdit`, query: { id, type: 'copy' } });
    },
    /**
 * 新增编辑页面
 */
    edit (id) {
      this.$router.push({ name: `AirOrderManagementEdit`, query: { id } });
    },
    showDetailFn (row) {
      this.$router.push({
        name: `AirOrderManagementOrderDetail`,
        query: { id: row.data.id }
      });
    },
    takeDelivery (row) {
      this.activeRow = row;
      this.takeDeliveryVisible = true;
    },
    cancellationOfOrder (row) {
      this.activeRow = row;
      if (this.activeRow.receivableState !== 10 || this.activeRow.payableState !== 10) {
        this.$message.warning(this.$t('air.cancellationOfOrderWarm'));
        return
      }
      this.cancellation.cancelReasonType = ""

      this.cancellationOfOrderVisible = true;
    },
    // 退关
    exitCustoms (row) {
      this.activeRow = row;
      this.exitCustomsVisible = true;
    },
    bookingFn (row) {
      this.activeRow = row;
      this.bookingVisible = true;
      bookingAirExportOrderApi(row.id).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t('air.bookingSuccessfulEnd'));
          this.list();
        }
      });
    },
    airExportCreateByList () {

      getCustomerAirExportCreate().then(res => {
        if (res && res.ok) {
          this.createByList = res.content;
        }
      });

      getSalesListApi().then(res => {
        if (res && res.ok) {
          this.salesList = res.content;
        }
      });

    },

    bookingFile () {
      this.bookingVisible = false;
      // 根据查询条件进行批量打印
      this.reportDialog.typeCode = "AIR_BOOKING";
      this.reportDialog.data = {
        jobId: this.activeRow.jobId,
        entityIdList: [this.activeRow.id]
      };
      // this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
      this.reportDialog.isShow = true;
    },
    setCustomerInfo (customer) {
      this.filter.customerId = customer.id;
      this.filter.customerName = customer.chineseName;
      this.list();
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
    // 运营人员
    setOperationalByInfo (createBy) {
      this.filter.operationId = createBy.id;
      this.filter.operationName = createBy.chineseName;
      this.list();
    },
    reset () {
      this.filter = this.$extends({}, this.defaultFilter);
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
    submitDeliveryFn () {
      this.takeDeliveryVisible = false;
      deliveryAirExportOrderListApi(this.activeRow.id).then(res => {
        if (res && res.ok) {
          this.list();
          this.$message.success(this.$t('air.successfulEnd'));
        }
      });
    },
    submitCancellationOfOrderFn () {
      this.$refs.cancellationForm.validate(valid => {
        if (valid) {
          this.cancellationOfOrderVisible = false;
          let param = {
            "id": this.activeRow.id,
            "cancelReasonType": this.cancellation.cancelReasonType
          }
          // 取消接口
          cancelAirExportApi(param).then(res => {
            if (res && res.ok) {
              this.list();
              this.$message.success(this.$t('air.cancellationOfOrderEnd'));
            }
          });
        }
      })


    },
    submitExitCustomsVisibleFn () {
      this.exitCustomsVisible = false;
      // 退关接口
      shoutoutsAirExportApi(this.activeRow.id).then(res => {
        if (res && res.ok) {
          this.list();
          this.$message.success(this.$t('air.exitCustomsEnd'));
        }
      });
    },
    atdFn () {
      this.getSelectData()
      if (this.selectedIds.length <= 0) {
        this.$message.warning(this.$t('air.PleaseSelectARowFirst'));
        return;
      }
      this.atdFormVisible = true;
    },
    atdClose () {
      this.atdFormVisible = false;
    },
    ataFn () {
      this.getSelectData()
      if (this.selectedIds.length <= 0) {
        this.$message.warning(this.$t('air.PleaseSelectARowFirst'));
        return;
      }
      this.ataFormVisible = true;
    },
    ataClose () {
      this.ataFormVisible = false;
    },

    changeShippingSpace () {
      this.getSelectData()
      if (this.selectedIds.length <= 0) {
        this.$message.warning(this.$t('air.PleaseSelectARowFirst'));
        return;
      }
      let CAN = true;
      this.multipleSelection.forEach(function (v) {
        if (v.orderState === 95 || v.orderState === 100) {
          CAN = false;
        }
      });
      if (!CAN) {
        this.$message.warning(this.$t('air.matchBatchErrorTipByStatus'));
        return;
      }
      if (this.selectedIds.length === 1 && this.multipleSelection[0].businessLockState === true) {
        this.$message.warning(
          this.$t('air.matchBatchErrorTipByPol2AndPodAndFlightNo')
        );
        return;
      }
      if (this.selectedIds.length > 1) {
        // 装货港、卸货港、航班号
        let podCode = this.multipleSelection[0].podCode;
        let polCode = this.multipleSelection[0].polCode;
        let flightNo = this.multipleSelection[0].flightNo;
        let flag = true;
        this.multipleSelection.forEach(function (v) {
          if (
            v.podCode !== podCode ||
            v.polCode !== polCode ||
            v.flightNo !== flightNo ||
            v.businessLockState === true
          ) {
            flag = false;
          }
        });
        if (!flag) {
          this.$message.warning(
            this.$t('air.matchBatchErrorTipByPol2AndPodAndFlightNo')
          );
          return;
        }
      }
      this.shippingSpaceVisible = true;
    },
    shippingSpaceClose () {
      this.shippingSpaceVisible = false;
    },

    mergeFn () {
      this.getSelectData()
      if (this.selectedIds.length <= 1) {
        this.$message.warning(this.$t('air.mergeWarm'));
        return;
      }

      // 起运港”“卸货港”“航班号”“航空公司”“订舱代理”
      let podCode = this.multipleSelection[0].podCode;
      let polCode = this.multipleSelection[0].polCode;
      let flightNo = this.multipleSelection[0].flightNo;
      let airlineId = this.multipleSelection[0].airlineId;
      let bookingAgentId = this.multipleSelection[0].bookingAgentId;
      let flag = true;
      let dF = true;
      this.multipleSelection.forEach(function (v) {
        if (v.blMode === 1) {
          dF = false;
        }
        if (
          v.podCode !== podCode ||
          v.polCode !== polCode ||
          v.flightNo !== flightNo ||
          v.airlineId !== airlineId ||
          v.bookingAgentId !== bookingAgentId && v.mblNo
        ) {
          flag = false;
        }
      });

      if (!dF) {
        this.$message.warning(
          this.$t('air.mergeWarm2')
        );
        return;
      }

      if (!flag) {
        this.$message.warning(this.$t('air.mergeWarm3'));
        return;
      }

      updateAirExportOrderMergeApi(this.selectedIds).then(res => {
        if (res && res.ok) {
          this.list();
          this.$message.success(this.$t('air.mergeSuccess'));
        }
      });
    },

    simSearch () {
      this.filter.validTimeRange = []
      this.list();
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
      let orderStateListStr = ''
      if (this.filter.orderStateListCode.length > 0) {
        this.filter.orderStateListCode.forEach(element => {
          if (element) {
            element = element + ','
            orderStateListStr += element
          }
        });
      }
      this.filter.orderStateList = orderStateListStr.substring(0, orderStateListStr.length - 1)
      const res = await getAirExportOrderListApi(this.filter)
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

            if (v.shippingSpaceType === 3) {
              // 代理舱位时产品航线名称默认显示为【外配】
              v.productAirlineName = this.$t('air.matchsOutside')
            } else if (v.shippingSpaceType === 4) {
              v.productAirlineName = this.$t('air.bellyhold')
            } else if (v.shippingSpaceType === null) {
              v.productAirlineName = ""
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
