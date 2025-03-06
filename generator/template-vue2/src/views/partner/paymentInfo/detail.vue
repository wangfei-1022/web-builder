<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="custmer-detail page-edit-content">
      <div class="info-section-module">
        <div class="info-title">
          {{$t('paymentInfoManage.companyInfo')}}
        </div>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">{{$t('paymentInfoManage.supplierName')}}： </span>
            <span class="info-span">{{detail.settlementCompanyName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('paymentInfoManage.taxNum')}}： </span>
            <span class="info-span">{{detail.taxNum}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('paymentInfoManage.address')}}： </span>
            <span class="info-span">
              {{detail.address}}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t('paymentInfoManage.tel')}}： </span>
            <span class="info-span">{{detail.tel}} </span>
          </div>
        </div>
      </div>

      <div class="info-section-module">
        <div class="info-title">
          {{$t('paymentInfoManage.bankInfo')}}
          <a class="link" style="margin-left: 10px; font-weight: 500;font-size: 15px;" href="https://www.myswiftcodes.com" target="_blank">{{ $t('paymentInfoManage.swiftSearch') }}</a>
        </div>
        <div class="info-content">
          <div v-for="(item, index) in detail.bankAccounts" :key="index">
            <div class="info-item">
              <span class="info-label">{{$t('paymentInfoManage.bankName')}}： </span>
              <span class="info-span">{{item.bankName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t('paymentInfoManage.bankBranch')}}： </span>
              <span class="info-span">{{item.bankBranch}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t('paymentInfoManage.bankAddress')}}： </span>
              <span class="info-span">{{item.bankAddress}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">SWIFT CODE： </span>
              <span class="info-span">{{item.swiftCode}} </span>
            </div>
            <div class="info-item full-line" v-for="(account, index) in item.accounts" :key="index">
              <span class="info-label">{{$t('paymentInfoManage.bankAccount')}}： </span>
              <span class="info-span">{{account.bankAccount}} {{account.rechargeCurrency}}</span>
            </div>
          </div>
           <div class="info-item">
              <span class="info-label">{{$t('paymentInfoManage.paymentCertificates')}}： </span>
              <span class="info-span">
                <a :href="item.url" target="_blank" class="link" v-for="(item, index) in detail.paymentCertificates" :key="index">{{item.originFileName}}</a><br />
              </span>
            </div>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList">{{$t('common.close')}}</el-button>
    </div>
  </div>


</template>

<script>
import { partnerPaymentInfoDetailApi, partnerPaymentInfoPutApi, partnerPaymentInfoSaveApi} from "@/api/partner/paymentInfo";

export default {
	name: 'PartnerPaymentInfoView',
  components: {

  },
	data() {
    return {
      detail: {},
      loading: false,
      id: ""
    }
  },
  created() {
		this.id = this.$route.query.id
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `PartnerPaymentInfoList` })
		},
    async getDetail() {
      this.loading = true
      const res = await partnerPaymentInfoDetailApi(this.id)
      this.loading = false
      if (res.ok) {
        this.detail = res.content
      }
		}
  }
}
</script>

<style scoped lang="scss">
.info-section-module .info-item .info-label {
  width: 115px;
}
</style>
