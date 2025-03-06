<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot
      :searchFun="list"
      :resetFun="reset"
      class="mb-20"
    >
      <template slot="multipleSearch">
        <el-form ref="formData" :inline="true" :model="formData" class="search-form" label-width="100px">
          <el-form-item class="el-form-item" :label="$t('warehouse.warehouse_name')" prop="name">
            <el-input v-model="formData.name" size="mini" :placeholder="$t('warehouse.please_enter_warehouse_name')" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item class="el-form-item" :label="$t('warehouse.country')" prop="countryCode">
            <SelectFilter
              v-model="formData.countryCode"
              size="mini"
              clearable
              name-key="chineseShortname"
              value-key="code2"
              :placeholder="$t('warehouse.country_desc')"
              :options="countryOptions"
              :filter-keys="['code2', 'chineseShortname']"
              class="w-full"
              @change="list"
            />
          </el-form-item>
          <el-form-item class="el-form-item" :label="$t('warehouse.supplier')" prop="supplierId">
            <SelectFilter
              v-model="formData.supplierId"
              size="mini"
              :placeholder="$t('warehouse.supplier_desc')"
              name-key="chineseName"
              value-key="id"
              :options="partnerList"
              :filter-keys="['chineseName', 'abbreviation','englishName']"
              @change="list"
            />
          </el-form-item>
          <el-form-item :label="$t('warehouse.warehouseType')" prop="warehouseType">
            <el-select v-model="formData.warehouseType"  size="mini" :placeholder="$t('warehouse.please_warehouse_type')" @change="list">
              <el-option :label="$t('warehouse.statusType.ALL')" :value="null" />
              <el-option :label="$t('warehouse.underBond')" :value="10" />
              <el-option :label="$t('warehouse.nonBonded')" :value="11" />
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" :label="$t('warehouse.status')" prop="status">
            <el-select v-model="formData.status" size="mini" @change="list">
              <el-option :label="$t('warehouse.statusType.ALL')" :value="null" />
              <el-option :label="$t('warehouse.statusType.EFFECTIVE')" :value="2" />
              <el-option :label="$t('warehouse.statusType.LOSE_EFFICACY')" :value="1" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </TopSearchItemsSlot>
    <div class="mb-10 top-btn-wrap">
      <el-button icon="el-icon-plus" size="mini" type="primary" @click="edit(null,'0')">{{$t('warehouse.add')}}</el-button>
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
    <Pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="list" />
  </div>
</template>

<script>
import { getWarehouseListApi, updateStatusApi, getWarhouseCountryApi, getWarhouseSupplierApi } from '@/api/OverseasWarehouse/warehouse'
import operationBtn from './components/operationBtn'
export default {
	name: 'WarehouseList',
	components: { operationBtn },
	data() {
		return {
			formData: {
				name: '',
				supplierId: null,
				countryCode: '',
				status: null,
				warehouseType: null,
				pageSize: 50,
				pageNum: 1
			},
			total: 0,
			dataList: [],
			countryOptions: [],
			partnerList: [],
			columnDefsRight: [
				{
					headerName: this.$t('warehouse.warehouse_name'),
					field: 'name'
				},
				{
					headerName: this.$t('warehouse.warehouse_code'),
					field: 'warehouseCode'
				},
				{
					headerName: this.$t('warehouse.country'),
					field: 'countryName'
				},
				{
					headerName: this.$t('warehouse.supplier'),
					field: 'supplierName'
				},
				{
					headerName: this.$t('warehouse.warehouseType'),
					field: 'warehouseType',
					cellRenderer: params => params.value ? params.value === 10 ? this.$t('warehouse.underBond') : this.$t('warehouse.nonBonded') : '-'
				},
				{
					headerName: this.$t('warehouse.status'),
					field: 'status',
					cellRenderer: params => {
						if (params.value === 2) {
							return `<div class='status-wrap'><span class='status-dot successed '></span>${params.data.statusName}</div>`
						} else if (params.value === 1) {
							return `<div class='status-wrap'><span class='status-dot rejected'></span>${params.data.statusName}</div>`
						}
					}
				},
				{

					headerName: this.$t('warehouse.operation'), pinned: 'right', field: `id`, width: 140,
					cellRendererFramework: 'operationBtn'
				}],
			gridOptionsRight: {},
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			loading: false
		}
	},
	created() {
		this.gridOptionsRight = {
			context: {
				componentParent: this
			}
		}
		this.formData.goodsStatus = this.$route.meta.status
		this.init()
		this.list()
	},
	mounted() {

	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (from.name === 'WarehouseDetail') {
				vm.list()
			}
		})
	},
	methods: {
		/**
		 * 初始化数据
		 */
		async init() {
			const result = await getWarhouseSupplierApi({ partnerRoleList: [11010, 11011] })
			if (result.ok) {
				this.partnerList = result.content || []
			}
			// 获取国家基础数据
			const res3 = await getWarhouseCountryApi()
			if (res3 && res3.ok) {
				this.countryOptions = res3.content
			}
		},
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
		/**
			 * 获取列表
			 */
		async list() {
			this.loading = true
			const res = await getWarehouseListApi(this.formData).catch(res => {
				this.loading = false
			})
			if (res.ok) {
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
			this.$router.push({ name: `WarehouseDetail`, query: { id, type: isDetail, time: new Date().getTime() } })
		},
		/**
		 * 改变状态
		 */
		async updateStatus(id, status) {
			if (status === 1) {
				this.$confirm(this.$t('warehouse.lose_efficacy_info'), this.$t('warehouse.prompt'), {
					confirmButtonText: this.$t('warehouse.confirm'),
					cancelButtonText: this.$t('warehouse.cancel'),
					type: 'warning'
				}).then(() => {
					updateStatusApi({ id, status }).then(res => {
						if (res.ok) {
							this.$message.success(this.$t('warehouse.status_update_success'))
							this.list()
						}
					})
				}).catch(() => {
				})
			} else {
				updateStatusApi({ id, status }).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('warehouse.status_update_success'))
						this.list()
					}
				})
			}
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
</style>
