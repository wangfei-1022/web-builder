<template>
  <div>
    <el-button type="primary" size="mini" class="mb-10" v-if="!isDetail" @click="toShowUploadDialog">{{$t('common.uploadText')}}</el-button>
    <el-table :cell-style="mockAgGridCellStyle" border :header-cell-style="mockAgGridHeaderCellStyle" :height="scrollTableHeight" class="mb-10" :data="formData.fileList" >
      <el-table-column prop="fileName" :label="$t('common.fileName')" />
      <el-table-column prop="documentTypeCodeDesc" :label="$t('common.documentTypeCodeDesc')" />
      <el-table-column prop="fileSuffix" :label="$t('common.fileSuffix')" />
      <el-table-column prop="fileSize" :label="$t('common.fileSize')" />
      <el-table-column prop="id" :label="$t('common.operation')" width="100" v-if="!isDetail">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="downloadElectronicFile(scope.row)">{{ $t('common.download') }}</el-button>
          <el-button type="text" size="mini" class="fc-red" @click="toDeleteElectronicFile(scope.row.id)">{{ $t('common.deleteBtn') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialog.visible" width="650px">
      <div class="flex">
        <div class="left-tree">
          <el-tree :data="documentTypeCodeTreeData" :props="documentTypeCodeTreeProps" :expand-on-click-node="false"
            :default-expand-all="true" style="
							padding-right: 10px;
							margin-right: 10px;
							bformData-right: 1px solid lightgray;
						" @node-click="setDocumentTypeCode" />
        </div>
        <div class="right-form">
          <el-form label-width="100px" label-position="left" style="max-width: 400px">
            <el-form-item :label="$t('common.documentTypeCode')" required>
              <el-input v-model="oneUpload.documentTypeCodeChineseName" size="mini" placeholder="请从左侧树形结构中选取"
                readonly />
            </el-form-item>
            <el-form-item :label="$t('common.chooseFile')" required>
              <UploadFile :showFileList="true" :multiple="true"
                v-model="fileList" :limit="5" :accept="'.pdf,.xlsx,.docx,jpg,.png,.txt'" :on-progress="handletProgress">
                <template slot="upload">
                  <el-button size="mini" type="primary">{{ $t('common.chooseFile') }}</el-button>
                </template>
                <div slot="tip" class="el-upload__tip">
                  {{$t('common.limitTips')}}<br />
                   {{$t('common.limitTips1')}}
                </div>
              </UploadFile>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" size="mini" @click="saveForm">{{$t('common.saveBtn')}}</el-button>
        <el-button size="mini" @click="dialog.visible = false">{{$t('common.cancelBtn')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getElectronicFile, saveElectronicFile, downloadElectronicFileApi, deleteElectronicFile } from '@/api/seaExport'
import { getDocumentTreelistApi } from '@/api/thirdKind.js'
export default {
	name: 'ElectronicDocument',
	props: {
		formData: { type: Object, default: () => { } }
	},
	data() {
		return {
			limit: 5,
			documentTypeCodeTreeData: [],
			documentTypeCodeTreeProps: {
				children: 'childNodes',
				label: 'chineseName'
			},
			fileList: [],
			oneUpload: {
				entityId: this.formData.id,
				entityType: 'THK_ENTITY_TYPE',
				documentTypeCode: '',
				documentTypeCodeChineseName: ''
			}
		}
	},
	computed: {
		mockAgGridCellStyle() {
			return {
				paddingLeft: '10px',
				fontSize: '12px',
				lineHeight: '30px'
			}
		},
		isDetail() {
			return this.formData.businessLockState || this.formData.orderState === 100
		},
		scrollTableHeight() {
			return document.documentElement.clientHeight - 350
		},
		mockAgGridHeaderCellStyle() {
			return {
				color: '#707171',
				fontSize: '12px',
				fontWeight: 'normal',
				backgroundColor: '#f5f7f7',
				bformDataBottom: '1px solid #bdc3c7'
			}
		}
	},
	methods: {
		/**
		* 上传时
		*/
		handletProgress() {
			this.loading = true
		},
		/**
		 * 上传文件
		 */
		toShowUploadDialog() {
			this.fileList = []
			this.oneUpload.documentTypeCode = ''
			this.oneUpload.documentTypeCodeChineseName = ''
			if (this.$isEmpty(this.documentTypeCodeTreeData)) {
				getDocumentTreelistApi({ parentCode: 'TE' }).then(res => {
					this.documentTypeCodeTreeData = res.content
				})
			}
			this.dialog.visible = true
		},
		setDocumentTypeCode(clickedNode) {
			if (clickedNode.childNodes.length === 0) {
				this.oneUpload.documentTypeCode = clickedNode.code
				this.oneUpload.documentTypeCodeChineseName = clickedNode.chineseName
			}
		},
		/**
		 * 保存数据
		 */
		saveForm() {
			if (!this.oneUpload.documentTypeCode) {
				return this.$message.error(this.$t('common.selectPlaceholder') + this.$t('common.documentTypeCode'))
			}
			this.oneUpload.entityId = this.formData.id
			let saveList = this.fileList.map(item => ({ ...item, ...this.oneUpload }))
			saveElectronicFile(saveList).then(res => {
				if (res.ok) {
					this.$message.success(this.$t('common.saveSuccess'))
					this.dialog.visible = false
					return this.formData.id
				}
			}).then(() => getElectronicFile({ entityId: this.formData.id })).then(res => {
				this.formData.fileList = res.content.list
			})
		},
		/**
		 * 下载文件
		 */
		downloadElectronicFile(obj) {
			downloadElectronicFileApi(obj.id).then(res => {
				if (res.ok) {
					res.content.fileName = obj.fileName
					this.downloadFile(res.content)
				}
			})
		},
		toDeleteElectronicFile(id) {
			this.confirmTips().then(() => {
				deleteElectronicFile(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.dialog.visible = false
						return this.formData.id
					}
				}).then(() => getElectronicFile({ entityId: this.formData.id })).then(res => {
					this.formData.fileList = res.content.list
				})
			}).catch(() => {
				// do nothing
			})
		}
	}
}
</script>
