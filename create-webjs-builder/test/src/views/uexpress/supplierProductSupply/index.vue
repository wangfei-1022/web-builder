<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressProduct.keyword")' prop="keyword">
							<el-input v-model="formData.keyword" type="text" size="mini" clearable @keyup.enter.native="list" :placeholder='$t("uexpressProduct.supplier_name_placeholder")'/>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.supplier")' prop="supplierId">
              <type-select
                v-model="formData.supplierId"
                type="supplier"
                @selected="list"
                :requestParams="{partnerRole: 17011}" >
              </type-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.state")' prop="productState">
							<el-select v-model="formData.productState" size="mini" @change="list">
								<el-option :label="$t('customerManage.ALL')" value="" />
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

    <el-dialog :visible.sync="addVisible" v-if="addVisible" :close-on-click-modal="false" :append-to-body="true" width="500px" :title="addOrEditTitle">
      <el-form class="contact-form" ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="120px" size="mini">
        <el-form-item :label='$t("uexpressProduct.supplier")' prop="supplierId">
          <type-select
            v-model="addForm.supplierId"
            type="supplier"
            @selected="supplierSelect"
            :requestParams="{partnerRole: 17011}"
            :defaultDisplay="supplierDefaultDisplay" >
            </type-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.supplier_product_code")' prop="productCode">
           <el-input v-model="addForm.productCode"></el-input>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.supplier_product_name")' prop="productName">
           <el-input v-model="addForm.productName"></el-input>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.supplier_product_desc")' prop="productDesc">
           <el-input v-model="addForm.productDesc"></el-input>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.remark")' prop="remarks">
          <el-input type="textarea" v-model="addForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="addVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" :loading="addLoading" @click="addConfirm">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import {
  supplierProductSupplyListApi,
  supplierProductSupplyAddApi,
  supplierProductSupplyUpdateApi,
  supplierProductSupplyForbiddenApi,
  supplierProductSupplyActivateApi
 } from "@/api/uexpress/supplierProductSupply";
 import { getDictListApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import optionBtn from "./optionBtn";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "ProductAreaList",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
		return {
      addLoading: false,
      addVisible: false,
      addOrEditTitle: '',
      supplierDefaultDisplay: [],
      addForm: {
        supplierId: '',
        productCode: '',
        productType: 2, // 默认尾程
        productName: '',
        productDesc: '',
        remarks: ''
      },
      addFormRules: {
        supplierId: [{required: true,	message: this.$t("common.cannot_be_null")}],
        productCode: [{required: true,	message: this.$t("common.cannot_be_null")}],
        productName: [{required: true,	message: this.$t("common.cannot_be_null")}]
      },
			formData: {
				keyword: "",
				productState: "",
        supplierId: ''
			},
			statusList: [],
			productStateList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [
				{
					field: "index",
					headerName: this.$t("uexpressProduct.seq"),
					minWidth: 80
				},
				{
					field: "supplierName",
					headerName: this.$t("uexpressProduct.supplier_name"),
					minWidth: 150
				},
				{
					field: "productCode",
					headerName: this.$t("uexpressProduct.supplier_product_code"),
					minWidth: 150
				},
				{
					field: "productName",
					headerName: this.$t("uexpressProduct.supplier_product_name"),
					minWidth: 200
				},
				{
					field: "productDesc",
					headerName: this.$t("uexpressProduct.supplier_product_desc"),
					minWidth: 200
				},
				{
					field: "productStateName",
					headerName: this.$t("uexpressProduct.remark"),
					minWidth: 100
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
					headerName: this.$t("customerManage.operation"),
					cellRendererFramework: "optionBtn",
					minWidth: 100,
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
			loading: false
		};
	},
	created() {
		this.list();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getDictListApi(3)]).then(results => {
				const productStateRes = results[0];
				if (productStateRes.ok) {
					this.productStateList = productStateRes.content;
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
			const res = await supplierProductSupplyListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v, index) {
          v.index = index + 1
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
      this.addForm = {
        supplierId: '',
        productCode: '',
        productType: 2, // 默认尾程
        productName: '',
        productDesc: '',
        remarks: ''
      }
      this.addOrEditTitle = this.$t("uexpressProduct.add")
      this.addVisible = true
      this.supplierDefaultDisplay = []
		},
    editFn(item) {
      this.addForm = {
        ...item
      }
      this.addOrEditTitle = this.$t("uexpressProduct.edit")
      this.supplierDefaultDisplay = [{
        id: item.supplierId,
        chineseName: item.supplierName
      }]
      this.addVisible = true
    },
    supplierSelect(item) {
      this.addForm.supplierId = item.id
      this.addForm.supplierName = item.chineseName
    },
    addConfirm() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.addLoading = true
          let fn = this.addForm.productId ? supplierProductSupplyUpdateApi : supplierProductSupplyAddApi
          let msg = this.addForm.productId ? this.$t("uexpressProduct.edit_success") : this.$t("uexpressProduct.add_success")
          fn(this.addForm).then(res => {
            if (res.ok) {
              this.$message.success(msg)
              this.addVisible = false
              this.list()
            }
            this.addLoading = false
          }).catch(() => {
            this.addLoading = false
          })
        }
      })
    },
    ableFn(item, flag) {
      let successMsg = flag ? this.$t("uexpressProduct.enabled_success") : this.$t("uexpressProduct.disabled_success")
      let confirmMsg = flag ? this.$t("uexpressProduct.enabled_info_confirm") : this.$t("uexpressProduct.disabled_info_confirm")
      let fn = flag ? supplierProductSupplyActivateApi : supplierProductSupplyForbiddenApi
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
