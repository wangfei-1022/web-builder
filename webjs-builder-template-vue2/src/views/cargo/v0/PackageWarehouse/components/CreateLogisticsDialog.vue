<template>
  <el-dialog :visible.sync="showCreat" :title="$t('packageWarehouse.logisticManager.createLogisticsTitle')" width="620px" :close-on-click-modal="false" :before-close="closeModify">
    <el-form label-width="110px" :model="createForm" :rules="createFormRule" ref="createForm" size="mini">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.memberId')}: `" prop="memberId">
            <RemoteSearchSelector ref="memberSelectorRef" v-model="createForm.memberId" :placeholder="$t('charteredBoat.memberPlaceholder')" :remote-api="getLogisticsListApi" :defaultDisplay="createForm.chineseName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.logisticsNos')}: `" prop="logisticsNo">
            <el-input v-model="createForm.logisticsNo" type="text" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.providerName')}: `" prop="providerName">
            <el-select v-model="createForm.providerName"
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
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.estimateLogisticsAmount')}: `" prop="estimateLogisticsAmount">
            <el-input v-model="createForm.estimateLogisticsAmount" type="text" size="mini" oninput="value = value.replace(/[^\d]/g, '')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.estimateParcelAmount')}: `" prop="estimateParcelAmount">
            <el-input v-model="createForm.estimateParcelAmount" type="text" size="mini" oninput="value = value.replace(/[^\d]/g, '')" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.estimateWeight')}: `" prop="estimateWeight">
            <el-input v-model="createForm.estimateWeight" type="text" size="mini" oninput="value = value.replace(/^\D*(\d*(?:\.\d{0,4})?).*$/g, '$1')" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('planManager.warehouseId')}: `" prop="warehouseId">
            <el-select v-model="createForm.warehouseId"
              clearable :disabled="isEdit">
              <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.receivedTime')}: `" prop="receivedTime">
            <CommonPicker
            v-model="createForm.receivedTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetime"
            :clearable="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.estimateArrivalTime')}: `" prop="estimateArrivalTime">
            <CommonPicker
            v-model="createForm.estimateArrivalTime"
            pickerFormat="yyyy-MM-dd HH:mm:ss"
            pikcerType="datetime"
            :clearable="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('packageWarehouse.logisticManager.remark')}: `" prop="remark">
            <el-input v-model="createForm.remark" type="textarea" rows="3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align: right;">
      <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { employeeDropdownListApi, saveLogisticsApi, modifyLogisticsApi } from '@/api/packageWarehouse'
import RemoteSearchSelector from '@/components/Cargo/Common/RemoteSearchSelector'
import InnerMixins from '../mixin/InnerMixins'
export default {
  name: 'CreateLogisticsDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    lockTypeList: {
      type: Array,
      default: () => []
    },
    numberTypeList: {
      type: Array,
      default: () => []
    },
    warehouseList: {
      type: Array,
      default: () => []
    },
    getLogisticsListApi: {
      type: Function,
      default: () => false
    },
    modifyInfo: {
      type: Object,
      default: () => null
    },
    parentLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RemoteSearchSelector
  },
  mixins: [InnerMixins],
  data() {
    return {
      createForm: {
        logisticsNo: '',
        memberId: '',
        warehouseId: '',
        estimateLogisticsAmount: '',
        estimateParcelAmount: '',
        estimateWeight: '',
        estimateArrivalTime: null,
        receivedTime: null,
        providerName: '',
        remark: ''
      },
      createFormRule: {
        memberId: [
          { required: true, message: this.$t('packageWarehouse.logisticManager.memberIdInvalid'), trigger: 'change' }
        ],
        logisticsNo: [
          { required: true, message: this.$t('packageWarehouse.logisticManager.logisticsNoInvalid'), trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {
    showCreat: {
      get: function() {
        return this.visible
      },
      set: function(val) {
        this.$emit('update:visible', val)
      }
    },
    loading: {
      get: function() {
        return this.parentLoading
      },
      set: function(val) {
        this.$emit('update:parentLoading', val)
      }
    }
  },
  watch: {},
  methods: {
    init(_obj = null) {
      if (_obj === null) {
        this.createForm = {
          logisticsNo: '',
          memberId: '',
          warehouseId: '',
          estimateLogisticsAmount: '',
          estimateParcelAmount: '',
          estimateWeight: '',
          estimateArrivalTime: null,
          receivedTime: null,
          providerName: '',
          remark: ''
        }
        this.isEdit = false
      } else {
        this.createForm = JSON.parse(JSON.stringify(_obj))
        this.isEdit = true
      }
      this.$nextTick(() => {
        this.$refs.createForm.clearValidate()
      })
    },
    validateForm() {
      this.$refs.createForm.validate((valid, obj) => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    async submitForm(arr) {
      this.loading = true
      let res = null
      // 编辑保存
      if (this.createForm.id) {
        res = await modifyLogisticsApi(this.createForm)
      } else { // 新建保存
        res = await saveLogisticsApi(this.createForm)
      }

      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.operationSuccess'))
        this.closeModify(null)
        this.$emit('refreshData')
      } else {
        this.loading = false
      }
    },
    closeModify(done) {
      this.showCreat = false
      if (typeof done == 'function') {done()}
      this.$refs.memberSelectorRef.clearOptions()
    }
  },
  create() {}
}

</script>
