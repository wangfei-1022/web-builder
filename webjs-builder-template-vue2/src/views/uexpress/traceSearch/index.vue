<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item label="">
              <el-input v-trim :placeholder="$t('common.placeholder')" v-model="formData.orderNo" class="input-with-select" style="width: 440px;" clearable>
                <el-select v-model="orderTypeSelected" slot="prepend" style="width: 110px;">
                  <el-option v-for="item in orderTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="top-btn-wrap mt-10">
      <div class="member-item">
        <!-- <h3>{{$t('uexpressTrace.basicInfo')}}</h3> -->
        <el-row :gutter="20" class="info-row" v-if="result">
          <el-col :span="6">
            <span class="info-label">{{$t('uexpressTrace.orderNo')}}: </span>
            <el-tooltip class="item" effect="dark" :content="result.orderNo" placement="top">
              <span class="info-value">{{result.orderNo}}</span>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <span class="info-label">{{$t('uexpressTrace.channelOrderNo')}}: </span>
            <el-tooltip class="item" effect="dark" :content="result.channelOrderNo" placement="top">
              <span class="info-value">{{result.channelOrderNo}}</span>
            </el-tooltip>
          </el-col>
          <el-col :span="6">
            <span class="info-label">{{$t('uexpressTrace.memberOrderNo')}}: </span>
            <el-tooltip class="item" effect="dark" :content="result.memberOrderNo" placement="top">
              <span class="info-value">{{result.memberOrderNo}}</span>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="info-row" v-else>
          <el-col :span="6">
            <span class="info-label">{{$t('uexpressTrace.orderNo')}}: </span>
            <span class="info-value">--</span>
          </el-col>
          <el-col :span="6">
            <span class="info-label">{{$t('uexpressTrace.channelOrderNo')}}: </span>
            <span class="info-value">--</span>
          </el-col>
          <el-col :span="6">
            <span class="info-label">{{$t('uexpressTrace.memberOrderNo')}}: </span>
            <span class="info-value">--</span>
          </el-col>
        </el-row>
        <!-- <div class="empty" v-else>
          <el-empty :description="$t('uexpressTrace.emptyInfo')" :image-size="50" />
        </div> -->
      </div>
    </div>
    <div class="member-item mt-10">
      <h3>{{$t('uexpressTrace.traceDetail')}}</h3>
      <TraceSearchDetail :table-data="dataList" :height="tableHeight" />
      <!-- <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" /> -->
    </div>
  </div>
</template>

<script>
import { getTraceInfoApi } from "@/api/uexpress/traceLine"
import { AgGridVue } from "ag-grid-vue"
import TraceSearchDetail from './TraceSearchDetail'
export default {
  name: "TraceSearch",
  components: {
    AgGridVue,
    TraceSearchDetail
  },
  data() {
    return {
      formData: {
        orderNo: ''
      },
      orderTypeSelected: 0,
      result: null,
      dataList: [],
      // columnFields: [],
      // sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
      // gridOptions: {
      //   rowSelection: "multiple", // 设置多行可选
      //   animateRows: true,
      //   suppressRowClickSelection: true, // 选中单元格后可以复制内容
      //   context: {
      //     componentParent: this
      //   }
      // },
      loading: false,
      orderTypeList: [
        {
          name: this.$t('uexpressOrder.orderNo'),
          code: 0
        },
        {
          name: this.$t('uexpressOrder.channelOrderNo'),
          code: 1
        },
        {
          name: this.$t('uexpressOrder.memberOrderNo'),
          code: 2
        }
      ]
    }
  },
  created() {
    this.formData.orderNo = this.$route.query.orderNo
    if (this.formData.orderNo) {
      this.list()
    }
    // this.columnFields = [
    //   {
    //     field: 'orderId',
    //     headerName: this.$t("uexpressTrace.seqNo"),
    //     width: 100,
    //     cellRenderer: params => params.node ? Number(params.node.rowIndex) + 1 : ''
    //   },
    //   {
    //     field: "trackingChannelName",
    //     headerName: this.$t("uexpressTrace.trackingChannelName"),
    //     minWidth: 200
    //   },
    //   {
    //     field: "trackingCode",
    //     headerName: this.$t("uexpressTrace.nodeCode"),
    //     minWidth: 200
    //   },
    //   {
    //     field: "channelOrderNo",
    //     headerName: this.$t("uexpressTrace.channelOrderNo"),
    //     minWidth: 200
    //   },
    //   {
    //     field: "trackingDesc",
    //     headerName: this.$t("uexpressTrace.descLabel"),
    //     minWidth: 200
    //   },
    //   {
    //     field: "happenCountryShortName",
    //     headerName: this.$t("uexpressTrace.happenCountryShortName"),
    //     minWidth: 200
    //   },
    //   {
    //     field: "happenCityShortName",
    //     headerName: this.$t("uexpressTrace.happenCityShortName"),
    //     minWidth: 100
    //   },
    //   {
    //     field: "happenTimeZone",
    //     headerName: this.$t("uexpressTrace.happenTimeZone"),
    //     minWidth: 100
    //   },
    //   {
    //     headerName: this.$t("uexpressTrace.lonlat"),
    //     minWidth: 100,
    //     cellRenderer: params => `Lon: ${params.data.happenLongitude} Lat: ${params.data.happenLatitude}`
    //   },
    //   {
    //     field: 'collectTime',
    //     headerName: this.$t("uexpressTrace.collectTime"),
    //     minWidth: 200,
    //     cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ""
    //   }
    // ]
  },
  watch: {},
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
      const res = await getTraceInfoApi(this.formData)
      if (res.ok) {
        this.result = res.content
        this.dataList = res.content ? res.content.trackingDtos : []
        // 按发生时间倒序
        this.dataList = this.dataList.sort((a, b) => {
          let numberA = a.happenTime ? Number(a.happenTime) : 0
          let numberB = b.happenTime ? Number(b.happenTime) : 0
          return numberB - numberA
        })
      } else {
        this.result = null
        this.dataList = []
      }
      this.resetHeight()
      this.loading = false
    },
    reset() {
      this.$refs.formData.resetFields()
      this.list()
    }
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.member-item {
  width: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px 2px rgba(0,0,0,0.05);
  font-size: 14px;
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f2f5;
  }
  .info-row {
    // height: 100px;
    // margin-top: 70px;
    height: 30px;
    line-height: 30px;
  }
  .info-label {
    display: inline-block;
    vertical-align: middle;
  }
  .info-value {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    width: 50%;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
