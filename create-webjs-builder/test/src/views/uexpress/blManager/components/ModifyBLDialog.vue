<template>
  <div class="">
    <el-dialog
    :visible.sync="showDialog"
    width="800px"
    :title="$t('uexpressBL.bindBlNoDialog.dialogTitle')"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form :inline="true" :model="blForm" ref="blForm" label-width="100px" :rules="blFormRule" size="mini">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.mawbNo')}: `" prop="mawbNo">
              <el-input v-model="blForm.mawbNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.flightNo')}: `" prop="flightNo">
              <el-input v-model="blForm.flightNo" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.polAgentId')}: `" prop="polAgentId">
              <TypeSelect v-model="blForm.polAgentId" ref="polAgentIdRef" type="supplier" :defaultDisplay="blForm.polAgentName" :requestParams="{ partnerRole: '14014'}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.airLineCode')}: `" prop="airLineCode">
              <TypeSelect v-model="blForm.airLineCode" ref="airLineCodeRef" :defaultDisplay="blForm.airLineName" type="airLine" @selected="setAirLineCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.polCode')}: `" prop="polCode">
              <type-select v-model="blForm.polCode" type="airport" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.podCode')}: `" prop="podCode">
              <type-select v-model="blForm.podCode" type="airport" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.polDeclareAgentId')}: `" prop="polDeclareAgentId">
              <TypeSelect v-model="blForm.polDeclareAgentId" ref="polDeclareAgentIdRef" :defaultDisplay="blForm.polDeclareAgentName" type="supplier" :requestParams="{partnerRole: '16010'}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.podDeclareAgentId')}: `" prop="podDeclareAgentId">
              <TypeSelect v-model="blForm.podDeclareAgentId" ref="podDeclareAgentIdRef" :defaultDisplay="blForm.podDeclareAgentName" type="supplier" :requestParams="{partnerRole: '17013'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.transitFlag')}: `" prop="transitFlag">
              <el-select v-model="blForm.transitFlag" @change="checkTransitFlag">
                <el-option v-for="item in transitFlagList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.secondFlightNo')}: `" prop="secondFlightNo">
              <el-input v-model="blForm.secondFlightNo" :disabled="blForm.transitFlag===false" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.etd')}: `" prop="etd">
              <CommonPicker
                v-model="blForm.etd"
                pikcer-type="datetime"
                pickerFormat="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.eta')}: `" prop="eta">
              <CommonPicker
                v-model="blForm.eta"
                pikcer-type="datetime"
                pickerFormat="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.weight')}: `" prop="weight">
              <NumberInput  v-model.trim="blForm.weight" :limitRange="{digits: 6, decimal: 3}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBL.bindBlNoDialog.volume')}: `" prop="volume">
              <NumberInput  v-model.trim="blForm.volume" :limitRange="{digits: 6, decimal: 3}" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" :loading="loading" @click="resetForm">{{$t('common.resetBtn')}}</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="validateBlForm">{{$t('common.saveBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { airLineListApi } from '@/api/common'
