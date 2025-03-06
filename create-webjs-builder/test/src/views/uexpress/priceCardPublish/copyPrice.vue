<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
      <div>
        <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
          <div class="info-section-module">
            <div class="info-title">
              <!--基本信息-->
              {{$t("uexpressPriceCard.baseInfo")}}
            </div>
            <div class="info-content">
              <el-form-item :label='$t("uexpressPriceCard.offerName")' prop="offerName">
                <el-input v-model="form.offerName" ></el-input>
              </el-form-item>
              <el-form-item :label='$t("uexpressPriceCard.productName")' prop="productCode">
                <uexpress-type-select type="productSales" v-model="form.productCode" clearable filterable />
              </el-form-item>
              <el-form-item :label='$t("uexpressPriceCard.destinationCountry")' prop="destinationCountryCode">
                <el-select v-model="form.destinationCountryCode" size="mini" style="width: 100%" filterable clearable >
                  <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
                </el-select>
              </el-form-item>
              <el-form-item :label='$t("uexpressPriceCard.templateCodeName")' prop="templateNo">
                <uexpress-type-select
                :defaultDisplay="form.templateNo ? [{templateNo: form.templateNo, templateName: form.templateName}] : []"
                type="priceTemplate"
                :requestParams="{templateTypeCode: 1, arAp: 1}"
                v-model="form.templateNo"
                clearable
                disabled
                :filterable="true" />
              </el-form-item>
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
      </div>

			<div class="page-edit-footer">
				<el-button size="mini" @click="backList">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="onSubmit" size="mini" :loading="loading">{{$t("common.nextStep")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { createOfferPublishApi, updateOfferPublishApi, getDetailOfferPublishApi, copyInitOfferPublishApi } from "@/api/uexpress/priceCardPublish";
import { getDictListApi } from "@/api/uexpress/base";
import { getCurrenciesListApi } from "@/api/common";
import { getCountryListApi } from '@/api/country'
import EditPrice from './components/EditPricePage'

export default {
	name: "UexpressPriceCardPublishReceiptCopyPrice",
	components: {
    EditPrice
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
      origin: '',
			offerVersionId: "",
			form: {
        offerName: '',
        productCode: '',
        destinationCountryCode: '',
        templateNo: '',
        templateName: '',
        bulkyModulus: '',
        effectiveDate: '',
        remarks: ''
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
      chargeAreaAllList: [],

      // 添加费用项
      chargeItemList: [],
      total: 0,
      pageSize: 50,
      pageNum: 1,
      addItemVisible: false,
      addSearchForm: {

      }
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
    getDetail() {
      getDetailOfferPublishApi(this.offerVersionId).then(res => {
        if (res.ok) {
          Object.keys(this.form).forEach(v => {
            this.form[v] = res.content[v]
            this.form.effectiveDate = res.content.effectiveDateBegin
          })
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
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            ...this.form,
            sourceOfferVersionId: this.offerVersionId
          }
					this.loading = true;
					copyInitOfferPublishApi(data).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("uexpressPriceCard.copySuccess"));
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.push({
              name: "UexpressPriceCardPublishReceiptEditPirce",
              query: {
                offerVersionId: res.content.offerVersionId,
                origin: this.origin
              }}
            );
						}
						this.loading = false;
					});
				} else {
					this.mixinsFormScrollIntoView();
				}
			});
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
</style>
