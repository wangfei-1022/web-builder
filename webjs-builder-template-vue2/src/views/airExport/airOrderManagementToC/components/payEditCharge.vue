<template>
  <div class="order-air-item edit" v-loading="loading">
    <div class="title">
      <!-- 编辑应付费用确认单 -->
      <span v-if="!!item.confirmationId">{{ $t('air.editPayableExpenseConfirmation') }}</span>
      <!-- 新增应付费用确认单 -->
      <span v-if="!item.confirmationId">{{ $t('air.addPayableExpenseConfirmation') }}</span>
    </div>
    <div class="company">
      <el-form ref="editForm" :model="editForm" label-width="95px" label-position="left">
        <el-row>
          <!-- <el-col :span="6">
            <el-form-item :label="$t('air.settlementUnitType')" prop="partnerRole"
              :rules="[{ required: true, message: $t('air.pleaseEnter'), trigger: 'change' },]">
              <el-select v-model="editForm.partnerRole" size="mini" :disabled="item.confirmationState === 11" @change="partnerRoleFn">
                <el-option :label="$t('air.airlineName')" :value="12015"></el-option>
                <el-option :label="$t('air.nationalEncouragementscholarship')" :value="14014"></el-option>
                <el-option :label="$t('air.inboundOperationAgent')" :value="16010"></el-option>
                <el-option :label="$t('air.warehouseDistributionServiceProvider')" :value="11011"></el-option>
                <el-option :label="$t('air.truckCompany')" :value="12011"></el-option>
                <el-option :label="$t('air.destinationAgentName')" :value="14012"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <!-- 供应商 -->
            <el-form-item :label="$t('air.supplier')"
              :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]" prop="scmSupplierCnName">
              <type-select v-model="editForm.scmSupplierCnName" type="supplier" @selected="supplierChange"
              :disabled="item.confirmationState === 11"  :request-params="{ 'businessType': 'AIR_EXPORT' }"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 结算单位 -->
            <el-form-item :label="$t('air.settlementUnit')"
              :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]" prop="settlementCompanyName">
              <!-- <type-select v-model="editForm.settlementCompanyName" type="member" @selected="customerChange"
                :disabled="item.confirmationState === 11" /> -->
                <!-- <type-select v-model="editForm.settlementCompanyName"
                           type="supplier"
                           @selected="customerChange"
                           :disabled="item.confirmationState === 11"
                           :request-params="requestParamsSettlement"
                           :key="componentKey" /> -->
              <el-select v-model="editForm.settlementCompanyName" clearable filterable size="mini"
                :disabled="item.confirmationState === 11" @change="customerChange">
                <el-option v-for="(item,index) in destinationAgentTitleList" :key="index"
                  :label="item.settlementCompanyName" :value="item.settlementCompanyId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--            结算方式-->
            <el-form-item :label="$t('air.settlementMethod')" prop="settlementModeName"
              :rules="[{ required: true, message: $t('sea.pleaseEnter'), trigger: 'change' },]">
              <el-select v-model="editForm.settlementModeName" size="mini" :disabled="item.confirmationState === 11" @change="settlementModeChange">
                <el-option v-for="item in settlementModeOps" :key="item.name" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 付款账套 -->
            <el-form-item :label="$t('air.paymentACSet')"
              :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]" prop="settlementOfficeId">
              <el-select v-model="editForm.settlementOfficeId" size="mini" :disabled="item.confirmationState === 11">
                <el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-form ref="chargeForm" :model="chargeForm" label-position="left">
      <el-table size="mini" :data="chargeForm.charges" style="width: 100%; " row-key="id" :border="true">
        <el-table-column prop="feeItemName" :label="$t('receiveFms.charge_name')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].feeItemName`">
              <!-- :method="dmnBusinessApi" -->
              <type-select v-model="row.feeItemName" type="businessFee"
                :requestParams="{ businessTypeCode: 'AIR_EXPORT' }" @selected="selectedFee($event, $index)"
                :disabled="editStatus(row)" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="unitName1" :label="$t('receiveFms.unit_name')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].unit1`">
              <el-select v-model="row.unit1" size="mini" :disabled="editStatus(row)">
                <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="currency" :label="$t('receiveFms.currency')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].currency`">
              <el-select v-model="row.currency" size="mini" @change="calcTotalFn()" :disabled="editStatus(row)">
                <el-option v-for="item in currencyList" :key="item.code" :label="item.code" :value="item.code" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('receiveFms.price')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].price`">
              <!-- oninput="value=value.replace(/[^\d.]/g,'')" -->
              <el-input v-model="row.price" size="mini" v-input-limit="[-9, 2]" @change="calcFn($index)"
                :disabled="editStatus(row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="chargeQuantity1" :label="$t('receiveFms.number')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].chargeQuantity1`">
              <el-input v-model="row.chargeQuantity1" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                @change="calcFn($index)" :disabled="editStatus(row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="soakRate" :label="$t('air.soakRate')">
          <template slot-scope="{row, $index}">
            <el-form-item :prop="`charges[${$index}].soakRate`">
              <el-input v-model='row.soakRate' size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                :disabled="editStatus(row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="invoiceTaxRate" :label="$t('receiveFms.tax_rate')">
          <template slot-scope="{row, $index}">
            <el-form-item :rules="[{ required: true, message: $t('receiveFms.can_not_be_null') }]"
              :prop="`charges[${$index}].invoiceTaxRate`">
              <el-select v-model="row.invoiceTaxRate" size="mini" @change="calcFn($index)" :disabled="editStatus(row)">
                <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="remark" :label="$t('air.remark')">
          <template slot-scope="{row, $index}">
            <el-form-item :prop="`charges[${$index}].remark`">
              <el-input v-model='row.remark' size="mini" :disabled="editStatus(row)"></el-input>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column prop="taxAmount" :label="$t('receiveFms.tax_amount')">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ scope.row.taxAmount | formatNumberToThousandsFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="excludeTaxAmount" :label="$t('receiveFms.exclude_tax_amount')" width="100">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ scope.row.excludeTaxAmount | formatNumberToThousandsFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('receiveFms.charge_amount')">
          <template slot-scope="scope">
            <div style='text-align: right'>{{ scope.row.amount | formatNumberToThousandsFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="oper" :label="$t('receiveFms.operation')" width="60">
          <template slot-scope="{row, $index }">
            <i class="iconfont icon-minus-circle" v-if="chargeForm.charges.length > 1 && !editStatus(row)"
              @click="deleteFn($index)"></i>
            <i class="iconfont icon-add-circle" v-if="$index === 0" @click="addFn($index)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="total">
        <span>{{ $t('payableFms.payable_sum') }}：</span>
        <span>
          <span class="value-item" v-for="(item, index) in sourceAmounts" :key='index'>
            <span class='value'>{{ item.currency }}</span>
            <span>{{ item.value | formatNumberToThousandsFilter }}</span>
          </span>
        </span>
      </div>
    </el-form>

    <div style="text-align: center;margin: 30px 0;">
      <el-button type="primary" size="mini" @click="saveFn">{{ $t('air.save') }}</el-button>
      <el-button type="primary" size="mini" @click="cancelFn">{{ $t('air.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getDictDataApi } from '@/api/fmsReceiveAir'
import {
  getCustomerDropDownListApi, getTaxRateListApi
} from '@/api/common'
import {
  dmnBusinessList, supplierSupplierActiveTitleApi
} from "@/api/airExport"
import { getCurrenciesListApi, getSupplierDropDownListApi } from "@/api/common"
import { getYHTListApi } from '@/api/partner/base'
import { validEmail } from "@/utils/validate"
import {
  rechargeModeApi
} from "@/api/seaExportOrder"
export default {
  name: 'PayToCTab',
  components: {
  },
  props: {
    type: String,
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    index: [String, Number],
    memberId: [String, Number],
    memberName: String,
    confirmationChargesSize: Number,
    etd: [String, Number],
    order: {
      type: Object,
      default: function () {
        return {
          baseDTO: {}
        }
      }
    }
  },
  watch: {
    item: {
      handler (val) {
        let target = this.$extends(true, {}, val)
        this.chargeForm.charges = target.charges || []
        if (this.chargeForm.charges.length === 0) {
          this.chargeForm.charges = [{}]
        }
        // 合计获取的dto 变更了
        this.sourceAmounts = val.amounts
        this.editForm.settlementCompanyId = target.settlementCompanyId
        this.editForm.settlementCompanyName = target.settlementCompanyName
        this.editForm.scmSupplierId = target.scmSupplierId
        this.editForm.scmSupplierCnName = target.scmSupplierCnName
        this.editForm.settlementMode = target.settlementMode
        this.editForm.settlementModeName = target.settlementModeName
        this.editForm.settlementOfficeId = target.settlementOfficeId
        // this.editForm.partnerRole = target.partnerRole
      },
      immediate: true
    }
  },
  data () {
    return {
      destinationAgentTitleList: [],
      componentKey: 0,
      requestParamsSettlement: {businessType: "AIR_EXPORT", partnerRole: ""},
      dmnBusinessApi: dmnBusinessList,
      settlementModeOps: [],
      unitList: [],
      settlementList: [],
      taxRateList: [],
      currencyList: [],
      YHTList: [],
      sourceAmounts: [],
      editForm: {
        scmSupplierId: "",
        scmSupplierCnName: "",
        partnerId: '',
        settlementCompanyId: '',
        settlementCompanyName: '',
        settlementOfficeId: '',
        // partnerRole: "",
        settlementMode: '',
        settlementModeName: ""
      },
      chargeForm: {
        charges: [{}]
      },
      loading: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    editStatus (charge) {
      if (this.type === "EDIT" && this.item.confirmationState === 11) {
        // 可编辑 账单状态为：调整中
        if (charge.entryState === 11 || !charge.entryState) {
          return false
        }
        return true
      }
      return false
    },
    init () {
      if (this.type === "ADD") {
        this.requestParamsSettlement.partnerRole = 14014
         // 国内空运代理 ==> 订舱代理
        let param = {
          ...this.requestParamsSettlement,
          name: this.order.spaceDTO.bookingAgentName
        }
        this.supplierDropDownListApi(param, this.order.spaceDTO.bookingAgentId, this.order.spaceDTO.bookingAgentName)
      } else {
        this.requestParamsSettlement.partnerRole = this.editForm.partnerRole
      }
      Promise.all([getDictDataApi(8), getTaxRateListApi(), getCurrenciesListApi(), getYHTListApi(), getCustomerDropDownListApi(), rechargeModeApi()]).then(results => {
        const unitRes = results[0]
        const taxRateRes = results[1]
        const currencyRes = results[2]
        const YHTRes = results[3]
        const settlementRes = results[4]
        const settlementModeRes = results[5]
        if (unitRes.ok) {
          let unit = [];
          unitRes.content.forEach(v => {
            if (v.code === 1101 || v.code === 2004) {
              unit.push(v)
            }
          })
          this.unitList = unit
        }
        if (taxRateRes.ok) {
          this.taxRateList = taxRateRes.content
        }
        if (currencyRes.ok) {
          this.currencyList = currencyRes.content
          // if (this.type === "ADD") {
          //   this.chargeForm.charges = [{
          //     "currency": "CNY",
          //     "invoiceTaxRate": 1
          //   }]
          // }

          if (this.type === "ADD" && this.confirmationChargesSize === 0) {
            this.chargeForm.charges = [{
              "currency": "CNY",
              "invoiceTaxRate": 4,
              "unit1": 1101,
              "feeItemName": this.$t('air.airFreight'),
              "feeItemCode": "AF"
            }, {
              "currency": "CNY",
              "invoiceTaxRate": 4,
              "unit1": 2004,
              "feeItemName": this.$t('air.documentCharge'),
              "feeItemCode": "DOC"
            }, {
              "currency": "CNY",
              "invoiceTaxRate": 4,
              "unit1": 2004,
              "feeItemName": this.$t('air.CustomsTransmissionServiceCharge'),
              "feeItemCode": "OEDI"
            }]
          } else {
            if (this.type === "ADD") {
              this.chargeForm.charges = [{
                "currency": "CNY",
                "invoiceTaxRate": 4
              }]
            }

          }
        }
        if (YHTRes.ok) {
          this.YHTList = YHTRes.content
          if (this.type === "ADD") {
            this.editForm.settlementOfficeId = "1"
            // this.editForm.partnerRole = 14014
          }
        }
        if (settlementRes.ok) {
          this.settlementList = settlementRes.content
        }
        // if (settlementModeRes.ok) {
        //   this.settlementModeOps = settlementModeRes.content
        //   if (this.type === "ADD") {
        //     this.editForm.settlementMode = 3
        //   }
        // }
      })
    },
    async customerChange (item) {
      this.editForm.settlementCompanyId = item
			this.settlementModeOps = [];
			this.editForm.settlementMode = ""
			this.editForm.settlementModeName = ""
			if (item) {
				let customerTitle = this.destinationAgentTitleList.find(res => item === res.settlementCompanyId)
				this.editForm.settlementCompanyName = customerTitle.settlementCompanyName

				this.editForm.settlementMode = customerTitle.rechargeMode
				this.editForm.settlementModeName = customerTitle.rechargeModeName
				let settlementModeOpsList = []
				let modeOps = {
					code: customerTitle.rechargeMode,
					name: customerTitle.rechargeModeName
				}
				settlementModeOpsList.push(modeOps)
				this.settlementModeOps = settlementModeOpsList

      }
    },
    settlementModeChange(item) {
			this.editForm.settlementMode = item
		},
    async supplierDropDownListApi (param, settlementCompanyId, settlementCompanyName) {
      const res1 = await getSupplierDropDownListApi(param)
      if (res1 && res1.ok && res1.content.length > 0) {
        this.editForm.settlementCompanyName = settlementCompanyName
        this.editForm.settlementCompanyId = settlementCompanyId
      } else {
        this.editForm.settlementCompanyName = ""
        this.editForm.settlementCompanyId = ""
      }
    },
    async supplierChange(item) {
      this.settlementModeOps = [];
      this.editForm.settlementCompanyId = ""
			this.editForm.settlementCompanyName = ""
			this.editForm.settlementMode = ""
			this.editForm.settlementModeName = ""
			this.editForm.scmSupplierId = item.id
      this.editForm.scmSupplierCnName = item.chineseName

      if (!item.id) {
        return
      }
      let param = {
        "memberId": item.id,
        "businessDate": this.etd,
        "businessType": "AIR_EXPORT"
      }
      const supplierTitleRes = await supplierSupplierActiveTitleApi(param);
      if (supplierTitleRes && supplierTitleRes.ok) {
        this.destinationAgentTitleList = supplierTitleRes.content
        if (supplierTitleRes.content.length === 0) {
          this.$message.warning(this.$t('air.supplierSupplierActiveWarning'))
        }
        if (supplierTitleRes.content.length === 1) {
          let supplierTitleMode = supplierTitleRes.content[0]
          this.editForm.settlementCompanyName = supplierTitleMode.settlementCompanyName
          this.editForm.settlementCompanyId = supplierTitleMode.settlementCompanyId
          this.editForm.settlementModeName = supplierTitleMode.rechargeModeName
          this.editForm.settlementMode = supplierTitleMode.rechargeMode
        }
      }
    },
    partnerRoleFn (partnerRole) {
      this.requestParamsSettlement = {
        businessType: "AIR_EXPORT",
        partnerRole: partnerRole
      }
      this.componentKey++
      let param = {}
      switch (partnerRole) {
        case 12015:
          // 航空公司
          param = {
            ...this.requestParamsSettlement,
            name: this.order.spaceDTO.airlineName
          }
          this.supplierDropDownListApi(param, this.order.spaceDTO.airlineId, this.order.spaceDTO.airlineName)
        break
        case 14014:
          // 国内空运代理 ==> 订舱代理
          param = {
            ...this.requestParamsSettlement,
            name: this.order.spaceDTO.bookingAgentName
          }
          this.supplierDropDownListApi(param, this.order.spaceDTO.bookingAgentId, this.order.spaceDTO.bookingAgentName)
        break
        case 16010:
          // 报关行(进仓操作代理) ==> 进仓操作代理
          param = {
            ...this.requestParamsSettlement,
            name: this.order.spaceDTO.loadingAgentName
          }
          this.supplierDropDownListApi(param, this.order.spaceDTO.loadingAgentId, this.order.spaceDTO.loadingAgentName)
        break
        default:
          this.editForm.settlementCompanyName = ""
          this.editForm.settlementCompanyId = ""
        break
      }
    },
    async checkSupplier (name) {
      let data = {
        ...this.requestParamsSettlement,
        name: name
      }
      const res = await getSupplierDropDownListApi(data)
      if (res && res.ok && res.content.length > 0) {
        return true
      }
      return false
    },
    calcTotalFn () {
      this.$nextTick(() => {
        let map = {}
        let arr = []
        this.chargeForm.charges.forEach(v => {
          if (v.currency && v.amount) {
            map[v.currency] = (Number(map[v.currency] || 0) + Number(v.amount)).toFixed(2)
          }
        })
        Object.keys(map).forEach(v => {
          arr.push({
            currency: v,
            value: map[v]
          })
        })
        this.sourceAmounts = arr
      })
    },
    calcFn (index) {
      let item = this.chargeForm.charges[index]
      if (item.price && item.chargeQuantity1 && item.invoiceTaxRate) {
        let all = item.amount = (item.price * item.chargeQuantity1).toFixed(2)
        item.excludeTaxAmount = (all / (1 + Number(this.taxRateList.find(res => res.code === item.invoiceTaxRate).rateValue) * 0.01)).toFixed(2)
        item.taxAmount = (all * 100 - item.excludeTaxAmount * 100) / 100
      } else {
        item.amount = ''
        item.excludeTaxAmount = ''
        item.taxAmount = ''
      }
      this.$set(this.chargeForm.charges, index, item)
      this.calcTotalFn()
    },
    selectedFee (charge, index) {
      let item = this.chargeForm.charges[index]
      item.feeItemName = charge.chineseName
      item.feeItemCode = charge.code
      this.$set(this.chargeForm.charges, index, item)
    },
    deleteFn (index) {
      this.chargeForm.charges.splice(index, 1)
    },
    addFn () {
      this.chargeForm.charges.unshift({
        "currency": "CNY",
        "invoiceTaxRate": 4
      })
    },
    saveFn () {
      let vb = false; let ve = false;
      this.$refs.chargeForm.validate(valid => {
        vb = valid
      })
      this.$refs.editForm.validate(valid => {
        ve = valid
      })

      if (ve && vb) {

        this.chargeForm.charges.forEach(v => {
          v.stepSize1 = 1
          v.price = Number(v.price).toFixed(2)
        })
        this.editForm.partnerId = this.editForm.settlementCompanyId
        this.loading = true
        this.$emit('saveFn', this.index, {
          ...this.item,
          ...this.editForm,
          ...this.chargeForm
        }, this.type)
        this.loading = false
      }

    },
    cancelFn () {
      this.$emit('cancelFn', this.index, this.type)
    }
  }
}
</script>

<style scoped lang="less">
.charge-tab {
  background: #fff;
  padding: 20px;
}

.order-air-item {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
  margin-bottom: 20px;

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  .title {
    font-weight: 600;
    line-height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #ccc;
  }

  .link {
    font-weight: 500;
    color: #1890ff;
  }

  .company {
    padding: 12px 20px;
    overflow: hidden;

    label {
      font-weight: 500;
      margin-right: 20px;
    }
  }
}

.add {
  padding: 10px;
  text-align: center;
  border: 1px dashed blue;
  box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
}

.total {
  background: rgba(16, 142, 233, 0.1);
  color: #108ee9;
  font-family: "PingFangSC-Regular", "PingFang SC";
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;

  .value-item {
    display: inline-block;
    margin-right: 30px;

    .value {
      display: inline-block;
      margin-right: 5px;
    }
  }
}
</style>
