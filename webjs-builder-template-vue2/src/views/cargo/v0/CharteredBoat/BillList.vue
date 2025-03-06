<template>
  <div v-loading="loading" class="right-main-wrapper">
    <topSearchItems :show-single-input="false">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('charteredBoat.blNo')}: `" prop="blNo">
              <el-input v-model="multipleForm.blNo" type="text" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.blNo')}`" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.containerNo')}: `" prop="containerNo">
              <el-input v-model="multipleForm.containerNo" type="text" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.containerNo')}`" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.sealNo')}: `" prop="sealNo">
              <el-input v-model="multipleForm.sealNo" type="text" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.sealNo')}`" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.vesselName')}: `" prop="vessel">
              <el-input v-model="multipleForm.vessel" type="text" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.vesselName')}`" size="mini" clearable @keyup.enter.native="list" @change="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyage">
              <el-input v-model="multipleForm.voyage" type="text" :placeholder="`${$t('common.placeholder')}${$t('charteredBoat.voyageNo')}`" size="mini" clearable @keyup.enter.native="list" @change="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.memberName')}: `" prop="memberId">
              <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="remoteApi" @selectorChange="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.hsCode')}: `" prop="hsCode">
              <el-input v-model="multipleForm.hsCode" type="text" :placeholder="$t('common.placeholder')+$t('charteredBoat.hsCode')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.blStatus')}: `" prop="blStatus">
              <BLStatusSelector v-model="multipleForm.blStatus" @selectorChange="list" :type-page="2" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.polCode')}: `" prop="polCode">
              <cargo-advance-select
                ref="polCodeSelect"
                :url="url.qf.seaport"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                @parentCallBack="(data)=>{
                  multipleForm.polCode=data.code5
                  list()
                }"
              />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.podCode')}: `" prop="podCode">
              <cargo-advance-select
                ref="podCodeSelect"
                :url="url.qf.seaport"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                @parentCallBack="(data)=>{
                  multipleForm.podCode=data.code5
                  list()
                }"
              />
            </el-form-item>
            <el-form-item :label="`${$t('boatBlList.declareMethod')}: `" prop="declareMethod">
              <el-select v-model="multipleForm.declareMethod" size="mini" @change="list">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="1" :label="$t('common.undetermined')" />
                <el-option value="2" :label="$t('boatBlList.declareByAgent')" />
                <el-option value="3" :label="$t('boatBlList.declareBySelf')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.declareStatus')}: `" prop="declareStatus">
              <el-select v-model="multipleForm.declareStatus" size="mini" @change="list">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="0" :label="$t('charteredBoat.waitForDeclare')" />
                <el-option value="-1" :label="$t('boatBlList.declareFailed')" />
                <el-option value="2" :label="$t('boatBlList.onCreating')" />
                <el-option value="8" :label="$t('boatBlList.onModifying')" />
                <el-option value="7" :label="$t('boatBlList.onDeleteing')" />
                <el-option value="3" :label="$t('common.rejected')" />
                <el-option value="4" :label="$t('common.accepted')" />
                <el-option value="5" :label="$t('common.matching')" />
                <el-option value="6" :label="$t('common.matched')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.issuingMethod')}: `" prop="blSignType">
              <el-select v-model="multipleForm.blSignType" size="mini" @change="list">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option :value="1" label="MBL" />
                <el-option :value="2" label="MBL+HBL" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="list">
          {{ $t('common.searchBtn') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{ $t('common.resetBtn') }}</el-button>
      </div>
    </topSearchItems>
    <div class="table-wrap mb-10">
      <el-dropdown @command="downLoad">
        <el-button type="primary" size="mini">
          {{ $t('common.download') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">{{ $t('boatBlList.ENSTypeOne') }}</el-dropdown-item>
          <el-dropdown-item command="2">{{ $t('boatBlList.ENSTypeTwo') }}</el-dropdown-item>
          <el-dropdown-item command="3">{{ $t('boatBlList.downType') }}</el-dropdown-item>
          <el-dropdown-item command="4">{{ $t('boatBlList.middleEast') }}</el-dropdown-item>
          <el-dropdown-item command="5">{{$t('boatBlList.typeCollection')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="danger" class="ml-10" size="mini" @click="del()">{{ $t('boatBlList.deleteBl') }}</el-button>
      <el-button type="primary" class="ml-10" size="mini" @click="batchIssue()">{{ $t('boatBlList.signBl') }}</el-button>
      <el-button type="primary" class="ml-10" size="mini" icon="el-icon-upload2" @click="uploadVisible=true">{{$t('common.importData')}}</el-button>
      <!--      <el-button type="primary" class="ml-10" size="mini" @click="markDeclarationStatus()">标记申报状态</el-button>-->
      <el-button type="primary" class="ml-10" size="mini" @click="print()">{{ $t('common.print') }}</el-button>
      <el-button type="primary" class="ml-10" size="mini" @click="batchPrint()">{{ $t('common.batchPrint') }}</el-button>

      <div v-if="batchPrintMultipleForm.vessel && batchPrintMultipleForm.voyage" class="statistics">{{$t('common.totalAmount')}}：{{ statistic.totalCount }}{{$t('common.ticket')}} <span>{{$t('common.unSign')}}：{{ statistic.unIssueCount}}{{$t('common.ticket')}}</span></div>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptionsRight"
      :side-bar="sideBarDefs"
      :column-defs="columnDefsRight"
      :row-data="dataList"
      :enable-col-resize="true"
      :enable-sorting="true"
      :grid-ready="onReadyRight"
      style="height:calc(100vh - 480px)"
      class="ag-theme-balham"
    />
    <MarkDeclarationStatusDialog :ids="selectedIds" :visible.sync="markDeclarationVisible" @saved="list" />
    <InputInfoDialog :id="selectedId" :visible.sync="inputInfoVisible" :mbl-no="mblNo" @saved="list" />
    <BLPrintConfig :id="activeld" :visible.sync="dialog.visible" />
    <Pagination :total="total" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="list" />
    <UploadData :visible.sync="uploadVisible" />
    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />
    <el-dialog :close-on-click-modal="false" :visible.sync="sampleSheetExportVs" :title="$t('boatBlList.exportTemplate')" width="550px">
      <el-form v-if="sampleSheetExportVs" ref="sampleSheetExportForm" label-width="90px" label-position="left" :model="sampleSheetExportForm">
        <el-form-item :label="`${$t('common.chooseTemplate')}：`" prop="blPrintStyle" :rules="[{required:true,message:$t('common.templateEmptyError')}]">
          <el-radio-group
            v-model="sampleSheetExportForm.blPrintStyle"
          >
            <el-radio :label="1">{{$t('boatBlList.nameOfHaite')}}</el-radio>
            <el-radio :label="2">{{$t('boatBlList.nameOfYihaitong')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="`${$t('boatBlList.chooseFormat')}：`" prop="outFormat" :rules="[{required:true,message:$t('boatBlList.formatEmptyError')}]">
          <el-radio-group
            v-model="sampleSheetExportForm.outFormat"
          >
            <el-radio :label="1">{{$t('boatBlList.excelFile')}}</el-radio>
            <el-radio :label="2">{{$t('boatBlList.pdfFile')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :disabled="loading" @click="subSampleSheetExport()">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" @click="cancelSampleSheetExport">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getGridSelected } from '@/utils/gridChoose'
import BLStatusSelector from './components/BLStatusSelector'
import topSearchItems from '@/components/Cargo/Common/topSearchItems'
import BLPrintConfig from './components/BLPrintConfig'
import BilOperationBtn from './components/BilOperationBtn'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import { getBLList, batchDelete, batchIssue, exportBL } from '@/api/bl.js'
import { getRemoteMemberApi } from '@/api/user'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'
import URL from '@/api/urlTranslator'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import MarkDeclarationStatusDialog from './components/MarkDeclarationStatusDialog'
import InputInfoDialog from './components/InputInfoDialog'
import UploadData from './components/UploadData'
import {batchExportCopy, issueStatisticApi} from "@/api/bl"
export default {
  name: 'BLList',
  components: {
    topSearchItems,
    BLStatusSelector,
    BLPrintConfig,
    BilOperationBtn,
    RemoteSearchSelector,
    cargoAdvanceSelect,
    reportListDialog,
    MarkDeclarationStatusDialog,
    InputInfoDialog,
    UploadData
  },
  filters: { },
  data() {
    return {
      sampleSheetExportVs: false,
      sampleSheetExportForm: {},
      mblNo: '',
      total: 0,
      loading: false,
      url: URL,
      dataList: [],
      selectedList: [],
      activeld: null,
      markDeclarationVisible: false,
      uploadVisible: false,
      selectedId: null,
      selectedIds: [],
      inputInfoVisible: false,
      reportDialog: { // 打印报表对话框
        isShow: false,
        typeCode: '',
        data: {
          jobId: '',
          assistInfo: '',
          definedInfo: '',
          entityIdList: [],
          remark: ''
        }
      },
      batchPrintMultipleForm: {}, // 批量打印用的条件
      multipleForm: {
        blNo: null,
        polCode: '',
        podCode: '',
        blStatus: null,
        containerNo: null,
        hsCode: null,
        memberId: null,
        sealNo: null,
        vessel: null,
        voyage: null,
        declareStatus: null,
        declareMethod: null,
        blSignType: null,
        pageNum: 1,
        pageSize: 50
      },
      columnDefsRight: [
        {
          headerName: '', width: 55, pinned: 'left',
          suppressSorting: true, checkboxSelection: true, headerCheckboxSelection: true,
          suppressMenu: true, suppressSizeToFit: true, suppressResize: true
        },
        {
          headerName: this.$t('charteredBoat.blNo'),
          field: 'blNo',
          pinned: 'left',
          minWidth: 140,
          cellClass: 'status-text primary-text'
        }, {
          headerName: this.$t('charteredBoat.memberName'),
          field: 'memberName',
          minWidth: 140
        },
        {
          headerName: this.$t('boatBlList.infoFrom'),
          field: 'blSourceName',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.blStatus'),
          field: 'status',
          minWidth: 140,
          cellRenderer: params => {
            if (params.value === 1) {
              return `<div class="status-text info-text">${params.data.statusName}</div>`
            } else if (params.value === 2) {
              return `<div  class="status-text warning-text">${params.data.statusName}</div>`
            } else if (params.value === 3) {
              return `<div  class="status-text success-text">${params.data.statusName}</div>`
            } else if (params.value === 4) {
              return `<div  class="status-text danger-text">${params.data.statusName}</div>`
            } else if (params.value === 5) {
              return `<div  class="status-text primary-text">${params.data.statusName}</div>`
            } else if (params.value === 7) {
              return `<div  class="status-text success-text">${params.data.statusName}</div>`
            } else {
              return `<div  class="status-text ">${params.data.statusName}</div>`
            }
          }
        },
        {
          headerName: this.$t('charteredBoat.issuingMethod'),
          field: 'blSignTypeName',
          minWidth: 120
        },
        {
          headerName: this.$t('boatBlList.typeAndAmount'),
          field: 'containerSizeTypeQty',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.polCode'),
          field: 'polCode',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.podCode'),
          field: 'podCode',
          minWidth: 140
        },
        {
          headerName: this.$t('boatBlList.quantityText'),
          field: 'quantity',
          minWidth: 140
        },
        {
          headerName: this.$t('common.unitText'),
          field: 'packageType',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.grossWeight'),
          field: 'weight',
          minWidth: 140
        },
        {

          headerName: this.$t('charteredBoat.volume'),
          field: 'volume',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.blType'),
          field: 'blTypeName',
          minWidth: 140
        },
        {
          headerName: this.$t('boatBlList.payPlatform'),
          field: 'paymentModeName',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.vesselName'),
          field: 'vessel',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.voyageNo'),
          field: 'voyage',
          minWidth: 140
        },
        {
          headerName: this.$t('charteredBoat.etd'),
          field: 'etd',
          minWidth: 120,
          cellRenderer: params => this.formatDate(params.value)
        },
        {
          headerName: this.$t('boatBlList.ATDText'),
          field: 'atd',
          minWidth: 120,
          cellRenderer: params => this.formatDate(params.value)
        },
        {
          headerName: this.$t('charteredBoat.masterBlText'),
          field: 'mblNo',
          minWidth: 120
        },
        {
          headerName: this.$t('boatBlList.declareMethod'),
          field: 'declareMethodName',
          minWidth: 120
        },
        {
          headerName: this.$t('common.reasonOfRejected'),
          field: 'rejectReason',
          minWidth: 140
        },
        {
          headerName: this.$t('common.signedBy'),
          field: 'issuer',
          minWidth: 140
        },
        {
          headerName: this.$t('common.issueDate'),
          field: 'issueDate',
          minWidth: 120,
          cellRenderer: params => this.formatDate(params.value)
        },
        {
          headerName: this.$t('common.operation'), pinned: 'right', width: 150, suppressSizeToFit: true, suppressResize: true,
          cellRendererFramework: 'BilOperationBtn'
        }
      ],
      gridOptionsRight: {},
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      statistic: {
        totalCount: null,
        unIssueCount: null
      }
    }
  },
  computed: {
    remoteApi() {
      return getRemoteMemberApi
    }
  },
  watch: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // if (from.name === 'BLInfo') {

      // }
      vm.list()
    })
  },
  mounted() {
    // this.list()
  },
  created() {
    this.gridOptionsRight = {
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true,
      // suppressCellSelection: true,
      suppressRowClickSelection: true, // 选中单元格后可以复制内容
      context: {
        componentParent: this
      }
    }
    // this.list()
  },
  methods: {
    onReadyRight(params) {
      // const self = this
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
          // self.onFirstDataRendered()
        })
      })
    },
    async list() {
      const res = await getBLList(this.multipleForm)
      if (res.ok) {
        this.batchPrintMultipleForm = { ...this.multipleForm } // 暂存条件，防止查询后 进行 修改查询条件，在未查询情况下，进行批量打印
        this.total = Number(res.content.total)
        this.dataList = res.content.list
      }
      const statistic = await issueStatisticApi(this.multipleForm)
      if (statistic.ok) {
        this.statistic = statistic.content
      }
    },
    /**
     * 清空重置条件
     */
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.$refs.polCodeSelect.value = ''
      this.$refs.podCodeSelect.value = ''
      this.list()
    },
    /**
     * 批量删除
     */
    async del() {
      const selectedList = this.getSelectData()
      if (this.$isEmpty(selectedList)) {
        this.$alert(this.$t('boatBlList.deletedDataEmptyError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      let isDel = selectedList.some(item => item.status === 8)
      if (isDel) {
        this.$message.warning(this.$t('boatBlList.blAlreadyDeletedError'))
        return
      }
      this.$confirm(this.$t('common.deleteWarnningTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        const ids = []
        selectedList.forEach(item => {
          ids.push(item.id)
        })
        batchDelete({ ids }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('common.deleteSuccess'))
            this.list()
          }
        })
      }).catch(() => {

      })
    },
    /**
     * 打印提单
     */
    print() {
      const selectedList = this.getSelectData()
      if (this.$isEmpty(selectedList)) {
        this.$alert(this.$t('charteredBoat.printDataEmptyError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      const entityIdList = selectedList.map(item => item.id)
      this.reportDialog.typeCode = 'BL'
      this.reportDialog.data = { jobId: '', entityIdList }
      this.reportDialog.isShow = true
    },
    /**
     * 打印提单
     */
    batchPrint() {
      if (Number(this.total) === 0) {
        this.$alert(this.$t('charteredBoat.filterDataError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      // 根据查询条件进行批量打印
      const { blNo = null, blStatus = null, containerNo = null, hsCode = null, memberId = null, sealNo = null, vessel = null, voyage = null, declareStatus = null, blSignType = null, declareMethod = null, polCode = null, podCode = null } = this.batchPrintMultipleForm
      const queryConditionJson = { blNo, blStatus, containerNo, hsCode, memberId, sealNo, vessel, voyage, declareStatus, declareMethod, polCode, podCode, blSignType }
      this.reportDialog.typeCode = 'BL'
      this.reportDialog.data = { queryConditionJson: queryConditionJson }
      // this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
      this.reportDialog.isShow = true
    },
    // 样单导出
    subSampleSheetExport() {
      this.$refs.sampleSheetExportForm.validate(async valid => {
        if (valid) {
          const params = this.$extends({}, this.multipleForm)
          params.blPrintStyle = this.sampleSheetExportForm.blPrintStyle
          params.outFormat = this.sampleSheetExportForm.outFormat
          const res = await batchExportCopy(params)
          if (res.ok) {
            this.sampleSheetExportVs = false
            this.$message.success(this.$t('boatBlList.exportSuccessTips'))
          }
        }
      })
    },
    cancelSampleSheetExport() {
      this.$refs.sampleSheetExportForm.resetFields()
      this.sampleSheetExportVs = false
    },
    /**
     * 批量签发
     */
    async batchIssue() {
      const selectedList = this.getSelectData()
      if (this.$isEmpty(selectedList)) {
        this.$alert(this.$t('boatBlList.signedDataEmptyError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      const hasUnqualified = selectedList.find(item => item.status !== 7)
      if (this.$isNotEmpty(hasUnqualified)) {
        this.$alert(this.$t('boatBlList.blStatusError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      const ids = []
      selectedList.forEach(item => {
        ids.push(item.id)
      })
      batchIssue({ ids }).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('boatBlList.blSignedSuccess'))
          this.list()
        }
      })
    },
    /**
     * 标记申报状态
     */
    markDeclarationStatus() {
      const selectedList = this.getSelectData()
      let errStr = ''
      if (this.$isEmpty(selectedList)) {
        errStr = this.$t('boatBlList.markDataEmptyErrro')
      }
      if (this.$isEmpty(errStr)) {
        const hasDeclare = selectedList.find(item => item.declareType !== 1 || item.status !== 3 || item.declareMethod === 1)
        if (this.$isNotEmpty(hasDeclare)) {
          errStr = this.$t('boatBlList.markDataVerifiedError')
        }
      }
      if (this.$isNotEmpty(errStr)) {
        this.$alert(errStr, {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      const ids = []
      selectedList.forEach(item => {
        ids.push(item.id)
      })
      this.selectedIds = ids
      this.markDeclarationVisible = true
    },
    /**
     * 录入IML
     */
    inputInfo(data) {
      this.mblNo = data.mblNo || ''
      if (this.$isNotEmpty(data.id)) {
        this.selectedId = data.id
        this.inputInfoVisible = true
      }
    },
    /**
     * 下载下拉选择
     */
    async downLoad(val) {
      if (val === '5') {
        if (!this.multipleForm.vessel || !this.multipleForm.voyage) {
          this.$message.warning(this.$t('boatBlList.sailingDifferentError'))
          return
        }
        this.sampleSheetExportVs = true
        return
      }
      this.multipleForm.exportType = Number(val)
      const res = await exportBL(this.multipleForm)
      if (res.ok) {
        window.location = res.content
      }
    },
    /**
     * 获取表格选中的数据集合
     */
    getSelectData() {
      const rows = getGridSelected(this.gridOptionsRight)
      return rows
    },
    /**
     * 设置打印信息
     */
    showPrint(row) {
      this.activeld = row.id
      this.dialog.visible = true
    },
    /**
     * 编辑审核
     */
    edit(blid, type) {
      this.$router.push({ name: `BLInfo`, query: { blid, type }})
    }
  }
}
</script>
<style lang="scss" scoped>
@import './styles/table.scss';
.statistics{ color: red; font-size: 13px; margin-left: 30px; display: inline-block; font-weight: bold;
  span{ margin-left: 20px}
}
</style>
