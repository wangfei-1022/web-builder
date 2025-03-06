<template>
  <el-dialog :visible.sync="showDialog" :title="$t('packageWarehouse.logisticManager.importTitle')" :close-on-click-modal="false" :before-close="closeModify" width="440px">
    <el-form label-width="80px" :model="upgradeFrom" :rules="upgradeFromRule" ref="upgradeFrom" size="mini" :inline="true">
      <el-form-item :label="`${$t('packageWarehouse.logisticManager.logisticsNos')}: `" prop="logisticsNo">
        <el-input v-model="upgradeFrom.logisticsNo" disabled></el-input>
      </el-form-item>
      <el-form-item :label="`${$t('packageWarehouse.logisticManager.logisticsStateName')}: `" prop="logisticsState">
        <el-select v-model="upgradeFrom.logisticsState">
          <el-option v-for="item in statusList" :label="item.label" :value="item.value" :key="item.value"></el-option>
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
import { upgradeLogisticsStatusApi } from '@/api/packageWarehouse'
import { getToken } from '@/utils/auth'
export default {
  name: 'LogisticsStatusDialog',
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
    modifyInfo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      upgradeFromRule: {
        logisticsState: [
          {required: true, message: this.$t('packageWarehouse.logisticManager.statusInvalid'), trigger: 'change'}
        ]
      },
      statusList: [
        {
          label: this.$t('packageWarehouse.logisticManager.statusList[0]'),
          value: 0
        },
        {
          label: this.$t('packageWarehouse.logisticManager.statusList[1]'),
          value: 5
        },
        {
          label: this.$t('packageWarehouse.logisticManager.statusList[2]'),
          value: 10
        }
      ]
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
    },
    upgradeFrom: function() {
      let _obj = {
        id: '',
        logisticsNo: '',
        logisticsState: null
      }
      if (this.modifyInfo) {
        _obj = {
          id: this.modifyInfo.id,
          logisticsNo: this.modifyInfo.logisticsNo,
          logisticsState: this.modifyInfo.logisticsState
        }
      }
      return _obj
    }
  },
  methods: {
    closeModify() {
      this.showDialog = false
      this.$refs.upgradeFrom.resetFields()
    },
    validateForm() {
      this.$refs.upgradeFrom.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    async submitForm() {
      this.loading = true
      const res = await upgradeLogisticsStatusApi(this.upgradeFrom)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.logisticManager.upgradeSuccess'))
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
