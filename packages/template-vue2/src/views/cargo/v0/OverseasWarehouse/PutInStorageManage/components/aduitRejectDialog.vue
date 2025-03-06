<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('common.tips')"
			width="550px"
			:close-on-click-modal="false"
			:append-to-body="true"
		>
      <el-form v-if="dialogVisible" ref="formData" label-width="110px" label-position="top" :model="formData">
        <el-form-item
         :label="$t('putInStorageManage.refuseReason')"
          :rules="[
            { required: true, message: $t('putInStorageManage.input_refuseReason') }
          ]"
          prop="reason"
        >
          <el-input
          type="textarea"
          :placeholder="$t('putInStorageManage.input_refuseReason')"
          v-model="formData.reason"
          maxlength="50"
          show-word-limit
        >
        </el-input>
        </el-form-item>
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button  size="mini" @click="dialogVisible = false" :loading='loading'>
					{{$t('common.cancelBtn') }}
				</el-button>
        <el-button type="primary" size="mini" @click="saveForm('formData')" :loading='loading'>
						{{$t('common.saveBtn') }}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { auditRejectApi } from '@/api/OverseasWarehouse/GRNManager'
export default {
	name: 'AduitRejectDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
    id: String
	},
	data() {
		return {
			dialogVisible: false,
      loading: false,
			formData: {
        reason: null
      }
		}
	},
  methods: {
    /**
     * 保存接口
     */
    saveForm(refName) {
      this.$refs[refName].validate(valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        auditRejectApi({id: this.id, reason: this.formData.reason}).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('common.saveSuccess'))
            this.loading = false
            this.$emit('saved')
            this.dialogVisible = false
          } else {
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })
      })
    }
  },
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
      if (val) {
        this.formData.reason = null
      }
      this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
