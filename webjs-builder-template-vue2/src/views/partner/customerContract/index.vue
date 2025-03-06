<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini" class="contract-search">
            <el-form-item :label="$t('contract.contract_kind_name')" prop="contractNameCode">
               <el-select v-model="formData.contractNameCode" size="mini" @change="getList">
                <el-option :label="$t('contract.ALL')" value="" />
                <el-option v-for="(item, index) in contractNameList" :key="index" :label="item.chineseName" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_type')" prop="contractType">
              <el-select v-model="formData.contractType" size="mini" @change="getList" >
                <el-option :label="$t('contract.ALL')" value="" />
                <el-option v-for="(item, index) in contractTypeList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.business_type')" prop="businessType">
              <base-select v-model="formData.businessType" type="businessType" addALL @selected="getList" />
            </el-form-item>
            <el-form-item :label="$t('contract.sales_and_product')" prop="principalId" v-if="false">
              <el-select v-model="formData.principalId" size="mini" @change="getList" filterable>
                <el-option :label="$t('contract.ALL')" value="" />
                <el-option v-for="(item, index) in salesAndProductList" :key="index" :label="item.chineseName" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.contract_status')" prop="contractStatus">
              <el-select v-model="formData.contractStatus" size="mini" @change="getList">
                <el-option :label="$t('contract.ALL')" value="" />
                <el-option v-for="(item, index) in contractStatusList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.company_name_sign')" prop="memberId">
              <type-select v-model="formData.memberId" type="customer" @selected="getList" />
            </el-form-item>
            <el-form-item :label="$t('contract.sign_name')" prop="memberSignatoryName">
              <el-input v-model="formData.memberSignatoryName" type="text" :placeholder="$t('contract.please_enter')" size="mini"  clearable @keyup.enter.native="getList"/>
            </el-form-item>
            <el-form-item :label="$t('contract.yht_name')" prop="signedOfficeId">
              <base-select v-model="formData.signedOfficeId" type="settlementOffice" addALL @selected="getList" />
            </el-form-item>
            <el-form-item :label="$t('contract.contract_no')" prop="contractNo">
              <el-input v-model="formData.contractNo" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="$t('contract.prepaidFlag')" prop="prepaidFlag">
              <el-select v-model="formData.prepaidFlag" size="mini" @change="getList">
                <el-option :label="$t('contract.ALL')" value="" />
                <el-option :label="$t('common.YES')" :value="true" />
                <el-option :label="$t('common.NO')" :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('contract.period')" prop="period">
              <common-picker pikcerType="daterange"	v-model="formData.period"	@change="getList" clearable/>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="table-wrap">
      <div style="padding: 0px 0 10px 0;" class="top-btn-wrap">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(1)" v-permission="['cms:customer:add:receipt']">{{$t('contract.receipt_contract')}}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(3)" v-if="false">{{$t('contract.trial_contract')}}</el-button><!--票结合同转试单合同，-->
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(10)" v-permission="['cms:customer:add:piece']">{{$t('contract.trial_contract')}}</el-button>
      </div>

      <el-table
        class="yht-table yht-aggird-table"
        :data="tableData" 
        :height="tableHeight" 
        style="width: 100%;" 
        row-key="id" 
        border 
        size="mini"
        lazy
        :load="loadFn"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column fixed="left" type="selection" width="40" />
        <el-table-column prop="contractTypeName" :label="$t('contract.contract_type')" min-width="120"></el-table-column>
        <el-table-column prop="contractName" :label="$t('contract.contract_kind_name')" min-width="220"></el-table-column>
        <el-table-column prop="customName" :label="$t('contract.contract_name')" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :title="scope.row.customName">{{scope.row.customName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractNo" :label="$t('contract.contract_no')" min-width="180"></el-table-column>
        <el-table-column prop="businessTypeStr" :label="$t('contract.business_type')" min-width="130" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :title="scope.row.businessTypeStr">{{scope.row.businessTypeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memberCnName" :label="$t('contract.company_name_sign')" min-width="250"> </el-table-column>
        <el-table-column prop="memberSignatoryName" :label="$t('contract.sign_name')"  min-width="120"> </el-table-column>
        <el-table-column prop="signedOfficeName" :label="$t('contract.yht_name')"  min-width="300"></el-table-column>
        <el-table-column prop="principalName" :label="$t('contract.yht_sign_name')" min-width="120"></el-table-column>
        <el-table-column prop="memberPrincipalName" :label="$t('contract.sales_and_product')" min-width="120" v-if="false"></el-table-column>
        <el-table-column prop="periodBegin" :label="$t('contract.contract_start_time')" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.periodBegin | parseDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="periodEnd" :label="$t('contract.contract_end_time')" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.periodEnd | parseDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractStatusName" :label="$t('contract.contract_status')" min-width="100">
          <template slot-scope="scope">
            <span :class="'STATUS-' + scope.row.contractStatus">{{scope.row.contractStatusName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="prepaidFlag" :label="$t('contract.prepaidFlag')" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.prepaidFlag === null ? '' : (scope.row.prepaidFlag ? $t('common.YES') : $t('common.NO'))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createByName" :label="$t('contract.create_by_name')" min-width="100"></el-table-column>
        <el-table-column prop="createTime" :label="$t('contract.create_time')" min-width="150">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="operationBtn" :label="$t('contract.operation')" min-width="180">
          <template slot-scope="{row, $index}">
            <a class="link" @click="showDetailFn(row)" v-permission="['cms:customer:view']">{{$t('contract.view')}}</a>
            <a class="link" @click="addNewBusiness(row)" v-permission="['cms:customer:add:business']" v-if="((!row.hasChildren && !row.isChildren) || row.isLastContract) && row.contractStatus === 30 && (row.contractType === 1 || row.contractType === 2)">新增业务</a>
            <a class="link" @click="edit(row)" v-permission="['cms:customer:update']" v-if="!row.isChildren && row.contractStatus === 10">{{$t('contract.edit')}}</a>
            <a class="link" @click="adjustFn(row)" v-permission="['cms:customer:adjust']" v-if="!row.isChildren && row.contractStatus !== 10 && row.contractStatus !== 50">{{$t('contract.adjust')}}</a>
            <a class="link" @click="deleteFn($index)" v-permission="['cms:customer:delete']" v-if="!row.isChildren && row.contractStatus === 10">{{$t('contract.delete')}}</a>
            <a class="link" @click="addChildren(row)" v-permission="['cms:customer:add:sub']" v-if="false && !row.isChildren && row.contractStatus === 30 && (row.contractType === 1 || row.contractType === 2)">{{$t('contract.add_children')}}</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :limit.sync="formData.pageSize" :page.sync="formData.pageNum" @pagination="getList"/>
    </div>

    <el-dialog v-if="addVisible" :visible.sync="addVisible" :close-on-click-modal="false" width="500px" :title="addTitle">
      <el-form ref="addDataForm" :model="addData" :rules="addDataRule" label-width="150px" size="mini" class="member-form">
        <el-form-item :label="$t('contract.contract_no')" prop="contractNo" v-if="addType === 1 || addType === 2">
          <el-input v-model="addData.contractNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('contract.contract_kind_name')" prop="contractNameCode" v-if="addType === 1 || addType === 2">
           <el-select v-model="addData.contractNameCode" size="mini">
              <el-option v-for="(item, index) in contractNameList" :key="index" :label="item.chineseName" :value="item.code"/>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract.contract_name')" prop="customName" v-if="addType === 1 || addType === 2">
          <el-input v-model="addData.customName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('contract.business_type')" prop="businessType" v-if="addType === 3 || addType === 10 || addType === 20">
          <base-select v-model="addData.businessType" type="businessType" />
        </el-form-item>
        <el-form-item :label="$t('contract.customer_company_name')" prop="memberId" v-if="addType === 1 || addType === 3 || addType === 10">
          <type-select v-model="addData.memberId" type="customer" @selected="customerChange" />
        </el-form-item>
        <el-form-item :label="$t('contract.yht_name')" prop="signedOfficeId">
          <el-select v-model="addData.signedOfficeId"  :placeholder="$t('contract.please_select')">
            <el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract.settlement_company_name')" prop="settlementCompanyId" v-if="addType === 3">
          <type-select v-model="addData.settlementCompanyId" @selected="settlementChange" type="member" />
        </el-form-item>
        <el-form-item :label="$t('contract.currency')" prop="rechargeCurrency" v-if="addType === 3">
          <base-select v-model="addData.rechargeCurrency" type="currency" />
        </el-form-item>
        <el-form-item :label="$t('contract.bank_account')" prop="bankAccount" v-if="addType === 3">
          <el-input v-model="addData.bankAccount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="addVisible = false">{{ $t("contract.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="addConfirm">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="renewVisible" :visible.sync="renewVisible" :close-on-click-modal="false" width="500px" :title="$t('contract.renew')">
      <el-form ref="renewFormRef" :model="renewForm" :rules="renewFormRule" label-width="110px" size="mini" class="member-form">
        <div style="color: red; padding-left: 20px; margin-bottom: 15px;">{{$t('contract.renewInfo')}}</div>
        <el-form-item :label="$t('contract.oldPeriodArr')" prop="contractNo">
          <span>{{renewForm.oldPeriodBegin | parseDate}} ~ {{renewForm.oldPeriodEnd | parseDate}}</span>
        </el-form-item>
        <el-form-item :label="$t('contract.renewPeriodArr')" prop="periodArr">
          <search-date-picker v-model="renewForm.periodArr" disabledStart></search-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="renewVisible = false">{{ $t("contract.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="renewConfirm" :loading="renewLoading">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="deleteVisible" :close-on-click-modal="false" width="400px" :title='$t("contract.delete")'>
      <div style="text-align: center; padding: 25px;">{{$t("contract.delete_confirm")}}</div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="deleteVisible = false">{{ $t("contract.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="deleteConfirmFn" :loading="deleteLoading">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>

    <add-business-dialog ref="addBusinessDialogRef" @success="getList"/>
  </div>
</template>
<script>
import topSearchItems from '@/components/Cargo/Common/topSearchItems'
import {
	getContractListApi,
	getContractNameListApi,
	getCustomerContractTypeApi,
	getSupplierContractTypeApi,
	getContractStatusListApi,
	getSalesAndProductApi,
	getCustomerListApi,
	getYHTListApi,
	getContractChildrenListApi,
	deleteContractApi,
	getCustomerContractListApi, // 客户合同
	getSupplierContractListApi, // 供应商合同产品
	getSupplierContractFinanceListApi, // 供应商合同财务
	addNewBusinessReceiveApi, // 收款合同-新增业务
	addNewBusinessPaymentApi, // 付款合同-新增业务
  getSettlementTitleStatusListApi,
  invalidSupplierPaymentContractApi, // 付款合同作废
  renewSupplierPaymentContractApi // 付款合同续签
} from '@/api/partner/customerContract'
import { validEmail } from "@/utils/validate"
import { getBusinessTypeListApi, checkContractNoIsUniqueApi } from "@/api/partner/customerContract"
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import { getCurrenciesListApi } from '@/api/common.js'
import { contractTypeMap } from "@/utils/constant"
import AddBusinessDialog from './components/AddBusinessDialog'

export default {
	name: 'ContractCustomerList',
	components: {
		topSearchItems,
		cargoLimitedSelect,
    AddBusinessDialog
	},
	props: {
		type: {
			type: String,
			default: ''
		},
		role: {
			type: String,
			default: ''
		}
	},
	data() {

		const validateContractNo = (rule, value, callback) => {
			if (value) {
				checkContractNoIsUniqueApi({ contractNo: value }).then(
					res => {
						if (res && res.ok && res.content) {
							callback(this.$t("contract.contract_no_cannot_be_repeat"))
						} else {
							callback()
						}
					}
				)
			}
		}

		const formData = {
			contractNo: '',
			period: [],
			signedOfficeId: '',
			businessType: '',
			memberId: '',
			name: '',
			periodBegin: '',
			periodEnd: '',
			memberSignatoryName: '',
      settlementTitleStatus: '',
			contractType: '',
			contractStatus: '',
			contractNameCode: '',
			principalId: '',
      prepaidFlag: "",
			pageSize: 50,
			pageNum: 1
		}

		return {
			deleteVisible: false,
			deleteIndex: null,
			deleteLoading: false,

			addTitle: '',
			addType: '',
			addVisible: false,
			addData: {
				signedOfficeId: "",
				contractNo: "",
				contractNameCode: "",
				memberBusinessNo: '',
				memberId: '',
				memberCnName: '',
				memberEnName: '',

				settlementCompanyId: '',
				settlementCompanyName: '',
				businessType: '',
				bankAccount: '',
				rechargeCurrency: ''
			},
			addDataRule: {
				contractNo: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}, {
					validator: validateContractNo,
					trigger: "blur"
				}],
				signedOfficeId: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
				contractNameCode: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
				customName: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
				memberId: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
				settlementCompanyId: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
				businessType: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
				bankAccount: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}],
				rechargeCurrency: [{
					required: true,
					message: this.$t("contract.cannot_be_null"),
					trigger: "change"
				}]
			},
			currenciesList: [],
			YHTList: [],
			customerList: [],
			salesAndProductList: [],
			contractStatusList: [],
			contractTypeList: [],
			contractNameList: [],
			businessTypeList: [],
			customerTypeList: [],
      settlementTitleStatusList: [],
			loading: false,
			defaultFilter: formData,
			formData: this.$extends({}, formData),
			total: 0,
			tableData: [],
			selectedIds: [],
			multipleSelection: []
		}
	},
	activated() {
		this.getList()
	},
	created() {
		this.getBaseDataFn()
		this.getList()
	},
	methods: {
		deleteFn(index) {
			this.deleteVisible = true
			this.deleteIndex = index
		},
		deleteConfirmFn() {
			if (this.deleteIndex !== null) {
				this.deleteLoading = true
				let item = this.tableData[this.deleteIndex]
				deleteContractApi(item.id).then(res => {
					if (res.ok) {
						this.tableData.splice(this.deleteIndex, 1)
						this.$message.success(this.$t("contract.delete_success"))
						this.deleteVisible = false
					}
					this.deleteLoading = false
				})
			}
		},
		customerChange(item) {
			this.addData.memberBusinessNo = item.businessLicenceNo
			this.addData.memberEnName = item.englishName
			this.addData.memberCnName = item.chineseName
		},
		settlementChange(item) {
			this.addData.settlementCompanyName = item.chineseName
		},
		handleSelectionChange(val) {
			let arr = []
			val.forEach(function (v) {
				arr.push(v.id)
			})
			this.selectedIds = arr
			this.multipleSelection = val
		},

		getBaseDataFn() {
			Promise.all([getContractNameListApi(), getCustomerContractTypeApi(),
			getBusinessTypeListApi(), getContractStatusListApi(), getSalesAndProductApi(),
			getCustomerListApi(), getYHTListApi(), getCurrenciesListApi(), getSettlementTitleStatusListApi()]).then(results => {
				const contractNameRes = results[0]
				const contractTypeRes = results[1]
				const businessTypeRes = results[2]
				const contractStatusRes = results[3]
				const salesAndProductRes = results[4]
				const customerListRes = results[5]
				const YHTListRes = results[6]
				const currenciesListRes = results[7]
				const settlementTitleStatusRes = results[8]

				if (contractNameRes.ok) {
					this.contractNameList = contractNameRes.content
				}
				if (contractTypeRes.ok) {
					this.contractTypeList = contractTypeRes.content
				}
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content
				}
				if (contractStatusRes.ok) {
					this.contractStatusList = contractStatusRes.content
				}
				if (salesAndProductRes.ok) {
					this.salesAndProductList = salesAndProductRes.content
				}
				if (customerListRes.ok) {
					this.customerList = customerListRes.content
				}
				if (YHTListRes.ok) {
					this.YHTList = YHTListRes.content
				}
				if (currenciesListRes.ok) {
					this.currenciesList = currenciesListRes.content
				}
				if (settlementTitleStatusRes.ok) {
					this.settlementTitleStatusList = settlementTitleStatusRes.content
				}
			})
		},

		async getList() {
			this.loading = true
			if (this.formData.period) {
				this.formData.periodBegin = this.formData.period[0]
				this.formData.periodEnd = this.formData.period[1]
			}
			const res = await getCustomerContractListApi(this.formData).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				res.content.list.forEach(function (v) {
					if (v.contractType !== contractTypeMap.RECEIPT_TRIAL_CONTRACT &&
						v.contractType !== contractTypeMap.RECEIPT_RECEIVE_PIECE_CONTRACT &&
						v.contractType !== contractTypeMap.RECEIPT_PAYMENT_PIECE_CONTRACT) {
						v.hasChildren = v.mainContractId !== v.currentContractId
					}
					let businessTypeStr = []
					v.businessTypes.forEach(x => {
						businessTypeStr.push(x.businessTypeName)
					})
					v.businessTypeStr = businessTypeStr.join('、')
				})
				this.tableData = []
				this.$nextTick(() => {
					this.tableData = res.content.list
				})
				this.total = Number(res.content.total)
				this.loading = false
			} else {
				this.tableData = []
				this.total = 0
				this.loading = false
			}
		},
		loadFn(tree, treeNode, resolve) {
			getContractChildrenListApi(tree.id).then(res => {
				let arr = []
				if (res.content) {
					res.content.forEach(function (v, index) {
						v.oldId = v.id
						v.id = index + new Date().getTime()
						v.isChildren = true

						let businessTypeStr = []
						v.businessTypes.forEach(x => {
							businessTypeStr.push(x.businessTypeName)
						})
						v.businessTypeStr = businessTypeStr.join('、')

						v.isLastContract = tree.currentContractId === v.oldId
						arr.push(v)
					})
				}
				resolve(arr)
			})
		},
		// 新增业务
		addNewBusiness(row) {
			this.$refs.addBusinessDialogRef.show(row)
		},
		showDetailFn(row) {
			let id = row.isChildren ? row.oldId : row.id
      this.$router.push({
        name: 'CRMContractCustomerReceiptDetail',
        query: {
          id: id,
          contractType: row.contractType,
          type: this.type,
          role: this.role
        }
      })
		},
		add(type) {
			this.addData = {
				signedOfficeId: "",
				contractNo: "",
				contractNameCode: "",
				memberBusinessNo: '',
				memberId: '',
				memberCnName: '',
				memberEnName: '',
				customName: '', // 自定义合同名称

				settlementCompanyId: '',
				settlementCompanyName: '',
				businessType: '',
				bankAccount: '',
				rechargeCurrency: ''
			}
			if (type === 1) {
				this.addTitle = this.$t('contract.new_receipt_contract')
			} else if (type === 2) {
				this.addTitle = this.$t('contract.new_pay_contract')
			} else if (type === 3) {
				this.addTitle = this.$t('contract.new_trial_contract')
			} else if (type === 10) {
				this.addTitle = this.$t('contract.new_piece_contract')
			} else if (type === 20) {
				this.addTitle = this.$t('contract.new_piece_contract')
			}

			this.addType = type
			this.addVisible = true
		},
    adjustFn(row) {
      let id = row.isChildren ? row.oldId : row.id
      this.$router.push({
        name: 'CRMContractCustomerReceiptAdjust',
        query: {
          id: id,
          contractType: row.contractType,
          type: this.type,
          role: this.role
        }
      })
    },
		edit(row) {
			this.$router.push({
				name: 'CRMContractCustomerReceiptEdit',
				query: {
					id: row.id,
					contractType: row.contractType,
					type: this.type,
					role: this.role
				}
			})
		},
		addChildren(row) {
			// 添加子合同时候传mainId
      this.$router.push({
        name: 'CRMContractCustomerReceiptAddChild',
        query: {
          mainId: row.mainContractId,
          contractType: row.contractType,
          type: this.type,
          role: this.role
        }
      })

		},
		addConfirm() {
			this.$refs.addDataForm.validate(valid => {
				if (valid) {
					let data = {
						contractType: this.addType,
						...this.addData
					}
					let i = this.YHTList.findIndex(item => item.value === data.signedOfficeId)
					data.signedOfficeName = this.YHTList[i].label
					this.$router.push({
						name: 'CRMContractCustomerReceiptAdd',
						query: {
							...data,
							type: this.type,
							role: this.role
						}
					})
					this.addVisible = false
				}
			})
		},
		reset() {
			this.formData = this.$extends({}, this.defaultFilter)
			this.getList()
		}
	}
}
</script>
<style lang="scss" scoped>
.contract-search {
	::v-deep .el-select {
		width: 180px;
	}
	::v-deep .el-input {
		width: 180px;
	}
}
.link {
	color: #1890ff;
}
.STATUS-10 {
	color: #aaa;
}
.STATUS-20 {
	color: #ff0000;
}
.STATUS-30 {
	color: #1890ff;
}
.STATUS-40 {
	color: #ff9000;
}
</style>

