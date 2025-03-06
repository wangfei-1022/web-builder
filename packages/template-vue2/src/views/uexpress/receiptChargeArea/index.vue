<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressProduct.keyword")' prop="keyword">
							<el-input v-model="formData.keyword" type="text" size="mini" clearable @keyup.enter.native="list" placeholder="分区编码/名称"/>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.state")' prop="areaState">
							<el-select v-model="formData.areaState" size="mini" @change="list">
								<el-option :label="$t('customerManage.ALL')" value="" />
								<el-option v-for="(item, index) in areaStateList" :key="index" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn">{{$t("uexpressProduct.add")}}</el-button>
				<el-button type="primary" size="mini" @click="batchImportFn()">{{$t("uexpressProduct.batch_import")}}</el-button>
      </div>
			<ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham"
        />
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='importTitle'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressProduct.charge_area_import_template")}}</el-button>
        </div>
        <el-form-item label='excel' prop="areaProductExcel">
          <upload-file v-model="importForm.areaProductExcel" accept=".xls,.xlsx" />
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
import { areaProductListApi, areaProductActivateApi, areaProductForbiddenApi, importProductAreaListApi, importProductAreaDetailApi } from "@/api/uexpress/productArea";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import optionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UexpressChargeAreaReceipt",
	components: {
		AgGridVue,
		optionBtn
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
				keyword: "",
				areaState: ""
			},
			statusList: [],
			areaStateList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [
				{
					field: "areaCode",
					headerName: this.$t("uexpressProduct.area_code"),
					minWidth: 100
				},
				{
					field: "areaName",
					headerName: this.$t("uexpressProduct.area_name"),
					minWidth: 100
				},
				{
					field: "areaStateName",
					headerName: this.$t("uexpressProduct.state"),
					minWidth: 200
				},
				{
					field: "remarks",
					headerName: this.$t("uexpressProduct.remark"),
					minWidth: 200
				},
				{
					field: "createByName",
					headerName: this.$t("uexpressProduct.create_by_name"),
					minWidth: 100
				},
				{
					field: "createTime",
					headerName: this.$t("uexpressProduct.create_by_time"),
					minWidth: 150
				},
				{
					field: "id",
					headerName: this.$t("uexpressProduct.operation"),
					cellRendererFramework: "optionBtn",
					minWidth: 150,
          pinned: 'right'
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

      // 批量导入
      batchImportVisible: false,
      importForm: {
        areaProductExcel: []
      },
      importFormRule: {
        areaProductExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },
      importRow: {},
      importTitle: ''
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(1)]).then(results => {
				const areaStateRes = results[0];
				if (areaStateRes.ok) {
					this.areaStateList = areaStateRes.content;
				}
			});
		},
		addFn() {
      this.$router.push({ name: "UexpressChargeAreaReceiptAdd"});
		},
    edit(item) {
			this.$router.push({
				name: "UexpressChargeAreaReceiptEdit",
				query: {
					id: item.areaId
				}
			});
		},
    ableFn(item, flag) {
      let successMsg = flag ? this.$t("uexpressProduct.enabled_success") : this.$t("uexpressProduct.disabled_success")
      let confirmMsg = flag ? this.$t("uexpressProduct.enabled_info_confirm") : this.$t("uexpressProduct.disabled_info_confirm")
      let fn = flag ? areaProductActivateApi : areaProductForbiddenApi
      let data = {
        areaId: item.areaId
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
        areaType: 1, // 1 计费分区 2 路由分区
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			const res = await areaProductListApi(params);
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
		reset() {
			this.$refs.formData.resetFields();
			this.list();
		},
    downloadTemplateFn() {
      getTemplateFileApi(4).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    importAreaDetailFn(row) {
      this.importRow = row
      this.importTitle = this.$t("uexpressProduct.importAreaDetail")
      this.batchImportVisible = true
      this.importForm = {
        areaProductExcel: []
      }
		},
    batchImportFn() {
      this.importRow = {}
      this.importTitle = this.$t("uexpressProduct.batch_import")
      this.batchImportVisible = true
      this.importForm = {
        areaProductExcel: []
      }
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            areaType: 1,
            ...this.importForm
          }
          data.areaProductExcel = data.areaProductExcel[0]
          let fn = null
          if (this.importRow.id) {
            fn = importProductAreaDetailApi
            data.areaId = this.importRow.id
          } else {
            fn = importProductAreaListApi
          }
          importProductAreaListApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressProduct.import_oper_success'))
            }
          })
        }
      })
    }
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
