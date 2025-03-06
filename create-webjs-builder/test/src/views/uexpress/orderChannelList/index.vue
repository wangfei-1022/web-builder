<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item label='' prop="searchNo">
							<el-input v-model="formData.searchNo" type="text" size="mini"  clearable >
                <el-select v-model="formData.noType" size="mini" slot="prepend" style="width: 100px;">
                  <el-option :label="$t('uexpressOrderChannel.sales_order_no')" :value="1" />
                  <el-option :label="$t('uexpressOrderChannel.chancel_order_no')" :value="2" />
                </el-select>
              </el-input>
						</el-form-item>
            <el-form-item :label="$t('uexpressOrderChannel.channel_supplier')" prop="channelSupplierId">
							<type-select v-model="formData.channelSupplierId" type="supplier" @selected="list" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: 17011}"></type-select>
						</el-form-item>
						<el-form-item :label="$t('uexpressOrderChannel.state')" prop="channelPushState">
							<el-select v-model="formData.channelPushState" size="mini" @change="list">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in channelPushStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrderChannel.request_time')" prop="requestTimePeriod">
              <search-date-picker v-model="formData.requestTimePeriod" @change="list" clearable></search-date-picker>
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>
	</div>
</template>

<script>
import { getOrderChannelListApi } from "@/api/uexpress/orderChannelList";
import { getDictListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands, addFloatNum } from "@/utils/index";

export default {
	name: "UExpressOrderChannelList",
	components: {
		AgGridVue
	},
	data() {
		return {
			formData: {
        noType: 1,
        searchNo: '',
        requestTimePeriod: [],

        channelSupplierId: '',
        channelPushState: ''
			},
      channelPushStateList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [{
          field: 'index',
          headerName: '',
          width: 55,
          pinned: 'left',
          suppressSorting: true,
          checkboxSelection: true,
          suppressMenu: true,
          suppressSizeToFit: true,
          suppressResize: true,
          headerCheckboxSelection: true
        },
				{
					field: "orderNo",
					headerName: this.$t('uexpressOrderChannel.sales_order_no'),
					minWidth: 150
				},
				{
					field: "orderChannelNo",
					headerName: this.$t('uexpressOrderChannel.chancel_order_no'),
					minWidth: 150
				},
				{
					field: "requestTime",
					headerName: this.$t('uexpressOrderChannel.request_time'),
					minWidth: 150
				},
				{
					field: "responseTime",
					headerName: this.$t('uexpressOrderChannel.response_time'),
					minWidth: 150
				},
				{
					field: "channelSupplierName",
					headerName: this.$t('uexpressOrderChannel.channel_supplier_name'),
					minWidth: 150
				},
				{
					field: "channelProductName",
					headerName: this.$t('uexpressOrderChannel.channel_product_name'),
					minWidth: 150
				},
				{
					field: "channelPushStateName",
					headerName: this.$t('uexpressOrderChannel.state'),
					minWidth: 150
				},
				{
					field: "failMessage",
					headerName: this.$t('uexpressOrderChannel.fail_message'),
					minWidth: 150
				},
				{
					field: "requestMessage",
					headerName: this.$t('uexpressOrderChannel.request_message'),
					minWidth: 200
				},
				{
					field: "responseMessage",
					headerName: this.$t('uexpressOrderChannel.response_message'),
					minWidth: 200
				}
			],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
					componentParent: this
				}
			},
			loading: false,
      gridApi: {}
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(11)]).then(results => {
				const channelPushStateRes = results[0];
				if (channelPushStateRes.ok) {
					this.channelPushStateList = channelPushStateRes.content;
				}
			});
		},

		onReady(params) {
      this.gridApi = params.api
			params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
		async list() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};

      if (params.noType === 1) {
        params.orderNo = params.searchNo
      } else if (params.noType === 2) {
        params.orderChannelNo = params.searchNo
      }

      if (params.requestTimePeriod) {
        params.requestTimeStart = this.formData.requestTimePeriod[0] || "";
				params.requestTimeEnd = this.formData.requestTimePeriod[1] || "";
      }

      delete params.searchTimePeriod

			const res = await getOrderChannelListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.requestTime = parseTime(v.requestTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.responseTime = parseTime(v.responseTime, "{y}-{m}-{d} {h}:{i}:{s}");
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
		reset() {
			this.$refs.formData.resetFields();
			this.list();
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
.search-item-1{
  width:100px;
  float: left;
  z-index: 6;
}
.search-item-2{
  padding-left: 100px;
  display: block;
}
.record-container{
  .title {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 600;
    line-height: 50px;
    border-bottom: 1px solid #eee;
  }

.record-container-content {
		overflow: hidden;

		.record-item {
			float: left;
			width: 50%;
			margin-bottom: 15px;
			display: flex;

			label {
				width: 120px;
				min-width: 120px;
				display: block;
				text-align: right;
				margin-bottom: 15px;
				font-weight: 500;
				font-size: 14px;
				float: left;
				margin-right: 6px;
			}
			span {
				font-weight: 500;
				font-size: 14px;
				display: inline;
				flex: 1;
			}
		}

		.title-important-item.record-item {
			width: 33%;
			label {
				font-weight: 600 !important;
			}
			span {
				font-weight: 600 !important;
			}
		}
	}
}
</style>
