<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getData" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label="`${$t('uexpressBox.boxNo')}: `" prop="boxNo">
              <el-input class='customer-input' v-model="formData.boxNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBox.podAreaCode')}: `" prop="countryCode">
              <base-select v-model="formData.countryCode" type="country" filterable clearable />
              <!-- <el-select v-model="formData.podAreaCode" filterable>
                <el-option v-for="item in podAreaList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" />
              </el-select> -->
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBox.channelCode')}: `" prop="channelCode">
              <el-select v-model="formData.channelCode" filterable>
                <el-option v-for="item in channelList" :key="item.channelCode" :label="item.englishName" :value="item.channelCode" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBox.channelSupplierId')}: `" prop="channelSupplierId">
              <TypeSelect v-model="formData.channelSupplierId"  type="supplier" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '17011'}" />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBox.boxState')}: `" prop="boxState">
              <el-select v-model="formData.boxState" @change="getData">
                <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBox.polCode')}: `" prop="polCode">
              <type-select v-model="formData.polCode" type="airport"  />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBox.podCode')}: `" prop="podCode">
              <type-select v-model="formData.podCode" type="airport"  />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="exportFn">{{ $t("uexpressBox.export") }}</el-button>
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getData" />
    </div>
  </div>
</template>

<script>
import URL from '@/api/urlTranslator'
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import BoxListOptionBtn from './components/BoxListOptionBtn'
import { getDictListApi } from '@/api/uexpress/orderManager'
import { getAllAreaProductApi, getAllChannelApi } from '@/api/uexpress/base'
import { getBoxListApi, getBoxExportApi } from '@/api/uexpress/boxManager'
import BoxNoComponent from "@/views/uexpress/boxManager/components/BoxNo";
import OutboundNoComponent from "@/views/uexpress/batchManager/components/OutboundNo";

export default {
  name: "UexpressBoxList",
  components: {
    cargoAdvanceSelect,
    BoxListOptionBtn,
    BoxNoComponent,
    OutboundNoComponent
  },
  data() {
    return {
      loading: false,
      url: URL,
      formData: {
        boxNo: '',
        countryCode: null,
        channelCode: null,
        channelSupplierId: null,
        boxState: null,
        polCode: null,
        podCode: null
      },
      pageSize: 50,
      pageNum: 0,
      total: 0,
      podAreaList: [],
      channelList: [],
      statusList: [],
      dataList: [],
      columnFields: null,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }
    }
  },
  created() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      enableRangeSelection: true, // 启用范围选择
      rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
      suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
    }

    this.columnFields = [
      {
        field: "boxNo",
        headerName: this.$t("uexpressBox.listLabel.boxNo"),
        minWidth: 160,
        cellRendererFramework: "BoxNoComponent"
      },
      {
        field: "outboundNo",
        headerName: this.$t("uexpressBox.listLabel.outboundNo"),
        minWidth: 130,
        cellRendererFramework: "OutboundNoComponent"
      },
      {
        field: "countries",
        headerName: this.$t("uexpressBatch.listLabel.destinationAreaName"),
        minWidth: 160,
        tooltip: params => {
          if (params.value) {
            let _arr = params.value.map(item => item.localShortName)
            return _arr.join(',')
          }
        },
        cellRenderer: params => {
          if (params.value) {
            let _arr = params.value.map(item => item.localShortName)
            return _arr.join(',')
          }
        }
      },
      {
        field: "channelNames",
        headerName: this.$t("uexpressBox.listLabel.channelNames"),
        minWidth: 200
      },
      {
        field: "channelSupplierName",
        headerName: this.$t("uexpressBox.listLabel.channelSupplierName"),
        minWidth: 200
      },
      {
        field: "parcelCount",
        headerName: this.$t("uexpressBox.listLabel.parcelCount"),
        minWidth: 120
      },
      {
        field: "boxStateName",
        headerName: this.$t("uexpressBox.listLabel.boxStateName"),
        minWidth: 120
      },
      {
        field: "weight",
        headerName: this.$t("uexpressBox.listLabel.weight"),
        minWidth: 120
      },
      {
        field: "boxWeight",
        headerName: this.$t("uexpressBox.listLabel.boxWeight"),
        minWidth: 160
      },
      {
        field: "dimension",
        headerName: this.$t("uexpressBox.listLabel.dimension"),
        minWidth: 200
      },
      {
        field: "createTime",
        headerName: this.$t("uexpressBox.listLabel.createTime"),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: "boxTime",
        headerName: this.$t("uexpressBox.listLabel.boxTime"),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: "outboundTime",
        headerName: this.$t("uexpressBox.listLabel.outboundTime"),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: "id",
        pinned: 'right',
        headerName: this.$t("common.operation"),
        cellRendererFramework: "BoxListOptionBtn",
        cellRendererParams: {refreshData: this.getData},
        minWidth: 160
      }
    ]

    this.getData()
    this.getBaseDataFn()
  },
  methods: {
    getBaseDataFn() {
      Promise.all([
        // getAllAreaProductApi(),
        getAllChannelApi(),
        getDictListApi(14)
      ]).then(results => {
        // 目的地下拉
        // const areaRes = results[0]
        // 渠道下拉
        // const channelRes = results[1]
        const channelRes = results[0]
        // 箱状态下拉
        // const dataListRes = results[2]
        const dataListRes = results[1]

        // if (areaRes && areaRes.ok) {
        //   this.podAreaList = areaRes.content
        //   this.podAreaList.unshift({
        //     areaName: this.$t('common.all'),
        //     areaCode: null
        //   })
        // }

        if (channelRes && channelRes.ok) {
          this.channelList = channelRes.content
          this.channelList.unshift({
            englishName: this.$t('common.all'),
            channelCode: null
          })
        }

        if (dataListRes && dataListRes.ok) {
          this.statusList = dataListRes.content
          this.statusList.unshift({
            name: this.$t('common.all'),
            code: null
          })
        }
      })
    },
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
     exportFn() {
      this.loading = true
      let params = {
        ...this.formData
      }
      getBoxExportApi(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressBox.exportSuccess'))
        }
        this.loading = false
      })
    },
    async getData() {
      this.loading = true
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      const res = await getBoxListApi(params)
      if (res && res.ok && res.content) {
        this.dataList = res.content.list
        this.total = Number(res.content.total)
      } else {
        this.dataList = []
        this.total = 0
      }
      this.loading = false
    },
    reset() {
      this.$refs.formData.resetFields();
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 0px;
}
.customer-input {
  width: 230px;
}
</style>
