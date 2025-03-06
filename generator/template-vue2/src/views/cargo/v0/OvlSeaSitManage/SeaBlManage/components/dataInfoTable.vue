<template>
    <div>
      <el-table :data="dataList" size="mini" height="250" border stripe v-loading="loading">
        <el-table-column :label="$t('seaBl.indexNo')" width="60">
          <template slot-scope="{$index}">
            {{$index+1}}
          </template>
        </el-table-column>
        <el-table-column width="120" :label="$t('seaBl.dataType')" prop="fieldCodeName"  />
        <el-table-column :label="$t('seaBl.file')" >
          <template slot-scope="{row}">
            <span @click="downFile(row)" class="link-box"> {{$isEmpty(row.originFileName)?'':row.originFileName}}</span>
            <span v-if="$isNotEmpty(row.originFileName) && !isDetail" class="ml-10 fc-red pointer" @click="delItem(row)">{{$t('common.deleteBtn')}}</span>
            <UploadFile :showFileList="false" v-if='$isEmpty(row.originFileName) && !isDetail' @success="uploadSuccess($event,row)">
              <div slot="upload" class="fc-blue">{{$t('common.uploadText')}}</div>
            </UploadFile>
          </template>
        </el-table-column>
        <el-table-column :label="$t('seaBl.uploadPerson')" prop="createByName" width="120" />
        <el-table-column :label="$t('seaBl.uploadTime')" width="140" >
          <template slot-scope="{row}">
            {{row.createTime | formatDate}}
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
import { getFilePagesApi, saveFileApi, delFileApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'DataInfoTable',
	props: {
		blId: String,
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dataList: [
				{ fieldCode: 'bl', fieldCodeName: '提单' },
				{ fieldCode: 'ctn', fieldCodeName: '箱单' },
				{ fieldCode: 'clear_invoice', fieldCodeName: '清关发票' },
				{ fieldCode: 'do', fieldCodeName: 'DO' },
				{ fieldCode: 'other', fieldCodeName: '其他' }
			],
			loading: false
		};
	},
	created() {
		this.list()
	},
	mounted() {

	},
	methods: {
		// 获取商品列表
		async list() {
			if (this.$isEmpty(this.blId)) {
				return
			}
			this.loading = true
			let res = await getFilePagesApi(this.blId)
			if (res.ok) {
				let dataList = []
				this.dataList.forEach(item => {
					let data = res.content.list.find(data => item.fieldCode === data.fieldCode)
					let itemData = {}
					if (this.$isNotEmpty(data)) {
						itemData = this.$extends(true, {}, data)
					} else {
						itemData = { fieldCode: item.fieldCode, fieldCodeName: item.fieldCodeName }
					}
					dataList.push(itemData)
				})
				this.dataList = dataList
				this.loading = false
			} else {
				this.loading = false
			}
		},
		// 上传文件
		uploadSuccess(data, row) {
			let saveForm = {
				entityType: null,
				entityId: this.blId,
				fieldCode: row.fieldCode,
				url: null,
				originFileName: null,
				cloudFileName: null,
				documentTypeCode: null,
				sourceType: null,
				fileSize: null
			}

			this.$copyProps(saveForm, data)
			this.loading = true
			if (row.id) {
				let delData = {
					deleteDTO: {
						blId: this.blId,
						blFileCode: row.fieldCode
					},
					addList: [saveForm]
				}
				delFileApi(delData).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			} else {
				saveFileApi(saveForm).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.saveSuccess'))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				})
			}

		},
		// 删除
		delItem(row) {
			this.$confirm(this.$t('common.deleteTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				let delData = {
					deleteDTO: {
						blId: this.blId,
						blFileCode: row.fieldCode
					}
				}
				this.loading = true
				delFileApi(delData).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})

			}).catch(() => {
				// do nothing
			})
		},
		downFile(row) {
			let obj = {
				fileName: row.originFileName,
				url: row.url
			}
			this.downloadFile(obj)
		}
	}
};
</script>

<style scoped lang="less">
</style>
