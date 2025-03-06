<template>
	<div class="right-main-wrapper product-line-container" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" >
						<el-form-item :label='$t("uexpressPriceCard.templateName")' prop="templateName">
							<el-input v-model="formData.templateName" type="text" size="mini"  clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.templateState")' prop="templateState">
							<el-select v-model="formData.templateState" size="mini" style="width: 100%" @change="list">
                <el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in stateList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.templateType")' prop="templateType">
							<el-select v-model="formData.templateType" size="mini" style="width: 100%"  @change="list">
                <el-option :label="$t('common.ALL')" value="" />
								<el-option v-for="item in templateList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.productType")' prop="productType">
							<uexpress-select v-model="formData.productType" type="productType" style="width: 100%" addALL  @selected="list" />
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn">{{$t("uexpressPriceCard.add")}}</el-button>
      </div>
			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>
	</div>
</template>

<script>
import { getChargeTemplateListApi, enableChargeTemplateApi, disabledChargeTemplateApi } from "@/api/uexpress/priceCardTemplate";
import { getDictListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import optionBtn from "./optionBtn";

export default {
	name: "UexpressPriceCardTemplateReceipt",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		return {
			formData: {
        templateName: '',
        templateState: '',
        templateType: ''
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
      templateList: [],
      stateList: [],
			columnFields: [{
					field: "templateName",
					headerName: this.$t("uexpressPriceCard.templateName"),
					minWidth: 120
				}, {
					field: "templateTypeName",
					headerName: this.$t("uexpressPriceCard.templateType"),
					minWidth: 150
				}, {
					field: "productTypeName",
					headerName: this.$t("uexpressPriceCard.productType"),
					minWidth: 120
				}, {
					field: "currency",
					headerName: this.$t("uexpressPriceCard.currency"),
					minWidth: 100
				}, {
					field: "unitGroupName",
					headerName: this.$t("uexpressPriceCard.unitGroup"),
					minWidth: 150
				}, {
					field: "templateStateName",
					headerName: this.$t("uexpressPriceCard.templateState"),
					minWidth: 100
				}, {
					field: "ounceFlagStr",
					headerName: this.$t("uexpressPriceCard.ounceFlag"),
					minWidth: 100
				}, {
					field: "createByName",
					headerName: this.$t("uexpressPriceCard.createByName"),
					minWidth: 100
				}, {
					field: "createTime",
					headerName: this.$t("uexpressPriceCard.createTime"),
					minWidth: 150
				}, {
					field: "id",
					headerName: this.$t("uexpressPriceCard.operation"),
					cellRendererFramework: "optionBtn",
					minWidth: 140,
          pinned: 'right'
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
			Promise.all([getDictListApi(31), getDictListApi(30)]).then(results => {
				const stateRes = results[0];
        const templateRes = results[1];
				if (stateRes.ok) {
					this.stateList = stateRes.content;
				}
        if (templateRes.ok) {
					this.templateList = templateRes.content;
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
				pageNum: this.pageNum,
        arAp: 1
			};
			const res = await getChargeTemplateListApi(params);
			if (res.ok) {
				res.content.list.forEach((item, index) => {
          item.index = index + 1
          item.createTime = parseTime(item.createTime, "{y}-{m}-{d} {h}:{i}:{s}");
          if (item.ounceFlag === true) {
            item.ounceFlagStr = this.$t('common.YES')
          } else if (item.ounceFlag === false) {
            item.ounceFlagStr = this.$t('common.NO')
          }
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
		},
    addFn() {
      this.$router.push({ name: "UexpressPriceCardTemplateReceiptAdd"});
    },
    editFn(row) {
      this.$router.push({
        name: "UexpressPriceCardTemplateReceiptEdit",
        query: {
          templateId: row.templateId
        }
      });
    },
    enabledFn(item) {
      this.$confirm(this.$t('uexpressPriceCard.enabled_info_confirm'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        enableChargeTemplateApi(item.templateId).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressPriceCard.enabled_success'))
            this.list()
          }
          this.loading = false
        })
      }).catch(() => {})
    },
    disabledFn(item) {
      this.$confirm(this.$t('uexpressPriceCard.disabled_info_confirm'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        disabledChargeTemplateApi(item.templateId).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('uexpressPriceCard.disabled_success'))
            this.list()
          }
          this.loading = false
        })
      }).catch(() => {})
    },
    viewFn(row) {
      this.$router.push({
        name: "UexpressPriceCardTemplateReceiptDetail",
        query: {
          templateId: row.templateId
        }});
    }
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}

</style>
