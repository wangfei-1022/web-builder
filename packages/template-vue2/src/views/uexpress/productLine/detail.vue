<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressProduct.base_info")}}
            <i class="icon-oper el-icon-edit" @click="editBaseFn" v-if="type == 'EDIT' && !isEditBase"></i>
            <i class="icon-oper el-icon-circle-check" @click="saveBaseFn" v-if="type == 'EDIT' && isEditBase"></i>
          </div>

          <div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.product_code")}}：</span>
              <span class="info-span">{{form.productCode}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.product_name")}}：</span>
              <span class="info-span">{{form.productName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.product_type")}}：</span>
              <span class="info-span">{{form.productTypeName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.mnemonic_code")}}：</span>
              <span class="info-span">{{form.mnemonicCode}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.product_short_name")}}：</span>
              <span class="info-span">{{form.shortName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.state")}}：</span>
              <span class="info-span">{{form.productStateName}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t("uexpressProduct.product_desc")}}：</span>
              <span class="info-span">{{form.productDesc}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t("uexpressProduct.remarks")}}：</span>
              <span class="info-span">{{form.remarks}}</span>
            </div>
          </div>
				</div>
			</el-form>

      <div class="info-section-module" v-if="type != 'ADD'">
        <div class="info-title">
          <span>{{$t("uexpressProduct.product_restriction")}}</span>
        </div>
        <div class="info-content">
          <restrictions ref="restrictionsRef" type="DETAIL" content-type="PRODUCT" :restrictionsList="restrictionsList" :detail="form"></restrictions>
        </div>
      </div>

      <div class="info-section-module" v-if="type != 'ADD'">
        <div class="info-title">
          <span>{{$t("uexpressProduct.add_service")}}</span>
        </div>
        <div class="info-content">
          <additional-services ref="additionalServicesRef" content-type="PRODUCT" type="DETAIL" :vasesList="vasesList" :detail="form"></additional-services>
        </div>
      </div>

      <div class="info-section-module" v-if="type != 'ADD'">
        <div class="info-title">
          <span>{{$t("uexpressProduct.product_line")}}</span>
        </div>
        <div class="info-content">
          <product-line ref="productLineRef" type="DETAIL" :detail="form"></product-line>
        </div>
      </div>

			<div class="page-edit-footer" v-if="type == 'ADD'">
				<el-button size="mini" @click="backList">{{$t("common.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading">{{$t("common.submit")}}</el-button>
			</div>

      <div class="page-edit-footer">
				<el-button size="mini" @click="backList">{{$t("common.close")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import {
  addProductSalesApi,
  updateProductSalesApi,
  getProductSalesDetailApi
 } from "@/api/uexpress/productSales";
 import { getDictListApi } from "@/api/uexpress/base";
import { getCountryListApi } from "@/api/country";
import AreaDetail from '../components/AreaDetail'
import Restrictions from '../components/Restrictions'
import ProductLine from '../components/ProductLine'
import AdditionalServices from '../components/AdditionalServices'

export default {
	name: "ProductLineDetail",
	components: {
    AreaDetail,
    Restrictions,
    ProductLine,
    AdditionalServices
	},
  props: {
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
      isEditBase: false, // 基础信息是否处于编辑状态
			id: "",
			form: {
				productCode: "",
				productName: "",
				productType: "",
        shortName: '',
        productDesc: '',
        mnemonicCode: '',
				remarks: ""
			},
			formRule: {
				productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productName: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false,
      productTypeList: [],
      restrictionsList: [], // 约束列表
      vasesList: []
		};
	},
	created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getDetail()
    }
		this.getBaseDataFn();
	},
	methods: {
    getDetail() {
      getProductSalesDetailApi(this.id).then(res => {
        if (res.ok) {
          this.form = {
            ...res.content
          }
          this.restrictionsList = res.content.restrictions
          this.vasesList = res.content.vases
        }
      })
    },
		getBaseDataFn() {
			Promise.all([getDictListApi(4)]).then(results => {
				const productTypeRes = results[0];
				if (productTypeRes.ok) {
					this.productTypeList = productTypeRes.content;
				}
			});
		},
    editBaseFn() {
      this.isEditBase = true
    },
    saveBaseFn() {
      this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            ...this.form
          }
					this.loading = true;
					updateProductSalesApi(data).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("uexpressProduct.edit_success"));
              this.isEditBase = false
						}
						this.loading = false;
					});
				} else {
					this.mixinsFormScrollIntoView();
				}
			});
    },
		onSubmit() {
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            ...this.form
          }
					this.loading = true;
          let fn = data.id ? updateProductSalesApi : addProductSalesApi
					fn(data).then(res => {
						if (res.ok) {
							let msg = data.id ? this.$t("uexpressProduct.edit_success") : this.$t("uexpressProduct.add_success");
							this.$message.success(msg);
							this.backList();
						}
						this.loading = false;
					});
				} else {
					this.mixinsFormScrollIntoView();
				}
			});
		},
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: `ProductSalesList` });
		}
	}
};
</script>
<style scoped lang="scss">
.customer-edit {
	::v-deep .el-table th > .cell {
		color: #555;
		font-size: 15px;
	}

	::v-deep .el-form-item {
		width: 50%;
		float: left;
	}
}

.icon-oper{
  float: right;
  font-size: 22px;
  cursor: pointer;
  color: #0085ff;
}
</style>
