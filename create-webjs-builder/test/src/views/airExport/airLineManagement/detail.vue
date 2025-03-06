<template>
  <div class="app">

    <div class="page-form">
      <div class="form-module-title ">
        <!--基础信息    -->
        <span>{{ $t('air.routeInformation') }}</span>

        <el-button style="margin-left:50px" type="primary" size="mini" @click="backToList">{{ $t('air.returnList')
        }}</el-button>

        <el-button style="margin-left:50px" type="primary" size="mini">{{ $t('air.exportTheLoadingPlan')
        }}</el-button>


      </div>
      <div class="form-module-item">
        <div class="item">
          <!--产品航线    -->
          <label>{{ $t('air.productLine') }}</label>
          <span>{{ order.productAirlineName }}</span>
        </div>
        <div class="item">
          <!--航班号   -->
          <label>{{ $t('air.flightNo') }}</label>
          <span>{{ order.flightNo }}</span>
        </div>
        <div class="item">
          <!--航班日期  -->
          <label>{{ $t('air.etd') }}</label>
          <span>{{ parseTime(order.etd) }}</span>
        </div>
        <div class="item">
          <!--考核基重 -->
          <label> {{ $t('air.assessmentBasisWeight') }} </label>
          <span>{{ order.assessWeight }}</span>
        </div>

        <div class="item">
          <!--总件数 -->
          <label> {{ $t('air.sumQuantity') }} </label>
          <span>{{ order.quantity }}</span>
        </div>
        <div class="item">
          <!--总毛重 -->
          <label> {{ $t('air.sumGrossWeight') }}</label>
          <span>{{ order.actualGrossWeight }}</span>
        </div>
        <div class="item">
          <!--总体积 -->
          <label>{{ $t('air.sumVolume') }}</label>
          <span>{{ order.actualVolume }}</span>
        </div>
        <div class="item">
          <!-- 理论体积  -->
          <label>{{ $t('air.theoryOfVolume') }}</label>
          <span>{{ order.theoryVolume }}</span>
        </div>

        <div class="item">
          <!-- 基重利用率  -->
          <label>{{ $t('air.baseWeightUtilization') }}</label>
          <span>{{ order.assessWeightRatio }}%</span>
        </div>
        <div class="item">
          <!-- 体积利用率  -->
          <label>{{ $t('air.volumeUtilizationRate') }}</label>
          <span>{{ order.theoryVolumeRatio }}%</span>
        </div>
        <div class="item">
          <!-- 板内板外  -->
          <label>{{ $t('air.palletSide') }}</label>
          <span>{{ order.palletSideName }}</span>
        </div>

      </div>

      <div class="form-module-title">
        <!-- 航线明细 -->
        <span>{{ $t('air.courseDetails') }}</span>
      </div>

      <div class="form-product-item">

        <div class="operate-buttons-left" style="padding: 0 0 10px 10px;">
          <el-button type="primary" size="mini" @click="toBathMatch()"
            v-permission="['air:order:export:modificationSpace']">
            {{ $t('air.batchShippingSpaceToMatch') }}
          </el-button>

          <!-- 起飞 -->
          <el-button type="primary" class="order-btn" size="mini" @click="atdFn"
            v-permission="['air:order:export:atd']">{{ $t('air.takeOff') }}</el-button>
        </div>


        <AgGridVue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :column-defs="columnDefs"
          :row-data="rowData" :enable-col-resize="true" :enable-sorting="true" :animate-rows="true" :grid-ready="onReady"
          :style="listGridStyle" class="ag-theme-balham" />
      </div>

    </div>
    <shipping-space @refresh="refreshFn" :visible="shippingSpaceVisible" @close="shippingSpaceClose" :order="selectData">
    </shipping-space>
    <atd @refresh="refreshFn" :visible="atdFormVisible" @close="atdClose" :orderIds="orderListIds"></atd>
    <batchShippingSpaceDialog @refresh="refreshFn" :visible="batchShippingSpaceVisible" @close="batchShippingSpaceClose"
      :orderIds="selectedIds" :spaceDTO="selectBathSpaceDTO">
    </batchShippingSpaceDialog>
  </div>
