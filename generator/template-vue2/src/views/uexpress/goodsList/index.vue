<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressGoodsList.keyword")' prop="goodsName">
							<el-input v-model="formData.goodsName" type="text" size="mini" :placeholder='$t("uexpressGoodsList.placeholder")' clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressGoodsList.hsCode")' prop="hsCode">
							<el-input v-model="formData.hsCode" type="text" size="mini" clearable @keyup.enter.native="list" />
            </el-form-item>
						<el-form-item :label='$t("uexpressGoodsList.country")' prop="countryCode">
              <el-select v-model="formData.countryCode" size="mini" style="width: 100%" filterable clearable  @change="list">
                  <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
                </el-select>
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addOrEditFn()">{{$t("uexpressGoodsList.add")}}</el-button>
				<el-button type="primary" size="mini" @click="batchImportFn()">{{$t("uexpressGoodsList.batch_import")}}</el-button>
			</div>

			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>

    <el-dialog :visible.sync="visible" v-if="visible" :close-on-click-modal="false" :append-to-body="true" width="700px" :title="addOrEditTitle">
      <el-form class="contact-form" ref="formRef" :model="form" :rules="formRule" label-width="120px" size="mini">
        <el-form-item :label='$t("uexpressGoodsList.goods_no")' prop="goodsNo">
          <el-input v-model="form.goodsNo" type="text" size="mini" clearable disabled />
        </el-form-item>
        <el-form-item :label='$t("uexpressGoodsList.declare_country")' prop="declareCountryCode">
           <el-select v-model="form.declareCountryCode" size="mini" style="width: 100%" filterable >
              <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
            </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressGoodsList.customer_goods_en_name")' prop="name">
          <el-input v-model="form.name" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("uexpressGoodsList.declare_en_name")' prop="declareName">
          <el-input v-model="form.declareName" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("uexpressGoodsList.customer_goods_zh_name")' prop="localName">
          <el-input v-model="form.localName" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("uexpressGoodsList.declare_zh_name")' prop="declareLocalName">
          <el-input v-model="form.declareLocalName" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("uexpressGoodsList.hsCode")' prop="hsCode">
          <el-input v-model="form.hsCode" type="text" size="mini" clearable />
        </el-form-item>
        <el-form-item :label='$t("uexpressGoodsList.logistic_direct")' prop="logisticDirect">
           <el-select v-model="form.logisticDirect" size="mini" style="width: 100%" filterable >
              <el-option v-for="item in logisticDirectList" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="visible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressGoodsList.batch_import_goods")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressGoodsList.goods_import_template")}}</el-button>
        </div>
        <el-form-item label='excel' prop="customsGoodsExcel">
          <upload-file v-model="importForm.customsGoodsExcel" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { getGoodsListApi, updateGoodsListApi, createGoodsListApi, importGoodsListApi } from "@/api/uexpress/goodsList";
import { getCountryListApi } from "@/api/country";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import optionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";


export default {
	name: "ProductLineList",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		return {
			formData: {
        goodsName: '',
        countryCode: '',
				hsCode: ""
			},

      visible: false,
			addOrEditTitle: "",
			form: {
        logisticDirect: '',
				declareCountryCode: "",
        hsCode: "",
				name: '',
				localName: "",
				declareName: "",
				declareLocalName: ""
			},
			formRule: {
        logisticDirect: [{required: true,	message: this.$t("common.cannot_be_null")}],
				name: [{required: true,	message: this.$t("common.cannot_be_null")}],
				declareName: [{required: true,	message: this.$t("common.cannot_be_null")}],
        declareCountryCode: [{required: true,	message: this.$t("common.cannot_be_null")}]
			},
      editItem: {},

      countryList: [],
      logisticDirectList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [{
					field: "index",
					headerName: this.$t("uexpressGoodsList.index"),
					minWidth: 80
				}, {
					field: "goodsNo",
					headerName: this.$t("uexpressGoodsList.goods_no"),
					minWidth: 120
				}, {
					field: "name",
					headerName: this.$t("uexpressGoodsList.customer_goods_en_name"),
					minWidth: 150
				}, {
					field: "declareName",
					headerName: this.$t("uexpressGoodsList.declare_en_name"),
					minWidth: 150
				}, {
					field: "localName",
					headerName: this.$t("uexpressGoodsList.customer_goods_zh_name"),
					minWidth: 150
				}, {
					field: "declareLocalName",
					headerName: this.$t("uexpressGoodsList.declare_zh_name"),
					minWidth: 150
				}, {
					field: "logisticDirectName",
					headerName: this.$t("uexpressGoodsList.logistic_direct"),
					minWidth: 100
				}, {
					field: "declareCountryName",
					headerName: this.$t("uexpressGoodsList.declare_country"),
					minWidth: 100
				}, {
					field: "hsCode",
					headerName: this.$t("uexpressGoodsList.hsCode"),
					minWidth: 100
				}, {
					field: "optionBtn",
					headerName: this.$t("uexpressGoodsList.operation"),
          cellRendererFramework: "optionBtn",
					minWidth: 100
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
			loading: false,

      // 批量导入
      batchImportVisible: false,
      importForm: {
        customsGoodsExcel: []
      },
      importFormRule: {
        customsGoodsExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getCountryListApi(3), getDictListApi(27)]).then(results => {
				const countryRes = results[0];
        const logisticDirectRes = results[1];
				if (countryRes.ok) {
					this.countryList = countryRes.content;
				}
				if (logisticDirectRes.ok) {
					this.logisticDirectList = logisticDirectRes.content;
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
			const res = await getGoodsListApi(params);
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
    confirmFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.visible = false;

          let data = {
            ...this.form,
            customsGoodsId: this.form.id
          }
          let fn = data.id ? updateGoodsListApi : createGoodsListApi
          let msg = data.id ? this.$t("uexpressGoodsList.edit_success") : this.$t("uexpressGoodsList.add_success")
          fn(data).then(res => {
            if (res.ok) {
              this.$message.success(msg)
              this.list()
            }
          })
				}
			})
		},
		addOrEditFn(item, index) {
      // 获取最新的产品分区列表
			if (item) {
				this.form = {
					...this.form,
					...item
				};
				this.addOrEditTitle = this.$t("uexpressGoodsList.edit");
			} else {
				this.form = {
					logisticDirect: '',
          declareCountryCode: "",
          hsCode: "",
          name: '',
          localName: "",
          declareName: "",
          declareLocalName: ""
				};
				this.addOrEditTitle = this.$t("uexpressGoodsList.add");
			}
			this.visible = true;
		},

    downloadTemplateFn() {
      getTemplateFileApi(3).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    batchImportFn() {
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.customsGoodsExcel = data.customsGoodsExcel[0]
          importGoodsListApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressGoodsList.import_oper_success'))
            }
          })
        }
      })
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

.contact-form{
  overflow: hidden;
   ::v-deep .el-form-item {
		width: 50%;
    float: left;
	}
}
</style>
