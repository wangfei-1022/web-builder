<template>
	<div style="height: calc(100vh - 170px)">
<!--    v-permission="['se:job:detail:etext:upload']"-->
    <el-button
			type="primary"
			size="mini"
			style="margin: 5px 0"
			@click="toShowUploadDialog"
			>上传</el-button
		>
		<el-table
			:row-style="mockAgGridRowStyle"
			:header-row-style="mockAgGridHeaderRowStyle"
			:cell-style="mockAgGridCellStyle"
			:header-cell-style="mockAgGridHeaderCellStyle"
			:data="job.electronicFile.list"
			style="border: 1px solid #bdc3c7; min-height: 500px"
			border
		>
			<!--<el-table-column prop="id" label="id" />-->
			<!--<el-table-column prop="entityId" label="业务实体id" />-->
			<!--<el-table-column prop="entityType" label="业务实体类型" />-->
			<el-table-column prop="fileName" :label="$t('sea.fileName')" />
			<el-table-column prop="documentTypeCodeDesc" :label="$t('sea.fileType')" />
			<el-table-column prop="fileSuffix" :label="$t('sea.fileFormat')" />
			<!--<el-table-column prop="fileNameId" label="文件名id"/>-->
			<!--<el-table-column prop="filePath" label="文件路径"/>-->
			<el-table-column prop="fileSize" :label="$t('sea.fileSizeBbyte')" />
			<el-table-column prop="createByName" :label="$t('sea.createByName')"/>
			<el-table-column prop="createTime" :label="$t('sea.creationDate')">
        <template slot-scope="scope">
          {{$moment(Number(scope.row.createTime)).format('YYYY-MM-DD HH:mm:ss')}}
        </template>

      </el-table-column>
			<el-table-column prop="id" :label="$t('sea.operating')" >
				<template slot-scope="scope">
					<el-button
						type="text"
						size="mini"
						@click="downloadElectronicFile(scope.row)"
						>下载</el-button
					>
					<el-button
						type="text"
						size="mini"
						@click="toDeleteElectronicFile(scope.row.id)"
						>删除</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog :visible.sync="isShowingUploadDialog" width="650px">
			<div style="display: flex">
				<div class="left-tree">
					<el-tree
						:data="documentTypeCodeTreeData"
						:props="documentTypeCodeTreeProps"
						:expand-on-click-node="false"
						:default-expand-all="true"
						style="
							padding-right: 10px;
							margin-right: 10px;
							border-right: 1px solid lightgray;
							overflow: auto;
              max-height: 400px;
						"
						@node-click="setDocumentTypeCode"
					/>
				</div>
				<div class="right-form">
					<el-form
						label-width="100px"
						label-position="left"
						style="max-width: 400px"
					>
						<el-form-item label="附件类型">
							<el-input
								v-model="oneUpload.documentTypeCodeChineseName"
								size="mini"
								placeholder="请从左侧树形结构中选取"
								readonly
							/>
						</el-form-item>
						<el-form-item label="选择文件">
							<el-upload
								ref="elUploadElectronicFile"
								:action="elUploadAction"
								:headers="elUploadHeaders"
								:file-list="cloudFileVOList"
								:limit="5"
								:before-upload="beforeUpload"
								:on-remove="handleRemove"
								:on-success="handleUploadSuccess"
								:on-exceed="
									() => {
										this.$message.warning('单次最多上传5个文件');
									}
								"
							>
								<el-button size="mini"
									><i
										class="el-icon-upload el-icon--right"
									/>上传文件</el-button
								>
								<div slot="tip" class="el-upload__tip">
									支持扩展名：pdf、xlsx、docx、jpg、png、txt<br />
									限制大小：10M
								</div>
							</el-upload>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<span slot="footer">
				<el-button type="primary" size="mini" @click="toSaveElectronicFile"
					>保存</el-button
				>
				<el-button size="mini" @click="isShowingUploadDialog = false"
					>取消</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getElectronicFile, getDocumentTypeCodeTree, saveElectronicFile, downloadElectronicFileApi, deleteElectronicFile } from '@/api/seaExport'
import _URL from '@/api/urlTranslator'
import { getToken } from '@/utils/auth'

