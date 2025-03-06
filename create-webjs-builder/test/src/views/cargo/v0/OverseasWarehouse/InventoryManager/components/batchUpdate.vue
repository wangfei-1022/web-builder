<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" :title="$t('inventoryManager.updateTitle')" width="400px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <div class="tips-content">
          {{$t('inventoryManager.updateTips')}}
        </div>
        <UploadFile :accept="'.xlsx'" :showFileList="true" :limit="1" v-model="fileList" :on-progress="handletProgress" >
          <div slot="upload">
            <el-button size="mini"  type="primary" class="ml-10" :loading="loading">
             {{$t('inventoryManager.uploadBtn')}}
            </el-button>
          </div>
        </UploadFile>
        <span class="ml-10">{{ $t("common.upload.uploadXlsx") }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  :loading="loading" size="mini" @click="saveForm" >
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">{{ $t("common.cancelBtn") }}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>

import { importTakeStockApi } from '@/api/inventory'
export default {
	name: 'BatchUpdate',
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
			fileList: [],
			loading: false,
		}
	},
	computed: {

	},
	methods: {
		async saveForm() {
			if (this.$isEmpty(this.fileList)) {
				this.$message.error(this.$t('common.upload.pleaseUploadFile'))
				return
			}
			let saveForm = this.fileList[0]
			saveForm.id = this.id
			this.loading = true
			let rs = await importTakeStockApi(saveForm)
			if (rs.ok) {
				this.loading = false
				// 添加日志 记录数据
				this.logBtnSend({
					origin: this.logOrigin.SYSTEM_OPERATION,
					logCode: this.pointOvl.OVL_TAKE_STOCK_BATCH_UPDATE,
					serviceName: this.logServiceName.OVL_SERVICE,
					businessType: this.pointOvl.OVL_TAKE_STOCK_BATCH_UPDATE,
					content: {
						id: this.activeId
					}
				})
				this.$alert(`<div><span class="fs-16">${this.$t('inventoryManager.importTakeTips')}</span></div>`, this.$t('inventoryManager.importTakeTitle'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.$t('common.theKnow'),
					callback: () => {
						this.$emit('saved')
						this.dialogVisible = false
					}
				})
			} else {
				this.loading = false
			}
		},
		/**
		 * 上传时
		 */
		handletProgress() {
			this.loading = true
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.fileList = []
			}
			this.dialogVisible = val
		}
	}

}
</script>
<style lang='scss' scoped>
.tips-content {
	line-height: 18px;
	width: 320px;
	line-height: 22px;
	margin-left: 10px;
	margin-bottom: 10px;
}
</style>>
