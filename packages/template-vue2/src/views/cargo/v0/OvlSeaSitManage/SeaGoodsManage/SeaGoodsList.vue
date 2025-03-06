<template>
	<div v-loading="loading" class="pd-16">
		<div class="mb-10">
			<top-search-items-slot :searchFun="list" :resetFun="reset">
				<template slot="multipleSearch">
					<el-form
						ref="formData"
						:inline="true"
						:model="formData"
						class="search-form"
						label-width="100px"
					>
						<el-form-item
							class="el-form-item"
							:label="getZH('sysCode')"
							prop="sysCode"
						>
							<el-input
								v-model="formData.sysCode"
								size="mini"
								:placeholder="inputZH('sysCode')"
								clearable
								@keyup.enter.native="list"
							/>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('elecSkuCode')"
							prop="skuCode"
						>
							<el-input
								v-model="formData.skuCode"
								size="mini"
								:placeholder="inputZH('elecSkuCode')"
								clearable
								@keyup.enter.native="list"
							/>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('memberId')"
							prop="ownerId"
						>
             <TypeSelect v-model="formData.ownerId"  type="customer" @selected="list"  />
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('goodsCnName')"
							prop="goodsCnName"
						>
							<el-input
								v-model="formData.goodsCnName"
								size="mini"
								:placeholder="inputZH('goodsCnName')"
								clearable
								@keyup.enter.native="list"
							/>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('goodsEnName')"
							prop="goodsEnName"
						>
							<el-input
								v-model="formData.goodsEnName"
								size="mini"
								:placeholder="inputZH('goodsEnName')"
								clearable
								@keyup.enter.native="list"
							/>
						</el-form-item>
					</el-form>
				</template>
			</top-search-items-slot>
		</div>
    <div class="mb-10 top-btn-wrap">
			<el-button size="mini" type="primary" @click="edit('add')">{{$t('common.addBtn')}}</el-button>
      <el-button type="primary"	size="mini" @click="goodsBatchExportVisible = true">{{ getZH("batchUpload") }}</el-button>
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
    <printBarcodeDialog :id="activeId" :visible.sync="printBarcodeVisible" :type='2' />
    <goodsBatchExport  :visible.sync="goodsBatchExportVisible" @saved="list" />
	</div>
</template>

<script>
import goodsBtn from './components/goodsBtn'
import printBarcodeDialog from '../../OverseasWarehouse/GoodsManagement/components/printBarcodeDialog'
import { getSeaGoodsListApi, updateStateGoodsApi } from '@/api/OvlSeaSitManage/seaGoodsManage'
import goodsBatchExport from './components/goodsBatchExport.vue'
export default {
	name: 'SeaGoodsList',
	components: { goodsBtn, printBarcodeDialog, goodsBatchExport },
	data() {
		return {
			formData: {
				sysCode: '',
				skuCode: '',
				sysBarCode: '',
				goodsTypeId: null,
				ownerId: '',
				goodsCnName: '',
				goodsEnName: '',
				countryId: '',
				goodsStatusList: [],
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			activeId: null,
			printBarcodeVisible: false,
			goodsBatchExportVisible: false,
			loading: false,
			dataList: [],
			columnDefsRight: [
				{
					headerName: this.getZH('sysCode'),
					field: 'sysCode',
					minWidth: 150
				},
				{
					headerName: this.getZH('sysBarCode'),
					field: 'sysBarCode',
					minWidth: 150
				},
				{
					headerName: this.getZH('elecSkuCode'),
					field: 'skuCode',
					minWidth: 150
				},
				{
					headerName: this.getZH('goodsCnName'),
					field: 'goodsCnName',
					minWidth: 120
				},
				{
					headerName: this.getZH('goodsEnName'),
					field: 'goodsEnName',
					minWidth: 120
				},
				{
					headerName: this.getZH('skuName'),
					field: 'skuName',
					minWidth: 120
				},
				{
					headerName: this.getZH('power') + '(w)',
					field: 'watt',
					minWidth: 100,
					cellRenderer: params => `<div class='text-right'>${params.value}</div>`
				},
				{
					headerName: this.getZH('memberId'),
					field: 'ownerName',
					minWidth: 150
				},
				{
					headerName: this.getZH('goodsType'),
					field: 'typeName',
					minWidth: 110
				},
				{
					headerName: this.getZH('status'),
					field: 'stateName',
					minWidth: 100,
					cellRenderer: params => {
						if (params.data.state === 0) {
							return `<div class='status-wrap'><span class='status-dot rejected'></span>${params.value}</div>`
						} else if (params.data.state === 1) {
							return `<div class='status-wrap'><span class='status-dot successed'></span>${params.value}</div>`
						}
					}
				},
				{
					headerName: this.getZH('length') + "(cm)",
					field: 'length',
					minWidth: 110,
					cellRenderer: params => `<div class='text-right'>${params.value}</div>`
				},
				{
					headerName: this.getZH('width') + "(cm)",
					field: 'width',
					minWidth: 110,
					cellRenderer: params => `<div class='text-right'>${params.value}</div>`
				},
				{
					headerName: this.getZH('height') + "(cm)",
					field: 'height',
					minWidth: 110,
					cellRenderer: params => `<div class='text-right'>${params.value}</div>`
				},
				{
					headerName: this.getZH('weight2') + "(kg)",
					field: 'weight',
					minWidth: 110,
					cellRenderer: params => `<div class='text-right'>${params.value}</div>`
				},
				{

					headerName: this.getZH('operation'), pinned: 'right', field: `id`, minWidth: 170,
					cellRendererFramework: 'goodsBtn'
				}],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }
		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.formData.goodsStatusList = this.$route.meta.status
		this.list()
	},
	mounted() {

	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'SeaGoodsDetail') {
				vm.list()
			}
		})
	},

	methods: {
		onReadyRight(params) {
			// const self = this
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
					// self.onFirstDataRendered()
				})
			})
		},

		updateStatus(id, state) {
			let data = { id, state }
			updateStateGoodsApi(data).then(res => {
				if (res.ok) {
					this.list()
					this.$message.success(this.getZH('uploadSuccess', 'common'))
				}
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
			obj = obj || 'goodsManagement'
			let str = obj + '.' + key
			return this.$t(str)
		},

		/**
			 * 获取列表
			 */
		async list() {
			this.loading = true
			const res = await getSeaGoodsListApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res && res.ok) {
				this.dataList = res.content.list || []
				res.content.list.forEach(item => {
					let extendedAttribute = item.extendedAttribute ? JSON.parse(item.extendedAttribute) : {}
					item.watt = extendedAttribute.watt ? extendedAttribute.watt : ''
				})
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.loading = false
			}
		},
		/**
	 * 打印条码
	 */
		printBarcode(id) {
			this.activeId = id
			this.printBarcodeVisible = true
		},
		/**
			 * 新增编辑
			 */
		edit(operate, id) {
			this.$router.push({ name: `SeaGoodsDetail`, params: { operate, id } })
		},
		/**
			 * 重置搜索条件
			 */
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="scss">
::v-deep.text-right {
	text-align: right;
}
::v-deep.status-wrap {
	display: flex;
	align-items: center;
	.status-dot {
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 6px;
		background: #ccc;
		margin-right: 4px;
		&.processing {
			background: #e6a23c;
		}
		&.successed {
			background: #67c23a;
		}
		&.rejected {
			background: #f56c6c;
		}
	}
}
</style>
