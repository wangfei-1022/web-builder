<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="clearSearchForm" class="mb-10">
			<el-form
				slot="multipleSearch"
				ref="filterForm"
				:inline="true"
				:model="filterForm"
				size="mini"
				@submit.native.prevent
			>
				<el-form-item
					:label="getZH('customer_cName')"
					prop="name"
					label-width="100px"
				>
          <el-input size='mini' v-model="filterForm.name" :placeholder="inputZH('customer_cName')" @keyup.enter.native="list" />
				</el-form-item>
				<el-form-item
					:label="getZH('customerNumber')"
					prop="no"
					label-width="90px"
				>
          <el-input size='mini' v-model="filterForm.no"  :placeholder="inputZH('customerNumber')" @keyup.enter.native="list" />
				</el-form-item>
        <el-form-item
					:label="getZH('status')"
					prop="status"
					label-width="90px"
				>
          <el-select size="mini" v-model="filterForm.status" @change="list" class="w-120">
            <el-option :value="null" :label="getZH('all', 'common')"></el-option>
            <el-option
              v-for="item in statusList"
              :key="item.code"
              :value="item.code"
              :label="getZH(item.name)"
            ></el-option>
          </el-select>
				</el-form-item>
         <el-form-item :label="getZH('sales_names')" prop="salesId">
          <el-select filterable clearable v-model="filterForm.salesId" size="mini" @change="list">
            <el-option v-for="(item, index) in salesList" :key="index" :label="item.userName" :value="item.id"/>
          </el-select>
        </el-form-item>
          <el-form-item :label="getZH('omcName')" prop="omcName">
          <el-select filterable clearable v-model="filterForm.omcName" size="mini" @change="list">
            <el-option v-for="(item, index) in []" :key="index" :label="item.userName" :value="item.id"/>
          </el-select>
        </el-form-item>
			</el-form>
		</top-search-items-slot>
		<div >
			<ag-grid-vue
				:locale-text-func="_i18nGridLocalText"
				:grid-options="gridOptions"
				:side-bar="sideBarDefs"
				:column-defs="columnFields"
				:row-data="rowData"
				:enable-col-resize="true"
				:enable-sorting="true"
				:grid-ready="onReady"
				:animate-rows="false"
        :style="gridHeight"
        class="ag-theme-balham"
			/>
			<div class="pagination-wrap">
				<Pagination
					:total="totalData"
					:limit.sync="filterForm.pageSize"
					:page.sync="filterForm.pageNum"
					@pagination="list"
				/>
			</div>
		</div>
    <baseConfigDialog :id="activeId" :visible.sync="baseConfigVisivle" @saved="list" />
    <wallateViewDialog :id="activeId" :visible.sync="dialog.visible"  />
	</div>
</template>

<script>
import customerOpearationBtn from './components/customerOpearationBtn'
import wallateViewDialog from './components/wallateViewDialog'
import baseConfigDialog from './components/baseConfigDialog'
import { getSalesListApi } from "@/api/partner/customerManage"
import { getOvlCustomerListApi } from '@/api/OverseasWarehouse/overseasManage.js'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'OvlCustomerList',
	mixins: [getZHMixin],
	data() {
		return {
			loading: false,
			filterForm: {
				name: null,
				no: null,
				status: null,
				salesId: null,
				omcName: null,
				pageNum: 1,
				pageSize: 50
			},
			totalData: 0,
			baseConfigVisivle: false,
			activeId: null,
			statusList: [
				{
					name: 'adaptation',
					code: 1
				},
				{
					name: 'business_stop',
					code: 2
				},
				{
					name: 'emergency_stop',
					code: 3
				}
			],
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: [],
			rowData: [],
			salesList: []
		}
	},
	components: { customerOpearationBtn, baseConfigDialog, wallateViewDialog },
	computed: {},
	methods: {
		onReady(params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
			this.gridApi.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		/**
		 * 初始化数据
		 */
		async init() {
			let res = await getSalesListApi()
			if (res.ok) {
				this.salesList = res.content || []
			}
		},
		/**
		 * 设置基础配置
		 */

		setBaseConfig(id) {
			this.activeId = id
			this.baseConfigVisivle = true
		},
		/**
	 * 设置基础配置
	 */
		setBusinessConfig(id) {
			this.$router.push({ name: 'CustomerConfigDetail', query: { id } })
		},
		lookWallet(id) {
			this.activeId = id
			this.dialog.visible = true
		},
		/**
		 * 获取列表
		 */

		async list() {
			this.loading = true
			const res = await getOvlCustomerListApi(this.filterForm)
			if (res.ok) {
				this.rowData = res.content.list
				this.totalData = Number(res.content.total)
			} else {
				this.rowData = []
				this.totalData = 0
			}
			this.loading = false
		},
		/**
		 * 重置
		 */
		clearSearchForm() {
			this.$refs.filterForm.resetFields()
			this.list()
		}

	},
	mounted() { },
	created() {
		this.gridOptions = {
			context: {
				componentParent: this
			},
			rowSelection: 'single', // 设置多行可选
			animateRows: true,
			suppressRowClickSelection: true // 选中单元格后可以复制内容
			// suppressCellSelection: true, //点击不选中单元格
		}
		this.columnFields = [
			{
				field: 'chineseName',
				headerName: this.getZH('customer_cName'),
				minWidth: 80
			},
			{
				field: 'no',
				headerName: this.getZH('customerNumber'),
				minWidth: 120
			},
			{
				field: 'status',
				headerName: this.getZH('status'),
				minWidth: 50,
				cellRenderer: params => {
					if (params.value === 2) {
						return `<div class='status-wrap'><span class='status-dot processing'></span>${params.data.statusName}</div>`
					} else if (params.value === 1) {
						return `<div class='status-wrap'><span class='status-dot successed'></span>${params.data.statusName}</div>`
					} else if (params.value === 3) {
						return `<div class='status-wrap'><span class='status-dot rejected'></span>${params.data.statusName}</div>`
					}
				}
			},
			{
				field: 'shortName',
				headerName: this.getZH('customer_short_Name'),
				minWidth: 50
			},
			{
				field: 'englishName',
				headerName: this.getZH('customer_eName'),
				minWidth: 50

			},
			{
				field: 'salesNames',
				headerName: this.getZH('sales_names'),
				minWidth: 80,
				cellRenderer(params) {
					return params.value ? params.value.join(",") : ''
				}
			},
			{
				field: 'omcName',
				headerName: this.getZH('omcName'),
				minWidth: 120
			},
			{
				field: 'createTime',
				headerName: this.getZH('createTime'),
				minWidth: 120,
				cellRenderer: params => this.formatDate(params.data.createTime, "YYYY-MM-DD")
			},
			{
				field: 'id',
				headerName: this.getZH('operation', 'common'),
				minWidth: 160,
				pinned: 'right',
				cellRendererFramework: 'customerOpearationBtn'
			}

		]
		let route = this.$route.query
		if (this.$isNotEmpty(route)) {
			this.$copyProps(this.filterForm, route)
		}
		this.list()
		this.init()

	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'CustomerConfigDetail') {
				vm.list()
			}
		})
	}
}
</script>

<style lang='scss' scoped>
::v-deep.status-wrap {
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
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
.features-btn {
	margin-bottom: 10px;
}
</style>
