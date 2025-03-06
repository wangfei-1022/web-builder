<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot :searchFun="list" :resetFun="clearSearchForm" class="mb-10" >
			<template slot="multipleSearch">
        <el-form ref="formData" :inline="true" :model="formData" label-width="100px">
          <el-form-item :label="$t('estimateCharge.orderNo')" prop="entityNo">
            <el-input v-model="formData.entityNo" type="text" :placeholder="$t('estimateCharge.please_enter_entity_no')" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item :label="$t('estimateCharge.businessType')" prop="childBusinessTypeArr">
           <el-cascader size="mini" clearable v-model="formData.childBusinessTypeArr" :options="childBusinessTypeOptions"
              :props="{
                expandTrigger: 'hover',
                value: 'code',
                label: 'name'
              }"
              @change="list">
            </el-cascader>
          </el-form-item>
          <el-form-item :label="$t('estimateCharge.customerName')" prop="memberId">
            <type-select type="customer" v-model="formData.memberId" @selected="list"></type-select>
          </el-form-item>
          <el-form-item :label="$t('estimateCharge.warehouseName')" prop="extendInfo1">
           <StorageWarehouseSelect v-model="formData.extendInfo1"	clearable @change="list" />
          </el-form-item>
          <el-form-item :label="$t('estimateCharge.feeName')" prop="feeItemCode">
            <type-select v-model="formData.feeItemCode" type="businessFee" @selected="list" :requestParams="{businessTypeCode: 'OVERSEAS_WAREHOUSE'}" />
          </el-form-item>
        </el-form>
			</template>
		</TopSearchItemsSlot>
    <div class="mb-10 top-btn-wrap">
      <div class="box-price">
        <span>{{$t('estimateCharge.totalPrice')}}</span>
        <span v-for="(item,index) in totalPrice" :key="index" class="mr-10">
          {{item.currency}}：{{item.amount}}
        </span>
      </div>
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
import StorageWarehouseSelect from "@/views/cargo/v0/OverseasWarehouse/components/storageWarehouseSelect.vue"
import { getEstimateListApi } from '@/api/OverseasWarehouse/estimateCharge'
import { getOrderTypesApi } from "@/api/fmsReceiveOvl"
export default {
	name: 'EstimateChargeList',
	components: { StorageWarehouseSelect },
	data() {
		return {
			formData: {
				entityNo: null,
				memberId: null,
				extendInfo1: null,
				feeItemCode: null,
				childBusinessTypeArr: [],
				childBusinessType: null,
				entityType: null,
				pageSize: 50,
				pageNum: 1
			},
			loading: false,
			total: 0,
			dataList: [],
			totalPrice: [],
			childBusinessTypeOptions: [],
			columnDefsRight: [
				{
					headerName: this.$t('estimateCharge.orderNo'),
					field: 'entityNo'
				},
				{
					headerName: this.$t('estimateCharge.businessType'),
					field: 'childBusinessTypeName'
				},
				{
					headerName: this.$t('estimateCharge.warehouseName'),
					field: 'warehouseName'
				},
				{
					headerName: this.$t('estimateCharge.customerName'),
					field: 'settlementCompanyName'
				},
				{
					headerName: this.$t('estimateCharge.feeName'),
					field: 'feeName'
				},
				{
					headerName: this.$t('estimateCharge.currency'),
					field: 'currency'
				},
				{
					headerName: this.$t('estimateCharge.unitPrice'),
					field: 'price'
				},
				{
					headerName: this.$t('estimateCharge.quantity'),
					field: 'chargeQuantity1'
				},
				{
					headerName: this.$t('estimateCharge.estimatedAmount'),
					field: 'amount'
				},
				{
					headerName: this.$t('estimateCharge.estimatedCard'),
					field: 'offerName'
				}
			],
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
		this.init()
		// this.list()
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
		async init() {
			let res = await getOrderTypesApi()
			if (res.ok) {
				res.content.forEach(v => {
					if (v.children && v.children.length === 0) {
						delete v.children
					}
				})
				this.childBusinessTypeOptions = res.content
			}
		},
		/**
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			let formData = this.$extends({}, this.formData)
			if (formData.childBusinessTypeArr.length) {
				if (formData.childBusinessTypeArr.length === 1) {
					formData.entityType = this.formData.childBusinessTypeArr[0]
				} else {
					formData.entityType = formData.childBusinessTypeArr[0]
					formData.childBusinessType = formData.childBusinessTypeArr[1]
				}
			}
			delete formData.childBusinessTypeArr
			let res = await getEstimateListApi(formData)
			if (res.ok && res.content) {
				this.dataList = res.content.pageInfo.list || []
				this.total = res.content.pageInfo.total
				this.totalPrice = res.content.currencyList
			} else {
				this.dataList = []
				this.total = 0
				this.totalPrice = []
			}
			this.loading = false

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
.box-price {
	padding: 10px;
	border: 1px solid #bdc3c7;
	color: "rgba(0, 0, 0, 0.54)";
	font-size: 12px;
}
</style>
