<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="getList" :resetFun="reset">
			<template slot="multipleSearch">
				<div class="multiple-form-wrap">
					<el-form ref="formData" :inline="true" :model="formData" label-width="100px">
						<el-form-item :label='$t("uexpressProduct.supplier")' prop="supplierId">
							<type-select v-model="formData.supplierId" type="supplier" :requestParams="{partnerRole: 17011}" />
						</el-form-item>
					</el-form>
				</div>
			</template>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="addFn">{{$t("uexpressProduct.add")}}</el-button>
      </div>
      <el-table
        class="yht-table yht-aggird-table"
        :data="dataList"
        :height="tableHeight"
        style="width: 100%;"
        row-key="id"
        border
        size="mini"
        lazy
        :load="loadFn"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
        <el-table-column fixed="left" type="selection" width="40" />
        <el-table-column prop="countryName" :label='$t("uexpressProduct.countryName")' min-width="110"></el-table-column>
        <el-table-column prop="supplierName" :label='$t("uexpressProduct.supplier")' min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="productName" :label='$t("uexpressProduct.supplier_product")' min-width="180"></el-table-column>
        <el-table-column prop="weightRuleTypeName" :label='$t("uexpressProduct.weightRuleTypeName")' min-width="180"></el-table-column>
        <el-table-column prop="effectiveDate" :label='$t("uexpressProduct.effectiveDate")' min-width="160">
          <template slot-scope="{row}">
            <span>{{row.effectiveDate | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" :label='$t("uexpressProduct.create_by_name")' min-width="130"></el-table-column>
        <el-table-column prop="createTime" :label='$t("uexpressProduct.create_by_time")' min-width="160">
          <template slot-scope="{row}">
            <span>{{row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oper" :label='$t("uexpressProduct.operation")' min-width="130" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="editFn(row)">{{$t("uexpressProduct.edit")}}</el-button>
            <el-button type="text" size="mini" @click="adjustFn(row)">{{$t("uexpressProduct.addVersion")}}</el-button>
            <el-button type="text" size="mini" @click="deleteFn(row)">{{$t("uexpressProduct.delete")}}</el-button>
          </template>
        </el-table-column>

      </el-table>
			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>

    <el-dialog :visible.sync="addVisible" :close-on-click-modal="false" width="950px" :title='addTitle'>
      <el-form ref="addFormRef" v-if="addVisible" :model="addForm" :rules="addFormRule" label-width="120px" size="mini">
        <el-form-item :label='$t("uexpressProduct.supplier")' prop="supplierId">
          <type-select
            v-model="addForm.supplierId"
            type="supplier"
            @selected="supplierSelect"
            :requestParams="{partnerRole: 17011}"
            :defaultDisplay="[{id: addForm.supplierId, chineseName: addForm.supplierName}]"
            :disabled="!!addForm.id"
          />
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.supplier_product")' prop="productCode">
          <el-select v-model="addForm.productCode" size="mini" style="width: 100%" filterable :disabled="!!addForm.id">
            <el-option v-for="item in supplierProductList" :key="item.productCode" :label="item.productName" :value="item.productCode"/>
          </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.countryName")' prop="countryCode">
          <base-select v-model="addForm.countryCode" type="country" filterable :disabled="!!addForm.id" />
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.effectiveDate")' prop="effectiveDate">
          <common-picker v-model="addForm.effectiveDate" pikcer-type="date" pickerFormat="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.weightRuleTypeName")' prop="weightRuleType">
          <el-radio-group v-model="addForm.weightRuleType">
            <el-radio :label="item.code" v-for="(item,index) in rulesList" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label='$t("uexpressProduct.weightRuleExpandTypeName")' prop="weightRuleExpandType" v-if="addForm.weightRuleType === 5">
          <el-select v-model="addForm.weightRuleExpandType" size="mini" style="width: 100%" >
            <el-option v-for="item in weightRuleExpandList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="addVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" :loading="addFormLoading" @click="addConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { getSupplierWeightRuleListApi, addSupplierWeightRuleApi, addVersionSupplierWeightRuleApi, updateSupplierWeightRuleApi, deleteSupplierWeightRuleApi } from "@/api/uexpress/payableSupplierChargeableWeightRule";
import { getDictListApi, getSupplierProductByApi } from "@/api/uexpress/base";
import { AgGridVue } from "ag-grid-vue";
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
	name: "UexpressPayableSupplierChargeableWeightRule",
	components: {
		AgGridVue
	},
	data() {
		return {
			formData: {
				keyword: "",
        supplierId: "",
				areaState: ""
			},
			rulesList: [],
			areaStateList: [],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			columnFields: [
				{
					field: "countryName",
					headerName: this.$t("uexpressProduct.countryName"),
					minWidth: 100
				},
				{
					field: "supplierName",
					headerName: this.$t("uexpressProduct.supplier"),
					minWidth: 200
				},
				{
					field: "productName",
					headerName: this.$t("uexpressProduct.supplier_product"),
					minWidth: 200
				},
        {
					field: "weightRuleTypeName",
					headerName: this.$t("uexpressProduct.weightRuleTypeName"),
					minWidth: 80
				},
        {
					field: "weightRuleExpandTypeName",
					headerName: this.$t("uexpressProduct.weightRuleExpandTypeName"),
					minWidth: 80
				},
        {
					field: "effectiveDate",
					headerName: this.$t("uexpressProduct.effectiveDate"),
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
			loading: false,

      weightRuleExpandList: [],
      addType: '',
      supplierProductList: [],
      addTitle: '',
      addFormLoading: false,
      addVisible: false,
      addForm: { },
      addFormRule: {
        supplierId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        countryCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        weightRuleType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveDate: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        weightRuleExpandType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
    this.getBaseDataFn()
		this.getList();
    this.addFormInit()
	},
	methods: {
		onReady(params) {
			params.api.sizeColumnsToFit();
			window.addEventListener("resize", function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
    getBaseDataFn() {
      getDictListApi(43).then(res => {
        if (res.ok) {
          this.rulesList = res.content
        }
      })
      getDictListApi(45).then(res => {
        if (res.ok) {
          this.weightRuleExpandList = res.content
        }
      })
    },
    addFormInit() {
      this.addForm = {
        supplierId: '',
        productCode: '',
        countryCode: '',
        weightRuleType: '',
        weightRuleExpandType: '',
        effectiveDate: '',
        remarks: ''
      }
    },
    adjustFn(row) {
      this.addForm = {
        id: row.id,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        productCode: row.productCode,
        countryCode: row.countryCode,
        weightRuleType: Number(row.weightRuleType),
        weightRuleExpandType: Number(row.weightRuleExpandType),
        effectiveDate: row.effectiveDate,
        remarks: row.remarks
      }
      this.getSupplierProduct(row.supplierId)
      this.addVisible = true
      this.addType = 'ADJUST'
      this.addTitle = this.$t("uexpressProduct.addVersion")
    },
    editFn(row) {
      this.addForm = {
        id: row.id,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        productCode: row.productCode,
        countryCode: row.countryCode,
        weightRuleType: Number(row.weightRuleType),
        weightRuleExpandType: Number(row.weightRuleExpandType),
        effectiveDate: row.effectiveDate,
        remarks: row.remarks
      }
      this.getSupplierProduct(row.supplierId)
      this.addVisible = true
      this.addType = 'EDIT'
      this.addTitle = this.$t("uexpressProduct.edit")
    },
    addFn() {
      this.addFormInit()
      this.addVisible = true
      this.addType = 'ADD'
      this.addTitle = this.$t("uexpressProduct.add")
		},
    getSupplierProduct(supplierId) {
      getSupplierProductByApi({ supplierId: supplierId }).then(res => {
        if (res.ok) {
          this.supplierProductList = res.content
        }
      })
    },
    supplierSelect(item) {
      this.addForm.supplierId = item.id
      this.supplierProductList = []
      this.addForm.productCode = ''
      if (item.id) {
        this.getSupplierProduct(item.id)
      }
    },
    addConfirmFn() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.addForm
          }
          this.addFormLoading = true
          let fn = null
          if (this.addType === 'ADJUST') {
            fn = addVersionSupplierWeightRuleApi
            data.weightRuleId = data.id
          } else if (this.addType === 'EDIT') {
            fn = updateSupplierWeightRuleApi
          } if (this.addType === 'ADD') {
            fn = addSupplierWeightRuleApi
          }
          fn(data).then(res => {
            if (res.ok) {
              this.addVisible = false
              this.getList()
              this.$message.success('操作成功')
            }
            this.addFormLoading = false
          })
        }
      })
    },
    deleteFn(row) {
      this.$confirm(this.$t("uexpressProduct.deleteInfo"), this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true
        let data = {
          weightRuleVersionId: row.id
        }
        deleteSupplierWeightRuleApi(data).then(res => {
          if (res.ok) {
            this.getList()
            this.$message.success(this.$t("uexpressProduct.operSuccess"));
          }
          this.loading = false
        });
      }).catch(() => { });
    },
		async getList() {
			this.loading = true;
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum,
        areaType: 1 // 1 计费分区 2 路由分区
			};
			const res = await getSupplierWeightRuleListApi(params);
			if (res.ok) {
				res.content.list.forEach(function (v) {
          let arr = []
          v.historyWeightRules.forEach(item => {
            // 过滤出当前这条父级数据
            if (v.id !== item.id) {
              arr.push(v)
            }
          })
          v.hasChildren = arr.length > 0
				});
				this.total = parseInt(res.content.total, 10);
				this.dataList = []
				this.$nextTick(() => {
					this.dataList = res.content.list
				})
			} else {
				this.total = 0;
				this.dataList = [];
			}
			this.loading = false;
		},
    loadFn(tree, treeNode, resolve) {
      let arr = []
      tree.historyWeightRules.forEach(v => {
        v.isChildren = true
        // 过滤出当前这条父级数据
        if (v.id !== tree.id) {
          arr.push(v)
        }
      })
      resolve(arr)
		},
		reset() {
			this.$refs.formData.resetFields();
			this.getList();
		}
	}
};
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}
</style>
