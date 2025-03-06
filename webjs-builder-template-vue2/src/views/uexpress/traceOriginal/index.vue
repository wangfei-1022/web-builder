<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressTrace.channelOrderNo")' prop="channelOrderNo">
              <el-input v-model="formData.channelOrderNo" clearable :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.nodeCode")' prop="sourceTrackingCode">
              <el-input v-model="formData.sourceTrackingCode" clearable :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.descLabel")' prop="sourceTrackingDesc">
              <el-input v-model="formData.sourceTrackingDesc" clearable :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label='$t("uexpressTrace.trackingChannelName")' prop="trackingChannelCode">
              <uexpress-type-select type="traceChannel" v-model="formData.trackingChannelCode" clearable filterable />
            </el-form-item>
            <el-form-item :label="$t('uexpressTrace.latestUpdate')" prop="traceTimeArr">
              <CommonPicker
                v-model="traceTimeArr"
                pickerFormat="yyyy-MM-dd HH:mm:ss"
                pikcerType="datetimerange"
                :clearable="true" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mt-10"></div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>
  </div>
</template>

<script>
import { getTraceOriginalApi } from "@/api/uexpress/traceLine"
import { AgGridVue } from "ag-grid-vue"
import { parseTimeZoneStr } from "@/utils"

export default {
  name: "TraceOriginal",
  components: {
    AgGridVue
  },
  data() {
    return {
      formData: {
        channelOrderNo: '',
        sourceTrackingCode: '',
        sourceTrackingDesc: '',
        trackingChannelCode: '',
        updateTimeStart: null,
        updateTimeEnd: null
      },
      traceTimeArr: [],
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
        field: 'orderId',
        headerName: this.$t("uexpressTrace.seqNo"),
        width: 100,
        cellRenderer: params => params.node ? Number(params.node.rowIndex) + 1 : ''
      },
      {
        field: "trackingChannelName",
        headerName: this.$t("uexpressTrace.trackingChannelName"),
        minWidth: 200
      },
      {
        field: "sourceTrackingCode",
        headerName: this.$t("uexpressTrace.nodeCode"),
        minWidth: 200
      },
      {
        field: "channelOrderNo",
        headerName: this.$t("uexpressTrace.channelOrderNo"),
        minWidth: 200
      },
      {
        field: "sourceTrackingDesc",
        headerName: this.$t("uexpressTrace.descLabel"),
        minWidth: 200
      },
      {
        field: "happenCountryShortName",
        headerName: this.$t("uexpressTrace.happenCountryShortName"),
        minWidth: 200
      },
      {
        field: "happenCityShortName",
        headerName: this.$t("uexpressTrace.happenCityShortName"),
        minWidth: 100
      },
      {
        field: "happenTimeZone",
        headerName: this.$t("uexpressTrace.happenTimeZone"),
        minWidth: 100
      },
      {
        headerName: this.$t("uexpressTrace.lonlat"),
        minWidth: 100,
        cellRenderer: params => `Lon: ${params.data.happenLongitude} Lat: ${params.data.happenLatitude}`
      },
      {
        field: 'collectTime',
        headerName: this.$t("uexpressTrace.collectTime"),
        minWidth: 200,
        cellRenderer: params => params.value ? parseTimeZoneStr(Number(params.value), params.data.happenTimeZone) : ""
      }
    ]
    this.list()
  },
  watch: {
    traceTimeArr: function(arr) {
      if (arr.length > 1) {
        this.formData.updateTimeStart = arr[0]
        this.formData.updateTimeEnd = arr[1]
      } else {
        this.formData.updateTimeStart = null
        this.formData.updateTimeEnd = null
      }
    }
  },
  methods: {
    onReady(params) {
      params.api.sizeColumnsToFit();
      window.addEventListener("resize", function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });
    },
    async list() {
      this.loading = true;
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      const res = await getTraceOriginalApi(params);
      if (res.ok) {
        this.total = parseInt(res.content.total, 10);
        this.dataList = res.content.list;
      } else {
        this.total = 0;
        this.dataList = [];
      }
      this.loading = false;
    },
    reset() {
      this.$refs.formData.resetFields();
      this.list();
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 0px;
}
</style>
