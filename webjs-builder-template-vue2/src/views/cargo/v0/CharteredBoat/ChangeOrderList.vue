<template>
  <div v-loading="loading" class="right-main-wrapper">
    <topSearchItems :show-single-input="false">
      <template #single>
        <div class="right-search-input-wrap">
          <el-input v-model="singleSearchStr" size="mini" type="text" @keyup.enter.native="singleSearchSubmit" />
        </div>
      </template>
      <template #mutliple>
        <div class="multiple-form-wrap">
          <el-form ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px">
            <el-form-item :label="`${$t('charteredBoat.changeOrder.soNoText')}: `" prop="soNo">
              <el-input v-model="multipleForm.soNo" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.containerNo')}: `" prop="containerNo">
              <el-input v-model="multipleForm.containerNo" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.memberName')}: `" prop="memberId">
              <remoteSearchSelector v-model="multipleForm.memberId" @selectorChange="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.vesselName')}: `" prop="vesselName">
              <el-input v-model="multipleForm.vesselName" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.voyageNo')}: `" prop="voyageNo">
              <el-input v-model="multipleForm.voyageNo" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
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
                  topSearch()
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
                  topSearch()
                }"
              />
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.changeOrder.changeContentType')}: `" prop="changeContentType">
              <el-select v-model="multipleForm.changeContentType" size="mini" @change="topSearch">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="1" :label="$t('charteredBoat.changeOrder.sailingDuration')" />
                <el-option value="2" :label="$t('charteredBoat.ownerName')" />
                <el-option value="3" :label="$t('charteredBoat.containerNo')" />
                <el-option value="4" :label="$t('charteredBoat.changeOrder.targetPort')" />
                <el-option value="5" :label="$t('charteredBoat.changeOrder.other')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.changeOrder.processingStatus')}: `" prop="processStatus">
              <el-select v-model="multipleForm.processStatus" size="mini" @change="topSearch">
                <el-option :value="null" :label="$t('common.all')" />
                <el-option value="0" :label="$t('charteredBoat.changeOrder.processing')" />
                <el-option value="1" :label="$t('charteredBoat.changeOrder.processed')" />
                <el-option value="2" :label="$t('common.rejected')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="`${$t('charteredBoat.changeOrder.processedByName')}: `" prop="processedByName">
              <el-input v-model="multipleForm.processedByName" type="text" size="mini" clearable @keyup.enter.native="topSearch" @clear="topSearch" />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <div slot="searchBtnGroup" class="top-search-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-search" @click="topSearch">
          {{$t('common.searchBtn')}}
        </el-button>
        <el-button icon="el-icon-refresh-left" size="mini" @click="clearSearchForm">{{$t('common.resetBtn')}}</el-button>
      </div>
    </topSearchItems>
    <div class="table-wrap">
      <el-dropdown style="margin-right: 10px;" @command="handleCommand">
        <el-button type="primary" size="mini">
          {{$t('common.download')}} <i class="el-icon-arrow-down" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="casOrder">{{$t('charteredBoat.changeOrder.casOrder')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" size="mini" @click="checkSelected">{{$t('charteredBoat.changeOrder.processCasChange')}}</el-button>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="rowData"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        style="width:100%; height:calc(100vh - 420px); margin-top: 10px;"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="pageSize" :page.sync="currPage" @pagination="getList" />
    </div>
    <el-dialog
      v-if="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="$t('charteredBoat.changeOrder.processCasChange')"
      :visible.sync="showDialog"
      width="500px"
    >
      <el-form ref="boxConForm" :model="formDate" label-width="100px">
        <el-form-item :label="$t('charteredBoat.changeOrder.processResult')" prop="processStatus" :rules="[{ required: true, message: $t('charteredBoat.changeOrder.resultEmptyInvalid') }]">
          <el-radio-group v-model="formDate.processStatus">
            <el-radio label="1">{{$t('charteredBoat.changeOrder.processFinished')}}</el-radio>
            <el-radio label="2">{{$t('charteredBoat.changeOrder.processRejected')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('charteredBoat.changeOrder.processRemark')" prop="processRemark" :rules="[{ required: true, message: $t('charteredBoat.changeOrder.remarkEmptyInvalid') }]">
          <el-input v-model="formDate.processRemark" type="textarea" rows="4" style="width: 300px;" :placeholder="$t('common.placeholder')" />
        </el-form-item>
      </el-form>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
        <el-button type="primary" size="mini" @click="confirm">{{$t('charteredBoat.changeOrder.processBtn')}}</el-button>
        <el-button type="" size="mini" @click="cancel">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <ElImageViewer v-show="fileimage" :on-close="()=>{fileimage=false,filepaths=''}" :url-list="[filepaths]" />
  </div>
</template>

<script>
import topSearchItems from './components/topSearchItems'
import TrailerListOptBtn from './components/trailerListOptBtn'
import URL from '@/api/urlTranslator'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import { applicationSignApi, getApplicationListApi, exportApplicationListApi } from '@/api/changeOrder'
import remoteSearchSelector from './components/remoteSearchSelector'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { cloudFileNameApi } from '@/api/commonComponent'
import ChangeOrderViewImg from '@/views/cargo/v0/CharteredBoat/components/ChangeOrderViewImg'
export default {
  name: 'ChangeOrderList',
  components: {
    topSearchItems, TrailerListOptBtn, cargoAdvanceSelect, remoteSearchSelector, ElImageViewer, ChangeOrderViewImg

  },
  data() {
    return {
      url: URL,
      gridApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      loading: false,
      singleSearchStr: '',
      multipleForm: {
        soNo: '',
        containerNo: '',
        multipleForm: '',
        vesselName: '',
        voyageNo: '',
        polCode: '',
        changeContentType: '',
        processStatus: '',
        processedByName: ''
      },
      rowData: [],
      totalData: 0,
      pageSize: 50,
      currPage: 1,
      selectedItems: [],
      showDialog: false,
      formDate: {
        processRemark: '',
        processStatus: ''
      },
      fileimage: false,
      filepaths: ''
    }
  },
  computed: {
    checkStatus() {
      return this.selectedItems.every(item => item.processStatus === 0)
    }
  },
  watch: {},
  mounted() {
    // this.getList()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // if (from.name === 'BLInfo') {

      // }
      vm.getList()
    })
  },
  created() {
    const _self = this
    this.gridOptions = {
      context: {
        componentParent: _self
      },
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
      // suppressCellSelection: true //点击不选中单元格
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: 'left',
        width: 60
      },
      {
        field: 'soNo',
        headerName: 'SO',
        pinned: 'left',
        width: 200,
        tooltipField: 'soNo'
      },
      {
        field: 'containerNo',
        headerName: this.$t('charteredBoat.containerNumber'),
        width: 200
      },
      {
        field: 'containerSizeType',
        headerName: this.$t('charteredBoat.containerType'),
        width: 200
      },
      {
        field: 'containerMaster',
        headerName: this.$t('charteredBoat.ownerName'),
        width: 160
      },
      {
        field: 'vessel',
        headerName: this.$t('charteredBoat.vesselName'),
        width: 160
      },
      {
        field: 'voyage',
        headerName: this.$t('charteredBoat.voyageNo'),
        width: 120
      },
      {
        field: 'memberName',
        headerName: this.$t('charteredBoat.memberName'),
        width: 200,
        tooltipField: 'memberName'
      },
      {
        field: 'polCode',
        headerName: this.$t('charteredBoat.polCode'),
        width: 200
      },
      {
        field: 'podCode',
        headerName: this.$t('charteredBoat.podCode'),
        width: 200
      },
      {
        field: 'changeContentType',
        headerName: this.$t('charteredBoat.changeOrder.changeContentType'),
        width: 200,
        cellRenderer: params => {
          if (params.value === 1) {
            return `<span>${this.$t('charteredBoat.changeOrder.sailingDuration')}</span>`
          } else if (params.value === 2) {
            return `<span>${this.$t('charteredBoat.ownerName')}</span>`
          } else if (params.value === 3) {
            return `<span>${this.$t('charteredBoat.containerNo')}</span>`
          } else if (params.value === 4) {
            return `<span>${this.$t('charteredBoat.changeOrder.targetPort')}</span>`
          } else {
            return `<span>${this.$t('charteredBoat.changeOrder.other')}</span>`
          }
        }
      },
      {
        field: 'changeRemark',
        headerName: this.$t('charteredBoat.changeOrder.changeRemark'),
        width: 200,
        tooltipField: 'changeRemark'
      },
      {
        field: 'guaranteeFileName',
        headerName: this.$t('charteredBoat.changeOrder.guaranteeFileName'),
        width: 200,
        tooltipField: 'guaranteeFileName',
        // cellRenderer: params => {
        //   if (params.value) {
        //     return `<div class="examine">查看</div>`
        //   }
        // },
        // onCellClicked: params => {
        //   this.prePicFile(params.value)
        // },
        cellRendererFramework: 'ChangeOrderViewImg'
      },
      {
        field: 'processStatus',
        headerName: this.$t('charteredBoat.changeOrder.processingStatus'),
        width: 200,
        cellRenderer: params => {
          if (params.value === 0) {
            return `<div class="status-text warning-text">${this.$t('charteredBoat.changeOrder.processing')}</div>`
          } else if (params.value === 1) {
            return `<div  class="status-text success-text">${this.$t('charteredBoat.changeOrder.passed')}</div>`
          } else if (params.value === 2) {
            return `<div  class="status-text danger-text">${this.$t('common.rejected')}</div>`
          }
        }
      },
      {
        field: 'processedByName',
        headerName: this.$t('charteredBoat.changeOrder.opreationByName'),
        width: 200,
        tooltipField: 'processedBy'
      },

      {
        field: 'processTime',
        headerName: this.$t('charteredBoat.changeOrder.processTime'),
        width: 250,
        tooltipField: 'processTime',
        cellRenderer: params => params.value === '' || !params.value ? '' : this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        field: 'processRemark',
        headerName: this.$t('charteredBoat.changeOrder.processRemark'),
        width: 200,
        tooltipField: 'processRemark'
      }
    ]
  },
  methods: {
    async prePicFile(path) {
      const res = await cloudFileNameApi(path)
      if (res.ok && res.content) {
        this.filepaths = res.content
        this.fileimage = true
      }
      // this.filepaths = 'http://api.cmclink.com:8087/getfile?filepath=82/2021/11/03/ZIMNS_GZH0191408-C268C6_-2069707776.pdf' // res.content
      // this.filepaths.push('http://api.cmclink.com:8087/getfile?filepath=82/2021/11/03/ZIMNS_GZH0191408-C268C6_-2069707776.pdf')

    },
    // 下载下拉command处理
    handleCommand(command) {
      this.downloadCasOrder()
    },
    // 下载申请清单
    async downloadCasOrder() {
      this.loading = true
      this.multipleForm.pageNum = this.currPage
      this.multipleForm.pageSize = this.pageSize
      const res = await exportApplicationListApi(this.multipleForm)
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
    onReady(params) {
      this.gridApi = params.api
      this.gridApi.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    singleSearchSubmit() {},
    clearSearchForm() {
      this.$refs.multipleForm.resetFields()
      this.currPage = 1
      this.$refs.polCodeSelect.value = ''
      this.$refs.podCodeSelect.value = ''
      this.getList()
    },
    topSearch() {
      this.currPage = 1
      this.getList()
    },
    refreshData() {
      this.getList()
    },
    async getList() {
      this.loading = true
      const _data = {
        pageNum: this.currPage,
        pageSize: this.pageSize,
        ...this.multipleForm
      }
      const _res = await getApplicationListApi(_data)
      if (_res.ok && _res.content) {
        this.rowData = _res.content.list
        this.totalData = parseInt(_res.content.total)
      }
      this.loading = false
    },
    researchData(_obj) {
      this.pageSize = _obj.size
      this.currPage = _obj.page
      this.getList()
    },
    checkSelected() {
      this.selectedItems = this.gridApi.getSelectedRows()
      console.log(this.selectedItems)
      if (!this.selectedItems || this.selectedItems.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('charteredBoat.changeOrder.changeDataEmptyError')
        })
        return false
      }
      if (!this.checkStatus) {
        this.$message({
          type: 'warning',
          message: this.$t('charteredBoat.changeOrder.processStatusError')
        })

        return false
      }
      this.showDialog = true
    },
    // 提交处理改单
    async confirm(_arr) {
      const ids = []
      for (const item of this.selectedItems) {
        ids.push(item.id)
      }
      this.$refs.boxConForm.validate(async(valid, failFields) => {
        if (valid) {
          const data = {
            ids,
            ...this.formDate
          }
          const _res = await applicationSignApi(data)
          if (_res.ok) {
            this.$message.success(this.$t('charteredBoat.changeOrder.changedSuccess'))
            this.cancel()
            this.refreshData()
          }
        }
      })
    },
    // 取消改单
    cancel() {
      this.$refs.boxConForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
  @import './styles/table.scss';
  ::v-deep .examine{ color: #1890ff; cursor: pointer}
  ::v-deep .el-form-item__error {
    padding-top: 4px;
  }
</style>