</template>
<script>
import shippingSpace from '../airOrderManagement/operation/shippingSpaceDialog'
import batchShippingSpaceDialog from './components/batchShippingSpaceDialog'
import atd from '../airOrderManagement/operation/atdDialog'

import { parseTime } from '@/utils/index'
import { AgGridVue } from 'ag-grid-vue'
import { getGridSelected } from "@/utils/gridChoose"
import {
  airFlightPlanDetail,
  getAirExportOrderDetailApi
} from "@/api/airExport";
export default {
  name: 'AirLineManagementDetail',
  components: {
    batchShippingSpaceDialog,
    shippingSpace,
    AgGridVue,
    atd,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" 
        v-if="params.data.businessLockState !== true"
        @click="params.context.componentParent.changeShippingSpace(params.data)">
        {{params.context.componentParent.$t('air.toMatch')}}
        </el-button>
      </span>
      `,
      methods: {

      }
    }
  },
  props: {
  },
  data () {
    const defaultFilter = {
      sellerId: "",
      validTimeRange: [],
      responsiblePersonId: '',
      airlineId: "",
      airlineName: "",
      customerId: "",
      customerName: "",
      mblNo: "",
      hblNo: "",
      orderState: "",
      receivableState: "",
      payableState: "",
      orderNo: "",
      podCode: "",
      polCode: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      selectBathSpaceDTO: {
        pol: "",
        polCode: "",
        podCode: "",
        pod: ""
      },
      orderListIds: [],
      atdFormVisible: false,
      order: {},
      selectData: {},
      selectedIds: [],
      multipleSelection: [],
      shippingSpaceVisible: false,
      batchShippingSpaceVisible: false,
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
      if (to.name === 'AirLineManagementDetail') {
        this.init()
      }
    }
  },
  computed: {
    dynamicHeightFactor () { // 用于动态计算列表高度
      let least = 430
      if (this.isShowingMoreSearchCondition) {
        least += document.querySelector('.more-search-condition').offsetHeight
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
        field: "customerName",
        headerName: this.$t('air.customer'),
        minWidth: 130
      },
      {
        field: "mblNo",
        headerName: this.$t('air.mblNoName'),
        minWidth: 130
      },
      {
        field: "hblNo",
        headerName: this.$t('air.hblNoName'),
        minWidth: 130
      }, {
        field: "receiptCode",
        headerName: this.$t('air.receipt'),
        minWidth: 90
      }, {
        field: "orderQuantity",
        headerName: this.$t('air.estimatedNumber'),
        minWidth: 90
      },
      {
        field: "orderGrossWeight",
        headerName: this.$t('air.estimatedGrossWeight'),
        minWidth: 90
      },
      {
        field: "orderVolume",
        headerName: this.$t('air.estimatedVolume'),
        minWidth: 90
      }, {
        field: "actualQuantity",
        headerName: this.$t('air.actualNumber'),
        minWidth: 90
      }, {
        field: "actualGrossWeight",
        headerName: this.$t('air.actualGrossWeight2'),
        minWidth: 90
      },
      {
        field: "actualVolume",
        headerName: this.$t('air.actualVolume2'),
        minWidth: 90
      },
      {
        field: "bookingReceivable",
        headerName: this.$t('air.joeBookPrices'),
        minWidth: 90
      },
      {
        field: "loadingPalletRemark",
        headerName: this.$t('air.packingPlateRemark'),
        minWidth: 150
      },
      {
        field: "cargoSize",
        headerName: this.$t('air.cargoSize'),
        minWidth: 90
      },
      {
        field: "inboundNo",
        headerName: this.$t('air.inboundNo'),
        minWidth: 90
      },
      {
        field: "handlingCode",
        headerName: this.$t('air.handlingCode'),
        minWidth: 90
      },
      {
        field: "sellerName",
        headerName: this.$t('air.salesperson'),
        minWidth: 90
      },
      {
        field: "createByName",
        headerName: this.$t('air.operationalStaff'),
        minWidth: 90
      },
      {
        headerName: this.$t("air.operating"),
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 80
      }
    ]

    this.init()

  },
  mounted () {

  },
  methods: {
    toBathMatch () {
      this.getSelectData()
      if (this.selectedIds.length <= 0) {
        this.$message.warning(this.$t('air.PleaseSelectARowFirst'));
        return;
      }
      console.log(22, this.multipleSelection)
      if (this.selectedIds.length >= 1) {
        // 装货港、卸货港
        let podCode = this.multipleSelection[0].podCode;
        let polCode = this.multipleSelection[0].polCode;
        let flagPodPol = true;
        let flag = true;
        this.multipleSelection.forEach(function (v) {
          if (
            v.businessLockState === true
          ) {
            flag = false;
          }
          if (
            v.podCode !== podCode ||
            v.polCode !== polCode
          ) {
            flagPodPol = false;
          }
        });
        if (!flag) {
          this.$message.warning(
            this.$t('air.etdBusinessLockState')
          );
          return;
        }
        if (!flagPodPol) {
          this.$message.warning(
            this.$t('air.matchBatchErrorTipByPol2AndPod')
          );
          return;
        }
      }

      this.selectBathSpaceDTO = {
        podCode: this.multipleSelection[0].podCode,
        pod: this.multipleSelection[0].pod,
        polCode: this.multipleSelection[0].polCode,
        pol: this.multipleSelection[0].pol
      }
      this.batchShippingSpaceVisible = true
    },
    changeShippingSpace (row) {

      getAirExportOrderDetailApi(row.id).then(res => {
        if (res && res.ok) {
          this.selectData = res.content
          this.shippingSpaceVisible = true
        }
      })

    },
    shippingSpaceClose () {
      this.shippingSpaceVisible = false
    },
    batchShippingSpaceClose () {
      this.batchShippingSpaceVisible = false
    },
    atdFn () {
      // 不用勾选，直接当前列表全部
      let ids = []
      this.rowData.forEach(function (v) {
        ids.push(v.id)
      });
      this.orderListIds = ids
      this.atdFormVisible = true
    },
    atdClose () {
      this.atdFormVisible = false
    },
    refreshFn () {
      this.init()
    },
    parseTime (value) {
      return parseTime(value, '{y}-{m}-{d} {h}:{i}')
    },
    backToList () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: `AirLineManagement` })
    },
    async init () {
      this.loading = true

      const res = await airFlightPlanDetail(this.$route.query.id)
      this.loading = false
      if (res.ok) {
        this.order = res.content
        if (this.order.palletSide === 1) {
          this.order.palletSideName = this.$t('air.inThePlate')
        } else if (this.order.palletSide === 2) {
          this.order.palletSideName = this.$t('air.offBoard')
        }
        res.content.airOrderList.forEach(v => {
          try {

            if (v.orderType === 2) {
              v.customerName = this.$t('air.smallBusiness')
            }
          } catch (e) {
            console.log(e)
          }
        })
        this.rowData = res.content.airOrderList
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

<style scoped lang="less">
.app {
  height: 100%;
  background: #f5f7fa;
}

.page-form {
  width: 100%;
  max-width: 1200px;
  min-width: 990px;
  padding: 20px 10px;
  background: #f5f7fa;
}

.form-module-title {
  font-size: 15px;
  margin-bottom: 10px;
  display: block;
  color: #1890ff;
  padding-left: 10px;
  border-left: 2px solid #1890ff;
  height: 28px;
  line-height: 28px;
}

.form-module-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    width: 25%;
    float: left;
    padding: 0 20px;
    margin-bottom: 15px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }
}

.form-product-item {
  overflow: hidden;
  padding: 20px;
  background: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px 0 #efefef, 0 0 6px 0 #efefef;

  .item {
    padding: 0 20px;
    margin-bottom: 15px;

    label {
      font-size: 14px;
      margin-right: 20px;
    }

    span {
      font-size: 12px;
    }
  }
}

.charge-list-data {
  margin: 20px 0;
}

.operation-btn {
  padding: 20px;
  text-align: right;
  background: #fff;
}

.order-btn {
  margin-left: 12px;
}

.shipping-info .item label {
  display: block;
  margin-bottom: 8px;
}

.shipping-info .item span {
  display: inline-block;
  min-height: 200px;
  width: 100%;
  border-radius: 5px;

  ::v-deep .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    font-size: 12px;
    color: #000;
  }
}

.dialog-footer {
  text-align: center;
}

.checkbox-width {
  width: 80px;
}

.checkbox-left {
  margin-left: 15px;
}
</style>
