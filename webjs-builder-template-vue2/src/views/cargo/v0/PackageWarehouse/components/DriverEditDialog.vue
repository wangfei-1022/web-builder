<template>
  <el-dialog :visible.sync="showDialog" :title="title" :close-on-click-modal="false" :before-close="closeModify" width="640px">
    <el-form label-width="80px" :model="uploadForm" :rules="uploadFormRule" ref="uploadForm" size="mini" :inline="true">
      <el-form-item :label="`${$t('packageWarehouse.driverManager.area')}: `" prop="area">
        <el-input v-model="uploadForm.area"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.driverManager.supplier')}: `" prop="supplierId">
        <TypeSelect v-model="uploadForm.supplierId"  type="supplier" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '12012'}" @selected="setSupplierInfo" :defaultDisplay="uploadForm.chineseName" style="width: 165px;"/>
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.driverManager.plateNo')}: `" prop="plateNo">
        <el-input v-model="uploadForm.plateNo"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.driverManager.driver')}: `" prop="driver">
        <el-input v-model="uploadForm.driver"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.driverManager.driverPhone')}: `" prop="driverPhone">
        <el-input v-model="uploadForm.driverPhone"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.driverManager.carModel')}: `" prop="carModel">
        <el-input v-model="uploadForm.carModel"></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.driverManager.remark')}: `" prop="remark">
        <el-input type="textarea" v-model="uploadForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createDriverApi, modifyDriverApi } from '@/api/packageWarehouse'
import NumberInput from '@/components/Cargo/NumberInput/NumberInput'
export default {
  name: 'GirdBindWarehouseDialog',
  components: {
    NumberInput
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    parentLoading: {
      type: Boolean,
      default: false
    },
    modifyId: {
      type: [Number, String],
      default: () => null
    }
  },
  data() {
    return {
      dropdownList: [],
      uploadForm: {
        driver: '',
        driverPhone: '',
        supplierId: '',
        chineseName: '',
        shortName: '',
        plateNo: '',
        area: '',
        carModel: '',
        remark: ''
      },
      uploadFormRule: {
        supplierId: [
          {required: true, message: this.$t('packageWarehouse.driverManager.supplierInvalid'), trigger: 'change'}
        ],
        area: [
          {required: true, message: this.$t('packageWarehouse.driverManager.areaInvalid'), trigger: 'blur'}
        ],
        plateNo: [
          {required: true, message: this.$t('packageWarehouse.driverManager.plateNoInvalid'), trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    showDialog: {
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
  methods: {
    setUploadForm(obj) {
      this.uploadForm = JSON.parse(JSON.stringify(obj))
    },
    setSupplierInfo(res) {
      this.uploadForm.chineseName = res.chineseName
      this.uploadForm.shortName = res.shortName
    },
    validateForm() {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          this.submitApp()
        }
      })
    },
    closeModify() {
      this.showDialog = false
      this.$refs.uploadForm.resetFields()
      this.uploadForm = {
        driver: '',
        driverPhone: '',
        plateNo: '',
        area: '',
        remark: ''
      }
    },
    async submitApp() {
      this.loading = true
      let res = null
      if (!this.uploadForm.id) {
        res = await createDriverApi(this.uploadForm)
      } else {
        res = await modifyDriverApi(this.uploadForm)
      }

      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.driverManager.modifySuccess'))
        this.closeModify()
        this.$emit('refreshData')
        this.$refs.uploadForm.resetFields()
      }
    }
  },
  mounted() {}
}

</script>
