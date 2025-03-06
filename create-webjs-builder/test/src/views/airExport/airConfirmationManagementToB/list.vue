<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
        <el-form-item :label="`${$t('air.orderNumber')}: `" prop="orderNo">
          <el-input v-model.trim="formData.orderNo" maxlength="50" placeholder="" size="mini" clearable
            @keyup.enter.native="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pol')" prop="polCode">
          <type-select v-model="formData.polCode" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('air.pod2')" prop="podCode">
          <type-select v-model="formData.podCode" type="airport" clearable @selected="list" />
        </el-form-item>
        <el-form-item :label="$t('air.requester')" prop="customerId">
          <type-select v-model="formData.customerId" type="customer" @selected="list" />
        </el-form-item>
        <el-form-item label="ETD:" prop="validTimeRange">
          <el-date-picker v-model="formData.validTimeRange" value-format="timestamp" type="daterange" range-separator="-"
            start-placeholder="" end-placeholder="" @change="list" style="width: 176px">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </top-search-items-slot>

    <div class="table-wrap">
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs"
        :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true"
        :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
    </div>

  </div>
</template>

<script>
import {
	getAirOrderConfirmePages
} from "@/api/airExport";

import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { airLineListApi, getCustomerDropDownListByJob } from "@/api/common";
import cargoLimitedSelect from "@/components/Cargo/Common/cargoLimitedSelect";
export default {
	name: "AirConfirmationManagementToB",
	components: {
		AgGridVue,
		cargoLimitedSelect,
		'operating': {
			template: `
      <span>
        <el-button  type="text" size="mini" @click="params.context.componentParent.showDetailFn(params.data)"
        v-if="params.data.orderState === 3"
        v-permission="['air:airConfirmationManagementToB:orderConfirmation']"
        >
        {{params.context.componentParent.$t('air.orderConfirmation')}}
        </el-button>
        
      </span>
      `,
			methods: {

			}
		}
	},
	data() {

		return {
			airCustomerMethod: airLineListApi,

			orderType: "",
			formData: {
				customerId: "",
				orderNo: '',
				polCode: '', // 装货港
				podCode: '', // 卸货港
				validTimeRange: []
			},
			order: {},
			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			amountTotal: [], // 统计
			columnFields: [],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			gridApi: {},
			loading: false
		}
	},
	created() {
		// this.formData.validTimeRange = [this.calculateDay(0, new Date(), 2), this.calculateDay(7, new Date(), 1)]

		this.list()
	},
	watch: {
		'$route'(to, from) {
			if (to.name === 'AirConfirmationManagementToB') {
				this.list();
			}
		}
	},
	methods: {
		/**
 * @param {*} dayNumber 天数
 * @param {*} date 日期
 * @param {*} type 1加 2减
 */
		calculateDay(dayNumber, date, type) {
			let ms = dayNumber * (1000 * 60 * 60 * 24)
			let newDate
			if (type === 1) {
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), "23", "59", "59");
				newDate = new Date(date.getTime() + ms);
			} else {
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
				newDate = new Date(date.getTime() - ms);
			}

			return newDate.valueOf();
		},

		getFields() {
			return [{
				headerName: '', width: 40, pinned: 'left',
				suppressSorting: true, checkboxSelection: true,
				suppressMenu: true, suppressSizeToFit: true, suppressResize: true,
				headerCheckboxSelection: true
			}, {
				field: "orderNo",
				headerName: this.$t("air.orderNumber"),
				minWidth: 100
			},
			{
				field: "customerName",
				headerName: this.$t("air.requester"),
				minWidth: 200
			},
			{
				field: "orderStateDesc",
				headerName: this.$t("air.orderStateDesc"),
				minWidth: 100
			},
			{
				field: "etd",
				headerName: "ETD",
				minWidth: 100
			},
			{
				field: "polCode",
				headerName: this.$t('air.pol'),
				minWidth: 80
			},
			{
				field: "potCode",
				headerName: this.$t('air.transitPort'),
				minWidth: 80
			},
			{
				field: "receiptCode",
				headerName: this.$t('air.receipt'),
				minWidth: 80
			},
			{
				field: "podCode",
				headerName: this.$t('air.pod2'),
				minWidth: 80
			}, {
				field: "orderQuantity",
				headerName: this.$t("air.estimatedNumber"),
				minWidth: 100
			}, {
				field: "orderGrossWeight",
				headerName: this.$t("air.estimatedGrossWeight"),
				minWidth: 100
			}, {
				field: "orderVolume",
				headerName: this.$t("air.estimatedVolume"),
				minWidth: 100
			},
			// {
			//   field: "orderChargeableWeight",
			//   headerName: this.$t("air.entrustedChargingWeight"),
			//   minWidth: 100
			// },
			{
				field: "palletSizes",
				headerName: this.$t("air.palletSizes"),
				minWidth: 100
			},
			{
				field: "remark",
				headerName: this.$t("air.remarks"),
				minWidth: 150
			},
			{
				field: "sellerName",
				headerName: this.$t("air.ownedSales"),
				minWidth: 100
			},
			{
				field: "createByName",
				headerName: this.$t("air.createdBy"),
				minWidth: 100
			},
			{
				field: "createTime",
				headerName: this.$t("air.createTime"),
				minWidth: 130
			},
			{
				field: "id",
				headerName: this.$t("air.operating"),
				cellRendererFramework: "operating",
				pinned: 'right',
				minWidth: 100
			}]
		},
		onReady(params) {
			this.gridApi = params.api
			params.api.sizeColumnsToFit()
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		async list() {
			this.loading = true
			if (this.formData.validTimeRange) {
				this.formData.etdStart = this.formData.validTimeRange[0];
				this.formData.etdEnd = this.formData.validTimeRange[1];
			} else {
				this.formData.validTimeRange = []
				this.formData.etdStart = "";
				this.formData.etdEnd = "";
			}

			const _params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}


			const res = await getAirOrderConfirmePages(_params)
			if (res.ok) {
				this.total = parseInt(res.content.total, 10)

				res.content.list.forEach(v => {
					try {
						v.etd = parseTime(v.etd, '{y}-{m}-{d}')
						v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
					} catch (e) {
						console.log(e)
					}
				})

				let arr = this.getFields()

				this.columnFields = arr
				this.dataList = res.content.list

				// 触发resize
				let ev = document.createEvent('Event')
				ev.initEvent('resize', true, true)
				window.dispatchEvent(ev)
			} else {
				this.total = 0
				this.dataList = []
			}
			this.loading = false
		},
		handleSizeChange(size) {
			this.pageSize = size
			this.list()
		},
		handleCurrentChange(page) {
			this.pageNum = page
			this.list()
		},
		reset() {// 搜索重置
			this.$refs.formData.resetFields()
			this.formData.validTimeRange = []
			this.list()
		},

		refreshFn() {
			this.list();
		},
		setAirCustomerInfo(customer) {
			this.filter.airlineId = customer.id;
			this.filter.airlineName = customer.chineseName;
			this.list();
		},

		batchQuotation() {

		},
		showDetailFn(row) {
			this.$router.push({
				name: `OrderConfirmationToB`,
				query: { id: row.id }
			});
		}
	}
}
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	overflow: auto;
	padding: 20px 20px 0 20px;
}

.total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
	font-family: "PingFangSC-Regular", "PingFang SC";
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	padding: 0px 10px;

	.value-item {
		display: inline-block;
		margin-right: 30px;

		.value {
			display: inline-block;
			margin-right: 5px;
		}
	}
}

.pagination-container {
	margin-top: 0px;
}
</style>
