<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			ref="formData"
			:title="getZH('batchUpload')"
			width="550px"
			:close-on-click-modal="false"
		>
			<div v-loading="loading">
				<el-row :gutter="20" v-if="dialogVisible">
					<el-col :span="12">
						<div>
							<div class="mb-10">
								<span class="fc-red">*</span> {{ getZH("goodsInfoUpload") }}
							</div>
              <div>
                <UploadFile :accept="'.xlsx'" :showFileList="true" :limit="1" v-model="fileList" :on-progress="onProgress">
                  <div slot="upload">
                    <el-button size="mini" type="primary">{{getZH("upload.uploadClickTitle", "common")}}</el-button>
                  </div>
                </UploadFile>
                <div class="el-upload__tip">
                  <span >{{ $t("common.upload.uploadXlsx") }}</span>
                  <span class="fc-blue ml-10 pointer" @click="downloadExcel('goodsInfoImportExcelTemplate.xlsx')">{{$t("common.upload.downloadTemplate")}}</span>
                </div>
              </div>
						</div>
					</el-col>
					<el-col :span="12">
						<div>
							<div class="mb-10">
								<span class="fc-red">*</span>{{ getZH("goodsPhotoUpload") }}
							</div>
							<FolderUpload	@remove="removeFile" @onProgress="onProgress" @success="successUpload" @onError="onError" />
						</div>
					</el-col>
				</el-row>
				<div class="tips">
					<div class="tips-title flex-box">
						<div class="icon flex-center">1</div>
						<div class="title">{{ getZH("attention") }}</div>
					</div>
					<div class="tips-content">
						<div class="content">{{ getZH("excelTip1") }}</div>
						<div class="content">{{ getZH("excelTip2") }}</div>
						<div class="content">{{ getZH("excelTip3") }}</div>
						<div class="content">{{ getZH("excelTip4") }}</div>
						<div class="content">{{ getZH("excelTip5") }}</div>
						<div class="content">{{ getZH("excelTip6") }}</div>
					</div>
				</div>
				<div class="tips warning">
					<div class="tips-title flex-box">
						<div class="icon flex-center">1</div>
						<div class="title">{{ getZH("photoUploadRule") }}</div>
					</div>
					<div class="tips-content">
						<div class="content">{{ getZH("photpTip1") }}</div>
						<div class="content">{{ getZH("photpTip2") }}</div>
						<div class="content">{{ getZH("photpTip3") }}</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="loading" @click="saveForm" size="mini" :disabled="	$isEmpty(goodsPicCloudFileVoList) && $isEmpty(fileList)">{{ this.getZH("uploadParsing") }}</el-button>
				<el-button size="mini" :loading="loading" @click="dialogVisible = false">{{ this.getZH("cancel", "common") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import FolderUpload from './folderUpload'
import { mapState } from 'vuex'
import { uploadFileBacthApi } from '@/api/OverseasWarehouse/goodsManager'
import { ossUpload } from '@/utils/ossUpload'
import TempContent from './TempContent'
export default {
	name: 'BulkImportFile',
	components: { FolderUpload, TempContent },
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
			isEnd: false,
			tips: {
				isEnd: false,
				content: ''
			},
			goodsPicCloudFileVoList: [],
			goodsInfoExcelCloudFileVo: {}
		}
	},
	computed: {
		...mapState({
			uploadToken: state => state.user.token
		}),
		uploadHeads() {
			return {
				Authorization: this.uploadToken
			}
		}
	},
	methods: {
		/**
		 * 删除已上传的文件
		 */
		removeFile(file) {
			let index = this.goodsPicCloudFileVoList.findIndex(item => item.uid === file.uid)
			if (index !== -1) {
				this.goodsPicCloudFileVoList.splice(index, 1)
			}
		},

		/**
		 * 文件上传时钩子
		 */
		onProgress() {
			this.loading = true
		},
		/**
		 * 文件上传失败时钩子
		 */
		onError() {
			this.loading = false
		},
		successUpload(data) {
			this.goodsPicCloudFileVoList.push(data)
			this.loading = false
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'goodsManagement'
			let str = obj + '.' + key
			return this.$t(str)
		},
		/**
		 * 保存数据
		 */
		async saveForm() {
			this.loading = true
			let saveData = {
				goodsPicCloudFileVoList: this.$isEmpty(this.goodsPicCloudFileVoList) ? null : this.goodsPicCloudFileVoList,
				goodsInfoExcelCloudFileVo: this.$isEmpty(this.fileList) ? null : this.fileList[0]
			}
			let res = await uploadFileBacthApi(saveData).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				let _this = this
				_this.tips = {
					isEnd: false,
					content: _this.getZH('parsingTips')
				}
				let h = this.$createElement
				let msg = h('div', null, [
					h(TempContent, {
						props: { tips: _this.tips },
						on: {
							end: () => {
								_this.tips.isEnd = true
								_this.tips.content = _this.getZH('uploadSuccessTips')
								_this.$emit('saved')
							}
						}
					})
				])
				this.$alert(msg, _this.getZH('parsing'), {
					dangerouslyUseHTMLString: true,
					confirmButtonText: _this.getZH('determine'),
					callback: () => {
						_this.tips.isEnd = true
						_this.tips.content = _this.getZH('parsingTips')
						_this.$emit('saved')
					}
				})
				this.dialogVisible = false
				this.loading = false
			} else {
				this.loading = false
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			this.dialogVisible = val
			if (val) {
				this.goodsPicCloudFileVoList = []
				this.fileList = []
			}
		}
	}

}
</script>

<style scoped lang="scss">
.download-text {
	color: #108efd;
	cursor: pointer;
}
.tips {
	width: 100%;
	min-height: 50px;
	padding: 10px;
	border: 1px solid #b3e2ff;
	background-color: #e6f7ff;
	margin-top: 10px;
	color: #666;
	font-size: 12px;
	.tips-title {
		margin-bottom: 4px;
		.icon {
			font-size: 12px;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			background: #108efd;
			color: #fff;
			margin-right: 6px;
		}
		.title {
			font-size: 14px;
			font-weight: 600;
		}
	}
	.tips-content {
		padding-left: 20px;
		.content {
			line-height: 22px;
		}
	}
	&.warning {
		border: 1px solid #edc28c;
		background-color: #fef5ec;
		.icon {
			background: #ef9027;
		}
	}
}
</style>
