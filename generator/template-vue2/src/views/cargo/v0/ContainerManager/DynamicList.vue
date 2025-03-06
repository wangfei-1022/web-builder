<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item :label="`${$t('containerManager.containerNumber')}: `" prop="containerNo">
          <el-input v-model="multipleForm.containerNo" type="text" :placeholder="$t('common.placeholder')" clearable @clear="getData" @keyup.enter.native="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.dynamicList.containerTypeLong')}: `" prop="containerTypes">
          <el-select v-model="multipleForm.containerTypes"
            multiple
            :multiple-limit="5"
            filterable
            @visible-change="handlerVisible"
            @remove-tag="handleTagRemove"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in containerTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.operationYard')}: `" prop="operationYard">
          <el-select
            v-model="multipleForm.operationYard"
            filterable
            remote
            reserve-keyword
            clearable
            :placeholder="$t('common.placeholder')"
            :remote-method="filterYardList"
            :loading="remoteLoading"
            @change="getData">
            <el-option
              v-for="item in yardList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.opreatorTime')}: `" prop="opreatorTime">
          <CommonPicker
            v-model="opreatorTime"
            pickerFormat="yyyy-MM-dd HH:mm"
            pikcerType="datetimerange"
            :clearable="true"
            @change="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.status')}: `" prop="statusName">
          <el-select v-model="multipleForm.statusName" clearable @change="getData">
            <el-option v-for="item in statusNameList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.operationCode')}: `" prop="operationCode">
          <el-select v-model="multipleForm.operationCode" filterable clearable @change="getData">
            <el-option v-for="item in operationCodeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.dynamicList.fullOrEmpty')}: `" prop="emptyWeight">
          <el-select v-model="multipleForm.emptyWeight"
            clearable
            @change="getData"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in emptyWeightList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.operationPort')}: `" prop="operationPort">
          <el-select
            v-model="multipleForm.operationPort"
            filterable
            remote
            reserve-keyword
            clearable
            :placeholder="$t('common.fiveCharCodePlaceholder')"
            :remote-method="filterPortCode"
            :loading="remoteLoading"
            @change="getData">
            <el-option
              v-for="item in portList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.destinationPort')}: `" prop="destinationPort">
          <el-select
            v-model="multipleForm.destinationPort"
            filterable
            remote
            reserve-keyword
            :placeholder="$t('common.fiveCharCodePlaceholder')"
            clearable
            :remote-method="filterPortCode"
            :loading="remoteLoading"
            @change="getData">
            <el-option
              v-for="item in portList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.dynamicList.blNo')}: `" prop="blNo">
          <el-input v-model="multipleForm.blNo" type="text" :placeholder="$t('common.placeholder')" clearable @clear="getData" @keyup.enter.native="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.vesselName')}: `" prop="vesselName">
          <el-input v-model="multipleForm.vesselName" type="text" :placeholder="$t('common.placeholder')" clearable @clear="getData" @keyup.enter.native="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.voyageNo')}: `" prop="voyageNo">
          <el-input v-model="multipleForm.voyageNo" type="text" :placeholder="$t('common.placeholder')" clearable @clear="getData" @keyup.enter.native="getData" />
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.dynamicList.businessType')}: `" prop="businessType">
          <el-select v-model="multipleForm.businessType"
            clearable
            @change="getData"
            :placeholder="$t('common.selectPlaceholder')">
            <el-option
              v-for="item in businessTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('containerManager.dynamicList.activeFlag')}: `" prop="activeFlag">
          <el-checkbox v-model="activeFlag"></el-checkbox>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap mb-10">
        <!-- <el-button type="primary" size="mini" v-permission="['ctn:dynamic:import']" @click="showUploadDialog = true">批量导入更新</el-button>
        <el-button type="primary" size="mini" v-permission="['ctn:dynamic:export']" @click="exportList">导出</el-button> -->
        <el-button type="primary" size="mini" @click="showUploadDialog = true">{{$t('containerManager.dynamicList.batchUpdate')}}</el-button>
        <el-button type="primary" size="mini" @click="exportList">{{$t('common.exportBtn')}}</el-button>
        <!-- <el-button type="danger" size="mini" @click="deleteRows">批量删除</el-button> -->
      </div>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="containerList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" />
    </div>
    <UploadDynamic :title="$t('containerManager.dynamicList.dynamicImportUpdate')" :showImgImport="false" :visible.sync="showUploadDialog" :excel-file-name="$t('containerManager.dynamicList.dynamicImportUpdateTemplet')" @uploadSuccess="getData" :orderType="1" />
  </div>
