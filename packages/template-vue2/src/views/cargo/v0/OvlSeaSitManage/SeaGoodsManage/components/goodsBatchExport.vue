<template>
  <el-dialog :visible.sync="dialogVisible" :title='$t("common.batchExport")' width="520px" :close-on-click-modal="false">
    <div class="dialog-content" v-loading="loading">
      <UploadFile :accept="'.xlsx'" :showFileList="true" :limit="1" v-model="fileList">
        <div slot="upload">
          <el-button size="mini" type="primary" class="mb-10">{{ $t("common.multipleUpload") }}</el-button>
        </div>
      </UploadFile>
      <span>{{ $t("common.upload.uploadXlsx") }}</span>
      <span class="fc-blue ml-10 pointer" @click="downloadExcel('seaGoodsInfoImportExcelTemplate.xlsx')">{{ $t("common.upload.downloadTemplate") }}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"	size="mini"	 :loading="loading" @click="saveForm">{{ $t("common.uploadText") }}</el-button>
      <el-button	size="mini"	@click="dialogVisible = false">{{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { importGoodsApi } from '@/api/OvlSeaSitManage/seaGoodsManage'
export default {
	name: 'GoodsBatchExport',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			fileList: []
		}
	},
	methods: {
		async saveForm() {
			if (this.$isEmpty(this.fileList)) {
				this.$message.error(this.$t('goodsManagement.uploadEmptyTip'));
				return
			}
			this.loading = true
			let res = await importGoodsApi(this.fileList[0])
			if (res.ok) {
				this.dialogVisible = false
				this.$alert(`<div><span class="fc-red fs-16">${this.$t('common.handlerTime')}</span><span class="fs-16">,${this.$t('common.handlerRes')}</span></div>`, this.$t('common.handlerImportTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.$t('common.theKnow'),
					callback: () => {
						this.$emit('saved')
					}
				})
			}
			this.loading = false
		},
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.fileList = []
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			this.dialogVisible = val
		}
	}

}
</script>
<style lang="scss" scoped>
</style>
