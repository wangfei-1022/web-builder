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
            <UploadFile  :accept="'.xlsx'" :showFileList="true" :limit="1" @success="()=>{loading=false}" v-model="fileList" :on-progress="handletProgress">
              <div slot="upload">
                <el-button size="mini" type="primary" class="ml-10" :loading="loading" >
                  {{ $t("outInStorageManage.uploadFile") }}
                </el-button>
              </div>
            </UploadFile>
            <span>{{ $t("common.upload.uploadXlsx") }}</span>
            <span class="fc-blue ml-10 pointer" @click="downloadExcel('inboundImportTemplate.xlsx')">{{$t("common.upload.downloadTemplate")}}</span>
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

import { imporInboundtApi } from '@/api/OverseasWarehouse/GRNManager'
export default {
	name: 'PhotovoltaicBatchDialog',
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
			let rs = await imporInboundtApi(saveForm)
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
				this.$alert(`<div><span class="fc-red fs-16">${this.$t('common.handlerTime')}</span><span class="fs-16">,${this.$t('common.handlerRes')}</span></div>`, this.$t('common.handlerImportTips'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: this.$t('common.theKnow'),
					callback: () => {
						this.loading = false
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
