<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressTrace.trackingNodeSegment")' prop="trackingNodeSegment">
              <el-select v-model="formData.trackingNodeSegment" clearable>
                <el-option v-for="item in trackingNodeSegmentList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.nodeName")' prop="nodeName">
              <el-input v-model="formData.nodeName" clearable :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.nodeCode")' prop="nodeCode">
              <el-input v-model="formData.nodeCode" clearable :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.forwardNecessary")' prop="forwardNecessary" label-width="120px">
              <el-select v-model="formData.forwardNecessary" clearable>
                <el-option v-for="item in judgementList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.abnormal")' prop="abnormal">
              <el-select v-model="formData.abnormal" clearable>
                <el-option v-for="item in judgementList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.descLabel")' prop="desc">
              <el-input style="width: 300px;" v-model="formData.desc" :placeholder="$t('uexpressTrace.localDescPlaceholder')" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="createTrace">{{$t("common.addBtn")}}</el-button>
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>
    <modify-dialog ref="modifyTrace" :visible.sync="showModifyDialog" :judgementList="judgementList" :loading.sync="loading" :trackingNodeSegmentList="trackingNodeSegmentList" @refreshData="list" />
  </div>
</template>

<script>
import { getStandNodeApi, getSegmentApi } from "@/api/uexpress/traceLine"
import { AgGridVue } from "ag-grid-vue"
import OptionBtn from "./OptionBtn"
import ModifyDialog from "./ModifyDialog"

export default {
  name: "TraceStandNode",
  components: {
    AgGridVue,
    OptionBtn,
    ModifyDialog
  },
  data() {
    return {
      formData: {
        trackingNodeSegment: null,
        nodeName: '',
        nodeCode: '',
        forwardNecessary: null,
        abnormal: null,
        desc: ''
      },
      trackingNodeSegmentList: [],
      judgementList: [
        {
          value: null,
          label: this.$t('common.all')
        },
        {
          value: true,
          label: this.$t('common.trueText')
        },
        {
          value: false,
          label: this.$t('common.falseText')
        }
      ],
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
      loading: false
    }
  },
  created() {
    this.columnFields = [
      {
        field: 'trackingNodeId',
        headerName: this.$t("uexpressTrace.seqNo"),
        minWidth: 80,
        cellRenderer: params => params.node ? Number(params.node.rowIndex) + 1 : ''
      },
      {
        field: "trackingNodeSegmentName",
        headerName: this.$t("uexpressTrace.trackingNodeSegment"),
        minWidth: 100
      },
      {
        field: "nodeName",
        headerName: this.$t("uexpressTrace.nodeName"),
        minWidth: 100
      },
      {
        field: "nodeCode",
        headerName: this.$t("uexpressTrace.nodeCode"),
        minWidth: 200
      },
      {
        field: "forwardNecessary",
        headerName: this.$t("uexpressTrace.forwardNecessary"),
        minWidth: 200,
        cellRenderer: params => {
          if (params.value === true || params.value === false) {
            return this.judgementList.filter(item => item.value === params.value)[0].label
          }
          return ""
        }
      },
      {
        field: "abnormal",
        headerName: this.$t("uexpressTrace.abnormal"),
        minWidth: 200,
        cellRenderer: params => {
          if (params.value === true || params.value === false) {
            return this.judgementList.filter(item => item.value === params.value)[0].label
          }
          return ""
        }
      },
      {
        field: "trackingNodeVisible",
        headerName: this.$t("uexpressTrace.trackingNodeVisibleName"),
        minWidth: 200,
        cellRenderer: params => {
          if (params.value === true || params.value === false) {
            return this.judgementList.filter(item => item.value === params.value)[0].label
          }
          return ""
        }
      },
      {
        field: "englishDesc",
        headerName: this.$t("uexpressTrace.englishDesc"),
        minWidth: 300
      },
      {
        field: "localDesc",
        headerName: this.$t("uexpressTrace.localDesc"),
        minWidth: 300
      },
      {
        field: "remarks",
        headerName: this.$t("common.remark"),
        minWidth: 300
      },
      {
        field: "updateTime",
        headerName: this.$t("uexpressTrace.updateTime"),
        minWidth: 300,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ""
      },
      {
        field: "updateByName",
        headerName: this.$t("uexpressTrace.updateByName"),
        minWidth: 200
      },
      {
        field: "trackingNodeId",
        pinned: 'right',
        headerName: this.$t("common.operation"),
        cellRendererFramework: "OptionBtn",
        cellRendererParams: {
          refreshData: this.list,
          modifyTrace: this.modifyTrace
        },
        minWidth: 100
      }
    ]
    this.list()
    this.getNodeSegment()
  },
  methods: {
    async getNodeSegment() {
      this.trackingNodeSegmentList = [{
        value: null,
        label: this.$t('common.all'),
        preffixCode: ''
      }]
      const res = await getSegmentApi()
      if (res.ok) {
        res.content.map(item => {
          this.trackingNodeSegmentList.push({
            value: item.code,
            label: item.name,
            preffixCode: item.nodePrefix
          })
        })
      }
    },
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
      const res = await getStandNodeApi(params)
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
    createTrace() {
      this.$refs.modifyTrace.init(null)
      this.showModifyDialog = true
    },
    modifyTrace(item) {
      this.$refs.modifyTrace.init(item)
      this.showModifyDialog = true
    },
    reset() {
      this.$refs.formData.resetFields()
      this.list()
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 0px;
}
</style>