import { submitModifyBLInfoApi } from '@/api/uexpress/blManager'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
  name: 'ModifyBLDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    batchIds: {
      type: Array,
      default: () => []
    }
  },
  components: {
    NumberInput
  },
  data() {
    return {
      vm: this,
      loading: false,
      blForm: {
        mawbNo: '',
        flightNo: '',
        polAgentId: '',
        polAgentName: '',
        airLineCode: '',
        airLineName: '',
        polCode: '',
        podCode: '',
        polDeclareAgentId: '',
        polDeclareAgentName: '',
        podDeclareAgentId: '',
        podDeclareAgentName: '',
        transitFlag: '',
        secondFlightNo: '',
        etd: null,
        eta: null,
        weight: '',
        volume: ''
      },
      blFormRule: {
        mawbNo: [
          {required: true, message: this.$t('uexpressBL.bindBlNoDialog.blNoInvalid'), trigger: 'blur'}
        ],
        flightNo: [
          {required: true, message: this.$t('uexpressBL.bindBlNoDialog.flightNoIvalide'), trigger: 'blur'}
        ],
        polAgentId: [
          {required: false, message: this.$t('uexpressBL.bindBlNoDialog.polAgentIdIvalide'), trigger: 'change'}
        ],
        airLineCode: [
          {required: true, message: this.$t('uexpressBL.bindBlNoDialog.airLineCodeIvalide'), trigger: 'change'}
        ],
        polCode: [
          {required: true, message: this.$t('uexpressBL.bindBlNoDialog.polCodeIvalide'), trigger: 'change'}
        ],
        podCode: [
          {required: true, message: this.$t('uexpressBL.bindBlNoDialog.podCodeIvalide'), trigger: 'change'}
        ],
        polDeclareAgentId: [
          {required: true, message: this.$t('uexpressBL.bindBlNoDialog.polDeclareAgentIvalide'), trigger: 'change'}
        ],
        podDeclareAgentId: [
          {required: true, message: this.$t('uexpressBL.bindBlNoDialog.podDeclareAgentIvalide'), trigger: 'change'}
        ],
        weight: [
          {required: true, message: this.$t('common.can_not_be_null'), trigger: 'change'}
        ],
        volume: [
          {required: true, message: this.$t('common.can_not_be_null'), trigger: 'change'}
        ]
      },
      transitFlagList: [
        {
          label: this.$t('uexpressBL.bindBlNoDialog.transitFlagTrue'),
          value: true
        },
        {
          label: this.$t('uexpressBL.bindBlNoDialog.transitFlagFalse'),
          value: false
        }
      ],
      airCustomerMethod: airLineListApi,
      airlineName: '',
      tplForm: null
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    showDialog: function(newVal, oldVal) {
      if (newVal === false) {
        this.resetTypeSelect()
        this.$nextTick(() => {
          this.$refs.blForm.resetFields()
        })
      }
    }
  },
  methods: {
    init(dataForm) {
      this.tplForm = JSON.parse(JSON.stringify(dataForm))
      this.blForm = JSON.parse(JSON.stringify(dataForm))
      this.$set(this.blForm, 'mawbNo', this.blForm.blNo)
      this.blForm.bolId = this.blForm.id
      this.blForm.etd = this.$moment(dataForm.etdFormat).valueOf()
      this.blForm.eta = this.$moment(dataForm.etaFormat).valueOf()
      delete this.blForm.blNo
      delete this.blForm.id
      this.$nextTick(() => {
        this.$refs.blForm.clearValidate()
      })
    },
    validateBlForm() {
      this.$refs.blForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.submitModify()
        }
      })
    },
    // 设置航司代码
    setAirLineCode(customer) {
      this.blForm.airLineCode = customer.scacCode
      this.airlineName = customer.chineseName
    },
    resetForm() {
      this.resetTypeSelect()
      this.blForm = JSON.parse(JSON.stringify(this.tplForm))
      this.$set(this.blForm, 'mawbNo', this.blForm.blNo)
      this.blForm.bolId = this.blForm.id
      this.blForm.etd = this.$moment(this.dataForm.etdFormat).valueOf()
      this.blForm.eta = this.$moment(this.dataForm.etaFormat).valueOf()
      delete this.blForm.blNo
      delete this.blForm.id
      this.$nextTick(() => {
        this.$refs.blForm.clearValidate()
      })
    },
    async submitModify() {
      this.blForm.etdFormat = this.blForm.etd ? this.$moment(Number(this.blForm.etd)).format('YYYY-MM-DD HH:mm:ss') : ''
      this.blForm.etaFormat = this.blForm.eta ? this.$moment(Number(this.blForm.eta)).format('YYYY-MM-DD HH:mm:ss') : ''
      const res = await submitModifyBLInfoApi(this.blForm)
      if (res && res.ok) {
        this.$message.success(this.$t('uexpressBL.bindBlNoDialog.modifyBLSuccess'))
        this.showDialog = false
        this.$emit('success')
      }
      this.loading = false
    },
    resetTypeSelect() {
      this.$refs.polAgentIdRef.clearChildOption('supplier')
      this.$refs.polDeclareAgentIdRef.clearChildOption('supplier')
      this.$refs.podDeclareAgentIdRef.clearChildOption('supplier')
      this.blForm.polAgentName = ''
      this.blForm.polDeclareAgentName = ''
      this.blForm.podDeclareAgentName = ''
    },
    checkTransitFlag() {
      if (this.blForm.transitFlag === false) {
        this.blForm.secondFlightNo = ''
      }
    }
  }
}
</script>
<style scoped lang="scss">
</style>
