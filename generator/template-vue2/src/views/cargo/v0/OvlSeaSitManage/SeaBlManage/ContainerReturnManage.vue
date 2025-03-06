<template>
	<div v-loading="loading" class="pd-16">
		<div class="mb-10">
			<top-search-items-slot :searchFun="list" :resetFun="reset">
				<template slot="multipleSearch">
					<el-form	ref="formData" :inline="true" :model="formData" class="search-form" label-width="100px">
						<el-form-item	class="el-form-item"	:label="getZH('customerName')" prop="customerId">
              <TypeSelect v-model="formData.customerId"  type="customer"  @selected="list" />
						</el-form-item>
						<el-form-item	class="el-form-item" :label="getZH('blNo')"	prop="blNo">
							<el-input	v-model="formData.blNo" size="mini" :placeholder="inputZH('blNo')" clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item	class="el-form-item" :label="getZH('ctnNo')"	prop="ctnNo">
							<el-input	v-model="formData.ctnNo" size="mini" :placeholder="inputZH('ctnNo')" clearable @keyup.enter.native="list" />
						</el-form-item>
					</el-form>
				</template>
			</top-search-items-slot>
		</div>
    <div class="mb-10 top-btn-wrap">
			<el-button size="mini" type="primary" @click="edit('add')">{{$t('common.addBtn')}}</el-button>
      <el-button size="mini" type="primary" @click="dialog.visible=true">{{$t('common.importBtn')}}</el-button>
       <el-button size="mini" type="primary" @click="batchComfirm()"> {{$t('seaBl.batchComfirm')}}</el-button>
		</div>
		<ag-grid-vue
			:locale-text-func="_i18nGridLocalText"
			:grid-options="gridOptionsRight"
			:side-bar="sideBarDefs"
			:column-defs="columnDefsRight"
			:row-data="dataList"
			:enable-col-resize="true"
			:enable-sorting="true"
			:grid-ready="onReadyRight"
      :style="gridHeight"
			class="ag-theme-balham"
		/>
		<Pagination
			:total="total"
			:limit.sync="formData.pageSize"
			:page.sync="formData.pageNum"
			@pagination="list"
		/>
    <ExcelUploadDialog ref="ExcelUploadDialog" tempName="海外仓还柜导入模板.xls" :visible.sync="dialog.visible" @saved="excelUpload" />
	</div>
</template>

