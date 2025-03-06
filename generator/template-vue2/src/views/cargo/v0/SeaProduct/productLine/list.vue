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

            <el-form-item :label="$t('seaProduct.state')">
              <el-select v-model="filter.state" :placeholder="$t('seaProduct.placeholder')" size="mini" clearable
                @change="list">
                <el-option :label="$t('seaProduct.all')" value=""></el-option>
                <el-option :label="$t('seaProduct.draft')" value="10"></el-option>
                <el-option :label="$t('seaProduct.published')" value="20"></el-option>
                <el-option :label="$t('seaProduct.soldOut')" value="30"></el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="top-btn-wrap"
      style="display: flex; justify-content: space-between; background-color: #f5f7f7; padding: 8px;border-bottom:5px solid #fff">
      <div class="mb-10 top-btn-wrap">
        <el-button type="primary" size="mini" @click="addFn()" v-permission="['sea:productLine:add']">
          {{ $t('seaProduct.productLineAdd') }}
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
    <edit :visible.sync="editFormVisible" @refresh="list" @close="editClose" :orderId="selectedEditId"></edit>
    <detail :visible.sync="viewFormVisible" @refresh="list" @close="viewClose" :orderId="selectedEditId"></detail>

  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

import { getGridSelected } from "@/utils/gridChoose"

import topSearchItems from "@/components/Cargo/Common/topSearchItems";
import {
  getSeaProductLineListApi, downShelfSeaProductLineApi, upShelfSeaProductLineApi
} from "@/api/seaProduct";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
import add from "./components/add";
import edit from "./components/edit";
import detail from "./components/detail";
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
  name: "SeaProductLineList",
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
        v-permission="['sea:productLine:view']"
        >
          {{params.context.componentParent.$t('seaProduct.view')}}
        </el-button>
        <el-button  type="text" size="mini" @click="params.context.componentParent.editFn(params)" 
        v-if="params.data.state === 10" v-permission="['sea:productLine:edit']">
          {{params.context.componentParent.$t('seaProduct.edit')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.publishedFn(params)" 
        v-if="params.data.state === 10" v-permission="['sea:productLine:publishedFn']">
          {{params.context.componentParent.$t('seaProduct.publishedFn')}}
        </el-button>

        <el-button  type="text" size="mini" @click="params.context.componentParent.soldOutFn(params)" 
        v-if="params.data.state === 20" v-permission="['sea:productLine:soldOutFn']">
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
      pageSize: 50,
      pageNum: 1,
      gridApi: null
    };
    return {
      addFormVisible: false,
      editFormVisible: false,
      viewFormVisible: false,
      selectedEditId: "",
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
      if (to.name === 'SeaProductLineList') {
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
        field: "productLineName",
        headerName: this.$t("seaProduct.subscriptionName"),
        minWidth: 100
      },
      {
        field: "transTypeDesc",
        headerName: this.$t("seaProduct.transType"),
        minWidth: 40
      },
      {
        field: "transitNumber",
        headerName: this.$t("seaProduct.transitNumber"),
        minWidth: 40
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
        field: "transitPortDesc",
        headerName: this.$t('seaProduct.transitPort'),
        minWidth: 80
      },
      {
        field: "transportModeDesc",
        headerName: this.$t('seaProduct.transportMode'),
        minWidth: 80
      },
      {
        field: "createByName",
        headerName: this.$t('seaProduct.createByName'),
        minWidth: 80
      },
      {
        field: "createTime",
        headerName: this.$t('seaProduct.createTime'),
        minWidth: 80
      },
      {
        field: "stateDesc",
        headerName: this.$t("seaProduct.state"),
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
    window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))

  },

  methods: {

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
      this.selectedEditId = row.data.id
      this.editFormVisible = true;
    },
    editClose () {
      this.editFormVisible = false;
    },

    viewFn (row) {
      this.selectedEditId = row.data.id
      this.viewFormVisible = true;
    },
    viewClose () {
      this.viewFormVisible = false;
    },

    publishedFn (row) {
      this.$confirm(this.$t('seaProduct.publishedFnTips'), this.$t('seaProduct.tips'), {
        confirmButtonText: this.$t('seaProduct.determine'),
        cancelButtonText: this.$t('seaProduct.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        upShelfSeaProductLineApi(row.data.id).then(res => {
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
        downShelfSeaProductLineApi(row.data.id).then(res => {
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
      this.loading = true
      const res = await getSeaProductLineListApi(this.filter)
      this.loading = false
      if (res.ok) {
        res.content.list.forEach(v => {
          try {
            v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            if (!v.transitNumber || v.transitNumber === 0) {
              v.transitNumber = "--"
            }
            let transJsonList = v.transJson ? JSON.parse(v.transJson) : []
            let transJson = ""
            transJsonList.forEach(tran => {
              transJson += tran.trans + ","
            })
            v.transitPortDesc = transJson
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
