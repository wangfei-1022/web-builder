<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getData" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label="`${$t('uexpressBatch.outboundNo')}: `" prop="outboundNo">
              <el-input class='customer-input' v-model="formData.outboundNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBatch.bolNo')}: `" prop="bolNo">
              <el-input class='customer-input' v-model="formData.bolNo" type="text" :placeholder="$t('common.placeholder')" clearable @keyup.enter.native="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBatch.podAreaCode')}: `" prop="countryCode">
              <base-select v-model="formData.countryCode" type="country" filterable clearable />
              <!-- <el-select v-model="formData.podAreaCode" filterable>
                <el-option v-for="item in podAreaList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode" />
              </el-select> -->
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBatch.outboundTimeStart')}: `" prop="tplTimeArr">
              <CommonPicker
                style="width: 300px;"
                v-model="tplTimeArr"
                :parent-range-date="tplTimeArr"
                pikcer-type="datetimerange"
                pickerFormat="yyyy-MM-dd HH:mm:ss"
                clearable
                @handleDateRangeChange="setTimeRange"/>
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBatch.plateNo')}: `" prop="plateNo">
              <el-input v-model="formData.plateNo" type="text" :placeholder="$t('common.placeholder')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="exportCustoms">{{$t("uexpressBatch.exportClearanceBtn")}}</el-button>
        <el-button type="primary" size="mini" @click="checkBatchBindBlNo">{{$t("uexpressBatch.bindBlNo")}}</el-button>
        <el-button type="primary" size="mini" @click="exportFn">{{$t("uexpressBatch.export")}}</el-button>
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
    <ValidateBlDialog :visible.sync="showValidateBlDialog" @nextStep="showBlNoDialog" />
    <BindBLDialog :visible.sync="showBindBlDialog" :dataForm="blObj" :batchIds="selectedBatchIds" @success="getData" />
    <export-dialog ref="exportDialogRef" :templateList="templateList" @success="getData" ></export-dialog>
  </div>
</template>
<script>
import BatchListOptionBtn from './components/BatchListOptionBtn'
import ValidateBlDialog from './components/ValidateBlDialog'
import BindBLDialog from './components/BindBLDialog'
import ExportDialog from './components/ExportDialog'
import { getBatchListApi, getBatchExportApi } from '@/api/uexpress/batchManager'
import { getExportManifestTemplateApi, getAllAreaProductApi} from "@/api/uexpress/base";
import OutboundNoComponent from "@/views/uexpress/batchManager/components/OutboundNo";
import BlNoComponent from "@/views/uexpress/blManager/components/BlNo";

