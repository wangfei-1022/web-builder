<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressProduct.keyword")' prop="keyword">
							<el-input
              v-model="formData.keyword"
              type="text"
              size="mini"
              :placeholder='$t("uexpressProduct.service_product_placeholder")'
              clearable
              @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.product_type")' prop="productType">
							<el-select v-model="formData.productType" size="mini" @change="list">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in productTypeList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressProduct.state")' prop="productState">
							<el-select v-model="formData.productState" size="mini" @change="list">
								<el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="(item, index) in productStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn">{{$t("uexpressProduct.add")}}</el-button>
			</div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>
	</div>
</template>

<script>
import { getProductSalesListApi, productSalesForbiddenApi, productSalesActivateApi } from "@/api/uexpress/productSales";
import { getDictListApi, getAllAreaProductApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import optionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "ProductSalesList",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		return {
			formData: {
        keyword: '',
        productCode: '',
        productName: '',
        productType: '',
				productState: "",
        channelName: '',
        channelCode: '',
        customerType: '',
        destinationArea: ''
			},
			productTypeList: [],
			productStateList: [],
      areaProductList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [
				{
					field: "productCode",
					headerName: this.$t("uexpressProduct.product_code"),
					minWidth: 100
				},
				{
					field: "productName",
					headerName: this.$t("uexpressProduct.product_name"),
					minWidth: 100
				},
				{
					field: "productTypeName",
					headerName: this.$t("uexpressProduct.product_type"),
					minWidth: 200
				},
				{
					field: "mnemonicCode",
					headerName: this.$t("uexpressProduct.mnemonic_code"),
					minWidth: 100
				},
				{
					field: "shortName",
					headerName: this.$t("uexpressProduct.product_short_name"),
					minWidth: 150
				},
        {
					field: "productStateName",
					headerName: this.$t("uexpressProduct.state"),
					minWidth: 150
				},
        {
					field: "productDesc",
					headerName: this.$t("uexpressProduct.product_desc"),
					minWidth: 150
				},
				{
					field: "id",
					headerName: this.$t("uexpressProduct.operation"),
					cellRendererFramework: "optionBtn",
					minWidth: 100
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
			loading: false
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(3), getDictListApi(4), getAllAreaProductApi()]).then(results => {
				const productStateRes = results[0];
        const productTypeRes = results[1];
        const areaProductRes = results[2]
				if (productStateRes.ok) {
					this.productStateList = productStateRes.content;
				}
				if (productTypeRes.ok) {
					this.productTypeList = productTypeRes.content;
				}
        if (areaProductRes.ok) {
					this.areaProductList = areaProductRes.content
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
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			const res = await getProductSalesListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
					v.createTime = parseTime(v.createTime, "{y}-{m}-{d} {h}:{i}:{s}");
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = res.content.list;
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    addFn() {
      this.$router.push({ name: "ProductSalesAdd"});
		},
    edit(item) {
			this.$router.push({
				name: "ProductSalesEdit",
				query: {
					id: item.productId
				}
			});
		},
    ableFn(item, flag) {
      let successMsg = flag ? this.$t("uexpressProduct.enabled_success") : this.$t("uexpressProduct.disabled_success")
      let confirmMsg = flag ? this.$t("uexpressProduct.enabled_info_confirm") : this.$t("uexpressProduct.disabled_info_confirm")
      let fn = flag ? productSalesActivateApi : productSalesForbiddenApi
      let data = {
        productId: item.productId
      }
      this.$confirm(confirmMsg, this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        fn(data).then(res => {
          if (res.ok) {
            this.$message.success(successMsg)
            this.list()
          }
        })
      }).catch(() => {})
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
