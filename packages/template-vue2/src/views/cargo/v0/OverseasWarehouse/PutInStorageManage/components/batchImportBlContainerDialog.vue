<template>
	<div>
		<el-dialog :visible.sync="dialogVisible" :title="$t('putInStorageManage.batchImport')"	width="550px" :close-on-click-modal="false">
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
                  {{ $t("putInStorageManage.batchImport") }}
                </el-button>
              </div>
            </UploadFile>
            <span>{{ $t("common.upload.uploadXlsx") }}</span>
            <span class="fc-blue ml-10 pointer" @click="downloadExcel('inboundBlContainNoTemplate.xlsx')">{{
              $t("common.upload.downloadTemplate")
            }}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- v-permission="['sys:template:update']" -->
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
import { importInboundbBlApi } from '@/api/OverseasWarehouse/GRNManager'
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant'
export default {
	name: 'BatchImportBlContainerDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
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
			let rs = await importInboundbBlApi(this.formData)
			if (rs.ok) {
				// 添加日志 记录数据
				this.logBtnSend({
					origin: logOrigin.SYSTEM_OPERATION,
					logCode: pointOvl.OVL_INBOUND_BL_IMPORT,
					serviceName: logServiceName.OVL_SERVICE,
					businessType: pointOvl.OVL_INBOUND_BL_IMPORT,
					content: {
						...this.formData
					}
				})
				this.loading = false
				this.dialogVisible = false
				this.$alert(`<div><span class="fc-red fs-16">${this.$t('common.handlerTime')}</span><span class="fs-16">,${this.$t('common.handlerRes')}</span></div>`, this.$t('common.handlerImportTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.$t('common.theKnow'),
					callback: () => {
						this.$emit('saved')
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

<style>
</style>
