<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
						{{$t("uexpressPriceCard.baseInfo")}}
					</div>
					<div class="info-content">
						<el-form-item :label='$t("uexpressPriceCard.templateName")' prop="templateName">
							<el-input v-model="form.templateName"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.templateType")' prop="templateType">
							<el-select v-model="form.templateType" size="mini" style="width: 100%" >
								<el-option v-for="item in templateList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
            <el-form-item :label='$t("uexpressPriceCard.productType")' prop="productType">
							<uexpress-select v-model="form.productType" type="productType" style="width: 100%" />
            </el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.currency")' prop="currency">
							<el-select v-model="form.currency" size="mini" style="width: 100%">
								<el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.unitGroup")' prop="unitGroup">
							<el-select v-model="form.unitGroup" size="mini" style="width: 100%">
								<el-option v-for="item in unitList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.ounceFlag")' prop="ounceFlag" v-if="form.unitGroup === 2">
							<el-radio-group v-model="form.ounceFlag">
                <el-radio :label="true">{{$t('uexpressPriceCard.YES')}}</el-radio>
                <el-radio :label="false">{{$t('uexpressPriceCard.NO')}}</el-radio>
              </el-radio-group>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.remarks")' prop="remarks" class="full-line">
							<el-input v-model="form.remarks" type="textarea"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-form>

      <charge-item-config ref="chargeItemConfigRef" :arAp="1" :templateCharges="templateCharges" :form="form"/>

			<div class="page-edit-footer">
				<el-button size="mini" @click="backList">{{$t("common.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading">{{$t("common.submit")}}</el-button>
			</div>
		</div>

	</div>
</template>
<script>
import { createChargeTemplateApi, updateChargeTemplateApi, getChargeTemplateDetailApi, getAllChargeAreaListApi } from "@/api/uexpress/priceCardTemplate";
import { getDictListApi } from "@/api/uexpress/base";
import { getCurrenciesListApi } from "@/api/common";
import ChargeItemConfig from '@/views/uexpress/priceCardTemplate/components/ChargeItemConfig'

export default {
	name: "ChargeTemplateReceiptAddAndEdit",
	components: {
    ChargeItemConfig
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
			templateId: "",
			form: {
        templateType: '',
        productType: '',
        templateName: '',
        currency: 'CNY',
        unitGroup: '',
        ounceFlag: null,
				remarks: ""
			},
			formRule: {
				templateType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productType: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        templateName: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        currency: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        unitGroup: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        ounceFlag: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},

			loading: false,
      currencyList: [],
      unitList: [],
      templateList: [],
      templateCharges: [],
      multipleSelection: []
		};
	},
	created() {
    this.templateId = this.$route.query.templateId
    if (this.templateId) {
      this.getDetail()
    }
		this.getBaseDataFn();
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
		getBaseDataFn() {
      let data = {
        areaType: 1,
        areaState: 2
      }
			Promise.all([getCurrenciesListApi(), getAllChargeAreaListApi(data), getDictListApi(32), getDictListApi(30)]).then(results => {
				const currencyRes = results[0];
        const areaRes = results[1];
        const unitRes = results[2];
        const templateRes = results[3];
				if (currencyRes.ok) {
					this.currencyList = currencyRes.content;
				}
        if (areaRes.ok) {
					this.chargeAreaAllList = areaRes.content;
				}
				if (unitRes.ok) {
					this.unitList = unitRes.content;
				}
				if (templateRes.ok) {
					this.templateList = templateRes.content;
				}
			});
		},
		onSubmit() {
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          if (!this.$refs.chargeItemConfigRef.validate()) {
            return
          }
          let templateCharges = this.$refs.chargeItemConfigRef.getValue()
          let data = {
            ...this.form,
            templateCharges: templateCharges,
            templateId: this.templateId,
            arAp: 1
          }
					this.loading = true;
          let fn = data.templateId ? updateChargeTemplateApi : createChargeTemplateApi
					fn(data).then(res => {
						if (res.ok) {
							let msg = data.templateId ? this.$t("uexpressPriceCard.updateSuccess") : this.$t("uexpressPriceCard.addSuccess");
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
