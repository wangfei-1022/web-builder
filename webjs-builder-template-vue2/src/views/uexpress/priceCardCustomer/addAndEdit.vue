<template>
	<div class="page-edit-container full-page" :loading="loading">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
				<div class="info-section-module">
					<div class="info-title">
            {{$t("uexpressPriceCard.baseInfo")}}
          </div>
					<div class="info-content">
						<el-form-item :label='$t("uexpressPriceCard.customerName")' prop="customerId">
							<type-select
                :disabled="!!offerVersionId"
                v-model="form.customerId"
                type="customer"
                :requestParams="{businessType: 'INTERNATIONAL_LINE'}"
                :defaultDisplay="form.customerName"
              />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.offerName")' prop="offerName">
							<el-input v-model="form.offerName" :disabled="!!offerVersionId"></el-input>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.effectiveDateFrom")' prop="effectiveDateFrom">
              <common-picker v-model="form.effectiveDateFrom" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.effectiveDateTo")' prop="effectiveDateTo">
              <common-picker v-model="form.effectiveDateTo" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.currency")' prop="currency">
							<el-select v-model="form.currency" size="mini" style="width: 100%" filterable :disabled="!!offerVersionId">
                <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.unitGroup")' prop="unitGroup">
							<el-select v-model="form.unitGroup" size="mini" style="width: 100%" filterable>
                <el-option v-for="item in unitGroupList" :key="item.code" :label="item.name" :value="item.code"/>
              </el-select>
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.remarks")' prop="remarks" class="full-line">
							<el-input v-model="form.remarks" type="textarea"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-form>

      <div class="info-section-module">
        <div class="info-title">
          <span>{{$t("uexpressPriceCard.customerPriceInfo")}}</span>
        </div>
        <div class="info-content">
          <el-form ref="addForm" :rules="addFormRule" :model="addForm" label-width="120px" size="mini" class="add-form-item">
            <el-form-item :label='$t("uexpressPriceCard.productName")' prop="productCode">
							<uexpress-type-select
                type="productSales"
                v-model="addForm.productCode"
                clearable
                filterable
                @selected="productCodeSelected"
              />
						</el-form-item>
						<el-form-item :label='$t("uexpressPriceCard.destinationCountry")' prop="destinationCountryCode">
							<el-select v-model="addForm.destinationCountryCode" size="mini" style="width: 100%" filterable clearable >
                <el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2"/>
              </el-select>
						</el-form-item>
            <span style="margin-left: 20px;">
              <el-button type="primary" @click="addItem" size="mini" >{{$t("uexpressPriceCard.increase")}}</el-button>
            </span>
          </el-form>
        </div>
        <div class="info-content">
          <el-table :data="offerDetails" style="width: 100%" border>
            <el-table-column prop="productName" :label='$t("uexpressPriceCard.productName")' min-width="220"></el-table-column>
            <el-table-column prop="destinationCountryName" :label='$t("uexpressPriceCard.destinationCountry")' min-width="180"></el-table-column>
            <el-table-column prop="templateCode" :label='$t("uexpressPriceCard.templateCode")' min-width="220">
              <template slot-scope="{ row }">
                <uexpress-type-select
                  ref="templateNoRef"
                  :defaultDisplay="row.templateName"
                  type="priceTemplate"
                  v-model="row.templateNo"
                  :requestParams="{templateTypeCode: 2, productTypeCode: form.productType, arAp: 1}"
                  clearable
                  :filterable="true" />
              </template>
            </el-table-column>
            <el-table-column prop="bulkyModulus" :label='$t("uexpressPriceCard.bulkyModulus")' min-width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.bulkyModulus" type="text" size="mini" clearable />
              </template>
            </el-table-column>
            <el-table-column prop="operation" :label='$t("uexpressPriceCard.operation")'  min-width="100">
              <template slot-scope="{ row,$index }">
                <el-button type="text" @click="deleteItemFn(row,$index)">{{$t("uexpressPriceCard.delete")}}</el-button>
              </template>
            </el-table-column>
          </el-table>
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
  updateOfferCustomerSalesApi,
  createOfferCustomerSalesApi,
  getDetailOfferCustomerApi } from "@/api/uexpress/priceCardCustomer";
import { getDictListApi } from "@/api/uexpress/base";
import { getCurrenciesListApi } from "@/api/common";
import { getCountryListApi } from '@/api/country'

export default {
	name: "ChargeTemplateReceiptAddAndEdit",
	components: {},
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
        customerId: '',
        customerName: '',
        offerName: '',
        effectiveDateFrom: '',
        effectiveDateTo: '',
        currency: 'CNY',
        unitGroup: '',
				remarks: ""
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

      addForm: {
        productCode: '',
        destinationCountryCode: ''
      },
      addFormRule: {
        productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        destinationCountryCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
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
    getDetail() {
      getDetailOfferCustomerApi(this.offerVersionId).then(res => {
        if (res.ok) {
          Object.keys(this.form).forEach(v => {
            this.form[v] = res.content[v]
            this.form.effectiveDateFrom = res.content.effectiveDateBegin
            this.form.effectiveDateTo = res.content.effectiveDateEnd
          })
          this.offerDetails = res.content.customerProducts
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
			this.$refs.baseForm.validate(valid => {
				if (valid) {
          let data = {
            offerVersionId: this.offerVersionId,
            ...this.form,
            offerDetails: this.offerDetails
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
							this.backList();
						}
						this.loading = false;
					});
				} else {
					this.mixinsFormScrollIntoView();
				}
			});
		},
    productCodeSelected(item) {
      this.addForm.productName = item.productName
      this.addForm.productType = item.productType
      this.addForm.productTypeName = item.productTypeName
      this.$nextTick(() => {
        this.$refs.templateNoRef.fetchList()
      })
    },
    addItem() {
      // 添加
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let data = {
            ...this.addForm,
            destinationCountryName: ''
          }
          this.countryList.forEach(v => {
            if (v.code2 === this.addForm.destinationCountryCode) {
              data.destinationCountryName = v.chineseName
            }
          })
          this.offerDetails.push(data)
        }
      })
    },
    deleteItemFn(row, index) {
      this.offerDetails.splice(index, 1)
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


.add-form-item{
	::v-deep .el-form-item {
		width: 33%;
		float: left;
	}
}
</style>
