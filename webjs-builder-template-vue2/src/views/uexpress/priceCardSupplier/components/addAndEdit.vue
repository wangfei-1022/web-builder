<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<div class="info-section-module">
        <div class="info-title">
          <!--基本信息-->
          {{$t("uexpressPriceCard.baseInfo")}}
        </div>
        <div class="info-content">
          <base-form ref="baseFormRef" :formData="detail" @updateInfo="updateInfoFn"/>
        </div>
      </div>

      <charge-item-config ref="chargeItemConfigRef" :arAp="2" :templateCharges="templateCharges" :form="detail"/>

			<div class="page-edit-footer">
				<el-button size="mini" @click="backList">{{$t("common.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading" v-if="type === 'ADD' || type === 'EDIT'">{{$t("common.submit")}}</el-button>
				<el-button type="primary" @click="onCopySubmit" size="mini" :loading="loading" v-if="type === 'COPY'">{{$t("common.nextStep")}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { createOfferSupplierApi, updateOfferSupplierApi, getDetailOfferSupplierApi, copyInitOfferSupplierApi } from "@/api/uexpress/priceCardSupplier";
import { getChargeTemplateDetailByNoApi } from "@/api/uexpress/priceCardTemplate";
import { getDictListApi } from "@/api/uexpress/base";
import { getCurrenciesListApi } from "@/api/common";
import { getCountryListApi } from '@/api/country'
import ChargeItemConfig from '@/views/uexpress/priceCardTemplate/components/ChargeItemConfig'
import BaseForm from './BaseForm'

export default {
	name: "UexpressPriceCardSupplierPayableAdd",
	components: {
    ChargeItemConfig,
    BaseForm
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
      templateCharges: [],
			loading: false,
      detail: {
        supplierId: '',
        unitGroup: ''
      }
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
    updateInfoFn(form) {
      this.detail = {
        ...form
      }
    },
    getDetail() {
      getDetailOfferSupplierApi(this.offerVersionId).then(res => {
        if (res.ok) {
          res.content.effectiveDate = res.content.effectiveDateBegin
          this.detail = res.content

          let params = {
            templateNo: res.content.templateNo,
            arAp: 2
          }
          getChargeTemplateDetailByNoApi(params).then(res => {
            if (res.ok) {
              this.templateCharges = res.content.templateCharges
            }
          })
        }
      })
    },
		onSubmit() {
      if (!this.$refs.baseFormRef.validate()) {
        return
      }
      if (!this.$refs.chargeItemConfigRef.validate()) {
        return
      }
      let templateCharges = this.$refs.chargeItemConfigRef.getValue()
      let form = this.$refs.baseFormRef.getValue()
      let data = {
        ...form,
        offerVersionId: this.offerVersionId,
        templateCharges: templateCharges
      }
      this.loading = true;
      let fn = this.offerVersionId ? updateOfferSupplierApi : createOfferSupplierApi
      fn(data).then(res => {
        if (res.ok) {
          let msg = this.offerVersionId ? this.$t("uexpressPriceCard.updateSuccess") : this.$t("uexpressPriceCard.addSuccess");
          this.$message.success(msg);
          this.backList();
        }
        this.loading = false;
      });
		},
		onCopySubmit() {
      if (!this.$refs.baseFormRef.validate()) {
        return
      }
      if (!this.$refs.chargeItemConfigRef.validate()) {
        return
      }
      let templateCharges = this.$refs.chargeItemConfigRef.getValue()
      let form = this.$refs.baseFormRef.getValue()
      let data = {
        ...form,
        templateCharges: templateCharges,
        sourceOfferVersionId: this.offerVersionId
      }
      this.loading = true;
      copyInitOfferSupplierApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("uexpressPriceCard.copySuccess"));
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push({
          name: "UexpressPriceCardSupplierPayableEditPirce",
          query: {
            offerVersionId: res.content.offerVersionId,
            origin: this.origin
          }}
        );
        }
        this.loading = false;
      });
		},
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ name: 'UexpressPriceCardSupplierPayable' });
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
