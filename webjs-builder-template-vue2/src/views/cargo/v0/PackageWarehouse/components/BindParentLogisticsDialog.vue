<template>
  <el-dialog :visible.sync="showDialog" :title="$t('packageWarehouse.logisticManager.importTitle')" :close-on-click-modal="false" :before-close="closeModify" width="440px">
    <el-form label-width="80px" :model="bindForm" :rules="bindFormRule" ref="bindForm" size="mini" :inline="true">
      <el-form-item :label="`${$t('packageWarehouse.logisticManager.parentLogisticsNo')}: `" prop="parentLogisticsNo">
        <el-input v-model="bindForm.parentLogisticsNo"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { bindParentLogisticsApi } from '@/api/packageWarehouse'
import { getToken } from '@/utils/auth'
export default {
  name: 'BindParentLogisticsDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    parentLoading: {
      type: Boolean,
      default: false
    },
    childIdList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      bindForm: {
        parentLogisticsNo: '',
        childIdList: []
      },
      bindFormRule: {
        parentLogisticsNo: [
          {required: true, message: this.$t('packageWarehouse.logisticManager.parentLogisticsNoInvalid'), trigger: 'blur'}
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
  watch: {
    childIdList: {
      handler: function(newVal, oldVal) {
        if (newVal.length > 0) {
          this.bindForm.childIdList = newVal
        }
      },
      immediate: true
    }
  },
  methods: {
    closeModify() {
      this.showDialog = false
      this.$refs.bindForm.resetFields()
    },
    validateForm() {
      this.$refs.bindForm.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    async submitForm() {
      this.loading = true
      const res = await bindParentLogisticsApi(this.bindForm)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.logisticManager.bindParentSuccess'))
        this.closeModify()
        this.$emit('refreshData')
      } else {
        this.loading = false
      }
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped="">
</style>
