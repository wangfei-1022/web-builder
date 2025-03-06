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
            <span class="info-label">{{$t("uexpressPriceCard.offerName")}}：</span>
            <span class="info-span">{{form.offerName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.offerStateName")}}：</span>
            <span class="info-span">{{form.offerStateName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.version")}}：</span>
            <span class="info-span">{{form.version}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.effectiveDateFrom")}}：</span>
            <span class="info-span">{{form.effectiveDateFrom | parseTime}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.effectiveDateTo")}}：</span>
            <span class="info-span">{{form.effectiveDateTo | parseTime}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.currency")}}：</span>
            <span class="info-span">{{form.currency}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressPriceCard.unitGroup")}}：</span>
            <span class="info-span">{{form.unitGroupName}}</span>
          </div>
          <div class="info-item full-line">
            <span class="info-label">{{$t("uexpressPriceCard.remarks")}}：</span>
            <span class="info-span">{{form.remarks}}</span>
          </div>
        </div>
      </div>

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
          <price-edit :detail="detail" :isDetail="true"></price-edit>
        </div>
      </div>

			<div class="page-edit-footer">
				<el-button size="mini" primary plain @click="backList">{{$t("common.close")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { getDetailOfferCustomerApi } from "@/api/uexpress/priceCardCustomer";
import PriceEdit from './components/PriceEdit'

export default {
	name: "UexpressPriceCardCustomerReceiptDetail",
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

      offerDetails: [],
			loading: false,
      currencyList: [],
      unitGroupList: [],
      countryList: [],

      charges: [],
      detail: {}
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
      getDetailOfferCustomerApi(this.offerVersionId).then(res => {
        if (res.ok) {
          this.form = {
            ...res.content
          }
          this.form.version = 'V' + this.form.version
          this.form.effectiveDateFrom = res.content.effectiveDateBegin
          this.form.effectiveDateTo = res.content.effectiveDateEnd

          this.charges = res.content.charges
          this.offerDetails = res.content.customerProducts
          this.detail = res.content
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


</style>
