<template>
	<div class="page-edit-container full-page">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressProduct.base_info")}}
            <i class="icon-oper el-icon-edit" @click="editBaseFn" v-if="type == 'EDIT' && !isEditBase"></i>
            <i class="icon-oper el-icon-circle-check" @click="saveBaseFn" v-if="type == 'EDIT' && isEditBase"></i>
          </div>
					<div class="info-content" v-if="type == 'ADD' || (type == 'EDIT' && isEditBase)">
						<el-form-item :label='$t("uexpressProduct.area_code")' prop="areaCode">
							<el-input v-model="form.areaCode" :disabled="!!form.areaId"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.area_name")' prop="areaName">
							<el-input v-model="form.areaName"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.supplier")' prop="supplierId">
							<type-select
                v-model="form.supplierId"
                :defaultDisplay="supplierDefaultDisplay"
                type="supplier"
                @selected="supplierSelect"
                :requestParams="{partnerRole: 17011}"
              ></type-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.supplier_product")' prop="productId">
							<el-select v-model="form.productId" size="mini" style="width: 100%" filterable @change="productChange">
                <el-option v-for="item in supplierProductList" :key="item.productId" :label="item.productName" :value="item.productId"/>
              </el-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.remarks_desc")' prop="remarks">
							<el-input v-model="form.remarks" type="textarea"></el-input>
						</el-form-item>
					</div>

          <div class="info-content" v-if="type == 'EDIT' && !isEditBase">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.area_code")}}：</span>
              <span class="info-span">{{form.areaCode}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.area_name")}}：</span>
              <span class="info-span">{{form.areaName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.supplier")}}：</span>
              <span class="info-span">{{form.supplierName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.supplier_product")}}：</span>
              <span class="info-span">{{form.productName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.remarks_desc")}}：</span>
              <span class="info-span">{{form.remarks}}</span>
            </div>
          </div>
				</div>
			</el-form>

      <div class="info-section-module">
        <div class="info-title">
          <span>{{$t("uexpressProduct.area_detail")}}</span>
        </div>
        <div class="info-content">
          <area-detail
            ref="areaRef"
            :type="type"
            :id="id"
            :getListApi="getAreaDetailListApi"
            :addApi="addAreaApi"
            :updateApi="updateAreaApi"
            :deleteApi="deleteAreaApi"
          ></area-detail>
        </div>
      </div>

			<div class="page-edit-footer" v-if="type == 'ADD'">
				<el-button size="mini" @click="backList">{{$t("common.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading">{{$t("common.submit")}}</el-button>
			</div>

      <div class="page-edit-footer" v-if="type == 'EDIT'">
				<el-button size="mini" @click="backList">{{$t("common.close")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import {
  areaChannelListApi,
  addAreaChannelApi,
  updateAreaChannelApi,
  getAreaChannelDetailApi,
  getAreaDetailListApi,
  addAreaApi,
  updateAreaApi,
  deleteAreaApi
 } from "@/api/uexpress/channelArea";
 import { getSupplierProductByApi } from "@/api/uexpress/base";
import { getCountryListApi } from "@/api/country";
import AreaDetail from '../components/AreaDetail'

export default {
	name: "ChannelAreaAddAndEdit",
	components: {
    AreaDetail
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
      supplierDefaultDisplay: [],
			form: {
				areaCode: "",
				areaName: "",
        supplierId: '',
        supplierName: '',
        productId: '',
        productName: '',
				remarks: ""
			},
			formRule: {
				areaCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        areaName: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        supplierId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false,
      supplierProductList: [],
      countryList: [],
      areaRanges: [],
      getAreaDetailListApi: getAreaDetailListApi,
      addAreaApi: addAreaApi,
      updateAreaApi: updateAreaApi,
      deleteAreaApi: deleteAreaApi
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
      getAreaChannelDetailApi(this.id).then(res => {
        if (res.ok) {
          this.form = {
            ...res.content
          }
          let supplierItem = {
            id: res.content.supplierId,
            chineseName: res.content.supplierName
          }
          this.supplierDefaultDisplay = [supplierItem]
          getSupplierProductByApi({ supplierId: supplierItem.id }).then(res => {
            if (res.ok) {
              this.supplierProductList = res.content
            }
          })
        }
      })
    },
		getBaseDataFn() {
			Promise.all([getCountryListApi()]).then(results => {
				const countryRes = results[0];
				if (countryRes.ok) {
					this.countryList = countryRes.content;
				}
			});
		},
    productChange() {
      this.supplierProductList.forEach(v => {
        if (v.productId === this.form.productId) {
          this.form.productName = v.productName
        }
      })
    },
    supplierSelect(item) {
      this.form.supplierId = item.id
      this.form.supplierName = item.chineseName
      if (item.id) {
        getSupplierProductByApi({ supplierId: item.id }).then(res => {
          if (res.ok) {
            this.supplierProductList = res.content
            this.form.productId = ''
            this.form.productName = ''
          }
        })
      } else {
        this.supplierProductList = []
        this.form.productId = ''
        this.form.productName = ''
      }
    },
    editBaseFn() {
      this.isEditBase = true
    },
    saveBaseFn() {
      this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            ...this.form,
            areaType: 2 // 1 计费分区 2 路由分区
          }
					this.loading = true;
					updateAreaChannelApi(data).then(res => {
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
          let areaRanges = this.$refs.areaRef.getValue()
          let data = {
            ...this.form,
            areaRanges: areaRanges,
            areaType: 2 // 1 计费分区 2 路由分区
          }
					this.loading = true;
          let fn = data.id ? updateAreaChannelApi : addAreaChannelApi
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
			this.$router.push({ name: `ChannelAreaList` });
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
.info-section-module .info-item .info-label {
  width: 115px;
}
.icon-oper{
  float: right;
  font-size: 22px;
  cursor: pointer;
  color: #0085ff;
}
</style>
