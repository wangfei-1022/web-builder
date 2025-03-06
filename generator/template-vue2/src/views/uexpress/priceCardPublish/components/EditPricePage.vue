<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            <!--基本信息-->
            {{$t("uexpressPriceCard.baseInfo")}}
            <i class="icon-oper el-icon-edit" @click="editBaseFn" v-if="!isEditBase"></i>
            <i class="icon-oper el-icon-circle-close" @click="cancelBaseFn" v-if="isEditBase"></i>
            <i class="icon-oper el-icon-circle-check" @click="saveBaseFn" v-if="isEditBase"></i>
          </div>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.offerNo")}}：</span>
              <span class="info-span">{{form.offerNo}}</span>
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
              <span class="info-label">{{$t("uexpressPriceCard.productName")}}：</span>
              <span class="info-span">{{form.productName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.destinationCountry")}}：</span>
              <span class="info-span">{{form.destinationCountryName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.unitGroup")}}：</span>
              <span class="info-span">{{form.unitGroupName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.version")}}：</span>
              <span class="info-span">{{form.version}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.templateCodeName")}}：</span>
              <span class="info-span">{{form.templateName}}</span>
            </div>
          </div>
          <div class="info-content detail-container" v-if="!isEditBase">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.bulkyModulus")}}：</span>
              <span class="info-span">{{form.bulkyModulus}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.effectiveDate")}}：</span>
              <span class="info-span">{{form.effectiveDate | parseTime}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.remarks")}}：</span>
              <span class="info-span">{{form.remarks}}</span>
            </div>
          </div>
					<div class="info-content" v-if="isEditBase">
						<el-form-item :label='$t("uexpressPriceCard.bulkyModulus")' prop="bulkyModulus">
							<el-input v-model="form.bulkyModulus"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.effectiveDate")' prop="effectiveDate">
              <common-picker v-model="form.effectiveDate" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.remarks")' prop="remarks" class="full-line">
							<el-input v-model="form.remarks" type="textarea"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-form>

      <div class="info-section-module">
				<div class="info-title">
          <!--费用项报价-->
          {{$t("uexpressPriceCard.feeItemPrice")}}
        </div>
				<div class="info-content">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="item.categoryName" :name="item.categoryCode" v-for="(item, index) in tabs" :key="index">
              <price-edit :templateCharges="item.templateCharges" :charges="charges" :baseForm="form" :ref="`priceEidt${index}`"></price-edit>
            </el-tab-pane>
          </el-tabs>
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
import { createOfferPublishApi, updateOfferPublishApi, getDetailOfferPublishApi, updatePriceOfferPublishApi } from "@/api/uexpress/priceCardPublish";
import { getDictListApi } from "@/api/uexpress/base";
import { getCurrenciesListApi } from "@/api/common";
import { getCountryListApi } from '@/api/country'
import PriceEdit from './PriceEditTab'

export default {
	name: "UexpressPriceCardPublishReceiptEditPrice",
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
      detail: {},
      isEditBase: false,
      origin: '',
			offerVersionId: "",
			form: {
        offerNo: '',
        offerName: '',
        offerStateName: '',
        productCode: '',
        productName: '',
        currency: '',
        destinationCountryCode: '',
        destinationCountryName: '',
        unitGroup: '',
        unitGroupName: '',
        templateNo: '',
        templateName: '',
        bulkyModulus: '',
        effectiveDate: '',
        remarks: '',
        version: ''
			},
			formRule: {
				offerName: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        destinationCountryCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        templateNo: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        bulkyModulus: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveDate: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
      templateCharges: [],
			loading: false,
      countryList: [],


      //
      activeName: '',
      tabs: [],
      charges: []
		};
	},
	created() {
    this.offerVersionId = this.$route.query.offerVersionId
    this.origin = this.$route.query.origin
    if (this.offerVersionId) {
      this.getDetail()
    }
		this.getBaseDataFn();
	},
	methods: {
    cancelBaseFn() {
      this.isEditBase = false
      Object.keys(this.form).forEach(v => {
        this.form[v] = this.detail[v]
      })
    },
    editBaseFn() {
      this.isEditBase = true
    },
    saveBaseFn() {
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            ...this.form,
            offerVersionId: this.offerVersionId
          }
					this.loading = true;
          let fn = this.offerVersionId ? updateOfferPublishApi : createOfferPublishApi
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
      getDetailOfferPublishApi(this.offerVersionId).then(res => {
        if (res.ok) {
          this.detail = res.content
          Object.keys(this.form).forEach(v => {
            this.form[v] = res.content[v]
          })
          this.form.version = 'V' + this.form.version
          this.form.effectiveDate = res.content.effectiveDateBegin
          let tabs = res.content.templateChargeCategorys
          this.charges = res.content.charges
          if (tabs.length > 0) {
            this.activeName = tabs[0].categoryCode
            this.tabs = tabs
          }
        }
      })
    },
		getBaseDataFn() {
			Promise.all([getCountryListApi()]).then(results => {
				const countryLRes = results[0];
				if (countryLRes.ok) {
					this.countryList = countryLRes.content;
				}
			});
		},
		onSubmit() {
      let data = {
        offerVersionId: this.offerVersionId,
        charges: []
      }

      // 增加校验
      let valid = true
      let arr = Object.keys(this.$refs)
      for (let i = 0, len = arr.length; i < len;i++) {
        let v = arr[i]
        if (v.indexOf('priceEidt') >= 0) {
          let check = this.$refs[v][0].validate()
          if (!check) {
            valid = false
            break;
          }
        }
      }
      if (!valid) {
        return
      }

      Object.keys(this.$refs).forEach(v => {
        if (v.indexOf('priceEidt') >= 0) {
          let partCharges = this.$refs[v][0].getValue()
          data.charges = data.charges.concat(partCharges)
        }
      })
      this.loading = true;
      updatePriceOfferPublishApi(data).then(res => {
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