</template>
<script>
import {
  getDynamicListApi,
  getOpreatorCodeListApi,
  getStatusListApi,
  getOpreatorStatusListApi,
  exportDynamicListApi,
  deleteBatchDynamicApi
} from '@/api/containerDynamic'
import { getContainerTypeList } from '@/api/seaExport'
import { getContainerYardListApi } from '@/api/containerManager'
import { seaportListApi } from '@/api/common'
import DynamicOpreatorBtn from './components/DynamicOpreatorBtn'
import UploadDynamic from './components/UploadDynamic'
import { commonBusinessTypeList, commonEmptyWeightList} from './components/dynamicCommonList'
export default {
  name: 'DynamicList',
  components: {
    UploadDynamic,
    DynamicOpreatorBtn
  },
  filters: {},
  data() {
    return {
      loading: false,
      remoteLoading: false,
      totalData: 0,
      showUploadDialog: false,
      opreatorTime: [],
      activeFlag: false,
      multipleForm: {
        containerNo: '',
        operationYard: '',
        containerTypes: [],
        operationStartTime: null,
        operationEndTime: null,
        statusName: null,
        emptyWeight: null,
        operationCode: '',
        operationPort: '',
        destinationPort: '',
        blNo: '',
        vesselName: '',
        voyageNo: '',
        pageSize: 50,
        pageNum: 1,
        businessType: null
      },
      yardList: [],
      statusNameList: [],
      operationCodeList: [],
      portList: [],
      selectedItems: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      containerList: [],
      containerTypeList: [],
      businessTypeList: commonBusinessTypeList,
      emptyWeightList: commonEmptyWeightList
    }
  },
  computed: {
  },
  watch: {
    activeFlag: function(val) {
      if (val) {
        this.multipleForm.activeFlag = val
      } else {
        delete this.multipleForm.activeFlag
      }
    },
    opreatorTime: function(arr) {
      this.multipleForm.operationStartTime = arr[0]
      this.multipleForm.operationEndTime = arr[1]
    },
    "$route.query": function(query) {
      if (query && query.refresh) {
        this.getData()
      }
    }
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      // window.addEventListener('resize', function() {
      //   setTimeout(function() {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getContainerType() {
      const res = await getContainerTypeList()
      if (res && res.ok) {
        this.containerTypeList = res.content.map(item => ({
            value: item.englishName,
            label: item.englishName
          }))
      }
    },
    async getData() {
      this.loading = true
      const res = await getDynamicListApi(this.multipleForm)
      if (res.ok && res.content) {
        this.containerList = res.content.list
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.containerList = []
        this.totalData = 0
      }
      this.loading = false
    },
    async getOpreatorCodeList() {
      const res = await getOpreatorCodeListApi()
      if (res.ok && res.content) {
        this.operationCodeList = res.content.map(item => ({
            value: item.operationCode,
            label: item.operationCode
          }))
      }
    },
    async getStatusList() {
      const res = await getStatusListApi()
      if (res.ok && res.content) {
        this.statusNameList = res.content.map(item => ({
            value: item.name,
            label: item.name
          }))
      }
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.initOpreatorTime()
      this.activeFlag = true
      this.multipleForm.activeFlag = true
      this.getData()
    },
    async filterYardList(query) {
      this.remoteLoading = true
      if (query.length > 1) {
        const res = await getContainerYardListApi({yardCode: query})
        if (res.ok) {
          this.yardList = res.content.map(item => ({
              label: item.code,
              value: item.code
            }))
        }
      }
      this.remoteLoading = false
    },
    async filterPortCode(query) {
      this.remoteLoading = true
      this.portList = []
      if (query.length > 1) {
        const res = await seaportListApi({keyword: query})
        if (res.ok) {
          this.portList = res.content.map(item => ({
              label: item.code5,
              value: item.code5
            }))
        }
      }
      this.remoteLoading = false
    },
    initOpreatorTime() {
      const _end = this.$moment().set({'hour': 23, 'minute': 59, 'second': 59}).valueOf()
      const _start = this.$moment().add(-1, 'month').set({'hour': 0, 'minute': 0, 'second': 0}).valueOf()
      this.opreatorTime = [_start, _end]
    },
    async exportList() {
      this.selectedItems = this.gridApi.getSelectedRows()
      let res = null
      if (this.selectedItems.length > 0) {
        res = await exportDynamicListApi({logIds: this.selectedItems.map(item => item.id).join(",")})
      } else {
        res = await exportDynamicListApi(this.multipleForm)
      }
      if (res.ok) {
        this.downloadFile({fileName: '', url: res.content})
      }
    },
    deleteRows() {
      this.selectedItems = this.gridApi.getSelectedRows()
      if (this.selectedItems.length === 0) {
        this.$message.warning(this.$t('containerManager.dynamicList.multipleSelectorEmpty'))
      } else {
        const checkCount = this.selectedItems.filter(item => item.activeFlag === false)
        if (checkCount.length > 0) {
          let messageHtml = "<div style='height: 200px; overflow: hidden; overflow-y: auto;'>"
          messageHtml += checkCount.map(item => `<p>${this.$t('containerManager.containerNo')}: ${item.containerNo} ${this.$t('containerManager.dynamicList.dynamicNonLatest')}</p>`).join('')
          messageHtml += "</div>"
          this.$alert(messageHtml, this.$t('containerManager.dynamicList.unremoveable'), {
            dangerouslyUseHTMLString: true
          })
          return false
        }
        this.$confirm(this.$t('common.deleteWarnningTips'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.deleteBtn'),
          cancelButtonText: this.$t('common.cancelBtn'),
          confirmButtonClass: 'el-button--danger',
          type: 'warning'
        }).then(async () => {
          // 删除 操作
          const selectedIds = this.selectedItems.map(item => item.id)
          const deleteRes = await deleteBatchDynamicApi({ids: selectedIds})
          if (deleteRes && deleteRes.ok) {
            this.$message({
              message: this.$t('common.deleteSuccess'),
              type: 'success'
            })
            this.getData()
          }
        }).catch(() => {})
      }
    },
    handlerVisible(visible) {
      if (visible === false) {
        this.getData()
      }
    },
    handleTagRemove(event) {
      this.getData()
    }
  },
  created() {
    this.activeFlag = true
    this.initOpreatorTime()
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      suppressRowClickSelection: true // 选中单元格后可以复制内容
    }
    this.columnFields = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        minWidth: 50,
        pinned: 'left'
      },
      {
        field: 'containerNo',
        headerName: this.$t('containerManager.containerNumber'),
        minWidth: 160,
        pinned: 'left'
      },
      {
        field: 'containerType',
        headerName: this.$t('containerManager.containerType'),
        minWidth: 120
      },
      {
        field: 'statusName',
        headerName: this.$t('containerManager.status'),
        minWidth: 160
      },
      {
        field: 'operationCode',
        headerName: this.$t('containerManager.operationCode'),
        minWidth: 100
      },
      {
        field: 'operationPort',
        headerName: this.$t('containerManager.operationPort'),
        minWidth: 120
      },
      {
        field: 'operationYard',
        headerName: this.$t('containerManager.operationYard'),
        minWidth: 120
      },
      {
        field: 'operationTime',
        headerName: this.$t('containerManager.operationTime'),
        minWidth: 180,
        cellRenderer: params => {
          const _gmt = params.data.timeZone ? params.data.timeZone >= 0 ? `GMT+${params.data.timeZone}` : `GMT${params.data.timeZone}` : ''
          return params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm')} ${_gmt}` : ''
        }
      },
      {
        field: 'soNo',
        headerName: this.$t('containerManager.dynamicList.soNo'),
        minWidth: 120
      },
      {
        field: 'blNo',
        headerName: this.$t('containerManager.dynamicList.blNo'),
        minWidth: 120
      },
      {
        field: 'vesselName',
        headerName: this.$t('containerManager.vesselName'),
        minWidth: 100,
        tooltip: params => params.value
      },
      {
        field: 'voyageNo',
        headerName: this.$t('containerManager.voyageNo'),
        minWidth: 100
      },
      {
        field: 'emptyWeight',
        headerName: this.$t('containerManager.dynamicList.fullPlusEmpty'),
        minWidth: 100,
        cellRenderer: params => {
          let str = ''
          if (!params.value) {
            str = 'E'
          } else if (params.value <= 1) {
            str = 'E'
          } else {
            str = 'F'
          }
          return str
        }
      },
      {
        field: 'destinationPort',
        headerName: this.$t('containerManager.destinationPort'),
        minWidth: 100
      },
      {
        field: 'nextPort',
        headerName: this.$t('containerManager.dynamicList.nextPort'),
        minWidth: 100
      },
      {
        field: 'businessType',
        headerName: this.$t('containerManager.dynamicList.businessType'),
        minWidth: 100,
        cellRenderer: params => {
          let _resText = ''
          switch (params.value) {
            case 1: _resText = this.$t('containerManager.dynamicList.byShip'); break
            case 2: _resText = this.$t('containerManager.dynamicList.railway'); break
            case 3: _resText = this.$t('containerManager.dynamicList.oneWay'); break
            case 4: _resText = this.$t('containerManager.dynamicList.outShip'); break
            case 6: _resText = this.$t('containerManager.dynamicList.shoutOut'); break
            default: _resText = ''; break
          }
          return _resText
        }
      },
      {
        field: 'inYardDays',
        headerName: this.$t('containerManager.insideYardDays'),
        minWidth: 100
      },
      {
        field: 'inPortDays',
        headerName: this.$t('containerManager.insidePortDays'),
        minWidth: 100
      },
      {
        field: 'remark',
        headerName: this.$t('containerManager.remark'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'id',
        headerName: this.$t('common.operation'),
        pinned: 'right',
        minWidth: 200,
        cellRendererFramework: 'DynamicOpreatorBtn',
        cellRendererParams: {refreshData: this.getData}
      }
    ]

    this.getContainerType()
    this.getData()
    this.getOpreatorCodeList()
    this.getStatusList()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>

</style>
