<template>
  <div v-loading="loading" style="padding: 10px;" class="app-main-inner">

    <div class="app-main-inner-row search-bar search-item-row"
      style="padding-top: 5px !important; padding-bottom: 5px !important">
      <div class="search-bar-left" style="padding-left: 0px">
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
            <el-form-item :label="$t('seaQuotationExport.quotationNo')">
              <el-input v-model.trim="filter.quotationNo" maxlength="50" size="mini" clearable
                @keyup.enter.native="list" />
            </el-form-item>

            <el-form-item :label="$t('seaQuotationExport.sourceOrderNo')">
              <el-input v-model.trim="filter.sourceOrderNo" maxlength="50" size="mini" clearable
                @keyup.enter.native="list" />
            </el-form-item>

            <el-form-item :label="$t('seaQuotationExport.pol')">
              <type-select v-model="filter.polCode" type="seaport" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('seaQuotationExport.pod')">
              <type-select v-model="filter.podCode" type="seaport" @selected="list" clearable />
            </el-form-item>

            <el-form-item :label="$t('seaQuotationExport.quotationState')">
              <el-select v-model="filter.quotationState" :placeholder="$t('seaQuotationExport.placeholder')" size="mini"
                clearable @change="list">
                <el-option :label="$t('seaQuotationExport.all')" value=""></el-option>
                <el-option :label="$t('seaQuotationExport.waitMatch')" value="10"></el-option>
                <el-option :label="$t('seaQuotationExport.matchProcessing')" value="20"></el-option>
                <el-option :label="$t('seaQuotationExport.notMatch')" value="30"></el-option>
                <el-option :label="$t('seaQuotationExport.matched')" value="40"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('seaQuotationExport.pushState')">
              <el-select v-model="filter.pushState" :placeholder="$t('seaQuotationExport.placeholder')" size="mini"
                clearable @change="list">
                <el-option :label="$t('seaQuotationExport.all')" value=""></el-option>
                <el-option :label="$t('seaQuotationExport.unpushed')" value="10"></el-option>
                <el-option :label="$t('seaQuotationExport.push')" value="20"></el-option>
                <el-option :label="$t('seaQuotationExport.pushSuccess')" value="30"></el-option>
                <el-option :label="$t('seaQuotationExport.pushFailure')" value="40"></el-option>
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

    <el-dialog :title="$t('seaQuotationExport.orderLabelUpd')" :visible.sync="orderLabelTypeVisible" width="400px">
      <div>
        <el-form ref="orderLabelTypeForm" :model="orderLabelFrom" label-width="95px" label-position="left"
          style="margin-top: -5px;">
          <el-form-item :label="$t('seaQuotationExport.orderLabelType')" prop="orderLabelType">
            <el-select v-model="orderLabelFrom.orderLabelType" clearable multiple size="mini">
              <el-option v-for="item in orderLabelTypeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderLabelTypeVisible = false" size="mini">{{ $t('seaQuotationExport.cancel') }}</el-button>
        <el-button type="primary" @click="submitOrderLabelTypFn" size="mini">{{ $t('seaQuotationExport.determine')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  getSeaQuotationExportListApi, systemRetryPushSeaQuotationExportApi, updOrderLabelTypeSeaQuotationExportApi
} from "@/api/seaQuotationExport";
import { getSalesListApi } from "@/api/partner/customerManage";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";

import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: "SeaQuotationExportList",
  components: {
    AgGridVue,
    topSearchItems,

    cargoLimitedSelect,
    'operating': {
      template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.view(params)" 
        v-permission="['sea:quotation:export:view']"
        >
          {{params.context.componentParent.$t('seaQuotationExport.view')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.updOrderLabelTypeFn(params)" 
        v-permission="['sea:quotation:export:orderLabelType']"
        >
          {{params.context.componentParent.$t('seaQuotationExport.orderLabel')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.quoteFn(params)" 
        v-if="params.data.quoteState === 10 && (params.data.quotationState === 10 || params.data.quotationState === 30)" v-permission="['sea:quotation:export:quote']">
          {{params.context.componentParent.$t('seaQuotationExport.quote')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.retryPushFn(params)" 
        v-if="params.data.pushState === 40" v-permission="['sea:quotation:export:retryPush']">
          {{params.context.componentParent.$t('seaQuotationExport.retryPush')}}
        </el-button>
      </span>
      `,
      methods: {

      }
    },
    'quoteStateTem': {
      template: `
      <div class="status-text ">
      <span v-if="params.data.quoteState===10 " style="color: #027BF0">
        {{params.data.quoteStateDesc}}
      </span>
      <span v-else-if="params.data.quoteState===15" style="color:#8400FF">{{params.data.quoteStateDesc}}</span>
      <span v-else-if="params.data.quoteState===20" style="color:#02830F">{{params.data.quoteStateDesc}}</span>
      <span v-else-if="params.data.quoteState===30" style="color:#AAAAAA">{{params.data.quoteStateDesc}}</span>
      <span v-else-if="params.data.quoteState===40" style="color:#D9001B">{{params.data.quoteStateDesc}}</span>
      <span v-else>{{params.data.quoteStateDesc}}</span>
      </div>`,
      methods: {}
    },
    'quotationStateTem': {
      template: `
      <div class="status-text ">
      <span v-if="params.data.quotationState===10 " style="color: #027BF0">
        {{params.data.quotationStateDesc}}
      </span>
      <span v-else-if="params.data.quotationState===20" style="color:#F59A23">{{params.data.quotationStateDesc}}</span>
      <span v-else-if="params.data.quotationState===30" style="color:#D9001B">{{params.data.quotationStateDesc}}</span>
      <span v-else-if="params.data.quotationState===40" style="color:#02830F">{{params.data.quotationStateDesc}}</span>
      <span v-else>{{params.data.quotationStateDesc}}</span>
      </div>`,
      methods: {}
    },
    'pushStateTem': {
      template: `
      <div class="status-text ">
      <span v-if="params.data.pushState===10 " style="color: #027BF0">
        {{params.data.pushStateDesc}}
      </span>
      <span v-else-if="params.data.pushState===20" style="color:#F59A23">{{params.data.pushStateDesc}}</span>
      <span v-else-if="params.data.pushState===30" style="color:#02830F">{{params.data.pushStateDesc}}</span>
      <span v-else-if="params.data.pushState===40" style="color:#D9001B">{{params.data.pushStateDesc}}</span>
      <span v-else>{{params.data.pushStateDesc}}</span>
      </div>`,
      methods: {}
    }
  },
  data () {
    const defaultFilter = {
      quotationNo: "",
      sourceOrderNo: "",
      polCode: "",
      podCode: "",
      quoteState: 10,
      quotationState: "",
      pushState: "",
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      orderLabelTypeVisible: false,
      orderLabelFrom: {
        orderLabelType: []
      },
      orderLabelTypeList: [{
        value: '1',
        label: this.$t('seaQuotationExport.secondaryInquiryOrder')
      }, {
        value: '2',
        label: this.$t('seaQuotationExport.inquiryAndAcceptanceOrder')
      }],
      takeDeliveryVisible: false,

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
      stateList: [{
        name: this.$t('seaQuotationExport.all'),
        value: '',
        active: false
      }, {
        name: this.$t('seaQuotationExport.waitQuoted'),
        value: '10',
        active: true
      }, {
        name: this.$t('seaQuotationExport.quotedProcessing'),
        value: '15',
        active: false
      }, {
        name: this.$t('seaQuotationExport.completeQuote'),
        value: '20',
        active: false
      }, {
        name: this.$t('seaQuotationExport.customerCanceled'),
        value: '30',
        active: false
      }, {
        name: this.$t('seaQuotationExport.notQuoted'),
        value: '40',
        active: false
      }
      ]
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'SeaQuotationExportList') {
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
        field: "quotationNo",
        headerName: this.$t("seaQuotationExport.quotationNo"),
        minWidth: 100
      },
      {
        field: "sourceOrderNo",
        headerName: this.$t("seaQuotationExport.sourceOrderNo"),
        minWidth: 130
      },
      {
        field: "polCode",
        headerName: this.$t("seaQuotationExport.pol"),
        minWidth: 100
      },

      {
        field: "podCode",
        headerName: this.$t('seaQuotationExport.pod'),
        minWidth: 80
      },
      {
        field: "ctnInfoDesc",
        headerName: this.$t('seaQuotationExport.ctnInfo'),
        minWidth: 80
      },
      {
        field: "targetPrice",
        headerName: this.$t('seaQuotationExport.targetPrice'),
        minWidth: 80
      },
      {
        field: "transportTermCode",
        headerName: this.$t('seaQuotationExport.transportTerm'),
        minWidth: 80
      },
      {
        field: "deliveryTime",
        headerName: this.$t('seaQuotationExport.deliveryTime'),
        minWidth: 80
      }, {
        field: "inquiryTime",
        headerName: this.$t("seaQuotationExport.inquiryTime"),
        minWidth: 100
      }, {
        field: "quoteStateDesc",
        headerName: this.$t("seaQuotationExport.quoteState"),
        minWidth: 100,
        cellRendererFramework: 'quoteStateTem'
      }, {
        field: "quotationStateDesc",
        headerName: this.$t("seaQuotationExport.quotationState"),
        minWidth: 100,
        cellRendererFramework: 'quotationStateTem'

      }, {
        field: "pushStateDesc",
        headerName: this.$t("seaQuotationExport.pushState"),
        minWidth: 100,
        cellRendererFramework: 'pushStateTem'

      },
      {
        field: "dataSourceDesc",
        headerName: this.$t("seaQuotationExport.dataSource"),
        minWidth: 100
      },
      {
        field: "orderLabelTypeDesc",
        headerName: this.$t("seaQuotationExport.orderLabelType"),
        minWidth: 140,
        cellRenderer (params) {
          return `<span title="${params.value}">${params.value}</span>`
        }
      },
      {
        field: "id",
        headerName: this.$t("air.operating"),
        cellRendererFramework: "operating",
        pinned: 'right',
        minWidth: 170
      }
    ]
    this.list()

  },

  methods: {
    toFilterByDateRange (lineCode, index) {
      this.stateList.map((item, i) => {
        if (index === i) {
          item.active = true
        } else {
          item.active = false
        }
      })
      this.filter.quoteState = lineCode
      this.list()
    },
    reset () {
      this.filter = this.$extends({}, this.defaultFilter);
      this.stateList = [{
        name: this.$t('seaQuotationExport.all'),
        value: '',
        active: false
      }, {
        name: this.$t('seaQuotationExport.waitQuoted'),
        value: '10',
        active: true
      }, {
        name: this.$t('seaQuotationExport.quotedProcessing'),
        value: '15',
        active: false
      }, {
        name: this.$t('seaQuotationExport.completeQuote'),
        value: '20',
        active: false
      }, {
        name: this.$t('seaQuotationExport.customerCanceled'),
        value: '30',
        active: false
      }, {
        name: this.$t('seaQuotationExport.notQuoted'),
        value: '40',
        active: false
      }
      ]
      this.list();
    },

    view (row) {
      this.$router.push({
        name: `SeaQuotationExportView`,
        query: { id: row.data.id }
      });
    },
    quoteFn (row) {
      this.$router.push({
        name: `SeaQuotationExportQuote`,
        query: { id: row.data.id }
      });
    },
    retryPushFn (row) {
      this.loading = true
      systemRetryPushSeaQuotationExportApi(row.data.quotationNo).then(res => {
        if (res && res.ok) {
          this.$message.success(this.$t("seaQuotationExport.retryPushSuccess"));
          this.list()
        }
        this.loading = false
      })
    },

    updOrderLabelTypeFn (row) {
      this.activeRow = row.data;
      if (this.$isEmpty(row.data.orderLabelType)) {
        this.orderLabelFrom.orderLabelType = []
      } else {
        this.orderLabelFrom.orderLabelType = row.data.orderLabelType.split(",")
      }
      this.orderLabelTypeVisible = true;
    },
    submitOrderLabelTypFn () {
      this.$refs.orderLabelTypeForm.validate(valid => {
        if (valid) {
          this.orderLabelTypeVisible = false;
          let param = {
            "id": this.activeRow.id,
            "orderLabelType": this.orderLabelFrom.orderLabelType.join(',')
          }
          // 标签更新
          updOrderLabelTypeSeaQuotationExportApi(this.activeRow.id, param).then(res => {
            if (res && res.ok) {
              this.list();
              this.$message.success(this.$t('seaQuotationExport.updSuccess'));
            }
          });
        }
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
      this.loading = true
      const res = await getSeaQuotationExportListApi(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.deliveryTime = parseTime(v.deliveryTime, '{y}-{m}-{d} {h}:{i}:{s}')
            v.inquiryTime = parseTime(v.inquiryTime, '{y}-{m}-{d} {h}:{i}:{s}')
            // 柜型柜量
            let ctnInfos = ""
            // let ctnInfoList = v.ctnInfo ? JSON.parse(v.ctnInfo) : []
            v.ctnInfoList.forEach(info => {
              ctnInfos += info.ctnTypeDesc + "*" + info.ctnCount + ","
            })
            v.ctnInfoDesc = ctnInfos.substring(0, ctnInfos.length - 1);

            v.transportTermCode = v.polTransportTermCode + "-" + v.podTransportTermCode
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
