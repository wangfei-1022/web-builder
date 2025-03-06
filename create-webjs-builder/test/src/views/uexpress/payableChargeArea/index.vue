<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressProduct.keyword")' prop="keyword">
							<el-input v-model="formData.keyword" type="text" size="mini" clearable @keyup.enter.native="getList" placeholder="分区编码/名称"/>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.supplier")' prop="supplierId">
							<type-select v-model="formData.supplierId" type="supplier" @selected="getList" :requestParams="{partnerRole: 17011}"
              ></type-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.state")' prop="areaState">
							<el-select v-model="formData.areaState" size="mini" @change="getList">
								<el-option :label="$t('common.ALL')" value="" />
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
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='importTitle'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressProduct.charge_area_import_template")}}</el-button>
        </div>
        <el-form-item label='excel' prop="areaChannelExcel">
          <upload-file v-model="importForm.areaChannelExcel" accept=".xls,.xlsx" />
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
import { 
  areaChannelListApi,
  areaChannelActivateApi, 
  areaChannelForbiddenApi, 
  importChannelAreaListApi, 
  importChannelAreaDetailApi,
  deleteChannelAreaApi 
} from "@/api/uexpress/channelArea";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import optionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UexpressChargeAreaPayable",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		return {
			formData: {
				keyword: "",
        supplierId: "",
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
					field: "supplierName",
					headerName: this.$t("uexpressProduct.supplier"),
					minWidth: 200
				},
				// {
				// 	field: "productName",
				// 	headerName: this.$t("uexpressProduct.supplier_product"),
				// 	minWidth: 200
				// },
        {
					field: "areaStateName",
					headerName: this.$t("uexpressProduct.state"),
					minWidth: 80
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
        areaChannelExcel: []
      },
      importFormRule: {
        areaChannelExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },
      importRow: {},
      importTitle: ''
		};
	},
	created() {
		this.getList();
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
		onReady(params) {
			params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},

    addFn() {
      this.$router.push({ name: "UexpressChargeAreaPayableAdd"});
		},
    edit(item) {
			this.$router.push({
				name: "UexpressChargeAreaPayableEdit",
				query: {
					id: item.areaId
				}
			});
		},
		async getList() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum,
        areaType: 1 // 1 计费分区 2 路由分区
			};
			const res = await areaChannelListApi(params);
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
    ableFn(item, flag) {
      let successMsg = flag ? this.$t("uexpressProduct.enabled_success") : this.$t("uexpressProduct.disabled_success")
      let confirmMsg = flag ? this.$t("uexpressProduct.enabled_info_confirm") : this.$t("uexpressProduct.disabled_info_confirm")
      let fn = flag ? areaChannelActivateApi : areaChannelForbiddenApi
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
            this.getList()
          }
        })
      }).catch(() => {})
    },
    deleteFn(row) {
      this.$confirm(this.$t("uexpressProduct.deleteInfo"), this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true
        let data = {
          areaId: row.areaId
        }
        deleteChannelAreaApi(data).then(res => {
          if (res.ok) {
            this.getList()
            this.$message.success(this.$t("uexpressProduct.operSuccess"));
          }
          this.loading = false
        });
      }).catch(() => { });
    },
		reset() {
			this.$refs.formData.resetFields();
			this.getList();
		},
    downloadTemplateFn() {
      getTemplateFileApi(5).then(res => {
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
        areaChannelExcel: []
      }
		},
    batchImportFn() {
      this.importRow = {}
      this.importTitle = this.$t("uexpressProduct.batch_import")
      this.batchImportVisible = true
      this.importForm = {
        areaChannelExcel: []
      }
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm,
            areaType: 1 // 1 计费分区 2 路由分区
          }
          data.areaChannelExcel = data.areaChannelExcel[0]
          let fn = null
          if (this.importRow.id) {
            fn = importChannelAreaDetailApi
            data.id = this.importRow.id
          } else {
            fn = importChannelAreaListApi
          }
          fn(data).then(res => {
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
