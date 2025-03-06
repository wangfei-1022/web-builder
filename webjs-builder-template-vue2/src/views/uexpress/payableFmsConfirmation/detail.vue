<template>
	<div class="page-edit-container full-page" v-loading="loading">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseFormRef" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressFmsCharge.baseInfo")}}
          </div>
					<div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.orderNo")}}：</span>
              <span class="info-span">{{form.orderNo}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.channelOrderNo")}}：</span>
              <span class="info-span">{{form.channelOrderNo}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.currency")}}：</span>
              <span class="info-span">{{form.currency}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.supplierName")}}：</span>
              <span class="info-span">{{form.supplierName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.supplierProductName")}}：</span>
              <span class="info-span">{{form.supplierProductName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.preWeight")}}：</span>
              <span class="info-span">{{form.preWeight}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.volumeWeight")}}：</span>
              <span class="info-span">{{form.volumeWeight}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.inboundWeight")}}：</span>
              <span class="info-span">{{form.weight}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.chargeWeight")}}：</span>
              <span class="info-span">{{form.chargeWeight}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.inboundDimensionDesc")}}：</span>
              <span class="info-span">{{form.dimension}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressFmsCharge.areaCode")}}：</span>
              <span class="info-span">{{form.areaCode}}</span>
            </div>
					</div>
				</div>
			</el-form>

      <div class="info-section-module">
        <div class="info-title">
          <span>{{$t("uexpressFmsCharge.chargeInfo")}}</span>
        </div>
        <div class="info-content">
          <el-table ref="contactTable" :data="dataList" border style="width: 100%" >
            <el-table-column prop="index" :label='$t("uexpressFmsCharge.seq")' min-width="70">
              <template slot-scope="{row, $index}">
                <span>{{$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="categoryName" :label='$t("uexpressFmsCharge.categoryName")' min-width="120"></el-table-column>
            <el-table-column prop="feeItemCode" :label='$t("uexpressFmsCharge.feeItemCode")' min-width="120"></el-table-column>
            <el-table-column prop="feeItemName" :label='$t("uexpressFmsCharge.feeItemName")' min-width="120"></el-table-column>
            <el-table-column prop="chargeWeightRule" :label='$t("uexpressFmsCharge.chargeWeightRule")' min-width="120"></el-table-column>
            <el-table-column prop="attributeChargeName" :label='$t("uexpressFmsCharge.attributeChargeName")' min-width="120"></el-table-column>
            <el-table-column prop="amount" :label='$t("uexpressFmsCharge.amount")' min-width="120"></el-table-column>
            <el-table-column prop="price" :label='$t("uexpressFmsCharge.price")' min-width="120"></el-table-column>
          </el-table>
        </div>
      </div>

			<div class="page-edit-footer">
        <el-button size="mini" @click="backList">{{$t("common.close")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { getPayableConfirmationDetailApi } from "@/api/uexpress/payableFmsBill";
export default {
	name: "UexpressPayableFmsConfirmationDetail",
	data() {
		return {
			confirmationId: "",
      orderId: '',
			form: {},
      formRule: {},
			loading: false,
      dataList: []
		};
	},
	created() {
    this.confirmationId = this.$route.query.confirmationId
    this.orderId = this.$route.query.orderId
    if (this.confirmationId) {
      this.getDetail()
    }
	},
	methods: {
    getDetail() {
      let data = {
        confirmationId: this.confirmationId,
        orderId: this.orderId
      }
      this.loading = true
      getPayableConfirmationDetailApi(data).then(res => {
        if (res.ok) {
          this.dataList = res.content.billOrderChargeDtos || res.content.charges
          this.form = {
            ...res.content
          }
        }
        this.loading = false
      })
    },
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: `UExpressPayableFmsConfirmationList` });
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
}
.info-section-module .info-item .info-label {
  width: 115px;
}
</style>

