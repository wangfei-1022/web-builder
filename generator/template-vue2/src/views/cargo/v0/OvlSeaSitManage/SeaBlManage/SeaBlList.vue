<template>
  <div v-loading="loading" class="pd-16">
    <div class="mb-10">
      <top-search-items-slot :searchFun="list" :resetFun="reset">
        <template slot="multipleSearch">
          <el-form  ref="formData" :inline="true" :model="formData" class="search-form" label-width="100px">
            <el-form-item class="el-form-item"  :label="getZH('customerName')" prop="customerId">
              <TypeSelect v-model="formData.customerId"  type="customer"  @selected="list" />
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('blOrClearInvoiceNo')" prop="number" label-width="120px">
              <el-input v-model="formData.number" size="mini" :placeholder="getZH('blOrClearInvoiceNo')" clearable @keyup.enter.native="list" />
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('declareDate')" >
               <div class="flex-box">
                <el-select size="mini" v-model="formData.type" class="w-100">
                  <el-option v-for="item in dataTypes" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
                <CommonPicker class="ml-10" v-model="dataTime" pickerFormat="yyyy-MM-dd"  pikcerType="daterange" :clearable="true" />
              </div>
            </el-form-item>
            <el-form-item class="el-form-item" :label="getZH('state')"  prop="blStateList">
              <ConstantSelect url="/api/sit-service/sea/import/bl/blState/selections" :multiple="true" :isHasAll="false"  v-model="formData.blStateList"  @change="list" ></ConstantSelect>
            </el-form-item>
          </el-form>
        </template>
      </top-search-items-slot>
    </div>
    <div class="mb-10 top-btn-wrap">
      <el-button size="mini" type="primary" @click="edit('add')"> {{$t('common.addBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="exchangeOrderData()"> {{$t('seaBl.exchangeOrderBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="updateETAData()"> {{$t('seaBl.updateETAData')}}</el-button>
      <el-button size="mini" type="primary" @click="copyInfoData()"> {{$t('seaBl.copyInfoData')}}</el-button>
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
      :style="gridHeight"
      class="ag-theme-balham"
    />
    <Pagination
      :total="total"
      :limit.sync="formData.pageSize"
      :page.sync="formData.pageNum"
      @pagination="list"
    />
    <TrayUploadDialog :visible.sync="dialog.visible" :blId='activeId' />
    <ExchangeOrderDialog :visible.sync="exchangeOrderVisible" :blId='activeId' />
    <ETAUpdateDialog :visible.sync="eTAUpdateVisible" :blId='activeId' />
  </div>
</template>

<script>
import operationBtn from './components/operationBtn'
import { getSeaBlListApi, submitSeaBlListApi, cancelSeaBlApi } from '@/api/OvlSeaSitManage/seaBl'
import TrayUploadDialog from './components/trayUploadDialog'
import ExchangeOrderDialog from './components/exchangeOrderDialog'
import ETAUpdateDialog from './components/ETAUpdateDialog'
export default {
  name: 'SeaBlList',
  components: { operationBtn, TrayUploadDialog, ExchangeOrderDialog, ETAUpdateDialog },
  data() {
    return {
      formData: {
        type: 1,
        customerId: null,
        blNo: '',
        number: '',
        blState: null,
        declareDateStart: null,
        declareDateEnd: null,
        blStateList: [],
        pageSize: 50,
        pageNum: 1
      },
      activeId: null,
      total: 0,
      dataTime: [],
      printBarcodeVisible: false,
      goodsTypes: [],
      userList: [],
      loading: false,
      exchangeOrderVisible: false,
      eTAUpdateVisible: false,
      shipperList: [],
      countryOptions: [],
      dataList: [],
      dataTypes: [{ value: 1, label: '预报日期' }, { value: 2, label: '到港日期' }],
      columnDefsRight: [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          minWidth: 35,
          maxWidth: 35,
          pinned: 'left'
        },
        {
          headerName: this.getZH('indexNo'),
          field: 'id',
          minWidth: 70,
          cellRenderer: params => `<div class='text-right'>${params.rowIndex + 1}</div>`
        },
        {
          headerName: this.getZH('systemNo'),
          field: 'systemNo',
          minWidth: 150
        },
        {
          headerName: this.getZH('blNo'),
          field: 'blNo',
          minWidth: 140
        },
        {
          headerName: this.getZH('customerName'),
          field: 'customerName',
          minWidth: 140
        },
        {
          headerName: this.getZH('clearInvoiceNo'),
          field: 'clearInvoiceNo',
          minWidth: 140
        },
        {
          headerName: this.getZH('carrierName'),
          field: 'carrierName',
          minWidth: 150
        },
        {
          headerName: this.getZH('vessel'),
          field: 'vessel',
          minWidth: 150
        },
        {
          headerName: this.getZH('voyage'),
          field: 'voyage',
          minWidth: 80
        },
        {
          headerName: this.getZH('podCode'),
          field: 'pod',
          minWidth: 120
        },
        {
          headerName: this.getZH('ETA'),
          field: 'eta',
          minWidth: 120,
          cellRenderer: params => this.formatDate(params.value)
        },
        {
          headerName: this.getZH('ATA'),
          field: 'ata',
          minWidth: 120,
          cellRenderer: params => this.formatDate(params.value)
        },
        {
          headerName: this.getZH('declareDate'),
          field: 'declareDate',
          minWidth: 120,
          cellRenderer: params => this.formatDate(params.value)
        },
        {
          headerName: this.getZH('ctnNum'),
          field: 'ctnNum',
          minWidth: 80,
          cellRenderer: params => `<div class='text-right'>${params.value}</div>`
        },
        {
          headerName: this.getZH('state'),
          field: 'blStateName',
          minWidth: 120
        },
        {
          headerName: this.getZH('createByName'),
          field: 'createByName',
          minWidth: 120
        },
        {
          headerName: this.getZH('operation', 'common'), pinned: 'right', field: `id`, minWidth: 180,
          cellRendererFramework: 'operationBtn'
        }],
      gridOptionsRight: {},
      columnApi: null,
      gridApi: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }
    }
  },
  created() {
    this.gridOptionsRight = {
      context: {
        componentParent: this
      },
      rowSelection: 'multiple', // 设置多行可选
      rowMultiSelectWithClick: true, // 点击及选择复选框
      onSortChanged: event => {
        this.gridApi.redrawRows()
      }
    }
    this.list()
  },
  mounted() {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'SeaBlDetail') {
        vm.list()
      }
    })
  },

  methods: {
    onReadyRight(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      // const self = this
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit()
          // self.onFirstDataRendered()
        })
      })
    },
    // 获取选中数据
    checkSelect() {
      const _selectedRows = this.gridApi.getSelectedRows()
      if (_selectedRows.length === 0) {
        this.$message.error(this.$t('common.multipleSelectorEmpty'))
        return
      }
      if (_selectedRows.length > 1) {
        this.$message.error(this.$t('common.selectorOne'))
        return
      }
      if (_selectedRows[0].state === 1) {
        this.$message.error(this.$t('seaBl.errState'))
        return
      }
      return _selectedRows[0]
    },
    // DO 换单
    exchangeOrderData() {
      let data = this.checkSelect()
      if (this.$isNotEmpty(data)) {
        this.activeId = data.id
        this.exchangeOrderVisible = true
      }
    },
    // ETA更新
    updateETAData() {
      let data = this.checkSelect()
      if (this.$isNotEmpty(data)) {
        this.activeId = data.id
        this.eTAUpdateVisible = true
      }
    },
    // 复制新增
    copyInfoData() {
      let data = this.checkSelect()
      if (this.$isNotEmpty(data)) {
        this.$router.push({ name: `SeaBlDetail`, params: { operate: 'copy', id: data.id } })
      }
    },
    /**
       * 下拉框
       */
    selectZH(key) {
      return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
    },
    /**
     * 输入框
     */
    inputZH(key) {
      return this.getZH('placeholder', 'common') + this.getZH(key)
    },
    /**
     * 获取中英文
     */
    getZH(key, obj) {
      obj = obj || 'seaBl'
      let str = obj + '.' + key
      return this.$t(str)
    },

    /**
       * 获取列表
       */
    async list() {
      this.loading = true
      this.formData.declareDateStart = null
      this.formData.declareDateEnd = null
      this.formData.ataStart = null
      this.formData.ataEnd = null
      if (this.formData.type === 1) {
        this.formData.declareDateStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
        this.formData.declareDateEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
      } else if (this.formData.type === 2) {
        this.formData.ataStart = this.$isNotEmpty(this.dataTime) ? this.dataTime[0] : null
        this.formData.ataEnd = this.$isNotEmpty(this.dataTime) ? this.dataTime[1] + 24 * 60 * 60 * 1000 - 1 : null
      }

      const res = await getSeaBlListApi(this.formData).catch(() => {
        this.loading = false
      })
      if (res && res.ok) {
        res.content.list.forEach((item, index) => {
          item.indexNo = index + 1
        })
        this.dataList = res.content.list || []
        this.total = Number(res.content.total)
        this.loading = false
      } else {
        this.loading = false
      }
    },
    submitData(id) {
      this.$confirm(this.$t('seaBl.submitTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        submitSeaBlListApi({ id }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('common.submitSuccess'))
            this.list()
          }
        })
      }).catch(() => {
        // do nothing
      })

    },
    // 导入集装箱
    exportBox(row) {
      this.activeId = row.id
      if (Number(row.ctnNum) > 0) {
        this.confirmTips(this.$t('seaBl.exportTips')).then(() => {
          this.dialog.visible = true
        })
      } else {
        this.dialog.visible = true
      }
    },
    // 撤销数据
    revocation(id) {
      this.$confirm(this.$t('seaBl.revocationTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('common.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        cancelSeaBlApi(id).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('seaBl.revocationSuccess'))
            this.list()
            this.loading = false
          } else {
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })

      }).catch(() => {
        // do nothing
      })
    },
    /**
     * 新增编辑
     */
    edit(operate, id) {
      this.$router.push({ name: `SeaBlDetail`, params: { operate, id } })
    },
    /**
     * 重置搜索条件
     */
    reset() {
      this.$refs.formData.resetFields()
      this.dataTime = []
      this.list()
    }
  }
}
</script>

<style scoped lang="scss">
.container-wrap {
  margin-top: 20px;
  padding: 10px 20px;
  background: #fff;
}
::v-deep.text-right {
  text-align: right;
}
</style>