<script>
import containerHandleOpBtn from './components/containerHandleOpBtn'
import { getCtnReturnListApi, confirmCtnReturnApi, backCtnReturnApi, delCtnReturnApi, importCtnReturnApi, appointInboundApi, batchConfirmCtnReturnApi } from '@/api/OvlSeaSitManage/seaBl'
import ExcelUploadDialog from './components/ExcelUploadDialog'
export default {
	name: 'CustomsDeclaration',
	components: { containerHandleOpBtn, ExcelUploadDialog },
	data() {
		return {
			formData: {
				customerId: null,
				blNo: '',
				blState: null,
				ctnNo: null,
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataTime: [],
			goodsTypes: [],
			loading: false,
			dataList: [],
			columnDefsRight: [
				{
					headerName: '',
					checkboxSelection: true,
					headerCheckboxSelection: true,
					minWidth: 35,
					maxWidth: 35,
					pinned: 'left'
				},
				{
					headerName: this.getZH('indexNo'),
					field: 'id',
					minWidth: 70,
					cellRenderer: params => `<div class='text-right'>${params.rowIndex + 1}</div>`
				},
				{
					headerName: this.getZH('containerNo'),
					field: 'ctnNo',
					minWidth: 150
				},
				{
					headerName: this.getZH('blNo'),
					field: 'blNo',
					minWidth: 140
				},
				{
					headerName: 'SKU',
					field: 'skuCode',
					minWidth: 140
				},
				{
					headerName: this.getZH('customerName'),
					field: 'customerName',
					minWidth: 140
				},
				{
					headerName: this.getZH('totalTray'),
					field: 'trayNum',
					width: 140,
					cellRenderer: params => `<div class='text-right'>${params.value || ' '}</div>`
				},
				{
					headerName: this.getZH('returnDate'),
					field: 'returnTime',
					minWidth: 140,
					cellRenderer: params => this.formatDate(params.value)
				},
				{
					headerName: this.getZH('trailerNumber'),
					field: 'transportNo',
					minWidth: 120
				},
				{
					headerName: this.getZH('supplierName'),
					field: 'supplierName',
					minWidth: 120
				},
				{
					headerName: this.getZH('emptyWharf'),
					field: 'returnEmptyDock',
					minWidth: 120
				},
				{
					headerName: this.getZH('state'),
					field: 'stateName',
					minWidth: 120
				},
				{
					headerName: this.getZH('operation', 'common'), pinned: 'right', field: `id`, minWidth: 180,
					cellRendererFramework: 'containerHandleOpBtn'
				}],
			gridOptionsRight: {},
			columnApi: null,
			gridApi: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }
		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			},
			rowSelection: 'multiple', // 设置多行可选
			onSortChanged: event => {
				this.gridApi.redrawRows()
			}
		}
		this.list()
	},
	mounted() {

	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'ContainerReturnDetail') {
				vm.list()
			}
		})
	},

	methods: {
		onReadyRight(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			// const self = this
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
					// self.onFirstDataRendered()
				})
			})
		},
		/**
			 * 下拉框
			 */
		selectZH(key) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
		},
		/**
		 * 输入框
		 */
		inputZH(key) {
			return this.getZH('placeholder', 'common') + this.getZH(key)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'seaBl'
			let str = obj + '.' + key
			return this.$t(str)
		},
		// 获取选中数据
		checkSelect() {
			const _selectedRows = this.gridApi.getSelectedRows()
			if (_selectedRows.length === 0) {
				this.$message.error(this.$t('common.multipleSelectorEmpty'))
				return
			}
			return _selectedRows
		},
		// 入库预约-创建入库单
		saveAppointInbound(ids) {
			this.confirmTips(this.getZH('confirmAppointInbound')).then(() => {
				this.loading = true
				appointInboundApi({ ids }).then(res => {
					if (res.ok) {
						this.loading = false
						let msg = `总条数：${res.content.sumCount}条；预约成功：${Number(res.content.successCount)}条；预约失败：${res.content.errorCount}条；`
						if (this.$isNotEmpty(res.content.errorList)) {
							let errTips = '失败原因：'
							res.content.errorList.forEach(item => {
								errTips += `【${item.message}】`
							})
							msg += errTips
						}
						this.$alert(msg, this.$t('common.tips'), {
							confirmButtonText: this.getZH('theKnow', 'common'),
							callback: () => {
								this.list()
							}
						})
					} else {
						this.loading = false
					}
				})
			}).catch(() => { })
		},

		/**
			 * 获取列表
			 */
		async list() {
			this.loading = true
			const res = await getCtnReturnListApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res && res.ok) {
				this.dataList = res.content.list || []
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		// 删除数据
		deleteData(id) {
			this.confirmTips().then(() => {
				delCtnReturnApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.deleteSuccess'))
						this.list()
					}
				})
			})
		},
		// 确认数据
		confirmData(id) {
			this.confirmTips(this.$t('seaBl.confirmTips')).then(() => {
				this.loading = true
				confirmCtnReturnApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.comfirmSuccess'))
						this.list()
						this.loading = false
					} else {
						this.loading = false
					}
				})
			})
		},
		// 撤销数据
		revocation(id) {
			this.$confirm(this.$t('seaBl.revocationTips'), this.$t('common.tips'), {
				confirmButtonText: this.$t('common.confirmBtn'),
				cancelButtonText: this.$t('common.cancelBtn'),
				type: 'warning'
			}).then(() => {
				this.loading = true
				backCtnReturnApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('seaBl.revocationSuccess'))
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
		// 批量确认
		batchComfirm() {
			let selectedList = this.checkSelect()
			// 获取未确认的数据
			selectedList = selectedList.filter(item => item.state === 1)
			if (this.$isEmpty(selectedList)) {
				this.$message.error(this.getZH('tips5'))
				return
			}
			let ids = []
			selectedList.forEach(item => {
				ids.push(item.id)
			})
			this.confirmTips(`${this.getZH('tips6')}${selectedList.length}${this.getZH('tips7')}`).then(() => {
				this.loading = true
				batchConfirmCtnReturnApi({ ids }).then(res => {
					if (res.ok) {
						this.loading = false
						this.$message.success(this.getZH('batchSuccess'))
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
		},
		// 导入
		excelUpload(data) {
			importCtnReturnApi(data).then(res => {
				if (res.ok) {
					this.$refs.ExcelUploadDialog.loading = false
					this.dialog.visible = false
					let msg = `总条数：${res.content.sumCount}条；导入成功：${Number(res.content.successCount)}条；导入失败：${res.content.errorCount}条；`
					if (this.$isNotEmpty(res.content.errorList)) {
						let errTips = '失败原因：'
						res.content.errorList.forEach(item => {
							errTips += `【${item.message}】`
						})
						msg += errTips
					}
					this.$alert(msg, this.$t('common.tips'), {
						confirmButtonText: this.getZH('theKnow', 'common'),
						callback: () => {
							this.list()
						}
					})
				} else {
					this.$refs.ExcelUploadDialog.loading = false
				}
			})
		},
		/**
		 * 新增编辑
		 */
		edit(operate, id) {
			this.$router.push({ name: `ContainerReturnDetail`, params: { operate, id } })
		},
		/**
		 * 重置搜索条件
		 */
		reset() {
			this.$refs.formData.resetFields()
			this.dataTime = []
			this.list()
		}
	}
}
</script>

<style scoped lang="scss">
.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}
::v-deep.text-right {
	text-align: right;
}
</style>
