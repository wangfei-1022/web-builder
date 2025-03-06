<template>
  <el-dialog :visible.sync="showCreat" :title="$t('packageWarehouse.createDistrain')" width="550px" :close-on-click-modal="false" :before-close="closeModify">
    <el-form label-width="80px" :model="createForm" :rules="createFormRule" ref="createForm" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('packageWarehouse.lockType')}: `" prop="lockType">
              <el-select v-model="createForm.lockType"
                :placeholder="$t('common.placeholder')"
                filterable>
                <el-option
                  v-for="item in lockTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('packageWarehouse.numberType')}: `" prop="queryNumberConditions">
              <el-select v-model="createForm.queryNumberConditions"
                :placeholder="$t('common.placeholder')">
                <el-option
                  v-for="item in numberTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="`${$t('packageWarehouse.number')}: `" prop="trackingNos">
          <el-input v-model="createForm.trackingNos" rows="3" type="textarea" />
        </el-form-item>
        <el-form-item :label="`${$t('packageWarehouse.employeeRemark')}: `" prop="remark">
          <el-input v-model="createForm.remark" rows="3" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
        <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
      </div>
  </el-dialog>
</template>
<script>
import { createDistrainApi } from '@/api/packageWarehouse'
export default {
  name: 'CreateDistrainDialog',
  props: {
    showCreat: {
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
    }
  },
  data() {
    return {
      loading: false,
      createForm: {
        trackingNos: '',
        lockType: '',
        queryNumberConditions: '',
        remark: ''
      },
      createFormRule: {
        trackingNos: [
          { required: true, message: this.$t('packageWarehouse.requiredError'), trigger: 'blur' }
        ],
        lockType: [
          { required: true, message: this.$t('packageWarehouse.requiredError'), trigger: 'change' }
        ],
        queryNumberConditions: [
          { required: true, message: this.$t('packageWarehouse.requiredError'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    validateForm() {
      this.$refs.createForm.validate((valid, obj) => {
        if (valid) {
          this.submitFollow()
        }
      })
    },
    async submitFollow(arr) {
      this.loading = true
      this.createForm.trackingNos = this.createForm.trackingNos.toUpperCase()
      const res = await createDistrainApi(this.createForm)
      if (res.ok) {
        this.$message.success(this.$t('packageWarehouse.operationSuccess'))
        this.closeModify(null)
        this.$emit('refreshData')
      }
      this.loading = false
    },
    closeModify(done) {
      this.$emit('update:showCreat', false)
      this.createForm = {
        trackingNos: '',
        lockType: '',
        remark: ''
      }
      this.$refs.createForm.resetFields()
      if (typeof done == 'function') {done()}
      this.$nextTick(() => {
        this.$refs.createForm.clearValidate()
      })
    }
  }
}

</script>
