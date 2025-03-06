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
							prop="elecSkuCode"
						>
							<el-input
								v-model="formData.elecSkuCode"
								size="mini"
								:placeholder="inputZH('elecSkuCode')"
								clearable
								@keyup.enter.native="list"
							/>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('goodsSaleCountryList')"
							prop="countryId"
						>
							<SelectFilter
								v-model="formData.countryId"
								size="mini"
								name-key="chineseShortname"
								value-key="id"
								:placeholder="selectZH('nameCode')"
								:options="countryOptions"
								:filter-keys="['code2', 'chineseShortname']"
								clearable
								@change="list"
							/>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('goodsType')"
							prop="goodsTypeId"
						>
							<el-select
								v-model="formData.goodsTypeId"
								clearable
								:placeholder="selectZH('goodsType')"
								size="mini"
								@change="list"
							>
								<el-option
									v-for="item in goodsTypes"
									:key="item.name"
									:value="item.id"
									:label="item.chineseName"
								/>
							</el-select>
						</el-form-item>
						<el-form-item
							class="el-form-item"
							:label="getZH('memberId')"
							prop="memberId"
						>
							<MemberList
								v-model="formData.memberId"
								@change="list"
								clearable
							/>
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
			<el-button size="mini" :loading="loading" type="primary" @click="batchAudit">{{$t('goodsManagement.batch_audit')}}</el-button>
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
		<el-dialog :visible.sync="auditVisible" :title="$t('goodsManagement.batch_audit')" width="400px" :close-on-click-modal="false">
			<el-form ref="auditForm" :inline="true" :model="auditForm" :rules="auditFormRules" label-width="100px">
				<el-form-item :label="getZH('audit_result')" prop="goodsStatus">
					<el-select v-model="auditForm.goodsStatus" :placeholder="selectZH('please_select')" size="mini">
						<el-option value="6" :label="getZH('pass')" />
						<el-option value="3" :label="getZH('refuse')" />
					</el-select>
				</el-form-item>
				<el-form-item :label="getZH('reason')" prop="refuseOpt"  v-if="Number(auditForm.goodsStatus) === 3">
					<el-select v-model="auditForm.refuseOpt" class="w-full" size="mini">
						<el-option v-for="item in reasonList" :key="item.value" :label="getZH(item.label)" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="Number(auditForm.refuseOpt) === 3 && Number(auditForm.goodsStatus) === 3" :label="getZH('remark')" prop="refuseReson">
					<el-input v-model="auditForm.refuseReson" size="mini" type="textarea" :rows="2" maxlength="20" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="auditVisible = false">{{ $t("common.cancel")}}</el-button>
				<el-button type="primary" size="mini" @click="auditFormConfirm()" :loading="auditLoading">{{ $t("common.confirm") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getUsers } from '@/api/user'
import goodsBtn from './components/goodsBtn'
import { getGoodsListApi, getDropdownlistApi, getGoodsOwnerApi, getCountryListApi, batchGoodsAuditApi } from '@/api/OverseasWarehouse/goodsManager'
export default {
	name: 'GoodsToAudit',
	components: { goodsBtn },
	data() {
		return {
			auditVisible: false,
			auditLoading: false,
			auditForm: {
				goodsStatus: '',
				refuseOpt: '',
				refuseReson: ''
			},
			auditFormRules: {
				goodsStatus: [{ required: true, message: this.$t('goodsManagement.please_select') }],
				refuseOpt: [{ required: true, message: this.$t('goodsManagement.please_select') }],
				refuseReson: [{ required: true, message: this.$t('goodsManagement.please_enter') }]
			},
			reasonList: [{
				label: 'auditReason1',
				value: 1
			}, {
				label: 'auditReason2',
				value: 2
			}, {
				label: 'auditReason3',
				value: 3
			}],
			formData: {
				sysCode: '',
				elecSkuCode: '',
				sysBarCode: '',
				goodsTypeId: null,
				memberId: '',
				goodsCnName: '',
				goodsEnName: '',
				countryId: '',
				goodsStatusList: [],
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			goodsTypes: [],
			userList: [],
			loading: false,
			loading1: false,
			shipperList: [],
			countryOptions: [],
			dataList: [],
			columnDefsRight: [
				{
					headerName: '',
					width: 55,
					checkboxSelection: true,
					pinned: 'left',
					headerCheckboxSelection: true,
					// suppressSorting: true,
					// suppressMenu: true,
					suppressSizeToFit: true,
					suppressResize: true
				},
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
					field: 'elecSkuCode',
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
					headerName: this.getZH('goodsType'),
					field: 'goodsTypeName',
					minWidth: 110
				},
				{
					headerName: this.getZH('memberId'),
					field: 'userName',
					minWidth: 120
				},
				{
					headerName: this.getZH('shipper'),
					field: 'shipperCnName',
					minWidth: 120
				},
				{
					headerName: this.getZH('goodsSaleCountryList'),
					field: 'goodsSaleCountryNames',
					minWidth: 140

				},
				{
					headerName: this.getZH('length') + "(cm/inch)",
					field: 'length',
					minWidth: 140,
					cellRenderer: params => `<div>${params.data.length}/${params.data.britishLength}</div>`
				},
				{
					headerName: this.getZH('width') + "(cm/inch)",
					field: 'width',
					minWidth: 140,
					cellRenderer: params => `<div>${params.data.width}/${params.data.britishWidth}</div>`
				},
				{
					headerName: this.getZH('height') + "(cm/inch)",
					field: 'height',
					minWidth: 140,
					cellRenderer: params => `<div>${params.data.height}/${params.data.britishHeight}</div>`
				},
				{
					headerName: this.getZH('weight2') + "(kg/lb)",
					field: 'weight',
					minWidth: 160,
					cellRenderer: params => `<div>${params.data.weight}/${params.data.britishWeight}</div>`
				},
				{

					headerName: this.getZH('operation'), pinned: 'right', field: `id`, minWidth: 120,
					cellRendererFramework: 'goodsBtn'
				}],
			gridOptionsRight: {},
			gridApi: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false }
		}
	},
	created() {
		this.gridOptionsRight = {
			rowSelection: 'multiple', // 设置多行可选
			rowMultiSelectWithClick: true, // 点击及选择复选框
			suppressRowClickSelection: true, // 选中单元格后可以复制内容
			context: {
				componentParent: this
			}
		}
		this.formData.goodsStatusList = this.$route.meta.status
		this.init()
		this.list()
	},
	mounted() {

	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'GoodsDetail') {
				vm.list()
			}
		})
	},

	methods: {
		onReadyRight(params) {
			this.gridApi = params.api
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
		 * 远程获取会员列表
		 */
		async remoteMethod(query) {
			if (query !== '') {
				this.loading1 = true
				const _params = {
					pageSize: 10000,
					pageNum: 1,
					userName: query
				}
				const res = await getUsers(_params)
				if (res.ok) {
					this.userList = res.content.list
					this.loading1 = false
				} else {
					this.$message({
						type: 'warning',
						message: this.$t('authorization.listEmpty')
					})
					this.loading = false
				}
			} else {
				this.loading = false
				this.userList = []
			}
		},

		// 批量审核
		batchAudit() {
			let selectedItems = this.gridApi.getSelectedRows()
			// 查询出来的数据超过200条
			if (selectedItems.length <= 0 && this.total > 200) {
				this.$alert(this.$t('goodsManagement.batch_audit_more_than_200'), this.$t('goodsManagement.mention'), {
					confirmButtonText: this.$t('common.close'),
					type: 'error'
				})
				return
			}
			this.auditForm = {
				goodsStatus: '',
				refuseOpt: '',
				refuseReson: ''
			}
			this.auditVisible = true
		},
		auditFormConfirm() {
			let ids = []
			let selectedItems = this.gridApi.getSelectedRows()
			selectedItems.forEach(v => {
				ids.push(v.id)
			})
			this.$refs.auditForm.validate(valid => {
				if (valid) {
					this.auditLoading = true
					let data = {
						...this.formData,
						...this.auditForm,
						ids: ids
					}
					batchGoodsAuditApi(data).then(res => {
						if (res.ok) {
							this.auditVisible = false
							this.$message.success(this.$t('goodsManagement.batch_audit_success'))
							this.list()
						}
						this.auditLoading = false
					}).catch(() => {
						this.auditLoading = false
					})
				}
			})
		},
		/**
		 * 获取基础下拉数据
		 */
		async init() {
			const res1 = await getDropdownlistApi({ termCode: 'GOODSKINDS' })
			if (res1 && res1.ok) {
				this.goodsTypes = res1.content || []
			}
			const res2 = await getGoodsOwnerApi({
				pageSize: 500,
				pageNum: 1
			})
			if (res2 && res2.ok) {
				this.shipperList = res2.content.list || []
			}
			// 获取国家基础数据
			const res3 = await getCountryListApi()
			if (res3 && res3.ok) {
				this.countryOptions = res3.content
			}
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
			const res = await getGoodsListApi(this.formData).catch(() => {
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
		/**
			 * 新增编辑
			 */
		edit(id, isDetail) {
			this.$router.push({ name: `GoodsDetial`, query: { id, type: isDetail, time: new Date().getTime() } })
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
.container-wrap {
	margin-top: 20px;
	padding: 10px 20px;
	background: #fff;
}
</style>
