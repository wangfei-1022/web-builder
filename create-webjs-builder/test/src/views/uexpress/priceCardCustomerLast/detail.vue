<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<div class="info-section-module">
        <div class="info-title">
          <!--基本信息-->
          {{$t("uexpressPriceCard.baseInfo")}}
        </div>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.customerName")}}：</span>
            <span class="info-span">{{form.customerName}}</span>
          </div>
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
            <span class="info-span status">{{form.offerStateName}}</span>
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
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.bulkyModulus")}}：</span>
            <span class="info-span">{{form.bulkyModulus}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.effectiveDate")}}：</span>
            <span class="info-span">{{form.effectiveDate | parseTime}}</span>
          </div>
          <div class="info-item full-line">
            <span class="info-label">{{$t("uexpressPriceCard.remarks")}}：</span>
            <span class="info-span">{{form.remarks}}</span>
          </div>
        </div>
      </div>

      <div class="info-section-module">
				<div class="info-title">
          {{$t("uexpressPriceCard.feeItemPrice")}}
        </div>
				<div class="info-content">
          <el-tabs v-model="activeName">
            <el-tab-pane :label="item.categoryName" :name="item.categoryCode" v-for="(item, index) in tabs" :key="index">
              <price-edit :templateCharges="item.templateCharges" :charges="charges" :baseForm="form" :ref="`priceEidt${index}`" :isDetail="true"></price-edit>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

			<div class="page-edit-footer">
				<el-button size="mini" plain primary @click="backList">{{$t("common.close")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { createOfferCustomerLastApi, updateOfferCustomerLastApi, getDetailOfferCustomerLastApi, updatePriceOfferCustomerLastApi } from "@/api/uexpress/priceCardCustomerLast";
import { getDictListApi } from "@/api/uexpress/base";
import { getCurrenciesListApi } from "@/api/common";
import { getCountryListApi } from '@/api/country'
import PriceEdit from '@/views/uexpress/priceCardPublish/components/PriceEditTab'

export default {
	name: "UexpressPriceCardCustomerLastReceiptDetail",
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
      origin: '',
			offerVersionId: "",
			form: {},

      templateCharges: [],
			loading: false,
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
	},
	methods: {
    getDetail() {
      getDetailOfferCustomerLastApi(this.offerVersionId).then(res => {
        if (res.ok) {
          this.form = {
            ...res.content
          }
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
.status {
  font-weight: 700;
  color: #ff7600;
}
</style>
