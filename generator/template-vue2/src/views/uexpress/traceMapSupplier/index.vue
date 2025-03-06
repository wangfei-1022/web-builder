<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressTrace.trackingChannelName")' prop="channelCode">
              <uexpress-type-select type="traceChannel" v-model="formData.channelCode" clearable filterable />
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.standTraceNode")' prop="standardNodeCode">
              <uexpress-type-select type="nodeDropdown" v-model="formData.standardNodeCode" clearable filterable />
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.replaceFlag")' prop="replaceFlag">
              <el-select v-model="formData.replaceFlag" clearable>
                <el-option v-for="item in replaceFlagList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.mappingInfo")' prop="mappingInfo">
              <el-input v-model="formData.mappingInfo" clearable :placeholder="$t('uexpressTrace.supportsBlurPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.sourceNodeCode")' prop="sourceNodeCode">
              <el-input v-model="formData.sourceNodeCode" clearable :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.sourceTrackingDesc")' prop="sourceDesc">
              <el-input v-model="formData.sourceDesc" clearable :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="createChannel">{{$t("common.addBtn")}}</el-button>
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>
    <modify-dialog ref="modifyMap" :replaceFlagList="replaceFlagList" :visible.sync="showModifyDialog" :loading.sync="loading" @refreshData="list" />
  </div>
</template>

<script>
import { getTraceMapApi } from "@/api/uexpress/traceLine";
import { AgGridVue } from "ag-grid-vue";
import OptionBtn from "./OptionBtn";
import ModifyDialog from "./ModifyDialog"

export default {
  name: "TraceMapSupplier",
  components: {
    AgGridVue,
    OptionBtn,
    ModifyDialog
  },
  data() {
    return {
      formData: {
        channelCode: null,
        standardNodeCode: '',
        replaceFlag: null,
        mappingInfo: '',
        sourceNodeCode: '',
        sourceDesc: ''
      },
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
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
      showModifyDialog: false,
      loading: false,
      replaceFlagList: [
        {
          value: null,
          label: this.$t('common.all')
        },
        {
          value: false,
          label: this.$t('common.falseText')
        },
        {
          value: true,
          label: this.$t('common.trueText')
        }
      ]
    }
  },
  created() {
    this.columnFields = [
      {
        field: 'mappingId',
        headerName: this.$t("uexpressTrace.seqNo"),
        minWidth: 80,
        cellRenderer: params => params.node ? Number(params.node.rowIndex) + 1 : ''
      },
      {
        field: "sourceNodeCode",
        headerName: this.$t("uexpressTrace.sourceNodeCode"),
        minWidth: 200
      },
      {
        field: "standardNodeCode",
        headerName: this.$t("uexpressTrace.standardNodeCode"),
        minWidth: 200
      },
      {
        field: "standardNodeName",
        headerName: this.$t("uexpressTrace.standardNodeName"),
        minWidth: 200
      },
      {
        field: "channelName",
        headerName: this.$t("uexpressTrace.channelName"),
        minWidth: 200
      },
      {
        field: "sourceDesc",
        headerName: this.$t("uexpressTrace.sourceTrackingDesc"),
        minWidth: 300
      },
      {
        field: "replaceFlag",
        headerName: this.$t("uexpressTrace.replaceFlag"),
        minWidth: 100,
        cellRenderer: params => {
          if (params.value === true || params.value === false) {
            return this.replaceFlagList.filter(item => item.value === params.value)[0].label
          }
          return ''
        }
      },
      {
        field: "targetDesc",
        headerName: this.$t("uexpressTrace.targetDesc"),
        minWidth: 200
      },
      {
        field: "descRuleDtos",
        headerName: this.$t("uexpressTrace.mappingInfo"),
        minWidth: 200,
        autoHeight: true,
        cellRenderer: params => {
          let str = ''
          params.value.map(item => {
            str += `${params.data.descMappingRelationName}${item.trackingMappingOperatorName}: ${item.mappingValue} <br />`
          })
          return str
        }
      },
      {
        field: "remarks",
        headerName: this.$t("common.remark"),
        minWidth: 240
      },
      {
        field: "updateByName",
        headerName: this.$t("uexpressTrace.updateByName"),
        minWidth: 100
      },
      {
        field: "updateTime",
        headerName: this.$t("uexpressTrace.updateTime"),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ""
      },
      {
        field: "mappingId",
        pinned: 'right',
        headerName: this.$t("common.operation"),
        cellRendererFramework: "OptionBtn",
        cellRendererParams: {
          refreshData: this.list,
          modifyMap: this.modifyMap
        },
        minWidth: 100
      }
    ]
    this.list()
  },
  methods: {
    onReady(params) {
      params.api.sizeColumnsToFit()
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit()
        })
      })
    },
    async list() {
      this.loading = true
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      const res = await getTraceMapApi(params)
      if (res.ok) {
        this.total = parseInt(res.content.total, 10)
        this.dataList = res.content.list
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false
    },
    // exportList() {
    //   console.log('Export list')
    // },
    createChannel() {
      this.$refs.modifyMap.init(null)
      this.showModifyDialog = true
    },
    modifyMap(item) {
      this.$refs.modifyMap.init(item)
      this.showModifyDialog = true
    },
    reset() {
      this.$refs.formData.resetFields()
      this.list()
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 0px;
}
</style>
