<template>
  <div v-loading="loading" class="right-main-wrapper">
    <topSearchItems :show-single-input="false">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('charteredBoat.blNo')}: `" prop="blNo">
              <el-input v-model="multipleForm.blNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.masterBlText')}: `" prop="mblNo">
              <el-input v-model="multipleForm.mblNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.houseBLText')}: `" prop="hblNo">
              <el-input v-model="multipleForm.hblNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.vesselName')}: `" prop="vessel">
              <el-input v-model="multipleForm.vessel" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyage">
              <el-input v-model="multipleForm.voyage" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.memberName')}: `" prop="memberId">
              <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="remoteApi" @selectorChange="list" />
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
            <el-form-item :label="`${$t('charteredBoat.amsList.blStatus')}: `" prop="blStatus">
              <el-select v-model="multipleForm.blStatus" size="mini" @change="list">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="1" :label="$t('charteredBoat.amsList.pushUnSubmit')" />
                <el-option value="2" :label="$t('charteredBoat.amsList.createProcessing')" />
                <el-option value="3" :label="$t('common.rejected')" />
                <el-option value="4" :label="$t('charteredBoat.amsList.accessed')" />
                <el-option value="5" :label="$t('charteredBoat.amsList.onMatching')" />
                <el-option value="6" :label="$t('charteredBoat.amsList.isMatched')" />
                <el-option value="7" :label="$t('charteredBoat.amsList.deleteUnResult')" />
                <el-option value="8" :label="$t('charteredBoat.amsList.processingModify')" />
                <el-option value="-1" :label="$t('charteredBoat.amsList.submitFailed')" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="list">
          {{ $t('common.searchBtn') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{ $t('common.resetBtn') }}
        </el-button>
      </div>
    </topSearchItems>
    <div class="table-wrap mb-10">
      <!--      <el-button type="primary" class="ml-10" size="mini" @click="print()">{{ $t('common.print') }}</el-button>-->
      <!--      <el-button type="primary" class="ml-10" size="mini" @click="batchPrint()">{{ $t('common.batchPrint') }}</el-button>-->
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
      style="height:calc(100vh - 460px)"
      class="ag-theme-balham"
    />
    <Pagination :total="total" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="list" />
    <report-list-dialog v-if="reportDialog.isShow" :is-show="reportDialog.isShow" :print-data="reportDialog.data" :type-code="reportDialog.typeCode" @closeDialog="reportDialog.isShow=false" />

  </div>
</template>
<script>
import { getGridSelected } from '@/utils/gridChoose'
import { parseTime } from '@/utils/index'
import { downloadContainerTransferApi } from '@/api/containerTransfer.js'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'
import URL from '@/api/urlTranslator'
import topSearchItems from './components/topSearchItems'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import { houseBlListApi } from '@/api/charteredBoat/AMSList'
import { getRemoteMemberApi } from '@/api/user'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import AMSListOperationBtn from '@/views/cargo/v0/CharteredBoat/components/AMSListOperationBtn'

export default {
  name: 'AMSList',
  components: {
    topSearchItems,
    reportListDialog,
    cargoAdvanceSelect,
    RemoteSearchSelector,
    AMSListOperationBtn
  },
  filters: {},
  data() {
    return {
      total: 0,
      loading: false,
      url: URL,
      dataList: [],
      selectedList: [],
      multipleForm: {
        blNo: null,
        mblNo: null,
        hblNo: null,
        vessel: null,
        voyage: null,
        memberId: null,
        polCode: null,
        podCode: null,
        blStatus: null,
        pageNum: 1,
        pageSize: 50
      },
      columnDefsRight: [{
        headerName: '',
        width: 55,
        pinned: 'left',
        suppressSorting: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        suppressMenu: true,
        suppressSizeToFit: true,
        suppressResize: true
      }, {
        headerName: this.$t('charteredBoat.blNo'),
        field: 'blNo',
        minWidth: 140,
        cellClass: 'status-text primary-text'
      }, {
        headerName: this.$t('charteredBoat.memberName'),
        field: 'memberName',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.masterBlText'),
        field: 'mblNo',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.houseBLText'),
        field: 'hblNo',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.declareStatus'),
        field: 'blStatusName',
        minWidth: 120
      }, {
        headerName: this.$t('charteredBoat.declareResult'),
        field: 'amsFeedback',
        tooltipField: 'amsFeedback',
        minWidth: 120
      }, {
        headerName: this.$t('charteredBoat.amsList.blMatch'),
        field: 'blMatch',
        minWidth: 140,
        cellRenderer: params => {
          if (params.value === true) {
            return `<span>${this.$t('charteredBoat.amsList.isMatched')}</span>`
          } else if (params.value === false) {
            return `<span>${this.$t('charteredBoat.amsList.matchFailed')}</span>`
          }
        }
      }, {
        headerName: this.$t('charteredBoat.amsList.isfMatch'),
        field: 'isfMatch',
        minWidth: 140,
        cellRenderer: params => {
          if (params.value === true) {
            return `<span>${this.$t('charteredBoat.amsList.isMatched')}</span>`
          } else if (params.value === false) {
            return `<span>${this.$t('charteredBoat.amsList.matchFailed')}</span>`
          }
        }
      }, {
        headerName: this.$t('charteredBoat.vesselName'),
        field: 'vessel',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.voyageNo'),
        field: 'voyage',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.polCode'),
        field: 'polCode',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.podCode'),
        field: 'podCode',
        minWidth: 140
      },
      {
        headerName: this.$t('charteredBoat.amsList.hblOwn'),
        field: 'hblOwn',
        minWidth: 140,
        cellRenderer: params => {
          if (params.value === 0) {
            return `<span>${this.$t('charteredBoat.amsList.YHTText')}</span>`
          } else if (params.value === 1) {
            return `<span>${this.$t('charteredBoat.amsList.ownerContainer')}</span>`
          }
        }
      },
      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 90, suppressSizeToFit: true, suppressResize: true,
        cellRendererFramework: 'AMSListOperationBtn'
      }],
      gridOptionsRight: {
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      batchPrintMultipleForm: {}, // 批量打印用的条件
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
      }
    }
  },
  computed: {
    remoteApi() {
      return getRemoteMemberApi
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    // 打印提单
    print() {
      const selectedList = this.getSelectData()
      if (this.$isEmpty(selectedList)) {
        this.$alert(this.$t('charteredBoat.printDataEmptyError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      if (selectedList.length > 1) {
        const error = selectedList.every(item => item.hblOwn === 1)
        if (error) {
          this.$alert(this.$t('charteredBoat.amsList.batchOrderError'), {
            confirmButtonText: this.$t('common.confirmBtn')
          })
          return
        }
        const error2 = selectedList.some(item => item.hblOwn === 1)
        if (error2) {
          this.$alert(this.$t('charteredBoat.amsList.batchSelectedOrderError'), {
            confirmButtonText: this.$t('common.confirmBtn')
          })
          return
        }
      }

      const entityIdList = selectedList.map(item => item.id)
      this.reportDialog.typeCode = 'CAS_HBL'
      this.reportDialog.data = { jobId: '', entityIdList }
      this.reportDialog.isShow = true
    },
    // 批量打印提单
    batchPrint() {
      if (Number(this.total) === 0) {
        this.$alert(this.$t('charteredBoat.filterDataError'), {
          confirmButtonText: this.$t('common.confirmBtn')
        })
        return
      }
      // 根据查询条件进行批量打印
      const { blNo = null, mblNo = null, hblNo = null, vessel = null, voyage = null, memberId = null, polCode = null, podCode = null, blStatus = null } = this.batchPrintMultipleForm
      const queryConditionJson = { blNo, mblNo, hblNo, vessel, voyage, memberId, polCode, podCode, blStatus }
      this.reportDialog.typeCode = 'CAS_HBL'
      this.reportDialog.data = { queryConditionJson: queryConditionJson }
      // this.reportDialog.data = { queryConditionJson: JSON.stringify(queryConditionJson) }
      this.reportDialog.isShow = true
    },
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
      const res = await houseBlListApi(this.multipleForm)
      if (res && res.ok) {
        this.batchPrintMultipleForm = { ...this.multipleForm }
        this.total = Number(res.content.total)
        res.content.list.forEach(ex => {
          ex.jobTime = parseTime(ex.jobTime)
        })
        this.dataList = res.content.list
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
       * 下载下拉选择
       */
    async downLoad(val) {
      const res = await downloadContainerTransferApi(this.multipleForm)
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
    }
  }
}
</script>
<style lang="scss" scoped>
  @import './styles/table.scss';
</style>
