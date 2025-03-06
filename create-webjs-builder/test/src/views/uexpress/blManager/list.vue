<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getData" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label="`${$t('uexpressBL.bolNo')}: `" prop="bolNo">
              <el-input class='customer-input' v-model="formData.bolNo" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBL.listLabel.importDeclareStateName')}: `" prop="importDeclareState">
              <uexpress-select v-model="formData.importDeclareState" type="importDeclareState" addAll @selected="getData" />
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBL.listLabel.lastMileSendStateName')}: `" prop="lastMileManifestState">
              <uexpress-select v-model="formData.lastMileManifestState" type="lastMileManifestState" addAll @selected="getData" />
            </el-form-item>
            <el-form-item label="">
              <el-row :gutter="0">
                <el-col :span="6">
                  <el-select v-model="timeSelected" style="width: 120px;" @change="setTimeRange">
                    <el-option v-for="item in timeTagsList" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-col>
                <el-col :span="18">
                  <CommonPicker
                    style="width: 300px;"
                    v-model="tplTimeArr"
                    :parent-range-date="tplTimeArr"
                    pikcer-type="datetimerange"
                    pickerFormat="yyyy-MM-dd HH:mm:ss"
                    clearable
                    @handleDateRangeChange="setTimeRange"/>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="`${$t('uexpressBL.flightNo')}: `" prop="flightNo">
              <el-input class='customer-input' v-model="formData.flightNo" type="text" :placeholder="$t('common.placeholder')" clearable />
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
        <el-button type="primary" size="mini" @click="exportCustoms">{{$t('uexpressBL.exportClearanceBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="sendManifestLastMailFn">{{$t('uexpressBL.sendMinifestLastMail')}}</el-button>
        <el-button type="primary" size="mini" @click="exportFn">{{$t('uexpressBL.exportBl')}}</el-button>
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
    <ModifyBLDialog :visible.sync="showModifyDialog" ref="modifyFormRef" :dataForm="modifyForm" @success="getData"/>
    <export-dialog ref="exportDialogRef" :templateList="templateList" @success="getData" ></export-dialog>
    <send-manifest-last-mail ref="sendManifestLastMailRef" :templateList="templateList" @success="getData" ></send-manifest-last-mail>
    <update-state-dialog ref="updateStateRef" :templateList="templateList" @success="getData" ></update-state-dialog>
  </div>
</template>
<script>
import URL from '@/api/urlTranslator'
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import { getDictListApi } from '@/api/uexpress/customerManager'
import { getImportManifestTemplateApi } from '@/api/uexpress/base'
import { getBLListApi, getBlExportApi } from '@/api/uexpress/blManager'
import BLListOptionBtn from './components/BLListOptionBtn'
import ModifyBLDialog from './components/ModifyBLDialog'
import ExportDialog from './components/ExportDialog'
import SendManifestLastMail from './components/SendManifestLastMail'
import UpdateStateDialog from './components/UpdateStateDialog'
import BlNoComponent from "@/views/uexpress/blManager/components/BlNo";

export default {
  name: "UexpressBLList",
  components: {
    cargoAdvanceSelect,
    BLListOptionBtn,
    ModifyBLDialog,
    ExportDialog,
    SendManifestLastMail,
    UpdateStateDialog,
    BlNoComponent
  },
  data() {
    return {
      url: URL,
      loading: false,
      formData: {
        bolNo: '',
        flightNo: '',
        atdStart: null,
        atdEnd: null,
        ataStart: null,
        ataEnd: null,
        importDeclareTimeStart: null,
        importDeclareTimeEnd: null,
        importDeclareFinishTimeStart: null,
        importDeclareFinishTimeEnd: null,
        importDeclareState: null,
        lastMileManifestState: '',
        polCode: '',
        podCode: ''
      },
      pageSize: 50,
      pageNum: 0,
      total: 0,
      columnFields: null,
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      selectedRows: [],
      timeSelected: 0,
      timeTagsList: [
        {
          name: this.$t('uexpressBL.timeRangeLabel[0]'),
          code: 0
        },
        {
          name: this.$t('uexpressBL.timeRangeLabel[1]'),
          code: 1
        },
        {
          name: this.$t('uexpressBL.timeRangeLabel[2]'),
          code: 2
        },
        {
          name: this.$t('uexpressBL.timeRangeLabel[3]'),
          code: 3
        }
      ],
      startTimeItemList: ['atdStart', 'ataStart', 'importDeclareTimeStart', 'importDeclareFinishTimeStart'],
      endTimeItemList: ['atdEnd', 'ataEnd', 'importDeclareTimeEnd', 'importDeclareFinishTimeEnd'],
      tplTimeArr: [],
      declareStateList: [],
      templateList: [],
      dataList: [],
      modifyForm: {},
      showModifyDialog: false
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
        field: "blNo",
        headerName: this.$t('uexpressBL.listLabel.blNo'),
        minWidth: 130,
        cellRendererFramework: "BlNoComponent"
      },
      {
        field: "bolAirStateName",
        headerName: this.$t('uexpressBL.listLabel.bolAirStateName'),
        minWidth: 120
      },
      {
        field: "importManifestStateName",
        headerName: this.$t('uexpressBL.listLabel.importDeclareStateName'),
        minWidth: 120
      },
      {
        field: "lastMileManifestStateName",
        headerName: this.$t('uexpressBL.listLabel.lastMileSendStateName'), // 后续追加一个尾程推送状态
        minWidth: 120
      },
      {
        field: "podDeclareAgentName",
        headerName: this.$t('uexpressBL.listLabel.podDeclareAgentName'),
        minWidth: 160
      },
      {
        field: "etdFormat",
        headerName: this.$t('uexpressBL.listLabel.etd'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: "etaFormat",
        headerName: this.$t('uexpressBL.listLabel.eta'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: "atdFormat",
        headerName: this.$t('uexpressBL.listLabel.atd'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: "ataFormat",
        headerName: this.$t('uexpressBL.listLabel.ata'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: "importDeclareTimeFormat",
        headerName: this.$t('uexpressBL.listLabel.importDeclareTime'),
        minWidth: 120,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: "importDeclareFinishTimeFormat",
        headerName: this.$t('uexpressBL.listLabel.importDeclareFinishTime'),
        minWidth: 200,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: "mailDeliveryTimeFormat",
        headerName: this.$t('uexpressBL.listLabel.mailDeliveryTime'),
        minWidth: 200,
        cellRenderer: params => params.value ? params.value : ''
      },
      {
        field: "outboundCount",
        headerName: this.$t('uexpressBL.listLabel.outboundCount'),
        minWidth: 120
      },
      {
        field: "boxCount",
        headerName: this.$t('uexpressBL.listLabel.boxCount'),
        minWidth: 120
      },
      {
        field: "parcelCount",
        headerName: this.$t('uexpressBL.listLabel.parcelCount'),
        minWidth: 120
      },
      {
        field: "weight",
        headerName: this.$t('uexpressBL.listLabel.weight'),
        minWidth: 120
      },
      {
        field: "volume",
        headerName: this.$t('uexpressBL.listLabel.volume'),
        minWidth: 120
      },
      {
        field: "flightNo",
        headerName: this.$t('uexpressBL.listLabel.flightNo'),
        minWidth: 120
      },
      {
        field: "polName",
        headerName: this.$t('uexpressBL.listLabel.polName'),
        minWidth: 120
      },
      {
        field: "podName",
        headerName: this.$t('uexpressBL.listLabel.podName'),
        minWidth: 120
      },
      {
        field: "id",
        pinned: 'right',
        headerName: this.$t('common.operation'),
        cellRendererFramework: "BLListOptionBtn",
        cellRendererParams: {refreshData: this.getData, showModifyBL: this.showModifyBL},
        minWidth: 160
      }
    ]

    this.getData()
    this.getDeclareStateList()
    this.getBase()
  },
  methods: {
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    getBase() {
      Promise.all([getImportManifestTemplateApi()]).then(results => {
				const templateRes = results[0];
				if (templateRes.ok) {
					this.templateList = templateRes.content;
				}
			});
    },
    async getDeclareStateList() {
      // const res = await getDictListApi(19)
      // if (res && res.ok) {
      //   this.declareStateList = res.content
      // }
    },
    exportFn() {
      this.loading = true
      let params = {
        ...this.formData
      }
      getBlExportApi(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressBL.exportBlSuccess'))
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
      const res = await getBLListApi(params)
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
      this.timeSelected = 0
      this.tplTimeArr = []
      const _initTime = {
        atdStart: null,
        atdEnd: null,
        ataStart: null,
        ataEnd: null,
        importDeclareTimeStart: null,
        importDeclareTimeEnd: null,
        importDeclareFinishTimeStart: null,
        importDeclareFinishTimeEnd: null
      }
      this.formData = {...this.formData, ..._initTime}
      this.getData();
    },
    setTimeRange() {
      const _initTime = {
        atdStart: null,
        atdEnd: null,
        ataStart: null,
        ataEnd: null,
        importDeclareTimeStart: null,
        importDeclareTimeEnd: null,
        importDeclareFinishTimeStart: null,
        importDeclareFinishTimeEnd: null
      }
      this.formData = {...this.formData, ..._initTime}
      this.formData[this.startTimeItemList[this.timeSelected]] = this.tplTimeArr[0] ? this.tplTimeArr[0] : null
      this.formData[this.endTimeItemList[this.timeSelected]] = this.tplTimeArr[1] ? this.tplTimeArr[1] : null
    },
    checkSelected() {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.warning(this.$t('uexpressBL.selectedIdEmptyWarning'))
        return false
      } else {
        this.selectedRows = _selectedRows
        return true
      }
    },
    // 导出清关 制作清关数据
    exportCustoms() {
      if (this.checkSelected()) {
        this.$refs.exportDialogRef.show(this.selectedRows)
      }
    },
    // 发送尾程
    sendManifestLastMailFn() {
      if (this.checkSelected()) {
        this.$refs.sendManifestLastMailRef.show(this.selectedRows)
      }
    },
    async showModifyBL(dataObj) {
      this.showModifyDialog = true
      this.$nextTick(() => {
        this.modifyForm = JSON.parse(JSON.stringify(dataObj))
        this.$refs.modifyFormRef.init(this.modifyForm)
      })
    },
    async updateBl(item) {
      this.$refs.updateStateRef.show(item)
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
