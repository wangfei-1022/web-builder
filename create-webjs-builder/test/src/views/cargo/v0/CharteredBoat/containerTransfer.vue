<template>
  <div v-loading="loading" class="right-main-wrapper">
    <topSearchItems :show-single-input="false">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('charteredBoat.containerNo')}: `" prop="containerNo">
              <el-input v-model="multipleForm.containerNo" type="text" :placeholder="$t('charteredBoat.containerNoPlaceholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.vesselName')}: `" prop="vessel">
              <el-input v-model="multipleForm.vesselName" type="text" :placeholder="$t('charteredBoat.containerTransfer.vesselPlaceholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyageNo">
              <el-input v-model="multipleForm.voyageNo" type="text" :placeholder="$t('charteredBoat.containerTransfer.voyagePlaceholder')" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.containerTransfer.jobType')}: `" prop="jobType">
              <el-select v-model="multipleForm.jobType" size="mini" @change="list">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="1" :label="$t('charteredBoat.containerTransfer.emptyPickup')" />
                <el-option value="2" :label="$t('charteredBoat.containerTransfer.fullPickup')" />
                <el-option value="3" :label="$t('charteredBoat.containerTransfer.emptyReturn')" />
                <el-option value="4" :label="$t('charteredBoat.containerTransfer.fullReturn')" />
                <el-option value="5" :label="$t('charteredBoat.containerTransfer.loadShip')" />
                <el-option value="6" :label="$t('charteredBoat.containerTransfer.removeShip')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.containerTransfer.jobPortCode')}: `" prop="jobPortCode">
              <cargo-advance-select
                ref="jobPortCode"
                :url="url.qf.seaport"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                @parentCallBack="(data)=>{
                  multipleForm.jobPortCode = data.code5
                  list()
                }"
              />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="list">
          {{ $t('table.search') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{ $t('table.resetColumns') }}
        </el-button>
      </div>
    </topSearchItems>
    <div class="table-wrap mb-10">
      <el-dropdown @command="downLoad">
        <el-button type="primary" size="mini">
          {{ $t('common.download') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">{{$t('charteredBoat.containerTransfer.jobList')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
  </div>
</template>
<script>
import { getGridSelected } from '@/utils/gridChoose'
import { parseTime } from '@/utils/index'
import { getContainerTransferListApi, downloadContainerTransferApi } from '@/api/containerTransfer.js'
import reportListDialog from '@/components/Cargo/Report/reportListDialog'
import URL from '@/api/urlTranslator'
import topSearchItems from './components/topSearchItems'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'

export default {
  name: 'BLList',
  components: {
    topSearchItems,
    reportListDialog,
    cargoAdvanceSelect
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
        containerNo: null,
        voyageNo: null,
        vesselName: null,
        jobType: null,
        jobPortCode: null,
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
        headerName: this.$t('charteredBoat.containerNumber'),
        field: 'containerNo',
        minWidth: 140,
        cellClass: 'status-text primary-text'
      }, {
        headerName: this.$t('charteredBoat.containerType'),
        field: 'containerType',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.vesselName'),
        field: 'vesselName',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.voyageNo'),
        field: 'voyageNo',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.containerTransfer.jobPortCode'),
        field: 'jobPortCode',
        minWidth: 120
      }, {
        headerName: this.$t('charteredBoat.containerTransfer.jobType'),
        field: 'jobTypeName',
        minWidth: 120
      }, {
        headerName: this.$t('charteredBoat.containerTransfer.jobDuration'),
        field: 'jobTime',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.containerTransfer.dataOriginName'),
        field: 'dataOriginName',
        minWidth: 140
      }],
      gridOptionsRight: {
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
          componentParent: this
        }
      },
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }
    }
  },
  mounted() {
    this.list()
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
      const res = await getContainerTransferListApi(this.multipleForm)
      if (res && res.ok) {
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
      this.$refs.jobPortCode.value = ''
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
