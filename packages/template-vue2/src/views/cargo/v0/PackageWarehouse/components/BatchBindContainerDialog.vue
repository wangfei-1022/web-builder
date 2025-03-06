<template>
  <el-dialog :visible.sync="showDialog" :title="$t('packageWarehouse.batchManager.bindContainerTitle')" width="350px" :close-on-click-modal="false" :before-close="closeModify">
    <el-form label-width="80px" :model="createForm" :rules="createFormRule" ref="createForm" size="mini" style="width: 261px;">
      <el-form-item :label="`${$t('packageWarehouse.batchManager.containerNos')}: `" prop="numbers">
        <el-input type="textarea" v-model="createForm.numbers" :placeholder="$t('common.placeholder')" rows="6" />
      </el-form-item>
    </el-form>
    <div style="text-align: right;">
      <el-button type="primary" :loading="loading" size="mini" @click="validateForm">{{$t('common.submitBtn')}}</el-button>
      <el-button size="mini" :loading="loading" @click="closeModify">{{$t('common.cancelBtn')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { containerBindBatchApi } from '@/api/packageWarehouse'
export default {
  name: 'BatchBindContainerDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      createForm: {
        numbers: '',
        batchId: this.$route.params.batchId
      },
      createFormRule: {
        numbers: [
          {required: true, message: this.$t('packageWarehouse.batchManager.containerNosInvalid'), trigger: 'blur'}
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
    showLoading: {
      get: function() {
        return this.loading
      },
      set: function(val) {
        this.$emit('update:loading', val)
      }
    }
  },
  watch: {},
  methods: {
    validateForm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.submitForm()
        }
      })
    },
    async submitForm() {
      this.showLoading = true
      this.createForm.ids = this.ids
      const res = await containerBindBatchApi(this.createForm)
      if (res && res.ok) {
        this.$message.success(this.$t('packageWarehouse.batchManager.bindContainerSuccess'))
        this.closeModify()
        this.$emit('refreshData')
      }
      this.showLoading = false
    },
    closeModify() {
      this.showDialog = false
      this.$nextTick(() => {
        this.clearForm()
      })
    },
    clearForm() {
      this.$refs.createForm.resetFields()
      this.$refs.createForm.clearValidate()
    }
  }
}

</script>