export default {
  name: "UexpressBatchList",
  components: {
    BatchListOptionBtn,
    ValidateBlDialog,
    BindBLDialog,
    ExportDialog,
    OutboundNoComponent,
    BlNoComponent
  },
  data() {
    return {
      loading: false,
      formData: {
        outboundNo: '',
        bolNo: '',
        countryCode: null,
        outboundTimeStart: null,
        outboundTimeEnd: null,
        plateNo: ''
      },
      pageSize: 50,
      pageNum: 0,
      total: 0,
      tplTimeArr: [],
      podAreaList: [],
      dataList: [],
      columnFields: null,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      selectedRows: [],
      selectedBatchIds: [],
      templateList: [],
      showValidateBlDialog: false,
      showBindBlDialog: false,
      blObj: {}
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
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left'
      },
      {
        field: "outboundNo",
        headerName: this.$t("uexpressBatch.listLabel.outboundNo"),
        minWidth: 130,
        cellRendererFramework: "OutboundNoComponent"
      },
      {
        field: "blNo",
        headerName: this.$t("uexpressBatch.listLabel.blNo"),
        minWidth: 130,
        cellRendererFramework: "BlNoComponent"
      },
      {
        field: "outboundTime",
        headerName: this.$t("uexpressBatch.listLabel.outboundTime"),
        minWidth: 200,
        cellRenderer: params => params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        field: "countries",
        headerName: this.$t("uexpressBatch.listLabel.destinationAreaName"),
        minWidth: 130,
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
        field: "boxCount",
        headerName: this.$t("uexpressBatch.listLabel.boxCount"),
        minWidth: 120
      },
      {
        field: "parcelCount",
        headerName: this.$t("uexpressBatch.listLabel.parcelCount"),
        minWidth: 120
      },
      {
        field: "polName",
        headerName: this.$t("uexpressBatch.listLabel.polName"),
        minWidth: 120
      },
      {
        field: "podName",
        headerName: this.$t("uexpressBatch.listLabel.podName"),
        minWidth: 120
      },
      {
        field: "plateNo",
        headerName: this.$t("uexpressBatch.listLabel.plateNo"),
        minWidth: 120
      },
      {
        field: "flightNo",
        headerName: this.$t("uexpressBatch.listLabel.flightNo"),
        minWidth: 120
      },
      {
        field: "weight",
        headerName: this.$t("uexpressBatch.listLabel.weight"),
        minWidth: 120
      },
      {
        field: "volume",
        headerName: this.$t("uexpressBatch.listLabel.volume"),
        minWidth: 120
      },
      {
        field: "id",
        pinned: 'right',
        headerName: this.$t("common.operation"),
        cellRendererFramework: "BatchListOptionBtn",
        cellRendererParams: {refreshData: this.getData},
        minWidth: 160
      }
    ]

    this.getData()
    // this.getAreaList()
    this.getBase()
  },
  methods: {
    getBase() {
      Promise.all([getExportManifestTemplateApi()]).then(results => {
				const templateRes = results[0];
				if (templateRes.ok) {
					this.templateList = templateRes.content;
				}
			});
    },
    // async getAreaList() {
    //   const res = await getAllAreaProductApi()
    //   if (res && res.ok) {
    //     this.podAreaList = res.content
    //     this.podAreaList.unshift({
    //       areaName: this.$t('common.all'),
    //       areaCode: null
    //     })
    //   }
    // },
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    async getData() {
      this.loading = true
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      const res = await getBatchListApi(params)
      if (res && res.ok && res.content) {
        this.dataList = res.content.list
        this.total = Number(res.content.total)
      } else {
        this.dataList = []
        this.total = 0
      }
      this.loading = false
    },
    exportFn() {
      this.loading = true
      let params = {
        ...this.formData
      }
      getBatchExportApi(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressBatch.exportSuccess'))
        }
        this.loading = false
      })
    },
    reset() {
      this.tplTimeArr = []
      this.outboundTimeStart = null
      this.outboundTimeEnd = null
      this.$refs.formData.resetFields();
      this.getData();
    },
    setTimeRange() {
      this.formData.outboundTimeStart = this.tplTimeArr[0]
      this.formData.outboundTimeEnd = this.tplTimeArr[1]
    },
    checkSelected() {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.warning(this.$t('uexpressBatch.selectedIdEmptyWarning'))
        return false
      } else {
        this.selectedRows = _selectedRows
        return true
      }
    },
    // 导出报关
    async exportCustoms() {
      if (this.checkSelected()) {
        this.$refs.exportDialogRef.show(this.selectedRows)
      }
    },
    // 绑定提单
    async checkBatchBindBlNo() {
      if (this.checkSelected()) {
        const _blNoArr = this.selectedRows.filter(item => item.blNo)
        if (_blNoArr.length > 0) {
          const _batchNoArr = _blNoArr.map(item => item.outboundNo)
          let warningText = `<p>${this.$t('uexpressBatch.blNoExsitWarning1')}: </p>`
          warningText += '<ul style="padding-left: 0;">'
          _batchNoArr.map(item => {
            warningText += `<li>${item}</li>`
          })
          warningText += '</ul>'
          warningText += this.$t('uexpressBatch.blNoExsitWarning2')

          this.$confirm(warningText, this.$t('common.warnningText'), {
            confirmButtonText: this.$t('common.confirmBtn'),
            cancelButtonText: this.$t('common.confirmBtn'),
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            customClass: 'ul-wraning-message',
            type: 'warning'
          }).then(() => {}).catch(() => {})
        } else {
          this.selectedBatchIds = this.selectedRows.map(item => item.id)
          this.showValidateBlDialog = true
        }
      }
    },
    showBlNoDialog(_obj) {
      this.blObj = _obj
      this.showValidateBlDialog = false
      this.showBindBlDialog = true
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
.ul-wraning-message{
  .el-message-box__status{
    top: 12px;
  }
}
</style>
