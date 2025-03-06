<template>
  <div class="page-edit-container full-page">
    <div class="custmer-detail page-edit-content">
      <div class="info-section-module inner img-inner">
        <div class="info-title">{{ form.contractTypeName }}{{ $t("contract.contract_detail")}}</div>
        <span v-if="operType == 'DETAIL'">
          <img src="@/assets/effective.png" v-if="form.contractStatus === 30"/>
          <img src="@/assets/effective_lose.png" v-if="form.contractStatus === 20"/>
          <img src="@/assets/effective_to_be.png" v-if="form.contractStatus === 40"/>
          <img src="@/assets/effective_invalid.png" v-if="form.contractStatus === 50"/>
        </span>
        <div class="info-title">
          {{ $t("contract.base_info") }}
          <i class="icon-oper el-icon-edit" @click="editBaseFn" v-if="operType == 'ADJUST' && !isEditBase"></i>
          <i class="icon-oper el-icon-circle-close" @click="cancelBaseFn" v-if="operType == 'ADJUST' && isEditBase"></i>
          <i class="icon-oper el-icon-circle-check" @click="saveBaseFn" v-if="operType == 'ADJUST' && isEditBase"></i>
        </div>
        <div class="info-content" v-if="operType == 'DETAIL' || (operType == 'ADJUST' && !isEditBase)">
          <div class="info-item" v-if="form.contractType === 3 || form.contractType === 10 || form.contractType === 20">
            <span class="info-label">{{ $t("contract.business_type") }}：</span>
            <span class="info-span">{{form.businessTypeName}}</span>
          </div>
          <div class="info-item" v-if="form.contractType === 1 || form.contractType === 2">
            <span class="info-label">{{ $t("contract.contract_type") }}：</span>
            <span class="info-span">{{form.contractTypeName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.contract_kind_name") }}：</span>
            <span class="info-span">{{form.contractName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.contract_name") }}：</span>
            <span class="info-span">{{form.customName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.contract_no") }}：</span>
            <span class="info-span">{{form.contractNo}}</span>
          </div>
          <div class="info-item" v-if="(form.contractType === 1 && type === 'CUSTOMER') || form.contractType === 3 || form.contractType === 10">
            <span class="info-label">{{ $t("contract.customer_company_name") }}：</span>
            <span class="info-span">{{form.memberCnName}}</span>
          </div>
          <div class="info-item" v-if="(form.contractType === 1 && type === 'SUPPLIER') ||form.contractType === 2 || form.contractType === 20">
            <span class="info-label">{{ $t("contract.supplier_company_name") }}：</span>
            <span class="info-span">{{form.memberCnName}}</span>
          </div>
          <div class="info-item" v-if="false">
            <span class="info-label">{{ $t("contract.business_no") }}：</span>
            <span class="info-span">{{form.memberBusinessNo}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.yht_name") }}：</span>
            <span class="info-span">{{form.signedOfficeName}}</span>
          </div>
          <div class="info-item" v-if="(form.contractType === 1 && type === 'CUSTOMER') || form.contractType === 3 || form.contractType === 10">
            <span class="info-label">{{ $t("contract.customer_sign_name") }}：</span>
            <span class="info-span">{{form.memberSignatoryName}}</span>
          </div>
          <div class="info-item" v-if="(form.contractType === 1 && type === 'SUPPLIER') ||form.contractType === 2 || form.contractType === 20">
            <span class="info-label">{{ $t("contract.supplier_sign_name") }}：</span>
            <span class="info-span">{{form.memberSignatoryName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.yht_sign_name") }}：</span>
            <span class="info-span">{{form.principalName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.contract_start_time") }}：</span>
            <span class="info-span">{{parseTime(form.periodBegin)}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.contract_end_time") }}：</span>
            <span class="info-span">{{parseTime(form.periodEnd)}}</span>
          </div>
          <div class="info-item" v-if="false">
            <span class="info-label">{{ $t("contract.sales") }}：</span>
            <span class="info-span">{{form.memberPrincipalName}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.recharge_currency") }}：</span>
            <span v-if="form.rechargeCurrency">{{form.rechargeCurrency.join(',')}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t("contract.remarks") }}：</span>
            <span class="info-span">{{form.remarks}}</span>
          </div>
          <div class="info-item" v-if="form.contractType === 1">
            <span class="info-label">{{ $t("contract.credits") }}：</span>
            <span class="info-span">
              <div v-for="(item, index) in form.credits" :key="index">{{item.currency}}&nbsp;&nbsp;{{item.amount}}</div>
            </span>
          </div>
        </div>
        <div class="info-content" v-if="operType == 'ADJUST' && isEditBase">
          <payment-base-form ref="paymentBaseFormRef" :baseForm="form" />
        </div>
      </div>

      <div class="info-section-module" v-if="form.contractType === 1 || form.contractType === 2">
        <div class="info-title">
          {{ $t("contract.business_relative_info") }}
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="addNewBusiness" style="float: right;" v-if="operType === 'ADJUST'">{{$t('contract.add_business')}}</el-button>
        </div>
        <div class="info-content">
          <el-tabs v-model="activeBusiness" style="width:100%" v-if="businessList.length">
            <el-tab-pane :label="item.businessTypeName" :name="item.businessType" v-for="(item, index) in businessList" :key="index">
              <!-- <account-period-detail :item="item" :contractType="form.contractType"></account-period-detail> -->
            </el-tab-pane>
          </el-tabs>
        </div>


        <div class="info-section-module inner">
          <div class="info-title">{{$t("contract.settlement_info")}}</div>
          <div class="info-content">
            <settlement
              ref="settlementRef"
              :contractType="form.contractType"
              :list="settlementList"
              :detail="form"
              :type="type"
              :role="role"
              :operType="operType"
              :activeBusiness="activeBusiness"
              @detailRefresh="getDetail"
              :businessList="businessList"
            ></settlement>
          </div>
        </div>

        <div class="info-section-module inner">
          <div class="info-title">
            <span>{{$t('contract.attachment_info')}}</span>
            <span style="font-weight: 500;font-size: 14px;">{{$t('contract.attachment_info_mention')}}</span>
          </div>
          <div class="info-content">
            <attachment-list :list="attachmentList" :id="id" :operType="operType"></attachment-list>
          </div>
        </div>
      </div>

      <div class="info-section-module" v-if="form.contractType === 3 || form.contractType === 10 || form.contractType === 20">
        <div class="info-title">{{ $t("contract.business_relative_info") }}</div>
        <div class="info-content">
            <!-- <account-period-detail :item="businessItem" :contractType="form.contractType"></account-period-detail> -->
        </div>

        <div class="info-section-module inner" v-if="form.contractType === 10 || form.contractType === 20">
          <div class="info-title">{{$t("contract.settlement_info")}}</div>
          <div class="info-content">
            <settlement
              ref="settlementRef"
              :contractType="form.contractType"
              :list="settlementList"
              :detail="form"
              :type="type"
              :role="role"
              :operType="operType"
              :activeBusiness="activeBusiness"
              @detailRefresh="getDetail"
              :businessList="businessList"
            ></settlement>
          </div>
        </div>

        <div class="info-section-module inner" v-if="form.contractType === 10 || form.contractType === 20">
          <div class="info-title">
            <span>{{$t('contract.attachment_info')}}</span>
            <span style="font-weight: 500;font-size: 14px;">{{$t('contract.attachment_info_mention')}}</span>
          </div>
          <div class="info-content">
            <attachment-list :list="attachmentList" :id="id" :operType="operType"></attachment-list>
          </div>
        </div>

        <div class="info-section-module inner" v-if="form.contractType === 3">
          <div class="info-title">{{$t("contract.settlement_info")}}</div>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">{{ $t("contract.settlement_company_name") }}：</span>
              <span class="info-span">{{settlementItem.settlementCompanyName}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ $t("contract.currency") }}：</span>
              <span class="info-span">{{settlementItem.rechargeCurrency}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ $t("contract.bank_account") }}：</span>
              <span class="info-span">{{settlementItem.bankAccount}}</span>
            </div>
              <div class="info-item">
              <span class="info-label">{{ $t("contract.bank_name") }}：</span>
              <span class="info-span">{{settlementItem.bankName}}</span>
            </div>
              <div class="info-item">
              <span class="info-label">{{ $t("contract.bank_branch") }}：</span>
              <span class="info-span">{{settlementItem.bankBranch}}</span>
            </div>
              <div class="info-item">
              <span class="info-label">{{ $t("contract.tax_num") }}：</span>
              <span class="info-span">{{settlementItem.taxNum}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ $t("contract.address") }}：</span>
              <span class="info-span">{{settlementItem.address}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ $t("contract.tel") }}：</span>
              <span class="info-span">{{settlementItem.tel}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ $t("contract.swift_code") }}：</span>
              <span class="info-span">{{settlementItem.swiftCode}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList">{{ $t("contract.close") }}</el-button>
    </div>

    <add-business-dialog ref="addBusinessDialogRef" @success="getDetail"/>
  </div>

</template>
<script>
import { getReceiptContractDetailApi, getContractPaymentDetailApi, updateSupplierContractPaymentApi } from "@/api/partner/supplierContract"
import attachmentList from "./attachmentList"
import settlement from "./settlement"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import AddBusinessDialog from '@/views/partner/customerContract/components/AddBusinessDialog'
import PaymentBaseForm from './PaymentBaseForm'

export default {
	name: 'CRMContractSupplierPaymentDetail',
  props: {
    // 详情或者调整
    operType: {
      type: String,
      default: ''
    }
  },
	components: {
		attachmentList,
		settlement,
    AddBusinessDialog,
    PaymentBaseForm
	},
	data() {
		return {
			id: '',
			type: '',
			role: '',
			attachmentList: [],
			settlementList: [],
			settlementItem: {},
			form: {},
			businessList: [],
			businessItem: {},
			activeBusiness: '',
      isEditBase: false
		}
	},
	created() {
		this.id = this.$route.query.id
		this.contractType = Number(this.$route.query.contractType)
		this.type = this.$route.query.type
		this.role = this.$route.query.role
		this.getDetail()
	},
	methods: {
    editBaseFn() {
      this.isEditBase = true
    },
    cancelBaseFn() {
      this.isEditBase = false
    },
    saveBaseFn() {
      if (this.$refs.paymentBaseFormRef.validate()) {
        let data = this.$refs.paymentBaseFormRef.getValue()
        data.id = this.id
        updateSupplierContractPaymentApi(data).then(res => {
          if (res.ok) {
            this.$message.success(this.$t("contract.edit_success"))
            this.isEditBase = false
            this.getDetail()
          }
        })
      }
    },
    // 新增业务
		addNewBusiness() {
			this.$refs.addBusinessDialogRef.show(this.form)
		},
		parseTime(value) {
			return value ? parseTime(value, '{y}-{m}-{d}') : ''
		},
		// 获取数据后的数据处理
		initData(res) {
			res.customerTitles = res.customerTitles || []
			res.supplierTitles = res.supplierTitles || []
			// 收款和付款
			if (res.contractType === 1 || res.contractType === 2) {
				if (res.businessTypes && res.businessTypes.length) {
					this.businessList = res.businessTypes
					this.activeBusiness = this.businessList[0].businessType
				}
			}
			if (res.customerTitles && res.customerTitles.length) {
				this.settlementList = res.customerTitles
			}
			if (res.supplierTitles && res.supplierTitles.length) {
				this.settlementList = res.supplierTitles
			}
			this.attachmentList = res.attachments || []
			// 试单
			if (res.contractType === 3) {
				this.settlementItem = res.customerTitles[0]
			}
			if (res.contractType === 3 || res.contractType === 10 || res.contractType === 20) {
				if (res.businessTypes && res.businessTypes.length) {
					this.businessItem = res.businessTypes[0]
					res.businessTypeName = res.businessTypes[0].businessTypeName
          this.businessList = res.businessTypes
          this.activeBusiness = this.businessList[0].businessType
				}
			}
			res.credits.forEach(v => {
				v.amount = formatNumberToThousands(v.amount)
			})
			delete res.businessTypes
			delete res.customerTitles
			delete res.supplierTitles
			delete res.attachments
			res.isCanEditTitle = res.id === res.currentContractId

      this.form = {
        ...res,
        settlementCompanyName: res.memberCnName,
        settlementCompanyId: res.memberId
      }

		},
		backList() {
			let name = 'ContractSupplierList'
			if (this.role === 'FINANCE') {
				name = 'ContractSupplierFinanceList'
			}
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: name })
		},
		getDetail() {
			// 收款合同/票结合同/试单合同详情  相同接口
			let fn = this.contractType === 2 || this.contractType === 20 ? getContractPaymentDetailApi : getReceiptContractDetailApi
			fn(this.id).then(res => {
				if (res.ok) {
					this.initData(res.content)
				}
			})
		}
	}
}
</script>
<style scoped lang="scss">
.custmer-detail {
	::v-deep .el-table th > .cell {
		color: #555;
		font-size: 14px;
	}
}

.img-inner {
	position: relative;
	img {
		position: absolute;
		right: 30px;
		width: 120px;
		top: 70px;
	}
}
.info-section-module .info-item .info-label {
  width: 120px;
}
.icon-oper{
  float: right;
  font-size: 22px;
  cursor: pointer;
  color: #0085ff;
}
</style>
