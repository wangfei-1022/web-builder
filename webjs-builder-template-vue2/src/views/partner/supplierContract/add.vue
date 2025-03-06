<template>
  <div class="page-edit-container full-page">
    <div class="customer-edit page-edit-content">
      <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="small" class="member-form">
        <div class="member-item">
          <div class="title">{{ $t("contract.base_info") }} </div>
          <div class="content">
            <el-form-item :label="$t('contract.business_type')" prop="businessType" required v-if="form.contractType === 3 || this.form.contractType === 10 || this.form.contractType === 20">
              <el-select v-model="form.businessType" size="mini" disabled>
                <el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_type')" prop="contractType" required>
              <el-select v-model="form.contractType" size="mini" disabled>
                <el-option v-for="(item, index) in contractTypeList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_kind_name')" prop="contractNameCode" >
              <el-select v-model="form.contractNameCode" size="mini" disabled>
                <el-option v-for="(item, index) in contractNameList" :key="index" :label="item.chineseName" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_name')" prop="customName" v-if="form.contractType === 1 || form.contractType === 2">
              <el-input v-model="form.customName" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_no')" prop="contractNo">
              <el-input v-model="form.contractNo" size="mini" :disabled="!mainId"></el-input>
            </el-form-item>
            <el-form-item :label="$t('contract.customer_company_name')" prop="memberCnName" v-if="(form.contractType === 1 && type === 'CUSTOMER') || form.contractType === 3 || form.contractType === 10">
              <el-input v-model="form.memberCnName" size="mini" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('contract.supplier_company_name')" prop="memberCnName" v-if="(form.contractType === 1 && type === 'SUPPLIER') || form.contractType === 2 || form.contractType === 20">
              <el-input v-model="form.memberCnName" size="mini" disabled></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('contract.business_no')" prop="memberBusinessNo">
              <el-input v-model="form.memberBusinessNo" size="mini" disabled></el-input>
            </el-form-item> -->
            <el-form-item :label="$t('contract.yht_name')" prop="signedOfficeId">
              <el-select v-model="form.signedOfficeId" size="mini" :placeholder="$t('contract.please_select')" disabled >
                <el-option v-for="item in YHTList" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.customer_sign_name')" prop="memberSignatoryId" v-if="(form.contractType === 1 && type === 'CUSTOMER') || form.contractType === 3 || form.contractType === 10">
              <sign-select type="CUSTOMER" v-model="form.memberSignatoryId" :memberId="form.memberId" :disabled="!!mainId"/>
            </el-form-item>
            <el-form-item :label="$t('contract.supplier_sign_name')" prop="memberSignatoryId" v-if="(form.contractType === 1 && type === 'SUPPLIER') || form.contractType === 2 || form.contractType === 20">
              <sign-select type="SUPPLIER" v-model="form.memberSignatoryId" :memberId="form.memberId" :disabled="!!mainId"/>
            </el-form-item>
            <!--一海通签约人-->
            <!-- <el-form-item :label="$t('contract.yht_sign_name')" prop="signatoryId">
              <type-select v-model="form.signatoryId" type="operation" clearable @selected="selectedSignatory"/>
            </el-form-item> -->
            <!--一海通经办人-->
            <el-form-item :label="$t('contract.yht_sign_name')" prop="principalName">
              <type-select v-model="form.principalName" type="operation" clearable @selected="selectedSignatory"/>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_start_time')" prop="periodBegin">
              <common-picker v-model="form.periodBegin" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" :disabled="!!mainId || form.contractType === 3 " @change="periodBeginChange"/>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_end_time')" prop="periodEnd">
              <common-picker v-model="form.periodEnd" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" :disabled="!!mainId || form.contractType === 3 || form.contractType === 10 || form.contractType === 20"/>
            </el-form-item>

            <el-form-item :label="$t('contract.recharge_currency')" prop="rechargeCurrency">
              <el-select v-model="form.rechargeCurrency" size="mini" :placeholder="$t('contract.please_select')" multiple  :disabled="contractType === 3">
                <el-option v-for="item in currenciesList" :key="item.code" :label="item.code" :value="item.code"/>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('contract.remarks')" prop="remarks">
              <el-input v-model="form.remarks" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="$t('contract.credits')" prop="credits" v-if="form.contractType === 1">
              <el-row v-for="(item, index) in form.credits" :key="index">
                <el-col :span="9">
                  <el-select v-model="item.currency" size="mini" :placeholder="$t('contract.please_select')" >
                    <el-option v-for="currency in currenciesList" :key="currency.code" :label="currency.code" :value="currency.code"/>
                  </el-select>
                </el-col>
                <el-col :span="9">
                  <el-input v-model="item.amount" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-col>
                <el-col :span="6">
                  <i class="iconfont icon-add-circle" @click="addCreditsAmount"/>
                  <i class="iconfont icon-minus-circle" @click="removeCreditsAmount(index)" v-if="form.credits.length > 1"/>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </div>
        <div class="member-item" v-if="form.contractType === 1 || form.contractType === 2">
          <div class="title">
            {{$t('contract.business_relative_info')}}
          </div>
          <div class="content">
              <div style="margin-buttom: 20px;">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addBusinessFn">{{$t('contract.add_business')}}</el-button>
              </div>
              <el-tabs v-model="activeBusiness" style="width:100%" v-if="businessList.length">
                <el-tab-pane :label="item.businessTypeName" :name="item.businessType" v-for="(item, index) in businessList" :key="index">

                </el-tab-pane>
              </el-tabs>
          </div>

          <div class="member-item inner" v-if="businessList.length">
            <div class="title">
              <span>{{$t('contract.settlement_info')}}</span>
            </div>
            <div class="content">
              <settlement
                ref="settlementRef"
                :mainId="mainId"
                :contractType="form.contractType"
                :list="settlementList"
                :detail="form"
                :type="type"
                :businessList="businessList"
                :role="role"
                :activeBusiness="activeBusiness"
              >
              </settlement>
            </div>
          </div>

          <div class="member-item inner" v-if="businessList.length">
            <div class="title">
              <span>{{$t('contract.attachment_info')}}</span>
              <span style="font-weight: 500;font-size: 14px;">{{$t('contract.attachment_info_mention')}}</span>
            </div>
            <div class="content">
              <attachment-list  ref="attachmentRef" :list="attachmentList"></attachment-list>
            </div>
          </div>
        </div>

        <div class="member-item" v-if="form.contractType === 3 || form.contractType === 10 || form.contractType === 20">
          <div class="title">
             {{$t('contract.business_relative_info')}}
          </div>
          <div class="content">
              <!-- <account-period ref="accountPeriodRef" :contractType="form.contractType" :business="businessItem" /> -->
          </div>

          <div class="member-item inner">
            <div class="title">
              <span> {{$t('contract.settlement_info')}}</span>
            </div>
            <div class="content" v-if="form.contractType === 10 || form.contractType === 20">
              <settlement
                ref="settlementRef"
                :mainId="mainId"
                :contractType="form.contractType"
                :list="settlementList"
                :detail="form"
                :type="type"
                :businessList="businessList"
                :role="role"
                :activeBusiness="activeBusiness"
              ></settlement>
            </div>
            <div class="content" v-if="form.contractType === 3">
               <settlement-form ref="settlementFormRef" :detail="form" :item="customerTitleItem" :step="2"/>
            </div>
          </div>

          <div class="member-item inner" v-if="form.contractType === 10 || form.contractType === 20">
            <div class="title">
              <span>{{$t('contract.attachment_info')}}</span>
              <span style="font-weight: 500;font-size: 14px;">{{$t('contract.attachment_info_mention')}}</span>
            </div>
            <div class="content">
              <attachment-list  ref="attachmentRef" :list="attachmentList"></attachment-list>
            </div>
          </div>
        </div>
      </el-form>

      <div class="page-edit-footer">
        <el-button size="mini" @click="backList">{{$t("contract.cancel")}}</el-button>
        <el-button size="mini" :loading="loading" @click="saveDraft" v-if="!mainId && (form.contractType === 1 || form.contractType === 2)">{{ $t("contract.save_draft")}}</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit" size="mini" v-if="form.contractType === 1 || form.contractType === 2"> {{$t("contract.submit")}} </el-button>
        <el-button type="primary" :loading="loading" @click="onSubmitTrial" size="mini" v-if="form.contractType === 3 || form.contractType === 10 || form.contractType === 20"> {{$t("contract.submit")}} </el-button>
      </div>
    </div>

     <el-dialog :visible.sync="addVisible" :close-on-click-modal="false" width="500px" :title="$t('contract.new_business')">
      <el-form  ref="addBusinessForm" :model="addBusiness" :rules="addBusinessRule" label-width="150px" size="small">
        <el-form-item :label="$t('contract.business_type')" prop="businessList">
          <el-select v-model="addBusiness.businessList" multiple :placeholder="$t('contract.please_select')" >
            <el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="addVisible = false">{{ $t("contract.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="addBusinessConfirm">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
	getBusinessTypeListApi,
	getContractNameListApi,
	getContractReceiveTypeListApi,
	getContractPaymentTypeListApi,

	getCustomerContractTypeApi, // 客户合同类型
	getSupplierContractTypeApi, // 供应商合同类型

	getSalesApi,
	getCustomerListApi,
	getYHTListApi,
	getProductApi,
	contractTrialInitApi,
	getCustomerSignListApi,
	contractReceiptSaveDraftApi, // 客户收款合同保存草稿
	contractReceiptSupplierSaveDraftApi, // 供应商收款合同保存草稿

	contractReceiptUpdateDraftApi,
	getReceiptContractDetailApi,

	contractReceiptSubmitApi, // 客户收款合同提交
	contractReceiptSupplierSubmitApi, // 供应商收款合同提交

	contractReceiptUpdateSubmitApi,
	receiptChildrenContractInitApi,
	receiptChildrenContractSubmitApi,
	contractTrialSubmitApi,

	contractReceivePieceInitApi, // 收款票结合同初始化
	contractPaymentPieceInitApi, // 付款票结合同初始化
	contractReceivePieceSubmitApi,
	contractPaymentPieceSubmitApi,

	contractSubmitCheckApi,
	contractPaymentSubmitCheckApi,

	contractPaymentDraftApi,
	contractPaymentUpdateDraftApi,
	contractPaymentSubmitApi,
	contractPaymentUpdateSubmitApi,
	paymentChildrenContractInitApi,
	paymentChildrenContractSubmitApi,
	getContractPaymentDetailApi
} from "@/api/partner/supplierContract"
import { getSupplierContactListApi } from '@/api/supplierManage'
import { getCurrenciesListApi } from '@/api/common.js'
import settlement from "./components/settlement"
import attachmentList from "./components/attachmentList"
import settlementForm from "./components/settlementForm"
import moment from 'moment'
import { contractTypeMap } from "@/utils/constant"
import SignSelect from '@/views/partner/customerContract/components/SignSelect'

export default {
	name: 'CRMContractSupplierPaymentAdd',
	components: {
		settlement,
		attachmentList,
		settlementForm,
    SignSelect
	},
	data() {
		return {
			id: '',
			type: '',
			role: '',
			contactList: [],

			contractType: '',
			mainId: '', // 代表是添加子合同
			attachmentList: [], // 附件列表
			settlementList: [],
			currenciesList: [],
			YHTList: [], // 一海通签约主体
			YHTSignList: [], // 一海通签约人
			customerList: [], // 客户签约主体
			customerSignList: [], // 客户签约人
			supplierSignList: [], // 供应商签约人
			productList: [], // 所属产品
			salesList: [], // 所属销售
			contractStatusList: [], // 合同状态
			contractTypeList: [], // 合同类型
			contractNameList: [], // 合同名称
			businessTypeList: [], // 业务类型
			businessTypeMap: {}, //
			oldBusinessList: [], // 子合同时候 用的 不被删除
			businessList: [], // 新增添加的业务类型数据
			businessItem: {}, // 账期信息 在试单合同的时候用的到
			customerTitleItem: {}, // 结算主体信息 在试单合同的时候用的到
			activeBusiness: '', // Tab切换的时候需要的名称
			title: {}, // 试单时候的结算抬头
			form: {
				contractType: '',
				contractTypeName: '',
				memberSignatoryId: '',
				memberSignatoryName: '',
				periodBegin: '',
				periodEnd: '',
				principalId: '',
				principalName: '',
				signatoryId: '',
				memberId: '',
				memberBusinessNo: '',
				memberCnName: '',
				memberEnName: '',
				signedOfficeId: '',
				signedOfficeName: '',
				contractNameCode: '',
				contractNo: '',
				remarks: '',
				credits: [{
					amount: '',
					currency: ''
				}],
        rechargeCurrency: []
			},
			formRule: {
				contractType: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				memberSignatoryId: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				periodBegin: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				periodEnd: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				principalName: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				signatoryId: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				memberCnName: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				memberBusinessNo: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				signedOfficeId: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				contractNameCode: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				customName: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				contractNo: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }],
				rechargeCurrency: [{ required: true,	message: this.$t("contract.cannot_be_null"),	trigger: "change" }]
			},
			addVisible: false,
			addBusiness: {
				businessList: []
			},
			addBusinessRule: {
				businessList: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}]
			},
			loading: false
		}
	},
	created() {
		// contractType 1 收款 2 付款 3 试单 10票结
		// type CUSTOMER 客户 SUPPLIRTER 供应商
		this.id = this.$route.query.id
		this.type = this.$route.query.type
		this.role = this.$route.query.role
		this.contractType = Number(this.$route.query.contractType)
		this.mainId = this.$route.query.mainId
		// 编辑
		if (this.id) {
			this.getDetail()
		} else if (this.mainId) { // 添加子合同时，初始化子合同
			this.childrenInit()
		} else {
			let data = {
				bankAccount: this.$route.query.bankAccount,
				businessType: this.$route.query.businessType,
				memberId: this.$route.query.memberId,
				customName: this.$route.query.customName,
				memberBusinessNo: this.$route.query.memberBusinessNo,
				memberEnName: this.$route.query.memberEnName,
				memberCnName: this.$route.query.memberCnName,
				signedOfficeId: this.$route.query.signedOfficeId,
				signedOfficeName: this.$route.query.signedOfficeName,
				rechargeCurrency: this.$route.query.rechargeCurrency,
				settlementCompanyId: this.$route.query.settlementCompanyId,
				settlementCompanyName: this.$route.query.settlementCompanyName,
				contractType: Number(this.$route.query.contractType)
			}

      this.form.settlementCompanyId = data.memberId
      this.form.settlementCompanyName = data.memberCnName

			// 如果是试单合同 并且是新增 则需要初始化接口
			// 如果是收款和付款合同，则不需要初始化
			if ((data.contractType === contractTypeMap.RECEIPT_TRIAL_CONTRACT ||
				data.contractType === contractTypeMap.RECEIPT_RECEIVE_PIECE_CONTRACT ||
				data.contractType === contractTypeMap.RECEIPT_PAYMENT_PIECE_CONTRACT) && !this.id) {
				this.contractNeedInit(data)
			} else {
				this.form.signedOfficeId = data.signedOfficeId
				this.form.memberId = data.memberId
				this.form.memberCnName = data.memberCnName
				this.form.memberEnName = data.memberEnName
				this.form.memberId = data.memberId
				this.form.customName = data.customName
				this.form.contractNo = this.$route.query.contractNo
				this.form.contractNameCode = this.$route.query.contractNameCode
				this.form.contractType = data.contractType
				this.getBaseDataFn()
			}
		}
	},
	methods: {
		// 获取数据后的数据处理
		initData(res) {
			if (res.businessTypes && res.businessTypes.length) {
				this.businessList = res.businessTypes
				this.oldBusinessList = res.businessTypes
				this.activeBusiness = this.businessList[0].businessType
			}
			this.settlementList = res.customerTitles || res.supplierTitles || []
			this.attachmentList = res.attachments || []
			delete res.businessTypes
			delete res.customerTitles
			delete res.supplierTitles
			delete res.attachmentList
			// 默认构造一项
			if (res.credits && res.credits.length === 0) {
				res.credits = [{
					amount: '',
					currency: ''
				}]
			}
			this.form = {
        ...res,
        settlementCompanyName: res.memberCnName,
        settlementCompanyId: res.memberId
      }
			this.getBaseDataFn()
		},

		// 子合同初始化
		childrenInit() {
			let fn = this.contractType === 1 ? receiptChildrenContractInitApi : paymentChildrenContractInitApi
			fn({ mainContractId: this.mainId }).then(res => {
				if (res.ok) {
					this.initData(res.content)
				}
			})
		},

		// 获取详情进行回显
		getDetail() {
			let fn = this.contractType === 1 ? getReceiptContractDetailApi : getContractPaymentDetailApi
			fn(this.id).then(res => {
				if (res.ok) {
					this.initData(res.content)
				}
			})
		},
		// 试单合同/票结合同初始化
		contractNeedInit(data) {
			let fn = null
			if (data.contractType === contractTypeMap.RECEIPT_TRIAL_CONTRACT) {
				fn = contractTrialInitApi
			} else if (data.contractType === contractTypeMap.RECEIPT_RECEIVE_PIECE_CONTRACT) {
				fn = contractReceivePieceInitApi
			} else if (data.contractType === contractTypeMap.RECEIPT_PAYMENT_PIECE_CONTRACT) {
				fn = contractPaymentPieceInitApi
			}

			fn(data).then(res => {
				if (res.ok) {
					if (res.content.businessTypes && res.content.businessTypes.length) {
						this.businessItem = res.content.businessTypes[0]
            this.businessList = res.content.businessTypes
            this.activeBusiness = this.businessList[0].businessType
					}
					if (res.content.customerTitles && res.content.customerTitles.length) {
						let item = res.content.customerTitles[0] || {}
						item.isEdit = true
						this.customerTitleItem = item
					}
					delete res.content.businessTypes
					delete res.content.customerTitles
					this.form = {
            ...this.form,
            ...res.content
          }
					this.form.contractType = data.contractType
					this.form.businessType = this.$route.query.businessType

					this.getBaseDataFn()
				}
			})
		},
		// 新增业务
		addBusinessFn() {
			let arr = []
			this.businessList.forEach(x => {
				if (!this.mainId) {
					arr.push(x.businessType)
				} else {
					// 当是子合同的时候 需要处理。
					// 从之前主合同合并过来 且不能做删除
					if (!x.id) {
						arr.push(x.businessType)
					}
				}
			})

			this.addBusiness.businessList = arr
			this.addVisible = true
		},
		addBusinessConfirm() {
			this.$refs.addBusinessForm.validate(valid => {
				if (valid) {
					this.addVisible = false
					let arr = []
					this.addBusiness.businessList.forEach(x => {

						// 从现有的先查找有没有
						let index = this.businessList.findIndex(item => item.businessType === x)
						// 查找到了
						if (index >= 0) {
							arr.push(this.businessList[index])
						} else {
							arr.push({
								businessType: x,
								businessTypeName: this.businessTypeMap[x].chineseName
							})
						}
					})
					// 当是子合同的时候 需要处理。
					// 从之前主合同合并过来 且不能做删除
					if (this.mainId) {
						arr = this.oldBusinessList.concat(arr)
					}
					this.businessList = arr
					this.activeBusiness = this.addBusiness.businessList[0]
				}
			})
		},
		// 获取所需的基础数据
		getBaseDataFn() {
			let getContractTypeListApi = this.type === 'CUSTOMER' ? getCustomerContractTypeApi : getSupplierContractTypeApi
			Promise.all([getContractNameListApi(), getContractTypeListApi(),
			getBusinessTypeListApi(), getSalesApi(), getYHTListApi(), getCurrenciesListApi(), getProductApi()]).then(results => {
				const contractNameRes = results[0]
				const contractTypeRes = results[1]
				const businessTypeRes = results[2]
				const salesRes = results[3]
				const YHTListRes = results[4]
				const currenciesListRes = results[5]
				const productRes = results[6]
				if (contractNameRes.ok) {
					this.contractNameList = contractNameRes.content
					if (this.form.contractNameCode) {
						this.contractNameList.forEach(x => {
							if (x.code === this.form.contractNameCode) {
								this.form.contractName = x.chineseName
							}
						})
					}
				}
				if (contractTypeRes.ok) {
					this.contractTypeList = contractTypeRes.content
				}
				if (businessTypeRes.ok) {
					let arr = []
					let externalJson = []
					contractNameRes.content.forEach(v => {
						if (v.code === this.form.contractNameCode) {
							try {
								externalJson = JSON.parse(v.externalJson) // 业务名称 关联的可选合同类型
							} catch (error) {
								externalJson = []
							}
						}
					})
					businessTypeRes.content.forEach(x => {
						let index = this.businessList.findIndex(b => b.businessType === x.code)
						// 已经存在主合同中 不能被更改
						// 假如是子合同。则把之前的需要移除掉。不能被修改。
						if (this.mainId && index >= 0) {
							// 则不能被添加
						} else {
							let flag = false
							if (externalJson.length > 0 && flag) {
								// 合同名称映射了业务类型
								// 确定了合同名称之后，所以只能勾选相应的业务类型
								if (externalJson.indexOf(x.code) >= 0) {
									arr.push(x)
								}
							} else {
								// externalJson没有值 则是所有。
								arr.push(x)
							}
						}
					})
					this.businessTypeList = arr
					this.businessTypeList.forEach(x => {
						this.businessTypeMap[x.code] = x
					})
				}
				if (salesRes.ok) {
					this.salesList = salesRes.content
				}
				if (YHTListRes.ok) {
					this.YHTList = YHTListRes.content
					if (this.form.signedOfficeId) {
						this.YHTList.forEach(x => {
							if (x.value === this.form.signedOfficeId) {
								this.form.signedOfficeName = x.label
							}
						})
					}

				}
				if (currenciesListRes.ok) {
					this.currenciesList = currenciesListRes.content
				}
				if (productRes.ok) {
					this.productList = productRes.content
				}

				// // 付款合同则是给到所属产品数据
				// if (this.form.contractType === 2) {
				//   this.YHTSignList = this.productList
				// } else if (this.form.contractType === 1 || this.form.contractType === 3) {
				//   this.YHTSignList = this.salesList
				// }
			})

			// 客户签约人的数据
			getCustomerSignListApi(this.form.memberId).then(res => {
				if (res.ok) {
					this.customerSignList = res.content
				}
			})

			// 供应商签约人的数据
			getSupplierContactListApi(this.form.memberId).then(res => {
				if (res.ok) {
					this.supplierSignList = res.content
				}
			})
		},
		// 合同开始时间
		periodBeginChange(val) {
			if (this.form.contractType === 10 || this.form.contractType === 20) {
				this.form.periodEnd = moment(val).valueOf() + 30 * 24 * 60 * 60 * 1000
			}
		},
		selectedSignatory(item) {
			this.form.principalId = item.id
			this.form.principalName = item.chineseName
		},
		// 收集数据
		collectContractData() {
			let all = {
				...this.form,
				id: this.id,
				businessTypes: [],
				customerTitles: [], // 收款合同使用
				supplierTitles: [], // 付款合同使用
				attachments: []
			}
			if (this.form.contractType === 3 || this.form.contractType === 10 || this.form.contractType === 20 || this.mainId) {
				// 来自接口返回的模板id 进行提交
				all.id = this.form.id
			}
			if (all.signatoryId) {
				this.YHTSignList.forEach(x => {
					if (x.id === all.signatoryId) {
						all.signatoryName = x.chineseName
					}
				})
			}
			if (all.memberSignatoryId) {
				this.supplierSignList.forEach(x => {
					if (x.id === all.memberSignatoryId) {
						all.memberSignatoryName = x.contact
					}
				})

				this.customerSignList.forEach(x => {
					if (x.id === all.memberSignatoryId) {
						all.memberSignatoryName = x.contact
					}
				})
			}
			// 收款取值
			if (this.form.contractType === 1 || this.form.contractType === 2) {
				all.businessTypes = this.businessList
			}
			if (this.$refs.settlementRef) {
				all.customerTitles = this.$refs.settlementRef.getValue()
				all.supplierTitles = this.$refs.settlementRef.getValue()
			}
			if (this.$refs.attachmentRef) {
				all.attachments = this.$refs.attachmentRef.getValue()
			}
			// 在试单取值
			if (this.form.contractType === 3) {
				let title = this.$refs.settlementFormRef.getValue()
				all.customerTitles = [title]
			}
			// 在试单 票结取值
			if (this.form.contractType === 3 || this.form.contractType === 10 || this.form.contractType === 20) {
				// let business = this.$refs.accountPeriodRef.getValue()
				all.businessTypes = this.businessList
			}

			if (all.periodBegin) {
				let date = moment(parseInt(all.periodBegin, 10)).format('YYYY-MM-DD') + ' 00:00:00'
				all.periodBegin = moment(date).valueOf()
			}
			if (all.periodEnd) {
				let date = moment(parseInt(all.periodEnd, 10)).format('YYYY-MM-DD') + ' 23:59:59'
				all.periodEnd = moment(date).valueOf()
			}
			return all
		},

		// 保存草稿
		saveDraft() {
			let data = this.collectContractData()
			let fn = null
			if (this.form.contractType === 1 && this.type === 'CUSTOMER') {
				fn = this.id ? contractReceiptUpdateDraftApi : contractReceiptSaveDraftApi
			} else if (this.form.contractType === 1 && this.type === 'SUPPLIER') {
				fn = this.id ? contractReceiptUpdateDraftApi : contractReceiptSupplierSaveDraftApi
			} else if (this.form.contractType === 2) {
				fn = this.id ? contractPaymentUpdateDraftApi : contractPaymentDraftApi
			}
			if (!fn) {
				return
			}
			this.loading = true
			fn(data).then(res => {
				if (res.ok) {
					this.$message.success(this.$t("contract.save_draf_success"))
					this.backList()
				}
				this.loading = false
			})
		},
		// 收款提交
		async onSubmit() {
			let VA = true
			this.$refs.baseForm.validate(valid => {
				VA = valid
				if (!valid) {
					this.mixinsFormScrollIntoView()
				}
			})
			let REF = true
			Object.keys(this.$refs).forEach(name => {
				if (name.indexOf('accountPeriod') >= 0) {
					if (this.$refs[name][0]) {
						let valid = this.$refs[name][0].validate()
						if (!valid) {
							REF = valid
						}
					}
				}
			})
      let ATTACHMENT = true
      if (this.$refs.attachmentRef) {
				ATTACHMENT = this.$refs.attachmentRef.validate()
			}

			if (!VA || !REF || !ATTACHMENT) {
				return
			}

			let data = this.collectContractData()

			if (data.contractType === 1) {
				let currencyList = [];
				let VALID_CURRENY_REPEAT = false
				this.form.credits.forEach(v => {
					if (currencyList.indexOf(v.currency) >= 0) {
						VALID_CURRENY_REPEAT = true
					} else {
						currencyList.push(v.currency)
					}
				})
				if (VALID_CURRENY_REPEAT) {
					this.$message.error(this.$t("contract.credits_can_not_repeat"))
					return
				}
			}

			if (data.periodBegin > data.periodEnd) {
				this.$message.error(this.$t("contract.period_date_error"))
				return
			}

			if (data.businessTypes <= 0) {
				this.$message.error(this.$t("contract.please_add_business_data"))
				return
			}
			if (data.supplierTitles <= 0) {
				this.$message.error(this.$t("contract.please_add_title_data"))
				return
			}

      let checkExDate = true
      data.supplierTitles.forEach(v => {
        if (v.defaultStartTime < data.periodBegin || v.defaultStartTime > data.periodEnd) {
          checkExDate = false
        }
      })

      if (!checkExDate) {
				this.$message.error(this.$t("contract.defaultStartTimeError"))
				return
			}

			let fn = null
			if (this.id) {
				// 编辑
				fn = this.form.contractType === 1 ? contractReceiptUpdateSubmitApi : contractPaymentUpdateSubmitApi
			} else if (this.mainId) {
				// 子合同
				fn = this.form.contractType === 1 ? receiptChildrenContractSubmitApi : paymentChildrenContractSubmitApi
			} else {
				// 新建提交
				if (this.form.contractType === 1) {
					fn = this.type === 'CUSTOMER' ? contractReceiptSubmitApi : contractReceiptSupplierSubmitApi
				} else {
					fn = contractPaymentSubmitApi
				}
			}
			let submitFun = () => {
				this.loading = true
				fn(data).then(res => {
					if (res.ok) {
						this.$message.success(this.$t("contract.submit_success"))
						this.backList()
					}
					this.loading = false
				})
			}
			// 校验是不是有已存在的票结合同 // 会提示是否覆盖
			let checkData = {
				memberId: data.memberId,
				periodBegin: data.periodBegin,
				periodEnd: data.periodEnd,
				businessTypes: []
			}
			data.businessTypes.forEach(v => {
				checkData.businessTypes.push(v.businessType)
			})
			let checkFn = this.form.contractType === 1 ? contractSubmitCheckApi : contractPaymentSubmitCheckApi
			let res = await checkFn(checkData)
			if (res.content) {
				this.$confirm(res.content, this.$t("common.tips"), {
					confirmButtonText: this.$t("common.confirm"),
					cancelButtonText: this.$t("common.cancel")
				}).then(() => {
					submitFun()
				}).catch(() => {
					// 取消
				});
			} else {
				submitFun()
			}

		},
		// 试单提交 票结合同
		onSubmitTrial() {
			let VA = true
			this.$refs.baseForm.validate(valid => {
				VA = valid
				if (!valid) {
					this.mixinsFormScrollIntoView()
				}
			})
			let AP = true
			if (this.$refs.accountPeriodRef) {
				AP = this.$refs.accountPeriodRef.validate()
			}
			let SF = true
			if (this.$refs.settlementFormRef) {
				SF = this.$refs.settlementFormRef.validate()
			}

			if (!VA || !AP || !SF) {
				return
			}
			let data = this.collectContractData()

			if (data.customerTitles <= 0) {
				this.$message.error(this.$t("contract.please_add_title_data"))
				return
			}

			this.loading = true
			let fn = null
			if (data.contractType === contractTypeMap.RECEIPT_TRIAL_CONTRACT) {
				fn = contractTrialSubmitApi
			} else if (data.contractType === contractTypeMap.RECEIPT_RECEIVE_PIECE_CONTRACT) {
				fn = contractReceivePieceSubmitApi
			} else if (data.contractType === contractTypeMap.RECEIPT_PAYMENT_PIECE_CONTRACT) {
				fn = contractPaymentPieceSubmitApi
			}
			fn(data).then(res => {
				if (res.ok) {
					this.$message.success(this.$t("contract.submit_success"))
					this.backList()
				}
				this.loading = false
			})
		},
		// 合同授信额度
		addCreditsAmount() {
			this.form.credits.push({
				amount: '',
				currency: ''
			})
		},
		removeCreditsAmount(index) {
			this.form.credits.splice(index, 1)
		},
		// 返回
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
		}
	}
}
</script>
<style scoped lang="scss">
.customer-edit {
	::v-deep .el-table th > .cell {
		color: #555;
		font-size: 14px;
	}

	::v-deep .el-select {
		width: 100%;
	}
	.member-item {
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
			padding: 0 20px;
		}
	}

	.member-item.inner {
		padding: 20px 20px;
	}

	::v-deep .el-form-item {
		width: 50%;
		float: left;
	}
	.height33 {
		height: 33px;
	}

	.full-line {
		margin-right: 40px;
	}
}

.icon-add-circle,
.icon-minus-circle {
	color: #1890ff;
	font-size: 24px;
	margin-left: 10px;
}
</style>
