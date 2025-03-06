<template>
  <el-dialog :visible.sync="showDialog" :title="$t('planManager.bindCarInfoTitle')" width="350px" :close-on-click-modal="false" :before-close="closeModify">
    <el-form label-width="80px" :model="createForm" :rules="createFormRule" ref="createForm" size="mini" style="width: 261px;">
      <el-form-item :label="`${$t('planManager.driver')}: `" prop="driver">
        <RemoteSelectObject ref="RemoteSelectObject" v-model="driverInfo" :placeholder="$t('common.placeholder')" :remote-api="getDriverDropdownApi" :value-key="'mergeKey'" :label-key="'driver'" />
      </el-form-item>
      <el-form-item :label="`${$t('planManager.plateNo')}: `" prop="plateNo">
        <el-input v-model="createForm.plateNo" :placeholder="$t('common.placeholder')" />
      </el-form-item>
      <el-form-item :label="`${$t('planManager.driverPhone')}: `" prop="driverPhone">
        <el-input v-model="createForm.driverPhone" :placeholder="$t('common.placeholder')" />
      </el-form-item>
      <el-form-item :label="`${$t('planManager.carModel')}: `" prop="carModel">
        <el-input v-model="createForm.carModel" :placeholder="$t('common.placeholder')" />
      </el-form-item>
      <el-form-item :label="`${$t('planManager.remark')}: `" prop="remark">
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
import { bindCarInfoApi } from '@/api/planManager'
import { getDriverDropdownApi } from '@/api/packageWarehouse'
import RemoteSelectObject from './RemoteSelectObject'
export default {
  name: 'CreateBatchDialog',
  components: {
    RemoteSelectObject
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    ids: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      getDriverDropdownApi: getDriverDropdownApi,
      loading: false,
      driverInfo: null,
      createForm: {
        driver: '',
        driverPhone: '',
        plateNo: '',
        carModel: '',
        remark: '',
        ids: []
      },
      createFormRule: {
        // plateNo: [
        //   {required: true, validator: this.$validators.checkPlateNo, trigger: 'blur'}
        // ],
        // driver: [
        //   {required: true, message: this.$t('planManager.driverEmptyErr'), trigger: 'blur'}
        // ],
        // driverPhone: [
        //   {required: true, validator: this.$validators.checkCommonMobile, trigger: 'blur'}
        // ],
        // plateNo: [
        //   {required: true, validator: this.$validators.checkPlateNo, trigger: 'blur'}
        // ],
      }
    }
  },
  watch: {
    driverInfo(newVal, oldVal) {
      if (newVal) {
        this.createForm.plateNo = newVal.plateNo
        this.createForm.driver = newVal.driver
        this.createForm.driverPhone = newVal.driverPhone
        this.createForm.carModel = newVal.carModel
      }
    }
  },
  methods: {
    validateForm() {
      // this.$refs.createForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     this.submitForm()
      //     this.loading = false
      //   }
      // })
      this.submitForm()
    },
    async submitForm() {
      this.loading = true
      this.createForm.ids = this.ids
      const res = await bindCarInfoApi(this.createForm)
      if (res && res.ok) {
        this.$message.success(this.$t('planManager.bindCarInfoSuccess'))
        this.closeModify()
      }
      this.loading = false
    },
    closeModify() {
      this.$emit('closeDialog')
      this.$nextTick(() => {
        this.clearForm()
      })
    },
    clearForm() {
      this.$refs.createForm.resetFields()
      this.$refs.createForm.clearValidate()
      this.createForm.ids = []
      this.$refs.RemoteSelectObject.clearInfo()
      // this.createForm = {
      //   driver: '',
      //   driverPhone: '',
      //   plateNo: '',
      //   remark: '',
      //   ids: []
      // }
    }
  }
}

</script>
