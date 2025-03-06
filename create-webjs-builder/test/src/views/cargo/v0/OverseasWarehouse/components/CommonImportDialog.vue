<template>
	<div>
		<el-dialog :visible.sync="dialogVisible" :title="title ? title : $t('common.batchImport')" width="550px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="70px"  label-position="left" :model="formData"  ref="formData"  v-if="dialogVisible" v-loading="loading" >
          <el-form-item :label="$t('common.uploadText')" required>
            <UploadFile
              :accept="'.xlsx'"
              :showFileList="true"
              @success="successUpload"
              :limit="1"
              v-model="fileList"
              class="upload"
              :on-progress="handletProgress"
            >
              <div slot="upload">
                <el-button
                  size="mini"
                  type="primary"
                  class="ml-10"
                  :loading="loading"
                >
                  {{ $t("common.multipleUpload") }}
                </el-button>
              </div>
            </UploadFile>
            <span>{{ $t("common.upload.uploadXlsx") }}</span>
            <span class="fc-blue ml-10 pointer" @click="downloadExcel(templateName)">{{ $t("common.upload.downloadTemplate") }}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="loading"
          size="mini"
          @click="saveForm"
        >
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
export default {
	name: 'ImportDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		fn: Function,
		templateName: String,
		title: String,
		paramsData: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {
			dialogVisible: false,
			fileList: [],
			loading: false,
			formData: {
				cloudFileName: '',
				originFileName: '',
				url: '',
				fileSize: ''

			}
		}
	},
	computed: {

	},
	methods: {
		/**
* 更新成功
*/
		successUpload(file) {
			this.loading = false
			this.$copyProps(this.formData, file)

		},
		async saveForm() {
			if (this.$isEmpty(this.fileList)) {
				this.$message.error(this.$t('common.upload.pleaseUploadFile'))
				return
			}
			this.loading = true
			let saveForm = {}
			saveForm = {
				...this.paramsData,
				...this.formData
			}
			let rs = await this.fn(saveForm)
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
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