export default {
	name: 'ElectronicFile',
	props: {
		job: { type: Object, default: () => { } }
	},
	data() {
		return {
			isShowingUploadDialog: false,
			isDocumentTypeCodeLoaded: false,
			documentTypeCodeTreeData: [],
			documentTypeCodeTreeProps: {
				children: 'childNodes',
				label: 'chineseName'
			},
			cloudFileVOList: [],
			oneUpload: {
				entityId: '',
				entityType: 'SEA_ORDER_EXPORT',
				documentTypeCode: '',
				documentTypeCodeChineseName: ''
			}
		}
	},
	computed: {
		elUploadAction() {
			return `${process.env.VUE_APP_BASE_API}/api/mdm-service/web/upload/file`
		},
		elUploadHeaders() {
			const Authorization = getToken()
			return { Authorization }
		},
		mockAgGridRowStyle() {
			return {}
		},
		mockAgGridCellStyle() {
			return {
				paddingLeft: '10px',
				fontSize: '12px',
				lineHeight: '30px'
			}
		},
		mockAgGridHeaderRowStyle() {
			return {}
		},
		mockAgGridHeaderCellStyle() {
			return {
				color: '#707171',
				fontSize: '12px',
				fontWeight: 'normal',
				backgroundColor: '#f5f7f7',
				borderBottom: '1px solid #bdc3c7'
			}
		}
	},
	beforeMount() {
		this.oneUpload.entityType = this.$route.query.entityType || this.oneUpload.entityType
		this.oneUpload.entityId = this.$route.query.id
	},
  created() {
    getElectronicFile({ entityId: this.$route.query.id }).then(res => {
      this.job.electronicFile.list = res.content.list
    })
  },
  methods: {
		toShowUploadDialog() {
			this.cloudFileVOList = []
			this.oneUpload.documentTypeCode = ''
			this.oneUpload.documentTypeCodeChineseName = ''
			if (this.isDocumentTypeCodeLoaded) {
				this.isShowingUploadDialog = true
			} else {
				getDocumentTypeCodeTree({ parentCode: 'SE' }).then(res => {
					this.documentTypeCodeTreeData = res.content
					this.isDocumentTypeCodeLoaded = true
					this.isShowingUploadDialog = true
				})
			}
		},
		setDocumentTypeCode(clickedNode) {
			if (clickedNode.childNodes.length === 0) {
				this.oneUpload.documentTypeCode = clickedNode.code
				this.oneUpload.documentTypeCodeChineseName = clickedNode.chineseName
			}
		},
		handleUploadSuccess(res) {
			if (res.ok) {
				const file = res.content
				file.name = file.cloudFileName
				this.cloudFileVOList.push({ ...res.content, ...this.oneUpload })
			} else {
				// 文件大小超限 等问题
				this.$message.error(res.message)
			}
		},
		beforeUpload(file) {
			console.log('file.type', file.type)
			const isAllowType = ['image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/pdf', 'text/plain', 'application/msword'].includes(file.type)
			const isLt10M = file.size / 1024 / 1024 < 10

			if (!isAllowType) {
				this.$message.error('支持扩展名：pdf、xlsx、docx、jpg、png、txt!')
			}
			if (!isLt10M) {
				this.$message.error('上传文件的大小不能超过 10MB!')
			}
			return isAllowType && isLt10M
		},
		handleRemove(file) {
			this.cloudFileVOList = this.cloudFileVOList.filter(f => f.cloudFileName !== file.cloudFileName)
		},
		toSaveElectronicFile() {
			if (!this.oneUpload.documentTypeCode) {
				return this.$message.error('请选择附件类型')
			}
      this.cloudFileVOList.map(item => {
        if (!item.documentTypeCode) {
          item.documentTypeCode = this.oneUpload.documentTypeCode
          item.documentTypeCodeChineseName = this.oneUpload.documentTypeCode
        }
      })
			saveElectronicFile(this.cloudFileVOList).then(res => {
				if (res.ok) {
					this.$message.success('保存成功')
					this.isShowingUploadDialog = false
					return this.$route.query.id
				}
			}).then(entityId => getElectronicFile({ entityId })).then(res => {
				this.job.electronicFile.list = res.content.list
			})
		},
		downloadElectronicFile(obj) {
			downloadElectronicFileApi(obj.id).then(res => {
				if (res.ok) {
					res.content.fileName = obj.fileName
					this.downloadFile(res.content)
				}
			})
		},
		downloadFile(fileObj) {
			const link = document.createElement('a')
			link.download = fileObj.fileName
      link.target = "_blank"
			link.href = fileObj.url
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			// fetch(fileObj.url, {mode: 'no-cors'}).then(res => res.blob()).then(blob => {
			//   // 将链接地址字符内容转变成blob地址
			//   link.href = URL.createObjectURL(blob)
			//   console.log(link.href)
			//   document.body.appendChild(link)
			//   link.click()
			//   document.body.removeChild(link)
			// })
		},
		toDeleteElectronicFile(id) {
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteElectronicFile(id).then(res => {
					if (res.ok) {
						this.$message.success('删除成功')
						this.isShowingUploadDialog = false
						return this.$route.query.id
					}
				}).then(entityId => getElectronicFile({ entityId })).then(res => {
					this.job.electronicFile.list = res.content.list
				})
			}).catch(() => {
				// do nothing
			})
		}
	}
}
</script>
