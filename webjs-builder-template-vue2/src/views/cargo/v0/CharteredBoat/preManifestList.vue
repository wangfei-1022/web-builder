<template>
  <div class="sys-right-inner-wrap" v-loading="loading">
    <topSearchItems :show-single-input="false">
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('preManifest.soNo')}: `" prop="soNo">
              <el-input v-model="multipleForm.soNo" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.vesselName')}: `" prop="vessel">
              <el-input v-model="multipleForm.vessel" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyage">
              <el-input v-model="multipleForm.voyage" type="text" :placeholder="$t('common.placeholder')" size="mini" clearable @keyup.enter.native="topSearch" />
            </el-form-item>
            <el-form-item class="el-form-item" :label="`${$t('charteredBoat.polCode')}: `" prop="polCode">
              <cargo-advance-select
                :url="`${VUE_APP_BASE_API}/api/mdm-service/dmn/seaportlist`"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                class="w-240"
                @parentCallBack="(data)=>{getItemFromChild(data,'polCode')}"
                ref="polCode"
              />
            </el-form-item>
            <el-form-item class="el-form-item" :label="`${$t('charteredBoat.podCode')}: `" prop="podCode">
              <cargo-advance-select
                :url="`${VUE_APP_BASE_API}/api/mdm-service/dmn/seaportlist`"
                :headers="[$t('common.englishName'),$t('common.fiveCharCode'),$t('common.chineseName')]"
                :fields="['englishName','code5','chineseName']"
                tag-value="code5"
                tag-name="enPortName"
                remote
                class="w-240"
                @parentCallBack="(data)=>{getItemFromChild(data,'podCode')}"
                ref="podCode"
              />
            </el-form-item>
            <el-form-item class="el-form-item" :label="`${$t('preManifest.splitOrder')}: `" v-model="multipleForm.declareMethod" prop="isHouseBill">
              <SplitOrderSelector @selectorChange="(data) => {selBlStatusrChange(data,'isHouseBill')}" ref="SplitOrderSelector"></SplitOrderSelector>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.declareStatus')}: `" prop="declareStatus">
              <el-select v-model="multipleForm.declareStatus" size="mini" @change="topSearch">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="0" :label="`${$t('charteredBoat.waitForDeclare')}`" />
                <el-option value="1" :label="`${$t('common.submited')}`" />
                <el-option value="2" :label="`${$t('common.rejected')}`" />
                <el-option value="3" :label="`${$t('common.accepted')}`" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="topSearch">
          {{ $t('common.searchBtn') }}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{ $t('common.resetBtn') }}
        </el-button>
      </div>
    </topSearchItems>
    <div class="container-wrap">
      <div class="mb-10">
        <el-button type="primary" class="ml-10" size="mini" @click="print()">{{$t('common.print')}}</el-button>
        <el-button type="primary" class="ml-10" size="mini" @click="declarationFeedback()">{{$t('charteredBoat.declareResult')}}</el-button>
      </div>

      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptionsRight"
        :side-bar="sideBarDefs"
        :column-defs="columnDefsRight"
        :row-data="tableData.list"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        style="height:calc(100vh - 460px)"
        class="ag-theme-balham"
      />
      <Pagination :total="pageTotal" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getList" />
    </div>

    <el-dialog :title="$t('charteredBoat.markDeclareStatus')" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="closeSoNoDialog" width="30%">
      <el-form :inline="true" :model="updateStatusForm" @submit.native.prevent ref="soNoSelectionForm">
        <el-form-item :label="$t('charteredBoat.declareStatus')" prop="declareStatus" :rules="[{ required: true, message: $t('preManifest.declareStatusEmptyInvalid'), trigger: 'change' },]">
          <el-radio-group v-model="updateStatusForm.declareStatus" @change="declareStatusChange">
            <el-radio :label="2">{{$t('preManifest.reject')}}</el-radio>
            <el-radio :label="3">{{$t('preManifest.accept')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('charteredBoat.declareResult')" prop="declareFeedback" :rules="[{ required: true, message: `${$t('preManifest.declareResultEmptyInvalid')}`, trigger: 'blur' },]">
          <el-input v-model="updateStatusForm.declareFeedback" type="textarea" rows="4" style="width: 400px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendUpdateStatus">{{$t('common.confirmBtn')}}</el-button>
        <el-button @click="closeSoNoDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import {
  exportManifestListApi,
  manifestContainersListApi,
  manifestListApi,
  manifestSoNoListApi, manifestUpdateStatusApi
} from "@/api/charteredBoat/preManifest"
import SplitOrderSelector from "@/views/cargo/v0/CharteredBoat/components/SplitOrderSelector"
import cargoAdvanceSelect from "@/components/Cargo/Common/cargoAdvanceSelect"
import PreManifestListOperationBtn from "@/views/cargo/v0/CharteredBoat/components/PreManifestListOperationBtn"
export default {
  name: 'PreManifestList',
  components: { SplitOrderSelector, cargoAdvanceSelect, PreManifestListOperationBtn },
  data() {
    return {
      loading: false,
      pageSizeList: [10, 20, 30, 40],
      tableData: {},
      selectedItems: [], // 列表选择
      pagination: {
        pageNum: 1,
        pageSize: 50
      },
      pageTotal: 0,
      multipleForm: {
        soNo: null,
        vessel: null,
        voyage: null,
        mblNo: null,
        polCode: null,
        podCode: null,
        isHouseBill: null,
        declareStatus: null,
        pageNum: 1,
        pageSize: 50
      },
      vm: this,
      VUE_APP_BASE_API: '',
      soNoList: [],
      dialogVisible: false,
      updateStatusForm: {},
      gridApi: null,
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
        headerName: this.$t('preManifest.mainSoNo'),
        field: 'soNo',
        minWidth: 140,
        cellClass: 'status-text primary-text'
      }, {
        headerName: this.$t('charteredBoat.memberName'),
        field: 'memberName',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.polCode'),
        field: 'polCode',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.podCode'),
        field: 'podCode',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.vesselName'),
        field: 'vessel',
        minWidth: 120
      }, {
        headerName: this.$t('charteredBoat.voyageNo'),
        field: 'voyage',
        minWidth: 120
      }, {
        headerName: this.$t('preManifest.splitOrder'),
        field: 'isHouseBill',
        minWidth: 80,
        cellRenderer: params => {
          if (params.value === true) {
            return `<span>${this.$t('common.trueText')}</span>`
          } else if (params.value === false) {
            return `<span>${this.$t('common.falseText')}</span>`
          }
        }
      }, {
        headerName: this.$t('charteredBoat.declareStatus'),
        field: 'declareStatusName',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.declareResult'),
        field: 'declareFeedback',
        tooltipField: 'declareFeedback',
        minWidth: 140
      }, {
        headerName: this.$t('charteredBoat.typeAndQuantity'),
        field: 'containerTypeQty',
        tooltipField: 'containerTypeQty',
        minWidth: 140
      },
      {
        headerName: this.$t('common.operation'), pinned: 'right', width: 90, suppressSizeToFit: true, suppressResize: true,
        cellRendererFramework: 'PreManifestListOperationBtn'
      }
      ],
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
  computed: {
    ...mapState({
      memberInfo: state => state.user.memberInfo
    })
  },
  filters: {
    filterSoc(socFlag, vm) {
      return socFlag ? vm.$t('containerList.socFlagYes') : vm.$t('containerList.socFlagFalse')
    },
    filterBLClass(_status) {
      const classList = [
        '',
        'status-text info-text',
        'status-text warning-text',
        'status-text success-text',
        'status-text danger-text',
        'status-text primary-text'
      ]
      return classList[_status]
    },
    filterDeclareClass(_status) {
      const classList = [
        'status-text info-text',
        'status-text warning-text',
        'status-text warning-text',
        'status-text success-text',
        'status-text danger-text',
        'status-text primary-text'
      ]
      return classList[_status]
    },
    filterFullInTime(timestamp, vm) {
      if (!timestamp) {
        return ''
      }
      return vm.$moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
    },
    isHouseBill(_status) {
      if (_status === true) {
        return this.$t('common.trueText')
      } else if (_status === false) {
        return this.$t('common.falseText')
      }
    }
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await manifestListApi(this.multipleForm)
      this.loading = false
      if (res.ok) {
        this.tableData = res.content
        this.pageTotal = Number(res.content.total)
      } else {
        this.pageTotal = 0
        this.tableData = []
      }
    },
    topSearch() {
      this.currPage = 1
      this.getList()
    },
    selBlStatusrChange(data, val) { // 下拉框
      this.multipleForm[val] = data
      this.getList()
    },
    selTrailerStatusChange(data) {
      this.multipleForm.trailerStatus = data
      this.getList()
    },
    searchFormReset() { // 搜索重置
      this.$refs.multipleForm.resetFields()
      this.$refs.SplitOrderSelector.value = null
      this.multipleForm.declareMethod = null
      this.multipleForm.declareStatus = null
      this.$refs.polCode.value = null
      this.$refs.podCode.value = null
      this.topSearch()
    },
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.$refs.polCode.value = null
      this.$refs.podCode.value = null
      this.getList()
    },
    onReady(params) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    async print() {
      this.loading = true
      const res = await exportManifestListApi(this.multipleForm)
      if (res.ok && !!res.content) {
        const link = document.createElement('a')
        link.download = 'cas_order.xlsx'
        link.href = res.content
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      this.loading = false
    },
    async declarationFeedback() {
      this.selectedItems = this.gridApi.getSelectedRows()
      console.log(this.selectedItems)
      if (!this.selectedItems || this.selectedItems.length === 0) {
        this.$message.warning(this.$t('preManifest.dataEmptyInvalid'))
        return false
      }
      this.dialogVisible = true
    },
    declareStatusChange(val) {
      if (val === 2) {
        this.$set(this.updateStatusForm, 'declareFeedback', '')
      } else if (val === 3) {
        this.$set(this.updateStatusForm, 'declareFeedback', this.$t('preManifest.soNoAcceptSuccess'))
      }
    },

    /** 选中装货港 */
    getItemFromChild(val, key) {
      this.multipleForm[key] = val.code5
      if (val.code5) {
        this.getList()
      }
    },
    sendUpdateStatus() { // 提交申报反馈
      this.$refs.soNoSelectionForm.validate(async valid => {
        if (valid) {
          this.loading = true
          let ids = this.selectedItems.map(item => item.id)
          let params = {
              ...this.updateStatusForm
          }
          const res = await manifestUpdateStatusApi(params, ids.join(','))
          this.loading = false
          if (res.ok) {
            this.$message.success(this.$t('charteredBoat.submitSuccess'))
          }
         this.closeSoNoDialog()
         this.getList()
        }
      })
    },
    closeSoNoDialog() {
      this.$refs.soNoSelectionForm.resetFields()
      this.dialogVisible = false
    }
  },
  async created() {
    this.VUE_APP_BASE_API = process.env.VUE_APP_BASE_API
    // const res = await manifestSoNoListApi()
    // if (res.ok) {
    //   this.soNoList = res.content
    // }
  },
  mounted() {
    this.getList()
  }
}

