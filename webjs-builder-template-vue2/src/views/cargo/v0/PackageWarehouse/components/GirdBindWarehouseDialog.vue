<template>
  <el-dialog :visible.sync="showDialog" :title="$t('planManager.createBatchDialogTitle')" width="550px" :close-on-click-modal="false" :before-close="closeModify">
    <el-form label-width="100px" :model="bindForm" :rules="bindFormRule" ref="bindForm" size="mini">
      <el-form-item :label="`${$t('packageWarehouse.girdConfig.targetGird')}: `" prop="warehouseId">
        {{bindForm.girdName}}
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.girdConfig.targetWarehouse')}: `" prop="warehouseId">
        <el-select v-model="bindForm.warehouseId"
          filterable>
          <el-option
            v-for="item in warehouseList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { bindGirdWarehouseApi } from '@/api/packageWarehouse'
export default {
  name: 'GirdBindWarehouseDialog',
  props: {
    warehouseList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      bindForm: {
        girdId: '',
        girdName: '',
        warehouseId: ''
      },
      bindFormRule: {
        warehouseId: [
          {required: true, message: this.$t('packageWarehouse.girdConfig.warehouseIdInvalid'), trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    showBindDialog(data) {
      this.bindForm.girdId = data.id
      this.bindForm.girdName = data.girdName
      this.showDialog = true
    },
    validateForm() {
      this.$refs.bindForm.validate(valid => {
        if (valid) {
          this.bindWarehouse()
        }
      })
    },
    async bindWarehouse() {
      const res = await bindGirdWarehouseApi(this.bindForm)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.girdConfig.bindSuccess'))
        this.$emit('refreshData')
        this.closeModify()
      }
    },
    closeModify() {
      this.showDialog = false
      this.$refs.bindForm.resetFields()
    }
  },
  mounted() {
  }
}

</script>
