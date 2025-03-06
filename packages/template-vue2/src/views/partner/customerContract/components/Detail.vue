<template>
  <div class="page-edit-container full-page" v-loading="loading">
    <div class="custmer-detail page-edit-content">
      <div class="module">
        <div class="title">{{ form.contractTypeName }}{{ $t("contract.contract_detail")}}</div>
        <div class="content">
          <div class="module inner img-inner">
            <img src="@/assets/effective.png" v-if="form.contractStatus === 30"/>
            <img src="@/assets/effective_lose.png" v-if="form.contractStatus === 20"/>
            <img src="@/assets/effective_to_be.png" v-if="form.contractStatus === 40"/>
            <img src="@/assets/effective_invalid.png" v-if="form.contractStatus === 50"/>
            <div class="title">{{ $t("contract.base_info") }}</div>
            <div class="content">
              <div class="item" v-if="form.contractType === 3 || form.contractType === 10 || form.contractType === 20">
                <label>{{ $t("contract.business_type") }}：</label>
                <span>{{form.businessTypeName}}</span>
              </div>
              <div class="item" v-if="form.contractType === 1 || form.contractType === 2">
                <label>{{ $t("contract.contract_type") }}：</label>
                <span>{{form.contractTypeName}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.contract_name") }}：</label>
                <span>{{form.contractName}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.contract_no") }}：</label>
                <span>{{form.contractNo}}</span>
              </div>
              <div class="item" v-if="(form.contractType === 1 && type === 'CUSTOMER') || form.contractType === 3 || form.contractType === 10">
                <label>{{ $t("contract.customer_company_name") }}：</label>
                <span>{{form.memberCnName}}</span>
              </div>
              <div class="item" v-if="(form.contractType === 1 && type === 'SUPPLIER') ||form.contractType === 2 || form.contractType === 20">
                <label>{{ $t("contract.supplier_company_name") }}：</label>
                <span>{{form.memberCnName}}</span>
              </div>
              <div class="item" v-if="false">
                <label>{{ $t("contract.business_no") }}：</label>
                <span>{{form.memberBusinessNo}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.yht_name") }}：</label>
                <span>{{form.signedOfficeName}}</span>
              </div>
              <div class="item" v-if="(form.contractType === 1 && type === 'CUSTOMER') || form.contractType === 3 || form.contractType === 10">
                <label>{{ $t("contract.customer_sign_name") }}：</label>
                <span>{{form.memberSignatoryName}}</span>
              </div>
              <div class="item" v-if="(form.contractType === 1 && type === 'SUPPLIER') ||form.contractType === 2 || form.contractType === 20">
                <label>{{ $t("contract.supplier_sign_name") }}：</label>
                <span>{{form.memberSignatoryName}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.yht_sign_name") }}：</label>
                <span>{{form.principalName}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.contract_start_time") }}：</label>
                <span>{{parseTime(form.periodBegin)}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.contract_end_time") }}：</label>
                <span>{{parseTime(form.periodEnd)}}</span>
              </div>
              <div class="item" v-if="false">
                <label>{{ $t("contract.sales") }}：</label>
                <span>{{form.memberPrincipalName}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.deposit") }}：</label>
                <span v-if="form.deposit">{{form.deposit.currency}} {{form.deposit.amount}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.recharge_currency") }}：</label>
                <span v-if="form.rechargeCurrency">{{form.rechargeCurrency.join(',')}}</span>
              </div>
              <div class="item">
                <label>{{ $t("contract.remarks") }}：</label>
                <span>{{form.remarks}}</span>
              </div>
              <div class="item" v-if="form.contractType === 1 || (form.contractType === 10  && businessList[0] && businessList[0].businessType === 'OVERSEAS_WAREHOUSE')">
                <label>{{ $t("contract.credits") }}：</label>
                <span>
                  <div v-for="(item, index) in form.credits" :key="index">{{item.currency}}&nbsp;&nbsp;{{item.amount}}</div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="module" v-if="form.contractType === 1 || form.contractType === 2 || form.contractType === 10">
        <div class="title">{{ $t("contract.business_relative_info") }}</div>
        <div class="content">
          <el-tabs v-model="activeBusiness" style="width:100%" v-if="businessList.length">
            <el-tab-pane :label="item.businessTypeName" :name="item.businessType" v-for="(item, index) in businessList" :key="index">
<!--              <account-period-detail :item="item" :contractType="form.contractType"></account-period-detail>-->
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="module inner">
          <div class="title">{{$t("contract.settlement_info")}}</div>
          <div class="content">
            <settlement :list="settlementList" ref="settlementInfo" :activeBusiness="activeBusiness" :operType="operType" @detailRefresh="getDetail" :contractType="form.contractType" :businessList="businessList" :detail="form"></settlement>
          </div>
        </div>

        <div class="module inner">
          <div class="title">
            <span>{{$t('contract.attachment_info')}}</span>
            <span style="font-weight: 500;font-size: 14px;">{{$t('contract.attachment_info_mention')}}</span>
          </div>
          <div class="content">
            <attachment-list :list="attachmentList" :operType="operType" :id="id"></attachment-list>
          </div>
        </div>
      </div>

      <div class="module" v-if="form.contractType === 3 || form.contractType === 20">
        <div class="title">{{ $t("contract.business_relative_info") }}</div>
        <div class="content">
<!--            <account-period-detail :item="businessItem" :contractType="form.contractType"></account-period-detail>-->
        </div>

        <div class="module inner" v-if="form.contractType === 10 || form.contractType === 20">
          <div class="title">{{$t("contract.settlement_info")}}</div>
          <div class="content">
            <settlement :list="settlementList" :operType="operType" @detailRefresh="getDetail" :contractType="form.contractType" :detail="form"></settlement>
          </div>
        </div>

        <div class="module inner" v-if="form.contractType === 10 || form.contractType === 20">
          <div class="title">
            <span>{{$t('contract.attachment_info')}}</span>
            <span style="font-weight: 500;font-size: 14px;">{{$t('contract.attachment_info_mention')}}</span>
          </div>
          <div class="content">
            <attachment-list :list="attachmentList" :operType="operType" :id="id"></attachment-list>
          </div>
        </div>

        <div class="module inner" v-if="form.contractType === 3">
          <div class="title">{{$t("contract.settlement_info")}}</div>
          <div class="content">
            <div class="item">
              <label>{{ $t("contract.settlement_company_name") }}：</label>
              <span>{{settlementItem.settlementCompanyName}}</span>
            </div>
            <div class="item">
              <label>{{ $t("contract.currency") }}：</label>
              <span>{{settlementItem.rechargeCurrency}}</span>
            </div>
            <div class="item">
              <label>{{ $t("contract.bank_account") }}：</label>
              <span>{{settlementItem.bankAccount}}</span>
            </div>
              <div class="item">
              <label>{{ $t("contract.bank_name") }}：</label>
              <span>{{settlementItem.bankName}}</span>
            </div>
              <div class="item">
              <label>{{ $t("contract.bank_branch") }}：</label>
              <span>{{settlementItem.bankBranch}}</span>
            </div>
              <div class="item">
              <label>{{ $t("contract.tax_num") }}：</label>
              <span>{{settlementItem.taxNum}}</span>
            </div>
            <div class="item">
              <label>{{ $t("contract.address") }}：</label>
              <span>{{settlementItem.address}}</span>
            </div>
            <div class="item">
              <label>{{ $t("contract.tel") }}：</label>
              <span>{{settlementItem.tel}}</span>
            </div>
            <div class="item">
              <label>{{ $t("contract.swift_code") }}：</label>
              <span>{{settlementItem.swiftCode}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-edit-footer">
      <el-button type="primary" size="mini" plain @click="backList">{{ $t("contract.close") }}</el-button>
      <el-button type="primary" @click="onSubmit" size="mini" v-if="(type === 'CUSTOMER' || (type === 'SUPPLIER'&& contractType === 1)) && operType === 'ADJUST'"> {{$t("contract.submit")}} </el-button>

    </div>
  </div>

</template>
<script>
import {getReceiptContractDetailApi, getContractPaymentDetailApi, customerTitleBatchApi, supplierReceiptTitleBatchApi} from "@/api/partner/customerContract"
import attachmentList from "./attachmentList"
import settlement from "./settlement"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import lodash from 'lodash'
export default {
	name: 'CRMContractCustomerReceiptDetail',
	components: {
		attachmentList,
		settlement
	},
  props: {
    // 详情或者调整
    operType: {
      type: String,
      default: ''
    }
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
      loading: false
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
		parseTime(value) {
			return value ? parseTime(value, '{y}-{m}-{d}') : ''
		},
		// 获取数据后的数据处理
		initData(res) {
			res.customerTitles = res.customerTitles || []
			res.supplierTitles = res.supplierTitles || []
			// 收款和付款
			if (res.contractType === 1 || res.contractType === 2 || res.contractType === 10) {
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
				}
			}
			res.credits.forEach(v => {
				v.amount = formatNumberToThousands(v.amount)
			})
      if (!res.deposit) {
        res.deposit = {}
      }
			delete res.businessTypes
			delete res.customerTitles
			delete res.supplierTitles
			delete res.attachments
			res.isCanEditTitle = res.id === res.currentContractId
			this.form = res

		},
		backList() {
			let name = 'ContractCustomerList'
			if (this.type === 'CUSTOMER') {
				name = 'ContractCustomerList'
			}
			if (this.type === 'SUPPLIER' && this.role === 'PRODUCT') {
				name = 'ContractSupplierList'
			}
			if (this.type === 'SUPPLIER' && this.role === 'FINANCE') {
				name = 'ContractSupplierFinanceList'
			}
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: name })
		},
    async onSubmit() {
      // this.loading = true
      let data = this.$refs.settlementInfo.getValue()
      let subData = data.filter(item => !item.id)
      subData.map(item => {
        item.contractId = this.id
      })
      let isSome
      data.map((item, i) => {
        isSome = data.some((item2, k) => {
          if (i !== k && item.settlementCompanyId === item2.settlementCompanyId && item.businessType === item2.businessType &&
            item.defaultStartTime === item2.defaultStartTime) {
            return true
          }
        })
      })
      if (isSome) {
        // 存在相同结算主体、业务类型、开始时间的数据！
        this.$message.error(this.$t('contract.sameDataCheckInfo'))
        return false
      }

      let fn = this.type === 'CUSTOMER' ? customerTitleBatchApi : supplierReceiptTitleBatchApi
      const res = await fn(subData)
      this.loading = false
      if (res.ok) {
        this.$message.success(this.$t('contract.submit_success'))
        this.backList()
      }
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

	.module {
		overflow: hidden;
		padding: 20px 0;
		background: #fff;
		margin-bottom: 20px;
		border-radius: 5px;

		.title {
			font-size: 16px;
			font-weight: 600;
			border-bottom: 1px solid #f0f2f5;
			margin-bottom: 15px;
			padding: 0 20px 15px 20px;
		}
		.content {
			padding: 0 25px;
		}
		.img {
			display: block !important;
			border: 1px dashed #ccc;
			border-radius: 6px;
			width: 300px;
			height: 180px;
			cursor: pointer;
			padding: 0;
			float: left;

			img {
				width: 100%;
				height: 100%;
				-o-object-fit: cover;
				object-fit: cover;
			}
		}
		.item {
			width: 50%;
			float: left;
			margin-bottom: 15px;
			display: flex;

			label {
				width: 130px;
				display: block;
				text-align: right;
				margin-bottom: 15px;
				font-weight: 500;
				font-size: 14px;
				float: left;
				margin-right: 6px;
			}
			span {
				font-weight: 500;
				font-size: 14px;
				display: inline;
				flex: 1;
			}
		}
	}
	.module.inner {
		padding: 20px 20px;
	}
}

.img-inner {
	position: relative;
	img {
		position: absolute;
		right: 30px;
		width: 120px;
		top: 0px;
	}
}
</style>
