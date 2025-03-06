<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="fms-detail page-edit-content">
      <div class="info-section-module">
        <div class="info-title">
          {{$t("uexpressFmsConfirmation.baseInfo")}}
        </div>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.customer_name")}}：</span>
            <span class="info-span">{{form.memberName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.settlement_office_name")}}：</span>
            <span class="info-span">{{form.settlementOfficeName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.productName")}}：</span>
            <span class="info-span">{{form.productName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.countryCode")}}：</span>
            <span class="info-span">{{form.countryCode}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.orderNo")}}：</span>
            <span class="info-span">{{form.orderNo}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.channelOrderNo")}}：</span>
            <span class="info-span">{{form.channelOrderNo}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.memberOrderNo")}}：</span>
            <span class="info-span">{{form.memberOrderNo}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.zipCode")}}：</span>
            <span class="info-span">{{form.consigneeZipcode}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.dimension")}}：</span>
            <span class="info-span">{{form.dimension}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.volumeWeight")}}：</span>
            <span class="info-span">{{form.volumeWeight}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.volumeWeightRate")}}：</span>
            <span class="info-span">{{form.volumeWeightRate}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.declaredAmount")}}：</span>
            <span class="info-span">{{form.declaredValue}}{{form.declaredCurrency}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.chargeWeight")}}：</span>
            <span class="info-span">{{form.chargeWeight}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.weight")}}：</span>
            <span class="info-span">{{form.weight}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.confirmationType")}}：</span>
            <span class="info-span">{{form.confirmationTypeName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.billNo")}}：</span>
            <span class="info-span">{{form.billNo}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.bill_status")}}：</span>
            <span class="info-span">{{form.entryStateName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.confirmation_state")}}：</span>
            <span class="info-span">{{form.confirmationStateName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.invoice_status")}}：</span>
            <span class="info-span">{{form.invoiceStateName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.clear_status")}}：</span>
            <span class="info-span">{{form.clearStateName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.productType")}}：</span>
            <span class="info-span">{{form.productTypeName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.inboundTime")}}：</span>
            <span class="info-span">{{form.inboundTime | parseTime}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.outboundTime")}}：</span>
            <span class="info-span">{{form.outboundTime | parseTime}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.offsetTime")}}：</span>
            <span class="info-span">{{form.offsetTime | parseTime}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.orderTime")}}：</span>
            <span class="info-span">{{form.orderTime | parseTime}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{$t("uexpressFmsConfirmation.lastMileCollectDateTime")}}：</span>
            <span class="info-span">{{form.lastMileCollectDateTime | parseTime}}</span>
          </div>
        </div>
      </div>
      <div class="info-section-module">
        <div class="info-title">
          {{$t("uexpressFmsConfirmation.chargeDetail")}}
           <el-button type="primary" @click="addChargeFn" size="mini" v-if="type == 'ADJUST'" style="margin-left: 15px;">{{$t('uexpressFmsConfirmation.addCharge')}}</el-button>
        </div>
        <div class="info-content">
          <el-table size="mini" :data="charges" style="width: 100%;" row-key="id" border>
            <el-table-column  prop="feeItemCode" :label="$t('uexpressFmsConfirmation.feeItemCode')" min-width="100"></el-table-column>
            <el-table-column  prop="feeItemName" :label="$t('uexpressFmsConfirmation.feeItemName')" min-width="130"></el-table-column>
            <el-table-column  prop="chargeRuleDesc" :label="$t('uexpressFmsConfirmation.chargeRuleDesc')" min-width="100"></el-table-column>
            <el-table-column  prop="estimateChargeQuantity1" :label="$t('uexpressFmsConfirmation.estimateChargeQuantity1')" min-width="100" v-if="type === 'DETAIL'"></el-table-column>
            <el-table-column  prop="estimateAmount" :label="$t('uexpressFmsConfirmation.estimateAmount')" min-width="100" align="right" v-if="type === 'DETAIL'">
              <template slot-scope="{ row }">
                {{row.estimateAmount | numberToThousands}}
              </template>
            </el-table-column>
            <el-table-column  prop="estimateOfferNo" :label="$t('uexpressFmsConfirmation.estimateOfferNo')" min-width="120" show-overflow-tooltip v-if="type == 'DETAIL'"></el-table-column>
            <el-table-column  prop="chargeQuantity1" :label="$t('uexpressFmsConfirmation.chargeQuantity1')" min-width="100" ></el-table-column>
            <el-table-column  prop="amount" :label="$t('uexpressFmsConfirmation.offerAmount')" min-width="100" align="right">
              <template slot-scope="{ row }">
                {{row.amount | numberToThousands}}
              </template>
            </el-table-column>
            <el-table-column  prop="offerNo" :label="$t('uexpressFmsConfirmation.offerNo')" min-width="120" show-overflow-tooltip v-if="type == 'DETAIL'"></el-table-column>
            <el-table-column  prop="currency" :label="$t('uexpressFmsConfirmation.currency')" min-width="80"></el-table-column>
            <el-table-column  prop="entryStateName" :label="$t('uexpressFmsConfirmation.bill_status')" min-width="120"></el-table-column>
            <el-table-column  prop="remark" :label="$t('uexpressFmsConfirmation.remark')" min-width="120"></el-table-column>
            <el-table-column  prop="operation" :label="$t('uexpressFmsConfirmation.operation')" min-width="120" v-if="type == 'ADJUST'">
              <template slot-scope="{ row }">
                <el-button type="text" @click="adjustFn(row)" v-if="row.entryState === 1">{{$t('uexpressFmsConfirmation.adjustCharge')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="info-section-module" v-if="type === 'DETAIL'">
        <div class="info-title">
          {{$t("uexpressFmsConfirmation.chargeAdjustDetail")}}
        </div>
        <div class="info-content">
          <el-table size="mini" :data="chargeAdjusts" style="width: 100%;" row-key="id" border>
            <el-table-column  prop="indexNo" :label="$t('uexpressFmsConfirmation.index_no')" min-width="80">
              <template slot-scope="{ $index }">
                {{$index + 1}}
              </template>
            </el-table-column>
            <el-table-column  prop="feeItemName" :label="$t('uexpressFmsConfirmation.feeItemName')" min-width="130"></el-table-column>
            <el-table-column  prop="adjustReasonName" :label="$t('uexpressFmsConfirmation.adjustReason')" min-width="100"></el-table-column>
            <el-table-column  prop="adjustAmount" :label="$t('uexpressFmsConfirmation.adjustAmount')" min-width="120" align="right">
              <template slot-scope="{ row }">
                {{row.adjustAmount | numberToThousands}}
              </template>
            </el-table-column>
            <el-table-column  prop="afterAmount" :label="$t('uexpressFmsConfirmation.adjustReceiveAmount')" min-width="120" align="right">
              <template slot-scope="{ row }">
                {{row.afterAmount | numberToThousands}}
              </template>
            </el-table-column>
            <el-table-column  prop="currency" :label="$t('uexpressFmsConfirmation.currency')" min-width="100"></el-table-column>
            <el-table-column  prop="adjustWeight" :label="$t('uexpressFmsConfirmation.adjustWeight')" min-width="100"></el-table-column>
            <el-table-column  prop="remarks" :label="$t('uexpressFmsConfirmation.remark')" min-width="80"></el-table-column>
            <el-table-column  prop="adjustByName" :label="$t('uexpressFmsConfirmation.adjustByName')" min-width="100"></el-table-column>
            <el-table-column  prop="adjustTime" :label="$t('uexpressFmsConfirmation.adjustTime')" min-width="150">
              <template slot-scope="{ row }">
                {{row.adjustTime | parseTime}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList()">{{$t('common.close')}}</el-button>
    </div>

    <el-dialog :title="$t('uexpressFmsConfirmation.addCharge')" :visible.sync="addVisible" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules"  size="mini" label-width="120px" label-position="right">
        <el-form-item :label='$t("uexpressFmsConfirmation.feeItemName")' prop="chargeRuleNo">
          <el-select v-model="addForm.chargeRuleNo" filterable @change="chargeRuleNoChange" style="width: 100%">
            <el-option v-for="(item, index) in chargeRulesList" :label="item.chargeNameStr" :value="item.ruleNo" :key="index" />
          </el-select>
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.chargeRuleDesc")' prop="chargeRuleDesc">
					<el-input v-model="addForm.chargeRuleDesc" type="text" clearable disabled/>
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.chargeQuantity")' prop="quantity">
					<el-input v-model="addForm.quantity" type="text" size="mini" clearable disabled/>
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.charge")' prop="amount">
          <el-row>
            <el-col :span="20">
             <el-input v-model="addForm.amount" type="text" size="mini" clearable />
            </el-col>
            <el-col :span="4">
              <div style="text-align: center;">{{addForm.currency}}</div>
            </el-col>
          </el-row>
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.remark")' prop="remarks">
					<el-input v-model="addForm.remarks" type="text" size="mini" clearable />
				</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="addSubmitFn" size="mini" :loading="addLoading">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('uexpressFmsConfirmation.adjustCharge')" :visible.sync="adjustVisible" width="500px">
      <el-form ref="adjustFormRef" :model="adjustForm" :rules="adjustFormRules" label-width="120px" label-position="right" size="mini">
        <el-form-item :label='$t("uexpressFmsConfirmation.feeItemName")' prop="feeItemName">
					<el-input v-model="adjustForm.feeItemName" type="text" size="mini" disabled clearable />
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.adjustReason")' prop="adjustReason">
          <el-select v-model="adjustForm.adjustReason" style="width: 100%;">
            <el-option v-for="item in reasonList" :label="item.name" :value="item.code" :key="item.code" />
          </el-select>
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.adjustWeight")' prop="adjustWeight" v-if="adjustForm.adjustReason === 2">
          <el-row>
            <el-col :span="8">
              <el-select v-model="adjustForm.addWeightType">
                <el-option label="+" value="+" />
                <el-option label="-" value="-" />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input v-model="adjustForm.adjustWeight" type="text" size="mini" clearable />
            </el-col>
            <el-col :span="4">
              <div style="text-align: center;">KG</div>
            </el-col>
          </el-row>
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.adjustAmount")' prop="adjustAmount">
					<el-row>
            <el-col :span="8">
              <el-select v-model="adjustForm.addAmountType">
                <el-option label="+" value="+" />
                <el-option label="-" value="-" />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input v-model="adjustForm.adjustAmount" type="text" size="mini" clearable />
            </el-col>
            <el-col :span="4">
              <div style="text-align: center;">{{adjustForm.currency}}</div>
            </el-col>
          </el-row>
				</el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.remark")' prop="remarks">
					<el-input v-model="adjustForm.remarks" type="text" size="mini" clearable />
				</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="adjustVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="adjustSubmitFn" size="mini" :loading="adjustLoading">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getReceiveConfirmationDetailByIdApi, receiveConfirmationAddChargeApi, receiveConfirmationAdjustChargeApi, getConfirmationChargeRuleApi } from "@/api/uexpress/fmsConfirmation"
import { getDictListApi } from "@/api/uexpress/base"
import { parseTime, formatNumberToThousands } from '@/utils/index'

export default {
	name: "UExpressFmsReceiveConfirmationView",
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			confirmationId: '',
      orderId: '',
      origin: '',
			loading: false,

      reasonList: [],
      form: {},
			charges: [],
      chargeAdjusts: [],
      adjustForm: {
        chargeId: '',
        feeItemName: '',
        currency: '',
        adjustReason: '',
        addWeightType: '+',
        adjustWeight: '',
        addAmountType: '+',
        adjustAmount: '',
        remarks: ''
      },
      adjustFormRules: {
        feeItemName: [{required: true,	message: this.$t("common.cannot_be_null")}],
        adjustReason: [{required: true,	message: this.$t("common.cannot_be_null")}],
        adjustWeight: [{required: true,	message: this.$t("common.cannot_be_null")}],
        adjustAmount: [{required: true,	message: this.$t("common.cannot_be_null")}]
      },
      adjustVisible: false,
      adjustLoading: false,

      addForm: { },
      addFormRules: {
        chargeRuleNo: [{required: true,	message: this.$t("common.cannot_be_null")}],
        amount: [{required: true,	message: this.$t("common.cannot_be_null")}]
      },
      addVisible: false,
      addLoading: false,

      chargeRulesList: []
		}
	},
	created() {
		this.confirmationId = this.$route.query.confirmationId
    this.orderId = this.$route.query.orderId
    this.orderSk = this.$route.query.orderSk
    this.origin = this.$route.query.origin
		this.getDetail()
    this.getBaseDataFn()
	},
	methods: {
    addFormInit() {
      let currency = this.charges[0] ? this.charges[0].currency : this.form.currency
      this.addForm = {
        chargeRuleNo: '',
        quantity: '',
        quantityUnit: '',
        currency: currency,
        remarks: ''
      }
    },
    getBaseDataFn() {
			Promise.all([getDictListApi(39)]).then(results => {
				const reasonRes = results[0];
				if (reasonRes.ok) {
					this.reasonList = reasonRes.content;
				}
			});
		},
		getDetail() {
			this.loading = true
      let data = {
        orderId: this.orderId,
        confirmationId: this.confirmationId
      }
			getReceiveConfirmationDetailByIdApi(data).then(res => {
				if (res.ok) {
					this.loading = false
          let charges = res.content.charges
          let chargeAdjusts = res.content.chargeAdjusts
          charges.forEach(v => {
            v.price = formatNumberToThousands(v.price)
            v.amount = formatNumberToThousands(v.amount)
            v.taxAmount = formatNumberToThousands(v.taxAmount)
            v.excludeTaxAmount = formatNumberToThousands(v.excludeTaxAmount)
          })
          this.charges = charges
          this.chargeAdjusts = chargeAdjusts
          delete res.content.charges
          delete res.content.chargeAdjusts
          this.form = {
            ...res.content
          }
          this.addFormInit()
				}
			})
		},
    chargeRuleNoChange() {
      this.chargeRulesList.forEach(v => {
        if (v.ruleNo === this.addForm.chargeRuleNo) {
          this.addForm.chargeRuleDesc = v.chargeRuleDesc
          this.addForm.quantity = v.quantity
          this.addForm.quantityUnit = v.quantityUnit
        }
      })
    },
    addChargeFn() {
      this.addFormInit()
      // 没有则初始化
      if (this.chargeRulesList.length === 0) {
        let data = {
          orderId: this.orderId,
          orderSk: this.orderSk
        }
        getConfirmationChargeRuleApi(data).then(res => {
          if (res.ok) {
            res.content.forEach(v => {
              v.chargeNameStr = v.categoryCode + '/' + v.feeItemName
            })
            this.chargeRulesList = res.content
            this.addVisible = true
          }
        })
      } else {
        this.addVisible = true
      }
    },
    addSubmitFn() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.addForm,
            orderId: this.orderId,
            confirmationId: this.confirmationId
          }
          this.addLoading = true
          receiveConfirmationAddChargeApi(data).then(res => {
            if (res.ok) {
              this.addVisible = false
              this.$message.success(this.$t("uexpressFmsConfirmation.addSuccess"));
              this.getDetail();
            }
            this.addLoading = false
          })
        }
      })
    },
    adjustFn(item) {
      this.adjustForm = {
        chargeId: item.id,
        feeItemName: item.feeItemName,
        currency: item.currency,
        adjustReason: '',
        addWeightType: '+',
        adjustWeight: '',
        addAmountType: '+',
        adjustAmount: '',
        remarks: ''
      }
      this.adjustVisible = true
    },
    adjustSubmitFn() {
      this.$refs.adjustFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.adjustForm,
            orderId: this.orderId,
            confirmationId: this.confirmationId
          }
          if (this.adjustForm.addAmountType === "-" && data.adjustAmount) {
            data.adjustAmount = -Number(data.adjustAmount)
          }
          if (this.adjustForm.addWeightType === "-" && data.adjustWeight) {
            data.adjustWeight = -Number(data.adjustWeight)
          }
          this.adjustLoading = true
          receiveConfirmationAdjustChargeApi(data).then(res => {
            if (res.ok) {
              this.adjustVisible = false
              this.$message.success(this.$t("uexpressFmsConfirmation.adjustSuccess"));
              this.getDetail();
            }
            this.adjustLoading = false
          })
        }
      })
    },
		backList() {
			if (this.origin) {
        this.$store.dispatch('tagsView/delView', this.$route)
				this.$router.push({ name: this.origin })
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.info-section-module .info-item .info-label {
  width: 115px;
}
</style>

