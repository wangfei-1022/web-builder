<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('outInStorageManage.addFile')"
			width="550px"
			:close-on-click-modal="false"
		>
			<div v-if="$isNotEmpty(vasData)">
				<div class="flex mb-20" v-for="(item, index) in vasData" :key="index">
					<span class="label-name">{{ item.name }}：</span>
					<UploadFile
						:accept="'.pdf'"
						:showFileList="true"
						v-model="item.serviceContent.fileList"
						class="upload"
					>
						<div slot="tip">
							<div class="uploadTip"> {{$t('common.upload.uploadPDF')}}</div>
						</div>
					</UploadFile>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					size="mini"
					@click="saveForm()"
					:disabled="loading"
				>
					{{$t('common.confirmBtn')}}
				</el-button>
				<el-button
					size="mini"
					@click="dialogVisible = false"
					:disabled="loading"
				>
					{{$t('common.cancelBtn')}}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { saveOutboundsVas, getBolAndPalletLabel } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'ThroughFile',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		return {
			loading: false,
			dialogVisible: false,
			vasData: []
		}
	},
	methods: {
		/**
		 * 获取增值服务
		 */
		async getBolAndPalletLabel() {
			this.vasData = []
			let res = await getBolAndPalletLabel(this.id)
			if (res.ok) {
				if (this.$isNotEmpty(res.content)) {
					res.content.forEach(item => {
						if (this.$isNotEmpty(item.serviceContentJson)) {
							let serviceContent = JSON.parse(item.serviceContentJson)
							if (this.$isEmpty(serviceContent.fileList)) {
								serviceContent.fileList = []
							}
							item.serviceContent = serviceContent
						}
					})
					this.vasData = res.content || []
				}
			}
		},
		/**
		 * 保存数据
		 */
		saveForm() {
			let message = ''
			if (this.$isNotEmpty(this.vasData)) {
				this.vasData.forEach(item => {
					item.serviceCode = item.code
					if (this.$isEmpty(item.serviceContent.fileList)) {
						message = this.$t('outInStorageManage.upload') + item.name + this.$t('outInStorageManage.file')
					} else {
						let serviceContent = this.$extends(true, {}, item.serviceContent)
						serviceContent.fileList.forEach(file => {
							delete file.url
						})
						item.serviceContentJson = JSON.stringify(serviceContent)
					}
				})
			} else {
				return
			}
			if (this.$isNotEmpty(message)) {
				this.$message.error(message)
				return
			}

			let saveData = {
				id: this.id,
				vas: this.vasData
			}
			this.loading = true
			saveOutboundsVas(saveData).then(res => {
				if (res.ok) {
					this.loading = false
					this.dialogVisible = false
					this.$emit('saved')
					this.$message.success(this.$t('outInStorageManage.addFileSuccess'))
				}
			}).catch(() => {
				this.loading = false
			})
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				if (this.$isNotEmpty(this.id)) {
					this.getBolAndPalletLabel()
				}
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.upload {
	text-align: left !important;
}
.tips {
	padding: 10px;
	font-size: 12px;
	color: #edc28c;
	background-color: #fef5ec;
	margin-bottom: 10px;
}
.label-name {
	width: 80px;
}
</style>
