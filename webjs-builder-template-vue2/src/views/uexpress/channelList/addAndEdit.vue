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
					<div class="info-content" v-if="type == 'ADD' || (type == 'EDIT' && isEditBase)">
						<el-form-item :label='$t("uexpressProduct.channel_code")' prop="channelCode">
							<el-input v-model="form.channelCode" :disabled="!!form.channelId"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.channel_name")' prop="channelName">
							<el-input v-model="form.channelName"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.mnemonic_code")' prop="mnemonicCode">
							<el-input v-model="form.mnemonicCode"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.channel_short_name")' prop="shortName">
							<el-input v-model="form.shortName"></el-input>
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
						<el-form-item :label='$t("uexpressProduct.predict_weight_booking")' prop="predictWeightBooking" class="full-line">
              <el-radio-group v-model="form.predictWeightBooking">
                <el-radio :label="true">{{$t("common.YES")}}</el-radio>
                <el-radio :label="false">{{$t("common.NO")}}</el-radio>
              </el-radio-group>
						</el-form-item>
						<el-form-item :label='$t("uexpressProduct.remarks_desc")' prop="remarks" class="full-line">
							<el-input v-model="form.remarks" type="textarea"></el-input>
						</el-form-item>
					</div>

          <div class="info-content" v-if="type == 'EDIT' && !isEditBase">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.channel_code")}}：</span>
              <span class="info-span">{{form.channelCode}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.channel_name")}}：</span>
              <span class="info-span">{{form.channelName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.mnemonic_code")}}：</span>
              <span class="info-span">{{form.mnemonicCode}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.channel_short_name")}}：</span>
              <span class="info-span">{{form.shortName}}</span>
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
              <span class="info-label">{{$t("uexpressProduct.predict_weight_booking")}}：</span>
              <span class="info-span">{{form.predictWeightBooking ? $t("common.YES") : $t("common.NO")}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressProduct.remarks")}}：</span
              ><span class="info-span">{{form.remarks}}</span>
            </div>
          </div>
				</div>
			</el-form>

      <div class="info-section-module" v-if="type != 'ADD'">
        <div class="info-title">
          <span>{{$t("uexpressProduct.channel_restriction")}}</span>
        </div>
        <div class="info-content">
          <restrictions
            ref="restrictionsRef"
            :type="type"
            content-type="CHANNEL"
            :restrictionsList="restrictionsList"
            :detail="form"
            @success="getDetail"
          >
          </restrictions>
        </div>
      </div>

      <div class="info-section-module" v-if="type != 'ADD'">
        <div class="info-title">
          <span>{{$t("uexpressProduct.add_service")}}</span>
        </div>
        <div class="info-content">
          <additional-services
            ref="additionalServicesRef"
            content-type="CHANNEL"
            :type="type"
            :vasesList="vasesList"
            :detail="form"
            @success="getDetail"
          >
          </additional-services>
        </div>
      </div>

      <div class="info-section-module" v-if="type != 'ADD'">
        <div class="info-title">
          <span>{{$t("uexpressProduct.address_router")}}</span>
        </div>
        <div class="info-content">
          <address-router
            ref="productLineRef"
            :lines="lines"
            :detail="form"
            v-if="form.channelId"
            @success="getDetail"
          >
          </address-router>
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
import { addChannelApi, updateChannelApi, getChannelDetailApi } from "@/api/uexpress/channelList";
import { getDictListApi, getSupplierProductByApi } from "@/api/uexpress/base";
import { getCountryListApi } from "@/api/country";
import Restrictions from '../components/Restrictions'
import AddressRouter from '../components/AddressRouter'
import AdditionalServices from '../components/AdditionalServices'

export default {
	name: "UexpressChannelListAddAndEdit",
	components: {
    Restrictions,
    AddressRouter,
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
        channelId: "",
				channelCode: "",
				channelName: "",
				productType: "",
        shortName: '',
        supplierId: '',
        supplierName: '',
        mnemonicCode: '',
        productId: '',
        productCode: '',
        productName: '',
        predictWeightBooking: true, // checkbox 和 此处场景 取反值
				remarks: ""
			},
			formRule: {
				channelCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        channelName: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        supplierId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			loading: false,
      productTypeList: [],
      supplierDefaultDisplay: [],
      supplierProductList: [],
      restrictionsList: [], // 约束列表
      vasesList: [], // 附加服务
      lines: [] // 地址路由
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
      getChannelDetailApi(this.id).then(res => {
        if (res.ok) {
          // 附加进去 全量保存的时候带回去的
          res.content.vaseCodes = []
          res.content.vases.forEach(v => {
            res.content.vaseCodes.push(v.vasCode)
          })
          this.form = {
            ...res.content
          }
          this.restrictionsList = res.content.restrictions || []
          this.vasesList = res.content.vases || []
          this.lines = res.content.lines || []

          let supplierItem = {
            id: res.content.supplierId,
            chineseName: res.content.supplierName
          }
          this.supplierDefaultDisplay = [supplierItem]
          this.supplierSelect(supplierItem)
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
    productChange() {
      this.supplierProductList.forEach(v => {
        if (v.productId === this.form.productId) {
          this.form.productCode = v.productCode
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
          }
        })
      } else {
        this.supplierProductList = []
      }
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
					updateChannelApi(data).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("uexpressProduct.edit_success"));
              this.isEditBase = false
              this.getDetail()
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
          let fn = data.id ? updateChannelApi : addChannelApi
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
			this.$router.push({ name: `UexpressChannelList` });
		}
	}
};
</script>
<style scoped lang="scss">
.info-section-module .info-item .info-label {
  width: 120px
}
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
