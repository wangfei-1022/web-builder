<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot
      class="mb-10"
      :searchFun="list"
      :resetFun="clearSearchForm"
    >
      <template slot="multipleSearch">
        <el-form
            ref="formData"
            :inline="true"
            :model="formData"
            label-width="100px"
          >
            <el-form-item :label="$t('logisticsProduct.logistics_product_name')" prop="productName">
              <el-input
                v-model="formData.productName"
                type="text"
                :placeholder="$t('logisticsProduct.please_enter_logistics_product_name')"
                size="mini"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>
            <el-form-item :label="$t('logisticsProduct.logistics_product_code')" prop="productCode">
              <el-input
                v-model="formData.productCode"
                type="text"
                :placeholder="$t('logisticsProduct.please_enter_logistics_product_code')"
                size="mini"
                clearable
                @keyup.enter.native="list"
              />
            </el-form-item>
            <el-form-item :label="$t('logisticsProduct.logistics_company')" prop="carrierId">
              <SelectFilter
                v-model="formData.carrierId"
                size="mini"
                name-key="shortname"
                value-key="id"
                :placeholder="$t('logisticsProduct.logistics_company_desc')"
                :options="companyList"
                :filter-keys="[
                  'scacCode',
                  'shortname',
                  'chineseName',
                  'englishName',
                ]"
                clearable
                @change="list"
              />
            </el-form-item>
            <el-form-item :label="$t('logisticsProduct.country')" prop="countryCode">
              <NationalGroupSelect	v-model="formData.countryCode" @selected="list()" />
            </el-form-item>
            <el-form-item :label="$t('logisticsProduct.transport_mode')" prop="productType">
              <el-select
                v-model="formData.productType"
                size="mini"
                :placeholder="$t('logisticsProduct.please_enter_transport_mode')"
                class="w-full"
                @change="list"
              >
                <el-option :label="$t('logisticsProduct.transportMode.all')" :value="0" />
                <el-option :label="$t('logisticsProduct.transportMode.express_elivery')" :value="1" />
                <el-option :label="$t('logisticsProduct.transportMode.truck')" :value="2" />
                <el-option :label="$t('logisticsProduct.transportMode.railway')" :value="3" />
                <el-option :label="$t('logisticsProduct.transportMode.trailer')" :value="4" />
              </el-select>
            </el-form-item>
        </el-form>
      </template>
    </TopSearchItemsSlot>
    <div class="mb-10 top-btn-wrap">
      <el-button icon="el-icon-plus" size="mini" type="primary" @click="edit()">
        {{$t('logisticsProduct.add')}}
      </el-button>
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
  </div>
</template>
<script>
import LogisticsProductsBtn from './components/LogisticsProductsBtn'
import { getProductListApi, getCompanyListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'
import NationalGroupSelect from './components/NationalGroupSelect.vue'
export default {
	name: 'LogisticsProducts',
	components: { LogisticsProductsBtn, NationalGroupSelect },
	data() {
		return {
			formData: {
				productCode: '',
				productName: '',
				carrierId: '',
				countryCode: '',
				productType: null,
				pageSize: 50,
				pageNum: 1
			},
			loading: false,
			total: 0,
			dataList: [],
			companyList: [],
			columnDefsRight: [
				{
					headerName: this.$t('logisticsProduct.logistics_product_code'),
					field: 'productCode'
				},
				{
					headerName: this.$t('logisticsProduct.logistics_product_name'),
					field: 'productName'
				},
				{
					headerName: this.$t('logisticsProduct.logistics_company'),
					field: 'logisticsCompanyName'
				},
				{
					headerName: this.$t('logisticsProduct.logistics_company_abbreviation'),
					field: 'logisticsCompanyShortname'
				},
				{
					headerName: this.$t('logisticsProduct.logistics_company_code'),
					field: 'scacCode'
				},
				{
					headerName: this.$t('logisticsProduct.country'),
					field: 'countryName'
				},
				{
					headerName: this.$t('logisticsProduct.transport_mode'),
					field: 'productTypeName'
				},
				{
					headerName: this.$t('logisticsProduct.timeliness'),
					field: 'aging'
				},
				{
					headerName: this.$t('logisticsProduct.sign'),
					field: 'signServiceFlagName'
				},
				{
					headerName: this.$t('logisticsProduct.insurance'),
					field: 'insuranceSupportTypeName'
				},
				// {
				// 	headerName: this.$t('logisticsProduct.mergePackageFlag'),
				// 	field: 'mergePackageFlag',
				// 	cellRenderer: params => params.data.mergePackageFlag ? this.$t('common.YES') : this.$t('common.NO')
				// },
				{
					headerName: this.$t('logisticsProduct.operation'), pinned: 'right', field: `id`, width: 120,
					cellRendererFramework: 'LogisticsProductsBtn'
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
		this.list()
		this.init()
	},
	mounted() {

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
		/**
		 *获取国家基础数据
			*/
		async init() {

			// 获取物流公司数据
			const result = await getCompanyListApi({ pageSize: 500, pageNum: 1 })
			if (result.ok) {
				this.companyList = result.content.list || []
			}
		},
		/**
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			const res = await getProductListApi(this.formData).catch(() => {
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
		 * 查看详情
		 */
		detail(id) { },
		/**
	 * 新增编辑
	 */
		edit(id, isDetail) {
			this.$router.push({ name: `LogisticsProductsDetail`, query: { id, type: isDetail, time: new Date().getTime() } })
		},
		/**
		 * 清空重置条件
		 */
		clearSearchForm() {
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="less">
</style>
