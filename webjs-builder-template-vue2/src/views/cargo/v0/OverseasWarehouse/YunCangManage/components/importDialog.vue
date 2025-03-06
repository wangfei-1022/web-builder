<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="[3,4].includes(batchType) ? $t('putInStorageManage.batchUpdateData') : $t('outInStorageManage.updateStatus')"
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
            <span class="fc-blue ml-10 pointer" @click="downloadExcel(getTemp)" v-if="batchType !== 4">{{ $t("common.upload.downloadTemplate") }}</span>
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
import { importCloudOutboundApi, importCloudInboundApi, importCloudPackageInboundApi } from "@/api/OverseasWarehouse/YunCangManage"
import { importInboundTaskInfoApi, importInboundTaskDetailListApi } from '@/api/OverseasWarehouse/GRNManager'
import { logServiceName, pointOvl, logOrigin } from '@/utils/constant'
export default {
	name: 'ImportDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		// 1 入库 2出库 3入库任务 4 入库任务详情导入数据 5 包裹入库
		batchType: {
			type: Number,
			default: 1
		},
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
		getTemp() {
			//  1 入库 2出库 3入库任务 4 包裹入库
			let templateName = ''
			switch (this.batchType) {
				case 1:
					templateName = '云仓入库单导入更新状态模板.xlsx'
					break
				case 2:
					templateName = '云仓出库单导入更新状态模板.xlsx'
					break
				case 3:
					templateName = 'inboundTaskInfoImportTemplate.xlsx'
					break
				case 5:
					templateName = 'cloudInboundPackageImportTemplate.xlsx'
					break
				default:
					templateName = ''
					break
			}
			return templateName
		}
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
			// 1 入库 2出库 3入库任务 4 入库任务详情 5 包裹入库
			let fn = null
			switch (this.batchType) {
				case 1:
					fn = importCloudInboundApi
					break
				case 2:
					fn = importCloudOutboundApi
					break
				case 3:
					fn = importInboundTaskInfoApi
					break
				case 4:
					fn = importInboundTaskDetailListApi
					break
				case 5:
					fn = importCloudPackageInboundApi
					break
				default:
					fn = null
					break
			}
			let saveForm = {}
			if (this.batchType === 4) {
				saveForm = {
					...this.paramsData,
					file: this.formData
				}
			} else {
				saveForm = this.formData
			}
			let rs = await fn(saveForm)
			if (rs.ok) {
				if (this.batchType === 3 || this.batchType === 4) {
					// 添加日志 记录数据
					this.logBtnSend({
						origin: logOrigin.SYSTEM_OPERATION,
						logCode: pointOvl.OVL_INBOUND_TASK_BATCH_UPDATE,
						serviceName: logServiceName.OVL_SERVICE,
						businessType: pointOvl.OVL_INBOUND_TASK_BATCH_UPDATE,
						content: {
							...saveForm
						}
					})
				}
				this.loading = false
				this.dialogVisible = false
				this.$emit('saved')
				this.$message.success(this.$t('common.uploadSuccessInfo'))
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
