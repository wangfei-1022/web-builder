<template>
	<div class="right-main-wrapper product-line-container" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressChargeItem.category")' prop="categoryCode">
              <el-select v-model="formData.categoryCode" size="mini" style="width: 100%" @change="list">
                <el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in categoryList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressChargeItem.feeItem")' prop="feeItemCode">
							<type-select v-model="formData.feeItemCode" type="businessFee" :requestParams="{businessTypeCode: 'INTERNATIONAL_LINE'}" @selected="list" />
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10"></div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>
	</div>
</template>

<script>
import { getChargeRulesListApi } from "@/api/uexpress/chargeItem";
import { getDictListApi, getChargeCategoryListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";

export default {
	name: "UexpressChargeRuleList",
	components: {
		AgGridVue
	},
  props: {
    arAp: {
      type: Number,
      default: 0
    }
  },
	data() {
		return {
			formData: {
        categoryCode: '',
        feeItemCode: ''
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
      categoryList: [],
			columnFields: [{
					field: "ruleNo",
					headerName: this.$t("uexpressChargeItem.ruleNo"),
					minWidth: 120
				}, {
					field: "categoryName",
					headerName: this.$t("uexpressChargeItem.category"),
					minWidth: 120
				}, {
					field: "feeItemCode",
					headerName: this.$t("uexpressChargeItem.feeItemCode"),
					minWidth: 150
				}, {
					field: "feeItemName",
					headerName: this.$t("uexpressChargeItem.feeItem"),
					minWidth: 150
				}, {
					field: "attributeCommodityName",
					headerName: this.$t("uexpressChargeItem.attributeCommodityName"),
					minWidth: 150
				}, {
					field: "attributeChargeName",
					headerName: this.$t("uexpressChargeItem.attributeChargeName"),
					minWidth: 150
				}, {
					field: "desc",
					headerName: this.$t("uexpressChargeItem.desc"),
					minWidth: 150
				}],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
        context: {
					componentParent: this
				}
			},
			loading: false
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getChargeCategoryListApi()]).then(results => {
				const countryRes = results[0];
        if (countryRes.ok) {
					this.categoryList = countryRes.content;
				}
			});
		},
		onReady(params) {
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
        arAp: this.arAp,
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			const res = await getChargeRulesListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (item, index) {
          item.index = index + 1
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

</style>
