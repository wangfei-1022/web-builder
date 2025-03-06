<template>
  <div class="edit-btn-wrap">
    <el-button type="text" size="mini" @click="editOwner" v-show="!params.data.activeFlag">{{$t('common.editBtn')}}</el-button>
    <el-button type="text" size="mini" @click="deleteOwner" v-show="!params.data.activeFlag">{{$t('common.deleteBtn')}}</el-button>
    <el-button type="text" size="mini" @click="enabledOwner" v-show="!params.data.activeFlag">{{$t('common.enableBtn')}}</el-button>
    <el-button type="text" size="mini" @click="disabledOwner" v-show="params.data.activeFlag" style="margin-left: 0;">{{$t('common.disableBtn')}}</el-button>
    <el-button type="text" size="mini" @click="editSubitem">{{$t('codeManager.subitemBtn')}}</el-button>
  </div>
</template>
<script>
import { disableAttributeApi, enableAttributeApi, deleteAttributeApi } from '@/api/codeManager'
export default {
	name: 'EditCodeBtn',
	data() {
		return {
			showDialog: false
		}
	},
	methods: {
		editOwner() {
			this.params.showEditDialog(this.params.data.id)
		},
		async deleteOwner() {
			this.$confirm(this.$t('codeManager.deleteWarnningText'), this.$t('common.warnningText'), {
				confirmButtonText: this.$t('common.deleteBtn'),
				cancelButtonText: this.$t('codeManager.thinkOver'),
				type: 'warning'
			}).then(async () => {
				const res = await deleteAttributeApi(this.params.data.id)
				if (res && res.ok) {
					this.$message.success(this.$t('codeManager.deletedSuccess'))
					this.params.refreshData()
				}
			}).catch(() => { })

		},
		async enabledOwner() {
			const res = await enableAttributeApi(this.params.data.id)
			if (res && res.ok) {
				this.$message.success(this.$t('codeManager.enabledSuccess'))
				this.params.refreshData()
			}
		},
		async disabledOwner() {
			this.$confirm(this.$t('codeManager.disableWarnningText'), this.$t('common.warnningText'), {
				confirmButtonText: this.$t('common.disableBtn'),
				cancelButtonText: this.$t('codeManager.thinkOver'),
				type: 'warning'
			}).then(async () => {
				const res = await disableAttributeApi(this.params.data.id)
				if (res && res.ok) {
					this.$message.success(this.$t('codeManager.disabledSuccess'))
					this.params.refreshData()
				}
			}).catch(() => { })
		},
		editSubitem() {
			this.$router.push({ name: 'CodeItemList', params: { id: this.params.data.id } })
		}
	},
	mounted() {
	}
}
</script>
<style lang="scss" scoped>
::v-deep .el-button + .el-button:first-child {
	margin-left: 0;
}
</style>
