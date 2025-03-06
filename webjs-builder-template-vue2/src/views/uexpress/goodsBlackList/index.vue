<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
						<el-form-item :label='$t("uexpressGoodsList.keyword")' prop="keyWord">
							<el-input v-model="formData.keyWord" type="text" size="mini" :placeholder='$t("uexpressGoodsList.blackPlaceholder")' clearable @keyup.enter.native="list" />
						</el-form-item>
						<el-form-item :label='$t("uexpressGoodsList.blackTypeName")' prop="type">
							<el-select v-model="formData.type" size="mini" style="width: 100%" @change="list">
                <el-option :label="$t('common.ALL')" value=""/>
                <el-option v-for="item in typeList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
						<el-form-item :label='$t("uexpressGoodsList.country")' prop="countryCode">
              <base-select v-model="formData.countryCode" type="country" style="width: 100%" filterable clearable  @selected="list" />
            </el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" @click="batchImportFn()">{{$t("uexpressGoodsList.batch_import")}}</el-button>
        <el-button type="primary" size="mini" @click="deleteFn()">{{$t("uexpressGoodsList.batchDelete")}}</el-button>
      </div>

			<ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true" :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressGoodsList.blackGoodsImport")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressGoodsList.blackGoodsImportTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="customsBlacklistGoodsExcel">
          <upload-file v-model="importForm.customsBlacklistGoodsExcel" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn" :loading="batchImportLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { getGoodsBlackListApi, updateGoodsBlackListApi, createGoodsBlackListApi, importGoodsBlackListApi, deleteGoodsBlackListApi, getGoodsBlackTypeApi } from "@/api/uexpress/goodsBlackList";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UexpressGoodsBlackList",
	data() {
		return {
			formData: {
        keyWord: '',
        countryCode: '',
				type: ""
			},

      typeList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [{
        field: 'indexKey',
        headerName: '',
        width: 55,
        pinned: 'left',
        suppressSorting: true,
        checkboxSelection: true,
        suppressMenu: true,
        suppressSizeToFit: true,
        suppressResize: true,
        headerCheckboxSelection: true
      }, {
					field: "index",
					headerName: this.$t("uexpressGoodsList.index"),
					minWidth: 80
				}, {
					field: "typeName",
					headerName: this.$t("uexpressGoodsList.blackTypeName"),
					minWidth: 100
				}, {
					field: "goodsName",
					headerName: this.$t("uexpressGoodsList.blackGoodsName"),
					minWidth: 100
				}, {
					field: "hsCode",
					headerName: this.$t("uexpressGoodsList.hsCode"),
					minWidth: 100
				}, {
					field: "destinationCountryName",
					headerName: this.$t("uexpressGoodsList.declare_country"),
					minWidth: 100
				}],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "multiple", // 设置多行可选
        animateRows: true,
        suppressRowClickSelection: true,
        context: {
					componentParent: this
				}
			},
      gridApi: null,
			loading: false,

      // 批量导入
      batchImportVisible: false,
      batchImportLoading: false,
      importForm: {
        customsBlacklistGoodsExcel: []
      },
      importFormRule: {
        customsBlacklistGoodsExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getGoodsBlackTypeApi()]).then(results => {
				const typeRes = results[0];
				if (typeRes.ok) {
					this.typeList = typeRes.content;
				}
			});
		},
		onReady(params) {
			params.api.sizeColumnsToFit();
      this.gridApi = params.api
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
			const res = await getGoodsBlackListApi(params);
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
    deleteFn() {
      let selRows = this.gridApi.getSelectedRows();
      if (selRows.length === 0) {
        this.$message.error(this.$t("uexpressGoodsList.leastOne"))
        return
      }
      let data = {
      ids: []
      }
      selRows.forEach(v => {
        data.ids.push(v.id)
      })
      this.$confirm(this.$t("uexpressGoodsList.deleteInfo"), this.$t('common.mention'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm'),
        type: 'warning'
      }).then(() => {
        deleteGoodsBlackListApi(data).then(res => {
          if (res.ok) {
            this.$message.success(this.$t("uexpressGoodsList.deleteSuccess"))
            this.list()
          }
        })
      }).catch(() => {});

    },
    downloadTemplateFn() {
      getTemplateFileApi(18).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    batchImportFn() {
      this.importForm = {
        customsBlacklistGoodsExcel: []
      }
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.customsBlacklistGoodsExcel = data.customsBlacklistGoodsExcel[0]
          this.batchImportLoading = true
          importGoodsBlackListApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressGoodsList.import_oper_success'))
            }
            this.batchImportLoading = false
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
