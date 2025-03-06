<template>
  <div v-loading="loading" class="pd-16">
    <TopSearchItemsSlot :searchFun="list" :resetFun="clearSearchForm" class="mb-10" >
			<template slot="multipleSearch">
        <el-form ref="formData" :inline="true" :model="formData" label-width="100px">
          <el-form-item :label="$t('chargeLog.entityNo')" prop="bizNo">
            <el-input v-model="formData.bizNo" type="text" :placeholder="$t('chargeLog.please_enter_entity_no')" size="mini" clearable @keyup.enter.native="list" />
          </el-form-item>
          <el-form-item :label="$t('chargeLog.customerName')" prop="customerId">
            <type-select type="customer" v-model="formData.customerId" @selected="list"></type-select>
          </el-form-item>
          <el-form-item :label="$t('chargeLog.chargeItem')" prop="feeCode">
            <type-select v-model="formData.feeCode" type="businessFee" @selected="list" :requestParams="{businessTypeCode: 'OVERSEAS_WAREHOUSE'}" />
          </el-form-item>
          <el-form-item :label="$t('chargeLog.operateType')" prop="optType" @change="list">
            <el-select size="mini" v-model="formData.optType" @change="list">
              <el-option :label="$t('common.all')" :value="null"></el-option>
              <el-option :label="$t('chargeLog.addItem')" :value="1"></el-option>
              <el-option :label="$t('chargeLog.adujustItem')" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('chargeLog.operateByName')" prop="operationBy">
            <type-select v-model="formData.operationBy" type="operation" @selected="list"  />
          </el-form-item>
          <el-form-item :label="$t('chargeLog.operateTime')" prop="operateTime">
            <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="operateTime" @change="list" clearable></common-picker>
          </el-form-item>
        </el-form>
			</template>
		</TopSearchItemsSlot>
    <!-- <div class="mb-10 top-btn-wrap">
      <el-button size="mini" type="primary"> {{$t('chargeLog.exportData')}}</el-button>
    </div> -->
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
import { getChargeLogListApi } from '@/api/OverseasWarehouse/estimateCharge'
export default {
	name: 'ChargeLogList',
	components: {},
	data() {
		return {
			formData: {
				customerId: null,
				feeCode: null,
				optType: null,
				optTimeStart: null,
				optTimeEnd: null,
				bizNo: null,
				pageSize: 50,
				pageNum: 1
			},
			operateTime: [],
			loading: false,
			total: 0,
			dataList: [],
			columnDefsRight: [
				{
					headerName: this.$t('chargeLog.entityNo'),
					field: 'bizNo'
				},
				{
					headerName: this.$t('chargeLog.customerName'),
					field: 'customerName'
				},
				{
					headerName: this.$t('chargeLog.chargeItem'),
					field: 'feeName'
				},
				{
					headerName: this.$t('chargeLog.chargeItemCode'),
					field: 'feeCode'
				},
				{
					headerName: this.$t('chargeLog.operateType'),
					field: 'optType',
					cellRenderer: params => `<div>${params.value === 1 ? this.$t('chargeLog.addItem') : this.$t('chargeLog.adujustItem')}</div>`,

				},
				{
					headerName: this.$t('chargeLog.operateByName'),
					field: 'optName'
				},
				{
					headerName: this.$t('chargeLog.operateTime'),
					field: 'optTime',
					cellRenderer: params => this.formatDate(params.value)
				},
				{
					headerName: this.$t('chargeLog.preOperationAmount'),
					field: 'optBeforeAmount'
				},
				{
					headerName: this.$t('chargeLog.afterOperationAmount'),
					field: 'optAfterAmount'
				},
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
		this.list()
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
		 * 获取列表数据
		 */
		async list() {
			this.loading = true
			this.formData.optTimeStart = this.$isEmpty(this.operateTime) ? null : this.operateTime[0]
			this.formData.optTimeEnd = this.$isEmpty(this.operateTime) ? null : this.operateTime[1]
			let res = await getChargeLogListApi(this.formData)
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = res.content.total
			}
			this.loading = false
		},
		/**
		 * 清空重置条件
		 */
		clearSearchForm() {
			this.operateTime = []
			this.$refs.formData.resetFields()
			this.list()
		}
	}
}
</script>

<style scoped lang="less">
</style>
 