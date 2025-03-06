<template>
  <div v-loading="loading" class="right-main-wrapper">
    <top-search-items-slot :searchFun="getData" :resetFun="clearSearchForm">
      <el-form slot="multipleSearch" ref="multipleForm" :inline="true" :model="multipleForm" label-width="80px"  size="mini" @submit.native.prevent style="max-width: 1000px;">
        <el-form-item label="" prop="numbers">
          <el-input v-trim :placeholder="$t('common.placeholder')" v-model="multipleForm.numbers" class="input-with-select" style="width: 440px;" clearable @keyup.enter.native="getData">
            <el-select v-model="multipleForm.queryNumberConditions" slot="prepend" style="width: 110px;">
              <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-input>
          <!-- <el-input :placeholder="$t('common.placeholder')" v-model="multipleForm.numbers" clearable @keyup.enter.native="getData" style="width: 320px;"></el-input> -->
        </el-form-item>
        <el-form-item :label="$t('packageWarehouse.distrainDate')" prop="distrainDate">
          <CommonPicker
            v-model="distrainDate"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetimerange"
            :clearable="true"
            :defaultTime="defaultTimeStr" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.companyName')}: `" prop="chineseName">
          <RemoteSearchSelector v-model="multipleForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getMemberApi" style="width: 300px;" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.lockType')}: `" prop="lockType">
          <el-select v-model="multipleForm.lockType"
            filterable
            popper-class="higher-popper"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in lockTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.lockedWarehouse')}: `" prop="warehouseId">
          <el-select v-model="multipleForm.warehouseId"
            :placeholder="$t('common.placeholder')">
            <el-option
              v-for="item in warehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="table-wrap">
      <div class="top-btn-wrap">
        <el-button type="primary" size="mini" @click="showCreateDialog = true" :disabled="disabledBtn">{{$t('packageWarehouse.createLock')}}</el-button>
        <el-button type="primary" size="mini" @click="passLock" :disabled="disabledBtn">{{$t('packageWarehouse.passBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="returnLock" :disabled="disabledBtn">{{$t('packageWarehouse.returnBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="checkDestory" :disabled="disabledBtn">{{$t('packageWarehouse.dragBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="followLock" :disabled="disabledBtn">{{$t('packageWarehouse.followBtn')}}</el-button>
        <el-button type="primary" size="mini" @click="exportList">{{$t('packageWarehouse.exportInfo')}}</el-button>
        <el-button type="primary" size="mini" @click="copySelectedInfo($event)">{{$t('packageWarehouse.copySelectedBtn')}}</el-button>
      </div>
      <el-tabs v-model="multipleForm.handlerType" @tab-click="getData">
        <el-tab-pane :label="this.$t('packageWarehouse.scheduleStatusList[0]')" name="0" />
        <el-tab-pane :label="this.$t('packageWarehouse.scheduleStatusList[2]')" name="1" />
      </el-tabs>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :grid-ready="onReady"
        :animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="totalData" :limit.sync="multipleForm.pageSize" :page.sync="multipleForm.pageNum" @pagination="getData" :pageSizes="[200, 500, 1000, 2000]" />
    </div>
    <create-distrain-dialog :showCreat.sync="showCreateDialog" @refreshData="getData" :lockTypeList="createLockTypeList" :numberTypeList="orderTypeList" />
    <el-dialog :visible.sync="showFollowDialog" :title="$t('packageWarehouse.followBtn')" width="550px" :close-on-click-modal="false" :before-close="closeFollowDialog">
      <el-form label-width="80px" :model="followForm" :rules="followFormRule" ref="followForm" size="mini">
        <el-form-item :label="`${$t('packageWarehouse.employeeRemark')}: `" prop="remark">
          <el-input v-model="followForm.remark" rows="3" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" :loading="loading" size="mini" @click="validateFollowForm">{{$t('common.submitBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeFollowDialog">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showDestoryDialog" :title="$t('packageWarehouse.dragBtn')" width="550px" :close-on-click-modal="false" :before-close="closeDestoryDialog">
      <el-form label-width="80px" :model="destoryForm" :rules="destoryFormRule" ref="destoryForm" size="mini">
        <el-form-item :label="`${$t('packageWarehouse.employeeRemark')}: `" prop="remark">
          <el-input v-model="destoryForm.remark2" rows="3" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" :loading="loading" size="mini" @click="validateDestoryForm">{{$t('common.submitBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDestoryDialog">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showReturnDialog" :title="$t('packageWarehouse.returnBtn')" width="400px" :close-on-click-modal="false" :before-close="closeReturnDialog">
      <el-form label-width="100px" style="width: 360px;" :model="returnForm" :rules="returnFormRule" ref="returnForm" size="mini">
        <el-form-item :label="`${$t('packageWarehouse.backType')}: `" prop="backType">
          <el-select v-model="returnForm.backType"
            :placeholder="$t('common.placeholder')"
            filterable
            default-first-option>
            <el-option
              v-for="item in returnCategory"
              :key="item.indexKey"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.logisticNo')}: `" prop="logisticNo" v-show="returnItem === 0">
          <el-input v-model="returnForm.logisticNo" clearable></el-input>
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.providerName')}: `" prop="providerName" v-show="returnItem === 0">
          <el-select v-model="returnForm.providerName"
            :placeholder="$t('common.placeholder')"
            clearable
            filterable
            allow-create
            default-first-option>
            <el-option
              v-for="item in providerList"
              :key="item.indexKey"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 司机退回 -->
        <template v-if="returnItem === 1">
          <el-form-item :label="`${$t('packageWarehouse.driverManager.driver')}: `" prop="driver">
            <RemoteSelectObject ref="RemoteSelectObject" v-model="driverInfo" :placeholder="$t('common.placeholder')" :remote-api="getDriverDropdownApi" :value-key="'id'" :label-key="'driver'" />
          </el-form-item>
          <el-form-item :label="`${$t('packageWarehouse.plateNo')}: `" prop="plateNo">
            <el-input v-model="returnForm.plateNo" clearable></el-input>
          </el-form-item>
          <el-form-item :label="`${$t('packageWarehouse.driverManager.driverPhone')}: `" prop="driverPhone">
            <el-input v-model="returnForm.driverPhone" clearable></el-input>
          </el-form-item>
        </template>
        <!-- 客户委托第三方提货 -->
        <template v-else-if="returnItem === 3">
          <el-form-item :label="`${$t('packageWarehouse.plateNo')}: `" prop="plateNo">
            <el-input v-model="returnForm.plateNo" clearable></el-input>
          </el-form-item>
          <el-form-item :label="`${$t('packageWarehouse.entrustedCompany')}: `" prop="entrustedCompany">
            <el-input v-model="returnForm.entrustedCompany" clearable></el-input>
          </el-form-item>
        </template>
        <!-- 其他情况退回 -->
        <template v-else>
          <el-form-item :label="`${$t('packageWarehouse.customerSignature')}: `" prop="customerSignature">
            <el-input v-model="returnForm.customerSignature" clearable></el-input>
          </el-form-item>
        </template>
        <el-form-item :label="`${$t('packageWarehouse.employeeRemark')}: `" prop="remark2">
          <el-input v-model="returnForm.remark2" rows="3" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" :loading="loading" size="mini" @click="validateReturnForm">{{$t('common.submitBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeReturnDialog">{{$t('common.cancelBtn')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getLockTypeListApi,
  getCreateLockTypeListApi,
  getDistrainListApi,
  distrainPassApi,
  distrainReturnApi,
  distrainFollowApi,
  destrainDropApi,
  exportDistrainApi,
  getWarehouseListApi,
  getDriverDropdownApi
} from '@/api/packageWarehouse'
import { getRemoteMemberApi } from '@/api/user'
import CreateDistrainDialog from './components/CreateDistrainDialog'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import RemoteSelectObject from './components/RemoteSelectObject'
import DistrainLabel from './components/DistrainLabel'
import clipboard from '@/utils/clipboard'
import ImgPreview from './components/ImgPreview'
import InnerMixins from './mixin/InnerMixins'
export default {
  name: 'DistrainList',
  components: {
    CreateDistrainDialog,
    RemoteSearchSelector,
    RemoteSelectObject,
    DistrainLabel,
    ImgPreview
  },
  mixins: [InnerMixins],
  filters: {},
  data() {
    return {
      driverInfo: null,
      getDriverDropdownApi: getDriverDropdownApi,
      loading: false,
      remoteLoading: false,
      totalData: 0,
      distrainDate: [],
      showCreateDialog: false,
      showFollowDialog: false,
      showDestoryDialog: false,
      showReturnDialog: false,
      defaultTimeStr: ['12:00:00', '12:00:00'],
      multipleForm: {
        queryNumberConditions: 0,
        numbers: '',
        lockTimeBegin: null,
        lockTimeEnd: null,
        memberId: '',
        lockType: null,
        warehouseId: null,
        pageSize: 200,
        pageNum: 1,
        handlerType: 0
      },
      destoryForm: {
        ids: [],
        remark2: ''
      },
      destoryFormRule: {
        remark2: [
          { required: true, message: this.$t('packageWarehouse.remarkEmptyError'), trigger: 'blur' }
        ]
      },
      followForm: {
        ids: [],
        remark: ''
      },
      followFormRule: {
        remark: [
          { required: true, message: this.$t('packageWarehouse.remarkEmptyError'), trigger: 'blur' }
        ]
      },
      returnForm: {
        ids: [],
        remark2: '',
        providerName: '',
        logisticNo: '',
        customerSignature: '',
        backType: this.$t('packageWarehouse.backTypeArr[0]'),
        entrustedCompany: '',
        plateNo: '',
        driver: '',
        driverPhone: ''
      },
      returnFormRule: {
        backType: [
          { required: true, message: this.$t('packageWarehouse.backTypeEmptyErr'), trigger: 'change' }
        ],
        logisticNo: [
          { required: true, message: this.$t('packageWarehouse.logisticNoEmptyErr'), trigger: 'blur' }
        ],
        providerName: [
          { required: true, message: this.$t('packageWarehouse.providerNameEmptyErr'), trigger: 'change' }
        ],
        driver: [
          { required: true, message: this.$t('packageWarehouse.driverEmptyErr'), trigger: 'change' }
        ],
        customerSignature: [
          { required: true, message: this.$t('packageWarehouse.customerSignatureEmptyErr'), trigger: 'blur' }
        ],
        entrustedCompany: [
          { required: true, message: this.$t('packageWarehouse.entrustedCompanyEmptyErr'), trigger: 'blur' }
        ]
        // driver: [
        //   { required: true, message: this.$t('packageWarehouse.entrustedCompanyEmptyErr'), trigger: 'blur' }
        // ],
        // driverPhone: [
        //   { required: true, message: this.$t('packageWarehouse.entrustedCompanyEmptyErr'), trigger: 'blur' }
        // ]
        // remark2: [
        //   { required: true, message: this.$t('packageWarehouse.remarkEmptyError'), trigger: 'blur' }
        // ]
      },
      warehouseList: [],
      driverList: [],
      dataList: [],
      gridApi: null,
      columnApi: null,
      gridOptions: null,
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
      columnFields: [],
      lockTypeList: [],
      createLockTypeList: [],
      passLockNumber: [1, 2, 6, 8, 9, 11, 12, 13, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 101, 102, 201],
      returnCategory: [
        {
          label: this.$t('packageWarehouse.backTypeArr[0]'),
          value: this.$t('packageWarehouse.backTypeArr[0]'),
          indexKey: 'KD'
        },
        {
          label: this.$t('packageWarehouse.backTypeArr[1]'),
          value: this.$t('packageWarehouse.backTypeArr[1]'),
          indexKey: 'DV'
        },
        {
          label: this.$t('packageWarehouse.backTypeArr[2]'),
          value: this.$t('packageWarehouse.backTypeArr[2]'),
          indexKey: 'CU'
        },
        {
          label: this.$t('packageWarehouse.backTypeArr[3]'),
          value: this.$t('packageWarehouse.backTypeArr[3]'),
          indexKey: 'THD'
        }
      ],
      orderTypeList: [
        {
          value: 0,
          label: this.$t('packageWarehouse.trackingNo')
        },
        {
          value: 1,
          label: this.$t('packageWarehouse.orderNo')
        },
        {
          value: 2,
          label: this.$t('packageWarehouse.customerRefNo')
        }
        // {
        //   value: 3,
        //   label: this.$t('packageWarehouse.containerNo')
        // },
        // {
        //   value: 4,
        //   label: this.$t('packageWarehouse.trackingNo2')
        // }
      ]
    }
  },
  computed: {
    disabledBtn() {
      return this.multipleForm.handlerType === 1
    },
    returnItem() {
      let typeNo = 0
      if (this.returnForm.backType === this.$t('packageWarehouse.backTypeArr[0]')) {
        typeNo = 0
      } else if (this.returnForm.backType === this.$t('packageWarehouse.backTypeArr[1]')) {
        typeNo = 1
      } else if (this.returnForm.backType === this.$t('packageWarehouse.backTypeArr[2]')) {
        typeNo = 2
      } else if (this.returnForm.backType === this.$t('packageWarehouse.backTypeArr[3]')) {
        typeNo = 3
      } else {
        typeNo = 0
      }
      return typeNo
    },
    getMemberApi: function() {
      return getRemoteMemberApi
    }
  },
  watch: {
    distrainDate: function(arr) {
      if (arr.length > 1) {
        this.multipleForm.lockTimeBegin = arr[0]
        this.multipleForm.lockTimeEnd = arr[1]
      } else {
        this.multipleForm.lockTimeBegin = null
        this.multipleForm.lockTimeEnd = null
      }
    },
    driverInfo: function(newVal, oldVal) {
      if (newVal) {
        this.returnForm.plateNo = newVal.plateNo || ''
        this.returnForm.driver = newVal.driver || ''
        this.returnForm.driverPhone = newVal.driverPhone || ''
      }
    }
  },
  methods: {
    // AG GRID
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
      this.resetHeight()
      // window.addEventListener('resize', () => {
      //   this.throttle(this.calcHeight, 200, 300)
      //   setTimeout(() => {
      //     params.api.sizeColumnsToFit()
      //   })
      // })
    },
    async getLockTypeList() {
      const res = await getLockTypeListApi()
      if (res && res.ok && res.content) {
        this.lockTypeList = [
          {
            label: this.$t('common.all'),
            value: null
          }
        ]
        res.content.forEach(item => {
          this.lockTypeList.push({
            label: item.name,
            value: item.code
          })
        })
      }
    },
    async getCreateLockTypeList() {
      const res = await getCreateLockTypeListApi()
      if (res && res.ok && res.content) {
        res.content.forEach(item => {
          if (item.code >= 0) {
            this.createLockTypeList.push({
              label: item.name,
              value: item.code
            })
          }
        })
      }
    },
    async getWarehouseList() {
      const res = await getWarehouseListApi({pageNum: 1, pageSize: 100})
      if (res && res.ok && res.content) {
        this.warehouseList = [
          {
            label: this.$t('packageWarehouse.statusAll'),
            value: null
          }
        ]

        res.content.list.forEach(item => {
          this.warehouseList.push({
            label: item.name,
            value: item.id
          })
        })
      }
    },
    async getData() {
      this.loading = true
      this.multipleForm.numbers = this.multipleForm.numbers.trim()
      const res = await getDistrainListApi(this.multipleForm)
      this.dataList = []
      if (res && res.ok && res.content) {
        if (res.content.list) {
          this.dataList = res.content.list
          this.getAddressInfo()
        }
        this.totalData = parseInt(res.content.total, 10)
      } else {
        this.dataList = []
        this.totalData = 0
      }
      this.loading = false
      return true
    },
    getAddressInfo() {
      this.dataList.map(item => {
        if (this.$isNotEmpty(item.extDTO.extJson)) {
          let str = ''
          const _obj = JSON.parse(item.extDTO.extJson)
          if (this.$isNotEmpty(_obj)) {
            str = `${this.$t('packageWarehouse.consigneeName')}: ${this.getObjValue(_obj.consigneeName)}, ${this.$t('packageWarehouse.consigneeTel')}: ${this.getObjValue(_obj.consigneeTel)}, ${this.$t('packageWarehouse.consigneeAddress')}: ${this.getObjValue(_obj.consigneeProvince)} ${this.getObjValue(_obj.consigneeCity)} ${this.getObjValue(_obj.consigneeDistrict)} ${this.getObjValue(_obj.consigneeMinute)}, ${this.$t('packageWarehouse.consigneeZipcode')}: ${this.getObjValue(_obj.consigneeZipcode)}`
          }
          item.address = str
        } else {
          item.address = ''
        }
      })
    },
    getObjValue(val) {
      return this.$isNotEmpty(val) ? val : ''
    },
    clearSearchForm() {
      if (this.$refs.singleForm) {
        this.$refs.singleForm.resetFields()
      }

      if (this.$refs.multipleForm) {
        this.$refs.multipleForm.resetFields()
      }
      this.distrainDate = []
      this.getData()
    },
    async passLock() {
      const _obj = this.checkList()
      if (_obj.submit && this.passLockNumber.includes(_obj.lockType)) {
        this.loading = true
        const res = await distrainPassApi({ids: _obj.ids, lockType: _obj.lockType})
        if (res.ok) {
          this.$message.success(this.$t('packageWarehouse.operationSuccess'))
          this.getData()
        } else {
          this.loading = false
        }
      } else if (_obj.submit) {
        this.$message.warning(this.$t('packageWarehouse.typeErrorWarning'))
      }
    },
    async returnLock() {
      const _obj = this.checkList(false)
      if (_obj.submit) {
        this.showReturnDialog = true
        // this.loading = true
        // const res = await distrainReturnApi({ids: _obj.ids})
        // if (res.ok) {
        //   this.$message.success(this.$t('packageWarehouse.operationSuccess'))
        //   this.getData()
        // } else {
        //   this.loading = false
        // }
      }
    },
    followLock() {
      let _tpl_arr = this.gridApi.getSelectedRows()
      if (_tpl_arr.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.multipleSelectorEmpty'))
      } else if (_tpl_arr.length === 1) {
        this.followForm.ids = _tpl_arr.map(item => item.id)
        this.showFollowDialog = true
      } else if (_tpl_arr.filter(item => item.remark.length > 0).length > 0) {
        this.$message.warning(this.$t('packageWarehouse.remarkIvalidWarning'))
      } else {
        this.followForm.ids = _tpl_arr.map(item => item.id)
        this.showFollowDialog = true
      }
    },
    checkDestory() {
      const _obj = this.checkList(false)
      if (_obj.submit) {
        this.showDestoryDialog = true
      }
    },
    async exportList() {
      let _tpl_arr = this.gridApi.getSelectedRows()
      let params = {}
      if (_tpl_arr.length === 0) {
        // 按查询条件导出
        params = this.multipleForm
      } else {
        // 按选择条目导出
        params = {
          ids: _tpl_arr.map(item => item.id),
          handlerType: this.multipleForm.handlerType
        }
      }

      this.loading = true
      const res = await exportDistrainApi(params)
      if (res.ok) {
        this.downloadFile({fileName: '', url: res.content})
      }
      this.loading = false
    },
    copySelectedInfo($event) { // 复制汇总数据
      const selectedItems = this.gridApi.getSelectedRows()
      if (!selectedItems || selectedItems.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.multipleSelectorEmpty'))
        return false
      }
      let copyStr = ""
      // 按尺寸组成新数组
      selectedItems.forEach(v => {
        copyStr += `${this.$t('packageWarehouse.trackingNo')}: ${v.trackingNo}, `
        copyStr += `${this.$t('packageWarehouse.createWeight')}: ${v.createWeight ? v.createWeight : this.$t('common.nullText')}, `
        copyStr += `${this.$t('packageWarehouse.declareWeight')}: ${v.declareWeight ? v.declareWeight : this.$t('common.nullText')}, `
        copyStr += `${this.$t('packageWarehouse.inboundWeight')}: ${v.inboundWeight ? v.inboundWeight : this.$t('common.nullText')}\r\n`
      })

      clipboard(copyStr, $event, this.$t('packageWarehouse.copySuccess'), this.$t('packageWarehouse.copyFailed'))
    },
    checkList(checkType = true) {
      // 没有勾选不能提交
      let _tpl_arr = this.gridApi.getSelectedRows()
      if (_tpl_arr.length === 0) {
        this.$message.warning(this.$t('packageWarehouse.multipleSelectorEmpty'))
        return {
          submit: false
        }
      }

      const _lockType = _tpl_arr[0].lockType
      if (checkType) {
        // 类型全部相等才能提交
        if (!_tpl_arr.every(item => item.lockType === _lockType)) {
          this.$message.warning(this.$t('packageWarehouse.lockTypeDiffrentError'))
          return {
            submit: false
          }
        }
      }

      return {
        submit: true,
        lockType: _lockType,
        ids: _tpl_arr.map(item => item.id)
      }
    },
    validateFollowForm() {
      this.$refs.followForm.validate(valid => {
        if (valid) {
          this.submitFollowForm()
        }
      })
    },
    validateDestoryForm() {
      this.$refs.destoryForm.validate(valid => {
        if (valid) {
          this.submitDestoryForm()
        }
      })
    },
    validateReturnForm() {
      this.$refs.returnForm.validateField('backType', errorMessage => {
        if (errorMessage === '') {
          this.checkReturnForm()
        }
      })
    },
    checkReturnForm() {
      let validField = []
      if (this.returnForm.backType === this.$t('packageWarehouse.backTypeArr[0]')) {
        validField = ['logisticNo', 'providerName']
      } else if (this.returnForm.backType === this.$t('packageWarehouse.backTypeArr[1]')) {
        validField = ['driver']
      } else if (this.returnForm.backType === this.$t('packageWarehouse.backTypeArr[2]')) {
        validField = ['customerSignature']
      } else {
        validField = ['entrustedCompany', 'plateNo']
      }

      Promise.all(
        validField.map(field => new Promise((resolve, reject) => {
            this.$refs.returnForm.validateField(field, errorMessage => {
              resolve(errorMessage)
            })
          }))
      ).then(errorMessages => {
        let valid = errorMessages.every(errorMessage => errorMessage === '')
        if (valid) {
          this.submitReturnForm()
        }
      })
    },
    async submitFollowForm() {
      this.loading = true
      const res = await distrainFollowApi(this.followForm)
      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.followSuccess'))
        this.closeFollowDialog()
        this.getData()
      } else {
        this.loading = false
      }
    },
    async submitDestoryForm() {
      this.loading = true
      const _obj = this.checkList(false)
      this.destoryForm.ids = _obj.ids
      const res = await destrainDropApi(this.destoryForm)
      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.operationSuccess'))
        this.closeDestoryDialog()
        this.getData()
      } else {
        this.loading = false
      }
    },
    async submitReturnForm() {
      this.loading = true
      const _obj = this.checkList(false)
      this.returnForm.ids = _obj.ids
      const res = await distrainReturnApi(this.returnForm)
      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.operationSuccess'))
        this.closeReturnDialog()
        this.getData()
      } else {
        this.loading = false
      }
    },
    closeFollowDialog(done) {
      this.showFollowDialog = false
      this.followForm = {
        ids: [],
        remark: ''
      }
      this.$refs.followForm.resetFields()
      if (typeof done == 'function') {done()}
      this.$nextTick(() => {
        this.$refs.followForm.clearValidate()
      })
    },
    closeDestoryDialog(done) {
      this.showDestoryDialog = false
      this.destoryForm = {
        ids: [],
        remark2: ''
      }
      this.$refs.destoryForm.resetFields()
      if (typeof done == 'function') {done()}
      this.$nextTick(() => {
        this.$refs.destoryForm.clearValidate()
      })
    },
    closeReturnDialog(done) {
      this.showReturnDialog = false
      this.returnForm = {
        ids: [],
        remark2: '',
        providerName: '',
        logisticNo: '',
        customerSignature: '',
        backType: this.$t('packageWarehouse.backTypeArr[0]'),
        entrustedCompany: '',
        plateNo: '',
        driver: '',
        driverPhone: ''
      }
      this.$refs.returnForm.resetFields()
      if (this.$refs.RemoteSelectObject) {
        this.$refs.RemoteSelectObject.clearInfo()
      }
      if (typeof done == 'function') {done()}
      this.$nextTick(() => {
        this.$refs.returnForm.clearValidate()
      })
    },
    resetHeight() {
      const _height = this.calcHeight() + 50
      this.gridHeight = {
        height: `calc(100vh - ${_height}px)`
      }
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
        field: 'orderNo',
        headerName: this.$t('packageWarehouse.orderNo'),
        minWidth: 200,
        pinned: 'left',
        tooltip: params => params.value,
        cellRendererFramework: 'DistrainLabel'
      },
      {
        field: 'trackingNo',
        headerName: this.$t('packageWarehouse.trackingNo'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'lockTypeName',
        headerName: this.$t('packageWarehouse.lockType'),
        minWidth: 120,
        tooltip: params => params.value
      },
      {
        field: 'planCodeName',
        headerName: this.$t('packageWarehouse.planCodeName'),
        minWidth: 100,
        tooltip: params => this.$isNotEmpty(params.value) ? params.value : ''
      },
      {
        field: 'lockTime',
        headerName: this.$t('packageWarehouse.distrainDate'),
        minWidth: 200,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'chineseName',
        headerName: this.$t('packageWarehouse.chineseName'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'customerRefNo',
        headerName: this.$t('packageWarehouse.customerRefNo'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'warehouseName',
        headerName: this.$t('packageWarehouse.warehouseName'),
        minWidth: 120
      },
      {
        field: 'createWeight',
        headerName: this.$t('packageWarehouse.createWeight'),
        minWidth: 120
      },
      {
        field: 'declareWeight',
        headerName: this.$t('packageWarehouse.declareWeight'),
        minWidth: 120
      },
      {
        field: 'inboundWeight',
        headerName: this.$t('packageWarehouse.inboundWeight'),
        minWidth: 120
      },
      {
        field: 'inboundPersonName',
        headerName: this.$t('packageWarehouse.inboundPersonName'),
        minWidth: 120
      },
      {
        field: 'passPersonName',
        headerName: this.$t('packageWarehouse.passPersonName'),
        minWidth: 120
      },
      {
        field: 'passTime',
        headerName: this.$t('packageWarehouse.passTime'),
        minWidth: 200,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'remark',
        headerName: this.$t('packageWarehouse.employeeRemark'),
        minWidth: 200,
        tooltip: params => params.value
      },
      // {
      //   field: 'createByName',
      //   headerName: this.$t('packageWarehouse.createByName'),
      //   minWidth: 100
      // },
      {
        field: 'extDTO.logisticNo',
        headerName: this.$t('packageWarehouse.logisticNo'),
        minWidth: 120
      },
      {
        field: 'extDTO.providerName',
        headerName: this.$t('packageWarehouse.providerName'),
        minWidth: 120
      },
      {
        field: 'extDTO.plateNo',
        headerName: this.$t('packageWarehouse.driverManager.plateNo'),
        minWidth: 120
      },
      {
        field: 'extDTO.driver',
        headerName: this.$t('packageWarehouse.driverManager.driver'),
        minWidth: 120
      },
      {
        field: 'extDTO.driverPhone',
        headerName: this.$t('packageWarehouse.driverManager.driverPhone'),
        minWidth: 120
      },
      {
        field: 'extDTO.customerSignature',
        headerName: this.$t('packageWarehouse.customerSignature'),
        minWidth: 120
      },
      {
        field: 'extDTO.entrustedCompany',
        headerName: this.$t('packageWarehouse.entrustedCompany'),
        minWidth: 120
      },
      {
        field: 'backPersonName',
        headerName: this.$t('packageWarehouse.returnPersonName'),
        minWidth: 120
      },
      {
        field: 'backTime',
        headerName: this.$t('packageWarehouse.returnTime'),
        minWidth: 200,
        cellRenderer: params => params.value ? `${this.$moment(Number(params.value)).format('YYYY-MM-DD HH:mm:ss')}` : ''
      },
      {
        field: 'extDTO.backType',
        headerName: this.$t('packageWarehouse.backType'),
        minWidth: 180
      },
      {
        field: 'address',
        headerName: this.$t('packageWarehouse.backAddress'),
        minWidth: 300,
        tooltip: params => params.value
      },
      {
        field: 'extDTO.remark2',
        headerName: this.$t('packageWarehouse.returnRemark'),
        minWidth: 200,
        tooltip: params => params.value
      },
      {
        field: 'lockInfoStateName',
        headerName: this.$t('packageWarehouse.status'),
        minWidth: 120
      },
      {
        field: 'saveImageUrlList',
        headerName: this.$t('packageWarehouse.saveImageUrlList'),
        minWidth: 100,
        cellRendererFramework: 'ImgPreview'
      },
      {
        field: 'backImageUrlList',
        headerName: this.$t('packageWarehouse.backImageUrlList'),
        minWidth: 100,
        cellRendererFramework: 'ImgPreview'
      },
      {
        field: 'createByName',
        headerName: this.$t('packageWarehouse.createByName'),
        minWidth: 100,
        pinned: 'right'
      }
    ]

    this.getData()
    this.getWarehouseList()
    this.getLockTypeList()
    this.getCreateLockTypeList()
  },
  mounted() {
    window.addEventListener('resize', this.throttle(this.resetHeight, 200, 300))
  }
}
</script>
<style lang="scss">
  @import "./mixin/highlight";
  .higher-popper{
    .el-scrollbar{
      .el-select-dropdown__wrap{
        max-height: 400px!important;
      }
    }
  }
</style>
