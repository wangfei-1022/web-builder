<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            <!--基本信息-->
            {{$t("uexpressPriceCard.baseInfo")}}
            <i class="icon-oper el-icon-edit" @click="editBaseFn" v-if="!isEditBase"></i>
            <i class="icon-oper el-icon-circle-check" @click="saveBaseFn" v-if="isEditBase"></i>
          </div>
					<div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.customerName")}}：</span>
              <span class="info-span">{{form.customerName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.offerName")}}：</span>
              <span class="info-span">{{form.offerName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.offerStateName")}}：</span>
              <span class="info-span">{{form.offerStateName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.currency")}}：</span>
              <span class="info-span">{{form.currency}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.unitGroup")}}：</span>
              <span class="info-span">{{form.unitGroupName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.offerNo")}}：</span>
              <span class="info-span">{{form.offerNo}}</span>
            </div>
					</div>
          <div class="info-content" v-if="!isEditBase">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.effectiveDateFrom")}}：</span>
              <span class="info-span">{{form.effectiveDateFrom | parseTime}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.effectiveDateTo")}}：</span>
              <span class="info-span">{{form.effectiveDateTo | parseTime}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.remarks")}}：</span>
              <span class="info-span">{{form.remarks}}</span>
            </div>
					</div>
          <div class="info-content" v-if="isEditBase">
            <el-form-item :label='$t("uexpressPriceCard.effectiveDateFrom")' prop="effectiveDateFrom">
              <CommonPicker v-model="form.effectiveDateFrom" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.effectiveDateTo")' prop="effectiveDateTo">
              <CommonPicker v-model="form.effectiveDateTo" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.remarks")' prop="remarks" class="full-line">
							<el-input v-model="form.remarks" type="textarea"></el-input>
						</el-form-item>
          </div>
				</div>
			</el-form>

      <div class="info-section-module">
        <div class="info-title">
          <!--客户产品线路信息-->
          <span>{{$t("uexpressPriceCard.customerProductInfo")}}</span>
        </div>
        <div class="info-content">
          <el-table :data="offerDetails" style="width: 100%" border>
            <el-table-column prop="productName" :label='$t("uexpressPriceCard.productName")'></el-table-column>
            <el-table-column prop="destinationCountryName" :label='$t("uexpressPriceCard.destinationCountry")' ></el-table-column>
            <el-table-column prop="templateName" :label='$t("uexpressPriceCard.templateCode")'></el-table-column>
            <el-table-column prop="bulkyModulus" :label='$t("uexpressPriceCard.bulkyModulus")'></el-table-column>
          </el-table>
        </div>
      </div>

      <div class="info-section-module">
        <div class="info-title">
          <!--费用项报价信息-->
          <span>{{$t("uexpressPriceCard.feeItemPriceInfo")}}</span>
        </div>
        <div class="info-content">
          <price-edit :detail="detail" ref="priceEidt" ></price-edit>
        </div>
      </div>

			<div class="page-edit-footer">
				<el-button size="mini" @click="backList">{{$t("common.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading">{{$t("common.submit")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import {
  createOfferCustomerApi,
  updateOfferCustomerApi,
  createOfferCustomerSalesApi,
  updateOfferCustomerSalesApi,
  updatePriceOfferCustomerApi,
  getDetailOfferCustomerApi } from "@/api/uexpress/priceCardCustomer";
import { getDictListApi } from "@/api/uexpress/base";
import { getCurrenciesListApi } from "@/api/common";
import { getCountryListApi } from '@/api/country'
import PriceEdit from './PriceEdit'

export default {
	name: "ChargeTemplateReceiptAddAndEdit",
	components: {
    PriceEdit
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
      isEditBase: false,
      origin: '',
			offerVersionId: "",
      charges: [],
			form: {
        customerId: '',
        customerName: '',
        offerName: '',
        offerNo: '',
        effectiveDateFrom: '',
        effectiveDateTo: '',
        currency: 'CNY',
        unitGroup: '',
        unitGroupName: '',
				remarks: "",

        offerStateName: '',
        version: ''
			},
			formRule: {
				customerId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        offerName: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveDateFrom: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveDateTo: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        currency: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        unitGroup: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
      offerDetails: [],
			loading: false,
      currencyList: [],
      unitGroupList: [],
      countryList: [],
      detail: {}
		};
	},
	created() {
    this.offerVersionId = this.$route.query.offerVersionId
    this.origin = this.$route.query.origin
    this.role = this.$route.query.role
    if (this.offerVersionId) {
      this.getDetail()
    }
		this.getBaseDataFn();
	},
	methods: {
    editBaseFn() {
      this.isEditBase = true
    },
    saveBaseFn() {
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            ...this.form,
            offerDetails: this.offerDetails,
            offerVersionId: this.offerVersionId
          }
					this.loading = true;
          let fn = null
          if (this.role === 'SALE') {
            fn = this.offerVersionId ? updateOfferCustomerSalesApi : createOfferCustomerSalesApi
          } else {
            fn = this.offerVersionId ? updateOfferCustomerApi : createOfferCustomerApi
          }
					fn(data).then(res => {
						if (res.ok) {
							let msg = this.offerVersionId ? this.$t("uexpressPriceCard.updateSuccess") : this.$t("uexpressPriceCard.addSuccess");
							this.$message.success(msg);
							this.isEditBase = false
						}
						this.loading = false;
					});
				} else {
					this.mixinsFormScrollIntoView();
				}
			});
    },
    getDetail() {
      getDetailOfferCustomerApi(this.offerVersionId).then(res => {
        if (res.ok) {
          Object.keys(this.form).forEach(v => {
            this.form[v] = res.content[v]
          })
          this.form.effectiveDateFrom = res.content.effectiveDateBegin
          this.form.effectiveDateTo = res.content.effectiveDateEnd
          this.form.version = 'V' + this.form.version
          this.charges = res.content.charges
          this.offerDetails = res.content.customerProducts
          this.detail = res.content
        }
      })
    },
		getBaseDataFn() {
			Promise.all([getCurrenciesListApi(), getDictListApi(32), getCountryListApi()]).then(results => {
				const currencyRes = results[0];
        const unitGroupRes = results[1];
        const countryRes = results[2];
				if (currencyRes.ok) {
					this.currencyList = currencyRes.content;
				}
        if (unitGroupRes.ok) {
					this.unitGroupList = unitGroupRes.content;
				}
        if (countryRes.ok) {
          this.countryList = countryRes.content
        }
			});
		},
		onSubmit() {
      let VLAID = this.$refs.priceEidt.validate()
      if (!VLAID) {
        return false
      }
      let data = {
        offerVersionId: this.offerVersionId,
        charges: []
      }
      data.charges = this.$refs.priceEidt.getValue()
      this.loading = true;
      updatePriceOfferCustomerApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("uexpressPriceCard.updatePriceSuccess"));
          this.backList();
        }
        this.loading = false;
      })
		},
		backList() {
			if (this.origin) {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ name: this.origin });
      }
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
