<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
        <el-form-item :label="$t('air.airline')" prop="airline">
          <!-- <cargo-limited-select placeholder="" :method="airCustomerMethod" :select-label="formData.airlineName"
            :select-value="formData.airlineId" type="customer" style="width: 100%" @set="setAirCustomerInfo" clearable
            @change="list" /> -->

          <type-select placeholder="" v-model="formData.airlineName" type="airLine" style="width: 100%;"
            @selected="setAirCustomerInfo" clearable />
        </el-form-item>

        <!-- 产品模式-->
        <el-form-item :label="$t('air.productModel')" prop="productModel">
          <el-select v-model="formData.productModel" :placeholder="$t('air.placeholder')" size="mini"
            @change="productModelChange" clearable>
            <el-option :label="$t('air.charteredAirplane')" value="1"></el-option>
            <el-option :label="$t('air.wrapperSheet')" value="2"></el-option>
            <el-option :label="$t('air.packageQuantity')" value="3"></el-option>
            <el-option :label="$t('air.foreignPurchasing')" value="4"></el-option>
          </el-select>
        </el-form-item>

        <!-- 产品协议-->
        <el-form-item :label="$t('air.productAgreement')" prop="productAgreement">
          <el-select v-model="formData.productAgreement" :placeholder="$t('air.placeholder')" size="mini" @change="list"
            clearable>
            <el-option v-for="(item, index) in productAgreementList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <!-- 产品人员-->
        <el-form-item :label="$t('air.productPersonnel')" prop="productPersonnel">
          <el-select v-model="formData.managerId" :placeholder="$t('air.placeholder')" size="mini" @change="list"
            clearable>
            <el-option v-for="(item, index) in productPersonnelList" :key="index" :label="item.chineseName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">

        <el-button size="mini" type="primary" @click="add()" v-permission="['air:airProductLineManagement:add']">
          {{ $t('air.new') }}</el-button>
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs"
        :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true"
        :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>

    <el-dialog :title="$t('air.cancellation')" :visible.sync="cancellationVisible" width="400px">
      <div>
        {{ $t('air.cancellationTip') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancellationVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitCancellationFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('air.publish')" :visible.sync="publishVisible" width="400px">
      <div>
        {{ $t('air.publishTip') }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishVisible = false" size="mini">{{ $t('air.cancel') }}</el-button>
        <el-button type="primary" @click="submitPublishionFn" size="mini">{{ $t('air.determine') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  airProductAirlineList, putAirProductAirline, delAirProductAirline
} from "@/api/airExport";
import {
  getProductApi
} from "@/api/partner/base";
import optionBtn from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'
import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
export default {
  name: "AirProductLineManagement",
  components: {
    AgGridVue,
    cargoLimitedSelect,
    optionBtn,
    reportListDialog
  },
  data () {
    const defaultFilter = {
      productAgreement: "",
      productModel: "",
      airlineId: "",
      airlineName: "",
      managerId: ""
    };
    return {
      airCustomerMethod: airLineListApi,
      cancellationVisible: false,
      publishVisible: false,
      productAgreementList: [],
      productPersonnelList: [],
      selectId: "",
      formData: {
        productAgreement: "",
        productModel: "",
        airlineId: "",
        airlineName: ""
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
  watch: {
    '$route' (to, from) {
      if (to.name === 'AirProductLineManagement') {
        this.list();
      }
    }
  },
  created () {
    this.list()
    this.getBaseDataFn()
  },
  methods: {
    productModelChange (value) {
      this.formData.productAgreement = ""
      if (value === 1) {
        this.productAgreementList = [{
          label: this.$t('air.allFlights'),
          value: "1"
        }, {
          label: this.$t('air.quarterOfFlight'),
          value: "2"
        }, {
          label: this.$t('air.aSingleFlight'),
          value: "3"
        }]
      }
      if (value === 2 || value === 3) {
        this.productAgreementList = [{
          label: this.$t('air.fixedPrice'),
          value: "4"
        }, {
          label: this.$t('air.floatingPrices'),
          value: "5"
        }]
      }
      if (value === 4) {
        this.productAgreementList = [{
          label: this.$t('air.backToBackProtocol'),
          value: "6"
        }]
      }
      this.list();
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
        field: "productName",
        headerName: this.$t("air.productName"),
        minWidth: 150
      },
      {
        field: "airlineScacCode",
        headerName: this.$t("air.airline2"),
        minWidth: 100
      },
      {
        field: "productModel",
        headerName: this.$t('air.productModel'),
        minWidth: 100
      }, {
        field: "productAgreement",
        headerName: this.$t('air.productAgreement'),
        minWidth: 100
      }, {
        field: "productLine",
        headerName: this.$t("air.productLine2"),
        minWidth: 100
      }, {
        field: "managerName",
        headerName: this.$t("air.productPersonnel"),
        minWidth: 100
      },
      {
        field: "truckTransportationService",
        headerName: this.$t("air.cardTransferService"),
        minWidth: 100
      }, {
        field: "valueAddedService",
        headerName: this.$t("air.valueAddedServices"),
        minWidth: 100
      }, {
        field: "validity",
        headerName: this.$t("air.productIsValid"),
        minWidth: 180
      }, {
        field: "productStatusName",
        headerName: this.$t("air.status"),
        minWidth: 100
      }, {
        field: "id",
        headerName: this.$t("air.operating"),
        cellRendererFramework: "optionBtn",
        pinned: 'right',
        minWidth: 150
      }]
    },
    getBaseDataFn () {
      Promise.all([getProductApi()]).then(results => {
        const productPersonnel = results[0]
        if (productPersonnel.ok) {
          this.productPersonnelList = productPersonnel.content
        }
      })
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
      const _params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }


      const res = await airProductAirlineList(_params)
      if (res.ok) {
        this.total = parseInt(res.content.total, 10)

        res.content.list.forEach(v => {
          res.content.list.forEach(v => {
            try {
              switch (v.productModel) {
                case 1:
                  v.productModel = this.$t('air.charteredAirplane')
                  break
                case 2:
                  v.productModel = this.$t('air.wrapperSheet')
                  break
                case 3:
                  v.productModel = this.$t('air.packageQuantity')
                  break
                case 4:
                  v.productModel = this.$t('air.foreignPurchasing')
                  break
                default:
                  return
              }
              switch (v.productAgreement) {
                case 1:
                  v.productAgreement = this.$t('air.allFlights')
                  break
                case 2:
                  v.productAgreement = this.$t('air.quarterOfFlight')
                  break
                case 3:
                  v.productAgreement = this.$t('air.aSingleFlight')
                  break
                case 4:
                  v.productAgreement = this.$t('air.fixedPrice')
                  break
                case 5:
                  v.productAgreement = this.$t('air.floatingPrices')
                  break
                case 6:
                  v.productAgreement = this.$t('air.backToBackProtocol')
                  break
                default:
                  return
              }

              v.validityStart = parseTime(v.validityStart, '{y}-{m}-{d}')
              v.validityEnd = parseTime(v.validityEnd, '{y}-{m}-{d}')
              v.validity = v.validityStart + " - " + v.validityEnd

              v.productLine = v.polCode + " - " + v.podCode

              switch (v.productStatus) {
                case 1:
                  v.productStatusName = this.$t('air.toBeReleased')
                  break
                case 2:
                  v.productStatusName = this.$t('air.havePublished')
                  break
                case 3:
                  v.productStatusName = this.$t('air.haveBeenCancelled')
                  break
                default:
                  return
              }
              v.truckTransportationService = v.truckTransportationService === true ? this.$t('air.yes') : this.$t('air.no')
              v.valueAddedService = v.valueAddedService === true ? this.$t('air.yes') : this.$t('air.no')
            } catch (e) {
              console.log(e)
            }
          })
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
    reset () {
      this.formData = this.$extends({}, this.defaultFilter);
      this.list()
    },

    setAirCustomerInfo (customer) {
      this.formData.airlineId = customer.id;
      this.formData.airlineName = customer.chineseName;
      this.list();
    },
    add () {
      this.$router.push({ name: `AirProductLineManagementAdd` })
    },
    // 发布
    publish (item) {
      this.selectId = item.id
      this.publishVisible = true;
    },
    // 作废
    cancellation (item) {
      this.selectId = item.id
      this.cancellationVisible = true;
    },
    // 作废
    submitCancellationFn () {
      // 取消接口
      this.loading = true
      delAirProductAirline(this.selectId).then(res => {
        if (res && res.ok) {
          this.list();
          this.$message.success(this.$t('air.cancellationfully'));
        }
        this.loading = false
        this.cancellationVisible = false;
      });
    },
    // 发布
    submitPublishionFn () {
      this.loading = true
      putAirProductAirline(this.selectId).then(res => {
        if (res && res.ok) {
          this.list();
          this.$message.success(this.$t('air.publishSuccessfully'));
        }
        this.loading = false
        this.publishVisible = false;
      });
    },
    // 查看
    view (item) {
      this.$router.push({ name: `AirProductLineManagementDetail`, query: { id: item.id } })
    },
    // 复制
    copy (item) {
      this.$router.push({ name: `AirProductLineManagementAdd`, query: { id: item.id, type: 'copy' } });
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
