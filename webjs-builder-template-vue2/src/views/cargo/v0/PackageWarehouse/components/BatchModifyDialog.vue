<template>
  <div>
    <el-dialog
    :visible.sync="showDialog"
    width="800px"
    :title="title"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRule" size="mini" label-width="90px" label-position="right" style="width: 100%;">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="`${$t('planManager.driver')}: `" prop="driver">
              <RemoteSelectObject ref="RemoteSelectObject" v-model="driverInfo" :placeholder="$t('common.placeholder')" :remote-api="getDriverDropdownApi" :value-key="'mergeKey'" :label-key="'driver'" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`${$t('planManager.plateNo')}: `" prop="plateNo">
              <el-input v-model="editForm.plateNo" type="text" :placeholder="$t('common.placeholder')" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`${$t('planManager.driverPhone')}: `" prop="driverPhone">
              <el-input v-model="editForm.driverPhone" type="text" :placeholder="$t('common.placeholder')" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`${$t('planManager.carModel')}: `" prop="carModel">
              <el-input v-model="editForm.carModel" type="text" :placeholder="$t('common.placeholder')" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item :label="`${$t('planManager.planNo')}: `" prop="planNo">
              <el-input v-model="editForm.planNo" type="text" :placeholder="$t('common.placeholder')" disabled />
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item :label="`${$t('planManager.planDate')}: `" prop="planTime">
              <CommonPicker
                v-model="editForm.planTime"
                pickerFormat="MM-dd"
                pikcerType="date"
                :disabled="disabled">
              </CommonPicker>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.countryName')}: `" prop="countryCode">
              <el-select
                v-model="countryCodeArr"
                multiple
                size="mini"
                disabled>
                <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.lastMailCarrier')}: `" prop="lastMailCarrier">
              <el-select
                v-model="lastMailCarrierArr"
                multiple
                filterable
                allow-create
                :disabled="disabled"
                size="mini">
                <el-option v-for="item in lastMailCarrierList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.cargoType')}: `" prop="cargoType">
              <el-select v-model="editForm.cargoType" size="mini" :disabled="disabled">
                <el-option v-for="item in cargoList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.outboundCarrier')}: `" prop="outboundCarrier">
              <type-select
                ref="supplierSelect"
                v-model="editForm.outboundCarrierId"
                type="supplier"
                @selected="setCarrierName"
                :disabled="disabled"
                :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRoleList: [12011, 12012]}"
                :defaultDisplay="editForm.outboundCarrier" >
              </type-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.customsAgentLabel')}: `" prop="customsAgent">
              <type-select
                ref="customsAgentSelect"
                v-model="editForm.customsAgentId"
                :defaultDisplay="editForm.customsAgent"
                :disabled="disabled"
                type="supplier"
                :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '16010'}"
                @selected="setCustomsAgentName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.airAgent')}: `" prop="airAgent">
              <type-select
                ref="airAgentSelect"
                v-model="editForm.airAgentId"
                type="supplier"
                :disabled="disabled"
                :defaultDisplay="editForm.airAgent"
                :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '14014'}"
                @selected="setAirAgentName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billNo')}: `" prop="billNo">
              <el-input v-model="editForm.billNo" type="text" :disabled="disabled" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.etd')}: `" prop="etd">
              <CommonPicker
                v-model="editForm.etd"
                pikcer-type="date"
                clearable
                :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.airLine')}: `" prop="airLine">
              <type-select v-model="editForm.airLineId" :defaultDisplay="editForm.airLine" type="airLine" @selected="setAirLineName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.flightNo')}: `" prop="flightNo">
              <el-input v-model="editForm.flightNo" type="text" :placeholder="$t('common.placeholder')" clearable :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.polCode')}: `" prop="polCode">
              <type-select v-model="editForm.polCode" :disabled="disabled" type="airport" :airportCodeOnly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.podCode')}: `" prop="podCode">
              <type-select v-model="editForm.podCode" :disabled="disabled" type="airport" :airportCodeOnly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.customsClearance')}: `" prop="customsClearance">
              <type-select
                ref="customsClearanceSelet"
                v-model="editForm.customsClearanceId"
                :defaultDisplay="editForm.customsClearance"
                type="supplier"
                :disabled="disabled"
                :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '17013'}"
                @selected="setClearanceName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item :label="`${$t('planManager.remark')}: `" prop="remark">
              <el-input v-model="editForm.remark" type="textarea" rows="4" :placeholder="$t('common.placeholder')" clearable :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item :label="`${$t('planManager.outboundTime')}: `" prop="outboundTime">
              <CommonPicker
                v-model="editForm.outboundTime"
                pikcer-type="datetime"
                pickerFormat="yyyy-MM-dd HH:mm:ss"
                clearable
                :disabled="disabled" />
                <p style="color: #F56C6C; margin-top: 5px;">
                  <i class="el-icon-warning"></i>
                  <span>{{$t('planManager.outboundTimeTips')}}</span>
                </p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="checkForm" v-show="!disabled">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBatchDetailApi,
  updateBatchDetailApi,
  createBatchDetailApi
} from '@/api/planManager'
import { getDriverDropdownApi } from '@/api/packageWarehouse'
import ListOfBatch from '../mixin/ListOfBatch'
import RemoteSelectObject from './RemoteSelectObject'
export default {
  name: 'BatchModifyDialog',
  mixins: [ListOfBatch],
  components: {
    RemoteSelectObject
  },
  data() {
    return {
      getDriverDropdownApi: getDriverDropdownApi,
      opreator: 'edit',
      loading: false,
      showDialog: false,
      remoteLoading: false,
      countryCodeArr: [],
      lastMailCarrierArr: [],
      outboundCarrierDisplay: [],
      driverInfo: null,
      editForm: {
        boxIdList: '',
        plateNo: '',
        driver: '',
        driverPhone: '',
        carModel: '',
        countryCode: '',
        countryName: '',
        lastMailCarrier: '',
        cargoType: '',
        outboundCarrier: '',
        outboundCarrierId: '',
        customsAgent: '',
        customsAgentId: '',
        airLine: '',
        airLineId: '',
        airLineCode: '',
        airAgent: '',
        airAgentId: '',
        billNo: '',
        etd: '',
        flightNo: '',
        polCode: '',
        podCode: '',
        // customsClearanceArr: [],
        customsClearance: '',
        customsClearanceId: '',
        remark: '',
        outboundTime: null
      },
      editFormRule: {
        // driver: [
        //   {required: true, message: this.$t('planManager.driverEmptyErr'), trigger: 'blur'}
        // ],
        // driverPhone: [
        //   {required: true, validator: this.$validators.checkCommonMobile, trigger: 'blur'}
        // ],
        // plateNo: [
        //   {required: true, validator: this.$validators.checkPlateNo, trigger: 'blur'}
        // ]
      },
      lastMailCarrierList: []
    }
  },
  computed: {
    disabled() {
      return this.opreator === 'view'
    },
    title() {
      if (this.opreator === 'view') {
        return this.$t('planManager.viewBatch')
      } else if (this.opreator === 'edit') {
        return this.$t('planManager.modifyBatch')
      } else {
        return this.$t('planManager.createBatch')
      }
    }
  },
  watch: {
    countryCodeArr: function(newVal, oldVal) {
      this.editForm.countryCode = newVal.join(',')
    },
    lastMailCarrierArr: function(newVal, oldVal) {
      this.editForm.lastMailCarrier = newVal.join(',')
    },
    driverInfo(newVal, oldVal) {
      if (newVal) {
        this.editForm.plateNo = newVal.plateNo
        this.editForm.driver = newVal.driver
        this.editForm.driverPhone = newVal.driverPhone
        this.editForm.carModel = newVal.carModel
      }
    }
  },
  methods: {
    setLastMailCarrier() {
      this.lastMailCarrierList = this.oriLastMailCarrierList.filter(item => this.editForm.countryCode.includes(item.dependent))
    },
    async showModifyDialog(ids, countries = null) {
      // 新增
      if (this.$isArray(ids)) {
        this.showDialog = true
        this.editForm.boxIdList = ids
        if (countries) {
          this.countryCodeArr = Array.from(new Set(countries))
        }
      } else { // 编辑
        this.showDialog = true
        this.loading = true
        const res = await getBatchDetailApi(ids)
        if (res && res.ok) {
          this.editForm = res.content
          this.driverInfo = {
            mergeKey: `${res.content.plateNo}_${res.content.driver}_${res.content.driverPhone}`,
            plateNo: res.content.plateNo,
            driver: res.content.driver,
            driverPhone: res.content.driverPhone,
            carModel: res.content.carModel
          }
          // this.outboundCarrierDisplay = [{
          //   id: this.editForm.supplierId,
          //   chineseName: this.editForm.supplierName
          // }]
          this.transformFormString()
        }
        this.loading = false
      }

      this.$nextTick(() => {
        this.setLastMailCarrier()
      })
    },
    checkForm() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.setCountryName()
          this.saveForm()
        }
      })
    },
    transformFormString() {
      this.countryCodeArr = this.editForm.countryCode.split(',')
      this.lastMailCarrierArr = this.editForm.lastMailCarrier.split(',')
    },
    setCountryName() {
      let _nameArr = []
      this.countryList.map(item => {
        if (this.countryCodeArr.includes(item.value)) {
          _nameArr.push(item.label)
        }
      })
      this.editForm.countryName = _nameArr.join(',')
    },
    async saveForm() {
      this.loading = true
      let res = null
      if (this.opreator === 'edit') {
        res = await updateBatchDetailApi(this.editForm.id, this.editForm)
      } else {
        res = await createBatchDetailApi(this.editForm)
      }

      if (res.ok) {
        this.$message({
          type: 'success',
          message: this.$t('planManager.modifyDynamicSuccess')
        })
      }
      this.loading = false
      this.showDialog = false
      this.$emit('refreshData')
      this.clearForm()
    },
    closeDialog() {
      if (this.disabled) {
        this.clearForm()
      } else {
        this.$confirm(this.$t('planManager.unSaveWarnningTips'), this.$t('common.warnningText'), {
          confirmButtonText: this.$t('common.dropEditBtn'),
          cancelButtonText: this.$t('planManager.thinkOver'),
          type: 'warning'
        }).then(() => {
          this.clearForm()
        }).catch(() => {})
      }
    },
    clearForm() {
      this.countryCodeArr = []
      this.lastMailCarrierArr = []
      this.$refs.editFormRef.resetFields()
      this.$refs.editFormRef.clearValidate()
      // console.log(this.editForm)
      this.showDialog = false
      this.$refs.RemoteSelectObject.clearInfo()

      this.$nextTick(() => {
        this.$refs.supplierSelect.clearChildOption('supplier')
        this.$refs.customsAgentSelect.clearChildOption('supplier')
        this.$refs.airAgentSelect.clearChildOption('supplier')
        this.$refs.customsClearanceSelet.clearChildOption('supplier')
      })
    },
    setCarrierName(item) {
      this.editForm.outboundCarrier = item.chineseName
    },
    setCustomsAgentName(item) {
      this.editForm.customsAgent = item.chineseName
    },
    setAirAgentName(item) {
      this.editForm.airAgent = item.chineseName
    },
    setClearanceName(item) {
      this.editForm.customsClearance = item.chineseName
    },
    setAirLineName(item) {
      this.editForm.airLine = item.chineseName
      this.editForm.airLineCode = item.scacCode
    }
  },
  mounted() {
    this.getCountryList()
  },
  created() {}
}
</script>
<style>
</style>
