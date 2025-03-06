<template>
  <div class="">
    <el-dialog
    :visible.sync="showDialog"
    width="800px"
    :title="$t('uexpressBatch.bindBlNoDialog.dialogTitle')"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form :inline="true" :model="blForm" ref="blForm" label-width="100px" :rules="blFormRule" size="mini">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.blNo')}: `" prop="mawbNo">
              <el-input v-model="blForm.mawbNo" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.flightNo')}: `" prop="flightNo">
              <el-input v-model="blForm.flightNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.polAgentId')}: `" prop="polAgentId">
              <TypeSelect v-model="blForm.polAgentId"  type="supplier" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '14014'}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.airLineCode')}: `" prop="airLineCode">
              <TypeSelect v-model="blForm.airLineCode"  type="airLine" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '12015'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.polCode')}: `" prop="polCode">
              <type-select v-model="blForm.polCode" type="airport" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.podCode')}: `" prop="podCode">
              <type-select v-model="blForm.podCode" type="airport" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.polDeclareAgentId')}: `" prop="polDeclareAgentId">
              <TypeSelect v-model="blForm.polDeclareAgentId"  type="supplier" :requestParams="{partnerRole: '16010'}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.podDeclareAgentId')}: `" prop="podDeclareAgentId">
              <TypeSelect v-model="blForm.podDeclareAgentId"  type="supplier" :requestParams="{partnerRole: '17013'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.transitFlag')}: `" prop="transitFlag">
              <el-select v-model="blForm.transitFlag" @change="checkTransitFlag">
                <el-option v-for="item in transitFlagList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.secondFlightNo')}: `" prop="secondFlightNo">
              <el-input v-model="blForm.secondFlightNo" :disabled="blForm.transitFlag===false"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.weight')}: `" prop="weight">
              <NumberInput  v-model.trim="blForm.weight" :limitRange="{digits: 6, decimal: 3}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.volume')}: `" prop="volume">
              <NumberInput  v-model.trim="blForm.volume" :limitRange="{digits: 6, decimal: 3}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="`${$t('uexpressBatch.bindBlNoDialog.remarks')}: `" prop="remarks">
              <el-input type="textarea" v-model="blForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" :loading="loading" @click="resetForm">{{$t('common.resetBtn')}}</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="validateBlForm">{{$t('uexpressBatch.bindBlNoDialog.bindBtn')}}</el-button>
        <!-- <el-button type="primary" size="mini" :loading="loading" @click="bindBatch" :disabled="blForm.exisitsBl===false">{{$t('uexpressBatch.bindBlNoDialog.bindBtn')}}</el-button> -->
        <!-- <el-button type="primary" size="mini" :loading="loading" @click="saveBlForm" :disabled="blForm.exisitsBl===true">{{$t('common.saveBtn')}}</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { airLineListApi } from '@/api/common'
import { batchBindBlNoApi } from '@/api/uexpress/batchManager'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
  name: 'BindBlNoDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataForm: {
      type: Object,
      default: () => {}
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
      blForm: {},
      blFormRule: {
        mawbNo: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.blNoInvalid'), trigger: 'blur'}
        ],
        flightNo: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.flightNoIvalide'), trigger: 'blur'}
        ],
        polAgentId: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.polAgentIdIvalide'), trigger: 'change'}
        ],
        airLineCode: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.airLineCodeIvalide'), trigger: 'change'}
        ],
        polCode: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.polCodeIvalide'), trigger: 'change'}
        ],
        podCode: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.podCodeIvalide'), trigger: 'change'}
        ],
        polDeclareAgentId: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.polDeclareAgentIvalide'), trigger: 'change'}
        ],
        podDeclareAgentId: [
          {required: true, message: this.$t('uexpressBatch.bindBlNoDialog.podDeclareAgentIvalide'), trigger: 'change'}
        ]
      },
      transitFlagList: [
        {
          label: this.$t('uexpressBatch.bindBlNoDialog.transitFlagTrue'),
          value: true
        },
        {
          label: this.$t('uexpressBatch.bindBlNoDialog.transitFlagFalse'),
          value: false
        }
      ],
      airCustomerMethod: airLineListApi,
      airlineName: ''
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
    dataForm: function(newVal, oldVal) {
      const _dataForm = JSON.parse(JSON.stringify(this.dataForm))
      const _obj = {
        mawbNo: '',
        flightNo: '',
        polAgentId: '',
        airLineCode: '',
        polCode: '',
        podCode: '',
        polDeclareAgentId: '',
        podDeclareAgentId: '',
        transitFlag: false,
        secondFlightNo: '',
        weight: '',
        volume: '',
        remarks: ''
      }
      this.blForm = {..._obj, ..._dataForm, mawbNo: _dataForm.blNo}
    }
  },
  methods: {
    validateBlForm() {
      this.$refs.blForm.validate(valid => {
        if (valid) {
          this.bindBatch()
        }
      })
    },
    // 设置航司代码
    setAirCustomerInfo(customer) {
      this.blForm.airLineCode = customer.id
      this.airlineName = customer.chineseName
    },
    resetForm() {
      this.blForm = JSON.parse(JSON.stringify(this.dataForm))
      this.$refs.blForm.clearValidate()
    },
    async bindBatch() {
      this.blForm.outboundIds = this.batchIds
      const res = await batchBindBlNoApi(this.blForm)
      if (res && res.ok) {
        this.$message.success(this.$t('uexpressBatch.bindBlNoDialog.bindBlSuccess'))
        this.showDialog = false
        this.$emit('success')
      }
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
