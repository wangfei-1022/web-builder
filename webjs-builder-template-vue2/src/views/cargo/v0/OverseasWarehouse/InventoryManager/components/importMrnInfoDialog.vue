<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" :title="$t('common.batchImport')" width="550px" :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="70px" label-position="left"  v-if="dialogVisible" v-loading="loading" >
          <el-form-item :label="$t('common.uploadText')" required>
            <UploadFile :accept="'.xlsx'" :showFileList="true" :limit="1" v-model="fileList" class="upload" :on-progress="handletProgress">
              <div slot="upload">
                <el-button size="mini" type="primary" class="ml-10" :loading="loading" >{{ $t("common.batchImport") }}</el-button>
              </div>
            </UploadFile>
            <span>{{ $t("common.upload.uploadXlsx") }}</span>
            <span class="fc-blue ml-10 pointer" @click="downloadExcel('mrnImportExcelTemplate.xlsx')">{{$t("common.upload.downloadTemplate")}}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm">
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">{{
          $t("common.cancelBtn")
        }}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { importInboundMrnApi } from '@/api/inventory'
export default {
	name: 'ImportMrnInfoDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dialogVisible: false,
			fileList: [],
			loading: false
		}
	},
	methods: {
		async saveForm() {
			if (this.$isEmpty(this.fileList)) {
				this.$message.error(this.$t('common.upload.pleaseUploadFile'))
				return
			}
			this.loading = true
			let rs = await importInboundMrnApi(this.fileList[0])
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
				this.$emit('saved')
				this.$message.success(this.$t('common.uploadSuccess'))
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

<style>
</style>