</script>
<style lang='scss' scoped>
// .sys-right-inner-wrap {
//   height: 100%;
//   overflow: hidden;
//   overflow-y: auto;
// }

.container-wrap {
  margin-top: 20px;
  padding: 10px 20px;
  background: #fff;
}

.pagination-wrap {
  margin-top: 20px;
  text-align: right;
}

.features-btn {
  margin-top: 15px;
}

.dataTable {
  margin-top: 15px;
}
.operating { display: flex;
  i {
    font-size: 16px;
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      transition: all 0.2s ease 0s;
    }
  }
}

.status-text {
  &.info-text {
    color: #909399;
  }

  &.warning-text {
    color: #E6A23C;
  }

  &.success-text {
    color: #67C23A;
  }

  &.danger-text {
    color: #F56C6C;
  }

  &.primary-text {
    color: #409EFF;
  }
}
.primary-text {
  color: #409EFF;
}
.billForm {
  display: flex; flex-wrap: wrap;
  .title{
    font-family: 'Arial Negreta', 'Arial';
    font-weight: 700;
    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;
    span{ color: red}
  }
  .phoneCon{
    display: flex; justify-content: space-between;
  }
  .phone{ width: 30%;}
}
.go-ams{  margin-right: 8px;}
.el-icon-click,.el-icon-edit,.el-icon-download{cursor: pointer; transition: all 0.2s ease 0s;
  &:hover{ transform: scale(1.1)}
}
.change-label-calss ::v-deep .el-form-item__label{
  width: 200px !important;
}

.billForm ::v-deep {
  .el-form-item--medium .el-form-item__content {
    width: 70% ;
  }
  .el-form-item{
    width: 100%;
  }
}
::v-deep .el-table__expand-column{
  pointer-events: none;
}
::v-deep .el-table__expand-column .el-icon{
  visibility:hidden;
}
.list-operating{
  display: flex; justify-content: space-between;
  ::v-deep .el-button{ margin-left: 0;}
}
//.list-operating ::v-deep .el-button{ margin-left: 0;}
</style>

