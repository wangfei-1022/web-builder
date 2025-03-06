<template>
  <div class="">
    <el-dialog
    :visible.sync="showDialog"
    width="800px"
    :title="$t('planManager.modifyPlan')"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
      <el-form ref="editForm" :model="editForm" :rules="editFormRules" size="mini" label-width="100px" label-position="right" style="width: 100%;">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.planNo')}: `" prop="planNo">
              <el-input v-model="editForm.planNo" type="text" :placeholder="$t('common.placeholder')" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.planDate')}: `" prop="planTime">
              <CommonPicker
                v-model="editForm.planTime"
                pickerFormat="MM-dd"
                pikcerType="date">
              </CommonPicker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.billOrigin')}: `" prop="billOrigin">
              <el-select v-model="editForm.billOrigin" disabled>
                <el-option v-for="item in billOriginList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.countryName')}: `" prop="countryCode">
              <el-select v-model="editForm.countryCode" size="mini" @change="setCountryName">
                <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.lastMailCarrier')}: `" prop="lastMailCarrier">
              <el-input v-model="editForm.lastMailCarrier" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.cargoType')}: `" prop="cargoType">
              <el-select v-model="editForm.cargoType" size="mini">
                <el-option v-for="item in cargoList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.outboundCarrier')}: `" prop="outboundCarrier">
              <el-input v-model="editForm.outboundCarrier" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.customsAgentLabel')}: `" prop="customsAgentLabel">
              <el-input v-model="editForm.customsAgent" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.airAgent')}: `" prop="airAgent">
              <el-input v-model="editForm.airAgent" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.etd')}: `" prop="etd">
              <CommonPicker
                v-model="editForm.etd"
                pikcer-type="date"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.flightNo')}: `" prop="flightNo">
              <el-input v-model="editForm.flightNo" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.polCode')}: `" prop="polCode">
              <cargo-advance-select
                ref="polCodeSelect"
                :url="airPortListUrl"
                :default-value="editForm.polCode"
                :headers="[$t('common.threeCharCode')]"
                :fields="['code3']"
                tag-value="code3"
                tag-name="code3"
                remote
                clearable
                @parentCallBack="(data) => {
                  editForm.polCode = data.code3
                  editForm.polName = data.chineseName
                }" />
              <el-input v-model="editForm.polCode" style="display: none;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.podCode')}: `" prop="podCode">
              <cargo-advance-select
                ref="podCodeSelect"
                :url="airPortListUrl"
                :default-value="editForm.podCode"
                :headers="[$t('common.threeCharCode')]"
                :fields="['code3']"
                tag-value="code3"
                tag-name="code3"
                remote
                @parentCallBack="(data) => {
                  editForm.podCode = data.code3
                  editForm.podName = data.chineseName
                }" />
              <el-input v-model="editForm.podCode" style="display: none;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.customsClearance')}: `" prop="customsClearance">
              <el-input v-model="editForm.customsClearance" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.density')}: `" prop="density">
              <el-input v-model="editForm.density" type="text" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.boxQuantity')}: `" prop="boxQuantity">
              <el-input v-model="editForm.boxQuantity" onInput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('common.placeholder')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.totalWeight')}: `" prop="totalWeight">
              <el-input v-model="editForm.totalWeight" onInput="value=value.replace(/[^\d.-]/g,'')" :placeholder="$t('common.placeholder')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`${$t('planManager.totalVolume')}: `" prop="totalVolume">
              <el-input v-model="editForm.totalVolume" onInput="value=value.replace(/[^\d.-]/g,'')" :placeholder="$t('common.placeholder')" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item :label="`${$t('planManager.timeliness')}: `" prop="timeliness">
              <el-input v-model="editForm.timeliness" type="textarea" rows="4" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item :label="`${$t('planManager.remark')}: `" prop="remark">
              <el-input v-model="editForm.remark" type="textarea" rows="4" :placeholder="$t('common.placeholder')" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm">{{$t('common.confirmBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeDialog">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPlanDetailApi,
  getPlanCountryListApi,
  updatePlanApi
} from '@/api/planManager'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import airPortAPIPath from '../mixin/airPortAPIPath'
export default {
  name: 'PlanModifyDialog',
  components: { cargoAdvanceSelect },
  mixins: [airPortAPIPath],
  data() {
    return {
      vm: this,
      loading: false,
      showDialog: false,
      countryList: [],
      // batchList: [],
      editForm: {
        planNo: '',
        planTime: null,
        countryCode: '',
        countryName: '',
        lastMailCarrier: '',
        cargoType: '',
        outboundCarrier: '',
        customsAgent: '',
        airAgent: '',
        billOrigin: null,
        // billNo: '',
        etd: '',
        flightNo: '',
        polCode: '',
        polName: 'dddddddd',
        podCode: '',
        podName: 'eeeeeeee',
        customsClearance: '',
        density: '',
        batchIdList: [],
        boxQuantity: null,
        totalWeight: null,
        totalVolume: null,
        timeliness: '',
        remark: ''
      },
      editFormRules: {
        planTime: [
          { required: true, message: this.$t('planManager.opreatorTimeEmptyErr'), trigger: 'change' }
        ],
        boxQuantity: [
          { required: true, message: this.$t('planManager.quantityRequired'), trigger: 'blur' }
        ],
        totalWeight: [
          { required: true, message: this.$t('planManager.weightRequired'), trigger: 'blur'}
        ],
        totalVolume: [
          { required: true, message: this.$t('planManager.volumeRequired'), trigger: 'blur'}
        ],
        polCode: [
          { required: true, message: this.$t('planManager.polRequired'), trigger: 'blur'}
        ],
        podCode: [
          { required: true, message: this.$t('planManager.podRequired'), trigger: 'blur'}
        ],
        timeliness: [
          { required: true, message: this.$t('planManager.timelinessRequired'), trigger: 'blur'}
        ]
      },
      cargoList: [
        {
          label: this.$t('planManager.normalProduct'),
          value: this.$t('planManager.normalProduct')
        },
        {
          label: this.$t('planManager.electricProduct'),
          value: this.$t('planManager.electricProduct')
        }
      ],
      billOriginList: [
        {
          label: this.$t('planManager.outsidePurchase'),
          value: 0
        },
        {
          label: this.$t('planManager.airDelivery'),
          value: 1
        }
      ],
      selectedBatch: []
    }
  },
  computed: {
    selectedBatchNo() {
      return this.selectedBatch.map(item => item.batchNo).join(',')
    },
    billOriginDisabled() {
      return this.editForm.billOrigin === 1
    }
  },
  watch: {
  },
  filters: {
    filterDate(val, vm) {
      return vm.$moment(Number(val)).format('YYYY-MM-DD')
    }
  },
  methods: {
    async showModifyDialog(id) {
      this.loading = true
      const res = await getPlanDetailApi(id)
      if (res && res.ok) {
        this.editForm = {...this.editForm, ...res.content}
        this.showDialog = true
      }
      this.$nextTick(() => {
        this.$refs.polCodeSelect.fetchData(this.editForm.polCode, true)
        this.$refs.podCodeSelect.fetchData(this.editForm.podCode, true)
      })
      this.loading = false
    },
    async getCountryList() {
      const res = await getPlanCountryListApi()
      if (res && res.ok) {
        this.countryList = []
        res.content.forEach(item => {
          this.countryList.push({
            label: item.countryName,
            value: item.countryCode
          })
        })
      }
    },
    async saveForm() {
      this.loading = true
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await updatePlanApi(this.editForm.id, this.editForm)
          if (res.ok) {
            this.$message({
              type: 'success',
              message: this.$t('planManager.modifyDynamicSuccess')
            })
          }
          this.showDialog = false
          this.$emit('refreshData')
        }
        this.loading = false
      })
    },
    closeDialog() {
      this.$confirm(this.$t('planManager.unSaveWarnningTips'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.dropEditBtn'),
        cancelButtonText: this.$t('planManager.thinkOver'),
        type: 'warning'
      }).then(() => {
        this.$refs.editForm.resetFields()
        this.showDialog = false
      }).catch(() => {})
    },
    setCountryName(val) {
      this.editForm.countryName = this.countryList.find(item => item.value === val).label
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
