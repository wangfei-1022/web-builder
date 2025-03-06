<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressProduct.base_info")}}
          </div>

          <div class="info-content">
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.templateName")}}</span>
              <span class="info-span">{{form.templateName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.templateType")}}</span>
              <span class="info-span">{{form.templateTypeName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.productType")}}</span>
              <span class="info-span">{{form.productTypeName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.currency")}}</span>
              <span class="info-span">{{form.currency}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{$t("uexpressPriceCard.unitGroup")}}</span>
              <span class="info-span">{{form.unitGroupName}}</span>
            </div>
            <div class="info-item" v-if="form.unitGroup === 2">
              <span class="info-label">{{$t("uexpressPriceCard.ounceFlag")}}</span>
              <span class="info-span">{{form.ounceFlag ? $t('uexpressPriceCard.YES') : $t('uexpressPriceCard.NO')}}</span>
            </div>
            <div class="info-item full-line">
              <span class="info-label">{{$t("uexpressPriceCard.remarks")}}</span>
              <span class="info-span">{{form.remarks}}</span>
            </div>
          </div>
				</div>
			</el-form>

      <div class="info-section-module">
        <div class="info-title">
          <span>{{$t("uexpressPriceCard.feeItem")}}</span>
        </div>
        <div class="info-content">
          <el-table :data="templateCharges" border style="width: 100%">
						<el-table-column prop="ruleNo" :label="$t('uexpressPriceCard.ruleNo')" min-width="150"></el-table-column>
						<el-table-column prop="categoryName" :label="$t('uexpressPriceCard.category')" min-width="150"></el-table-column>
						<el-table-column prop="feeItemName" :label="$t('uexpressPriceCard.feeItem')" min-width="150"></el-table-column>
						<el-table-column prop="attributeCommodityName" :label="$t('uexpressPriceCard.attributeCommodityName')" min-width="120"></el-table-column>
            <el-table-column prop="attributeChargeName" :label="$t('uexpressPriceCard.attributeChargeName')" min-width="120"></el-table-column>
						<el-table-column prop="chargeByArea" :label="$t('uexpressPriceCard.chargeByArea')" min-width="120">
              <template slot-scope="{ row }">
                <span>{{row.chargeByArea ? $t('uexpressPriceCard.YES') : $t('uexpressPriceCard.NO')}}</span>
							</template>
            </el-table-column>
						<el-table-column prop="areaCodes" :label="$t('uexpressPriceCard.area')" min-width="180">
              <template slot-scope="{ row }">
								<span v-for="(item, index) in row.areas || []" :key="index" style="margin-right:4px;">{{item.areaName}}</span>
							</template>
            </el-table-column>
            <el-table-column prop="reDeliveryFlag" :label="$t('uexpressPriceCard.reDeliveryFlag')" min-width="120">
              <template slot-scope="{ row }">
                <span>{{row.reDeliveryFlag ? $t('uexpressPriceCard.YES') : $t('uexpressPriceCard.NO')}}</span>
							</template>
            </el-table-column>
            <el-table-column prop="ounceFlag" :label="$t('uexpressPriceCard.ounceFlag')" min-width="140" v-if="form.ounceFlag">
              <template slot-scope="{ row }">
                <span>{{row.ounceFlag ? $t('uexpressPriceCard.YES') : $t('uexpressPriceCard.NO')}}</span>
							</template>
            </el-table-column>
					</el-table>
        </div>
      </div>

      <div class="page-edit-footer" >
				<el-button size="mini" @click="backList">{{$t("common.close")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { getChargeTemplateDetailApi } from "@/api/uexpress/priceCardTemplate";
import { getDictListApi } from "@/api/uexpress/base";
import { getCountryListApi } from "@/api/country";

export default {
	name: "UexpressPriceCardTemplateReceiptDetail",
	components: { },
	data() {
		return {
			id: "",
			form: {},
			formRule: {},
			loading: false,
      templateCharges: []
		};
	},
	created() {
    this.templateId = this.$route.query.templateId
    if (this.templateId) {
      this.getDetail()
    }
	},
	methods: {
    getDetail() {
      getChargeTemplateDetailApi(this.templateId).then(res => {
        if (res.ok) {
          this.form = {
            ...res.content
          }
          this.templateCharges = res.content.templateCharges
        }
      })
    },
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: `UexpressPriceCardTemplateReceipt` });
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
