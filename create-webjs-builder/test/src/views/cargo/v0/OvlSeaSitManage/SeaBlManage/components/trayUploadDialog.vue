<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('outInStorageManage.batchImport')"
			width="550px"
			:close-on-click-modal="false"
		>
      <div class="dialog-content">
        <el-form
          label-width="70px"
          label-position="left"
          :model="formData"
          ref="formData"
          v-if="dialogVisible"
          v-loading="loading"
        >
          <el-form-item :label="$t('common.uploadText')" required>
            <UploadFile  :accept="'.xlsx,.xls'" :showFileList="true" :limit="1" @success="()=>{loading=false}" v-model="fileList" :on-progress="handletProgress">
              <div slot="upload">
                <el-button size="mini" type="primary" class="ml-10" :loading="loading" >
                  {{ $t("outInStorageManage.uploadFile") }}
                </el-button>
              </div>
            </UploadFile>
            <span>{{ $t("common.upload.uploadXlsx") }}</span>
            <span class="fc-blue ml-10 pointer" @click="downloadExcel('光伏装箱明细导入模板.xls')">{{$t("common.upload.downloadTemplate")}}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm">
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">{{
          $t("common.cancelBtn")}}
        </el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { importTrayExcelApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'TrayUploadDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		blId: String
	},
	data() {
		return {
			dialogVisible: false,
			fileList: [],
			loading: false,
			formData: {}
		}
	},

	methods: {
		async saveForm() {
			if (this.$isEmpty(this.fileList)) {
				this.$message.error(this.$t('common.upload.pleaseUploadFile'))
				return
			}
			this.loading = true
			let saveForm = this.fileList[0]
			saveForm.blId = this.blId
			let rs = await importTrayExcelApi(saveForm)
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
				this.$message.success(this.$t('common.parsingSuccess'))
				this.$emit('saved')
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
