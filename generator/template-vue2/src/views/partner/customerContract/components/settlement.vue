<template>
	<div class="contact-table">
    <el-button size="mini" type="primary" @click="copyHeader()" v-if="operType !== 'DETAIL'" class="contact-add" icon="el-icon-plus" style="right: 115px">
      {{$t("contract.copy_header")}}
    </el-button>
    <el-button size="mini" type="primary" @click="addOrEditContact()" v-if="operType !== 'DETAIL'" class="contact-add" icon="el-icon-plus">{{$t("contract.settlement_company_name")}}</el-button>

		<el-table :data="settlementList" :row-class-name="rowClassName" border style="width: 100%">
			<el-table-column prop="settlementCompanyName" :label='$t("contract.settlement_company_name")' min-width="280"></el-table-column>
			<el-table-column prop="titleTypeName" :label='$t("contract.header_type")' min-width="80"></el-table-column>
			<el-table-column prop="rechargeModeName" :label='$t("contract.recharge_mode")' min-width="160"></el-table-column>
			<el-table-column prop="businessTypeName" :label='$t("contract.business_type")' min-width="180"></el-table-column>
			<el-table-column prop="defaultStartTime" :label='$t("contract.start_time")' min-width="180">
				<template slot-scope="scope">
					<span>{{scope.row.defaultStartTime | parseTime}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="billOffsetTypeName" :label='$t("contract.bill_base")' min-width="140">
				<template slot-scope="{row}">
					{{row.billBaseTypeName}} {{row.billOffsetTypeName}}
				</template>
			</el-table-column>
			<el-table-column prop="statementOffsetTypeName" :label='$t("contract.statement_base")' min-width="140">
				<template slot-scope="{row}">
					{{row.statementBaseTypeName}} {{row.statementOffsetTypeName}}
				</template>
			</el-table-column>
			<el-table-column prop="invoiceOffsetTypeName" :label='$t("contract.invoice_base")' min-width="140">
				<template slot-scope="{row}">
					{{row.invoiceBaseTypeName}} {{row.invoiceOffsetTypeName}}
				</template>
			</el-table-column>
			<el-table-column prop="receiptOffsetTypeName" :label='$t("contract.receipt_base")' min-width="140">
				<template slot-scope="{row}">
					{{row.receiptBaseTypeName}} {{row.receiptOffsetTypeName}}
				</template>
			</el-table-column>

			<el-table-column prop="attachments" :label='$t("contract.Enclosure")' min-width="120">
				<template slot-scope="{ row }">
					<span v-if="$isNotEmpty(row.attachments)">
						<span v-for="(item, index) in row.attachments" :key="index">
              <a :href="item.url" target="_blank" style="color: blue">{{item.originFileName}}</a>
            </span>
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="oper" :label='$t("contract.operation")' min-width="120" fixed="right">
				<template slot-scope="{row, $index}">
          <a class="link" @click="addOrEditContact(row, $index)" v-if="!row.id">{{$t("contract.edit")}}</a>
					<a class="link" @click="deleteContactFn($index, row)" v-if="!row.id || (operType !== 'DETAIL' && operType !== 'ADJUST')">{{$t("contract.delete")}}</a>
					<a class="link" @click="auditOrDetailFn(row, 'AUDIT')" v-if="role === 'FINANCE' && (row.settlementTitleStatus != 30) && (contractType === 2 || contractType === 20)">审核</a>
					<a class="link" @click="auditOrDetailFn(row, 'DETAIL')" v-if="role === 'FINANCE' && (contractType === 2 || contractType === 20)">查看</a>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog v-if="settlementVisible" :visible.sync="settlementVisible" @close="closeFn" :close-on-click-modal="false" width="800px" :title="settlementTitle">
			<settlement-form key="CUSTOMER" :type="type" :step="step" ref="settlementFormRef" :item="settlementFormData" :contractType="contractType" :businessList="businessList" :detail="detail"></settlement-form>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="settlementVisible = false">{{ $t("contract.cancel") }}</el-button>
				<!--客户合同和供应商收款合同调整了-->
				<template v-if="type === 'CUSTOMER' || (type=== 'SUPPLIER'&& contractType === 1)">
					<el-button size="mini" type="primary" v-if="type === 'CUSTOMER' || (type=== 'SUPPLIER'&& contractType === 1)" @click="contactConfirmNew">{{ $t("contract.confirm") }}</el-button>
				</template>
				<template v-else>
					<el-button size="mini" type="primary" v-if="step === 1 && !settlementFormData.isEdit" @click="next">{{ $t("contract.next") }}</el-button>
					<el-button size="mini" type="primary" v-if="step === 2 && !settlementFormData.isEdit" @click="step = 1">{{ $t("contract.pre") }}</el-button>
					<el-button size="mini" type="primary" v-if="(step === 2 && !settlementFormData.isEdit) || settlementFormData.isEdit" @click="contactConfirm">{{ $t("contract.confirm") }}</el-button>
				</template>
			</div>
		</el-dialog>

		<el-dialog :visible.sync="auditVisible" :close-on-click-modal="false" width="800px" :title='$t("contract.titleType")'>
			<div class="settlement-title-container">
				<div class="settlement-title-des">{{ $t("contract.titleTypeInfo") }}</div>
				<div class="item">
					<label>{{$t("contract.titleType")}}</label>
					<span>{{auditRow.settlementCompanyName}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.currency")}}</label>
					<span>{{auditRow.rechargeCurrency}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.bank_account")}}</label>
					<span>{{auditRow.bankAccount}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.bank_no")}}</label>
					<span>{{auditRow.bankNo}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.bank_name")}}</label>
					<span>{{auditRow.bankName}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.bank_branch")}}</label>
					<span>{{auditRow.bankBranch}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.bank_address")}}</label>
					<span>{{auditRow.bankAddress}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.swift_code")}}</label>
					<span>{{auditRow.swiftCode}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.effective_time")}}</label>
					<span>{{auditRow.defaultStartTime}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.Enclosure")}}</label>
					<span>
						<span class="file-show" v-for="(item,index) in auditRow.files || []" :key="index">
							<a :href="item.url" target="_blank">{{item.originFileName}}</a><br />
						</span>
					</span>
				</div>
			</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="auditVisible = false" v-if="auditType === 'DETAIL'">{{ $t("contract.close") }}</el-button>
				<el-button size="mini" @click="auditVisible = false" v-if="auditType === 'AUDIT'">{{ $t("contract.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="auditConfirm" :loading="auditLoading" v-if="auditType === 'AUDIT'">{{ $t("contract.audit_accept") }}</el-button>
			</div>
		</el-dialog>

		<el-dialog :visible.sync="deleteVisible" :close-on-click-modal="false" width="400px" :title='$t("contract.delete_settlement")'>
			<div style="text-align: center; padding: 25px;">{{$t("contract.confirm_delete_settlement")}}</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="deleteVisible = false">{{ $t("contract.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="deleteConfirmFn">{{ $t("contract.confirm") }}</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="copyHeaderVisible" :close-on-click-modal="false" width="1000px" :title="$t('contract.historical_settlement_entity')">
			<el-table :data="historicalSettlementList" @selection-change="handleSelectionChange" max-height="400" border style="width: 100%">
				<el-table-column type="selection" width="55" fixed>
				</el-table-column>
				<el-table-column prop="index" :label='$t("contract.index")' width="50">
					<template slot-scope="{$index}">
						<span>{{$index +1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="settlementCompanyName" :label='$t("contract.settlement_company_name")' min-width="200" show-overflow-tooltip></el-table-column>
				<el-table-column prop="rechargeModeName" :label='$t("contract.recharge_mode")' min-width="80"></el-table-column>
				<el-table-column prop="businessTypeName" :label='$t("contract.business_type")' min-width="120"></el-table-column>
				<el-table-column prop="defaultStartTime" :label='$t("contract.effective_time")' min-width="120">
					<template slot-scope="{row}">
						{{row.defaultStartTime | parseTime}}
					</template>
				</el-table-column>
				<el-table-column prop="titleTypeName" :label='$t("contract.header_type")' min-width="130"></el-table-column>
				<el-table-column prop="billOffsetTypeName" :label='$t("contract.bill_base")' min-width="140">
					<template slot-scope="{row}">
						{{row.billBaseTypeName}} {{row.billOffsetTypeName}}
					</template>
				</el-table-column>
				<el-table-column prop="statementOffsetTypeName" :label='$t("contract.statement_base")' min-width="140">
					<template slot-scope="{row}">
						{{row.statementBaseTypeName}} {{row.statementOffsetTypeName}}
					</template>
				</el-table-column>
				<el-table-column prop="invoiceOffsetTypeName" :label='$t("contract.invoice_base")' min-width="140">
					<template slot-scope="{row}">
						{{row.invoiceBaseTypeName}} {{row.invoiceOffsetTypeName}}
					</template>
				</el-table-column>
				<el-table-column prop="receiptOffsetTypeName" :label='$t("contract.receipt_base")' min-width="140">
					<template slot-scope="{row}">
						{{row.receiptBaseTypeName}} {{row.receiptOffsetTypeName}}
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="copyHeaderVisible = false">{{ $t("contract.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="copyHeaderConfirmFn">{{ $t("contract.confirm") }}</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import SettlementForm from "./settlementForm";
import { getSettlementInfoApi, addReceiveSettlementInfoApi, editReceiveSettlementInfoApi, deleteReceiveSettlementInfoApi, addPaymentSettlementInfoApi, editPaymentSettlementInfoApi, deletePaymentSettlementInfoApi, auditSupplierTitleApi, settlementcompanyApi, settlementCompanyBySupplierReceiptApi } from "@/api/partner/customerContract";
import lodash from "lodash";
export default {
	name: "Settlement",
	components: {
		SettlementForm
	},
	props: {
		operType: {
			type: String,
			default: ''
		},
		detail: {
			type: Object,
			default: function () {
				return {};
			}
		},
		postList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		list: {
			type: Array,
			default: function () {
				return [];
			}
		},
		contractType: {
			type: [String, Number],
			default: ""
		},
		mainId: {
			type: [String, Number],
			default: ""
		},
		businessList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		activeBusiness: {
			type: [String, Number],
			default: ""
		}
	},
	watch: {
		list: {
			handler(val) {
				let arr = this.$extends(true, [], val);
				this.settlementList = arr;
			},
			deep: true,
			immediate: true
		},
		postList: {
			handler(val) {
				(val || []).forEach(x => {
					this.postMap[x.code] = x.name;
				});
			},
			deep: true
		}
	},
	data() {
		return {
			step: 1,
			type: "",
			role: "",

			settlementVisible: false,
			settlementTitle: "",
			settlementList: [],
			settlementFormData: {},
			deleteVisible: false,
			deleteIndex: null,
			deleteRow: {},
			auditRow: {},
			auditType: "",
			auditVisible: false,
			auditLoading: false,
			copyHeaderVisible: false, // 复制结算主体
			copyHeaderForm: {},
			index: null,
			multipleSelection: [],
			historicalSettlementList: []
		};
	},
	created() {
		this.type = this.$route.query.type;
		this.role = this.$route.query.role;
	},
	methods: {
		rowClassName(val) {
			if (this.activeBusiness === val.row.businessType) {
				return;
			} else {
				return "hide";
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		getValue() {
			return this.settlementList;
		},
		next() {
			let valid = this.$refs.settlementFormRef.validate();
			if (valid) {
				let data = this.$refs.settlementFormRef.getValue();
				if (data.bankAccount && data.rechargeCurrency) {
					getSettlementInfoApi(data).then(res => {
						if (res.ok) {
							this.$refs.settlementFormRef.setValue(res.content || {});
						}
					});
				}
				this.step = 2;
			}
		},
		closeFn() {
			this.settlementFormData = {};
			this.$refs.settlementFormRef.resetFields();
		},
		contactConfirmNew() {
			let valid = this.$refs.settlementFormRef.validate();
			if (valid) {
				let data = this.$refs.settlementFormRef.getValue();
				data.contractId = this.detail.id;
				// 正常的进行编辑和新增 并不提交到后端

				if (this.index !== null && this.index >= 0) {
					this.settlementVisible = false;
					this.settlementList.splice(this.index, 1, data);
				} else {
					let validRepeat = false;
					this.settlementList.forEach(v => {
						if (v.bankAccount === data.bankAccount && v.settlementCompanyId === data.settlementCompanyId && v.rechargeCurrency === data.rechargeCurrency) {
							validRepeat = true;
						}
					});
					if (validRepeat) {
						this.$message.error(this.$t("contract.settlement_title_repeat"));
						return;
					}
					let iLength = data.settlementCompanyArr.length || 1;
					let jLength = data.businessTypeArr.length || 1;
					for (let i = 0; i < iLength; i++) {
						for (let j = 0; j < jLength; j++) {
							let dataCopy = lodash.cloneDeep(data);
							if (data.settlementCompanyArr[i]) {
								dataCopy.settlementCompanyName = data.settlementCompanyArr[i].chineseName;
								dataCopy.settlementCompanyId = data.settlementCompanyArr[i].id;
							}
							if (data.businessTypeArr[j]) {
								dataCopy.businessType = data.businessTypeArr[j].businessType;
								dataCopy.businessTypeName = data.businessTypeArr[j].businessTypeName;
							}
							delete dataCopy.settlementCompanyArr;
							delete dataCopy.businessTypeArr;

							let isSome = this.settlementList.some(val => dataCopy.settlementCompanyId === val.settlementCompanyId && dataCopy.businessType === val.businessType && Number(dataCopy.defaultStartTime) === Number(val.defaultStartTime));
							if (isSome) {
                // 存在相同结算主体、业务类型、开始时间的数据！
								this.$message.error(this.$t("contract.sameDataCheckInfo"));
								return false;
							}
							this.settlementList.push(dataCopy);
						}
					}
					this.closeFn();
					this.settlementVisible = false;
				}
			}
		},
		contactConfirm() {
			let valid = this.$refs.settlementFormRef.validate();
			if (valid) {
				let data = this.$refs.settlementFormRef.getValue();
				data.contractId = this.detail.id;
				// 详情里面进行编辑和新增 提交到后端
				if (this.operType === 'ADJUST') {
					// 2 为付款合同 其他的类型则是归类到收款合同里去（票结和试单）
					if (this.index !== null && this.index >= 0) {
						let fn = this.contractType === 2 || this.contractType === 20 ? editPaymentSettlementInfoApi : editReceiveSettlementInfoApi;
						fn(data).then(res => {
							if (res.ok) {
								this.settlementVisible = false;
								this.$emit("detailRefresh");
								this.$message.success(this.$t("contract.edit_success"));
							}
						});
					} else {
						// 2 为付款合同 其他的类型则是归类到收款合同里去（票结和试单）
						let fn = this.contractType === 2 || this.contractType === 20 ? addPaymentSettlementInfoApi : addReceiveSettlementInfoApi;
						fn(data).then(res => {
							if (res.ok) {
								this.settlementVisible = false;
								this.$emit("detailRefresh");
								this.$message.success(this.$t("contract.add_success"));
							}
						});
					}
					return;
				}

				// 正常的进行编辑和新增 并不提交到后端
				if (this.index !== null && this.index >= 0) {
					this.settlementVisible = false;
					this.settlementList.splice(this.index, 1, data);
				} else {
					let validRepeat = false;
					this.settlementList.forEach(v => {
						if (v.bankAccount === data.bankAccount && v.settlementCompanyId === data.settlementCompanyId && v.rechargeCurrency === data.rechargeCurrency) {
							validRepeat = true;
						}
					});
					if (validRepeat) {
						this.$message.error(this.$t("contract.settlement_title_repeat"));
						return;
					}
					this.settlementList.push(data);
					this.settlementVisible = false;
				}
			}
		},
		async copyHeader() {
			this.auditLoading = true;
      let fn = this.type === 'CUSTOMER' ? settlementcompanyApi : settlementCompanyBySupplierReceiptApi
			let res = await fn(this.detail.memberId);
			this.auditLoading = false;
			if (res.ok) {
				let businessListArr = this.businessList.map(item => item.businessType);
				let historicalSettlementList = res.content.filter(item => businessListArr.indexOf(item.businessType) > -1);
				this.historicalSettlementList = historicalSettlementList;
				this.copyHeaderVisible = true;
			}
		},
		copyHeaderConfirmFn() {
			if (this.$isEmpty(this.multipleSelection)) {
				this.$message.error(this.$t("contract.multipleSelectorEmpty"));
				return;
			}
			this.multipleSelection.map(item => {
				delete item.id;
				delete item.contractId;
				delete item.attachments;
			});
			// let isSome = this.settlementList.some(val => {
			//   let res = this.multipleSelection.some(item => item.settlementCompanyId ==== val.settlementCompanyId && item.businessType ==== val.businessType &&
			//     Number(item.defaultStartTime) ==== Number(val.defaultStartTime))
			//   if (res) {
			//     return true
			//   }
			// })
			// if (isSome) {
			//   this.$message.error('存在相同结算主体、业务类型、开始时间的数据！')
			//   return false
			// }
			this.settlementList.push(...this.multipleSelection);
			this.multipleSelection = [];
			this.copyHeaderVisible = false;
		},
		addOrEditContact(item, index) {
			if (item) {
				item.isEdit = true;
				this.step = 2;
				this.index = index;
				if (!item.id) {
					item.editType = "new";
				}
				this.settlementFormData = item;
				this.settlementTitle = this.$t("contract.edit_settlement");
			} else {
				this.step = 1;
				this.index = null;
				this.settlementFormData = {
					settlementCompanyId: "",
					settlementCompanyName: "",
					rechargeCurrency: "",
					bankAccount: "",
					bankName: "",
					bankBranch: "",
					tel: "",
					swiftCode: "",
					address: "",
					taxNum: ""
				};
				if (this.settlementList.length === 0) {
					this.settlementFormData.settlementCompanyId = this.detail.memberId;
					this.settlementFormData.settlementCompanyName = this.detail.memberCnName;
				}
				this.settlementTitle = this.$t("contract.new_settlement");
			}
			this.settlementVisible = true;
		},
		deleteConfirmFn() {
			if (this.deleteIndex !== null) {
				if (!this.deleteRow.id) {
					this.settlementList.splice(this.deleteIndex, 1);
					this.deleteVisible = false;
				} else {
					let fn = this.contractType === 1 || this.contractType === 3 || this.contractType === 10 ? deleteReceiveSettlementInfoApi : deletePaymentSettlementInfoApi;
					fn(this.deleteRow.id).then(res => {
						if (res.ok) {
							this.deleteVisible = false;
							this.$emit("detailRefresh");
							this.$message.success(this.$t("contract.delete_success"));
						}
					});
				}
			}
		},
		deleteContactFn(index, row) {
			this.deleteVisible = true;
			this.deleteIndex = index;
			this.deleteRow = row;
		},
		auditOrDetailFn(row, type) {
			this.auditVisible = true;

			this.auditRow = row;
			this.auditType = type;
		},
		auditConfirm() {
			let id = this.auditRow.id;
			this.auditLoading = true;
			auditSupplierTitleApi(id).then(res => {
				if (res.ok) {
					this.auditVisible = false;
					this.$emit("detailRefresh");
					this.$message.success(this.$t("contract.auditAcceptSuccess"));
				}
				this.auditLoading = false;
			});
		}
	}
};
</script>
<style scoped lang="scss">
.contact-table {
	position: relative;
}
.contact-add {
	position: absolute;
	right: 0px;
	top: -55px;
}
.link {
	color: #1890ff;
}
.contact-form {
	::v-deep .el-form-item {
		width: 100% !important;
	}
}
.settlement-title-container {
	overflow: hidden;
	.settlement-title-des {
		font-weight: 600;
		margin-bottom: 20px;
		font-size: 17px;
	}
	.item {
		width: 50%;
		float: left;
		line-height: 35px;
		display: flex;

		label {
			font-weight: 500;
			width: 100px;
			text-align: right;
			display: inline-block;
			margin-right: 10px;
		}
	}
}
.file-show {
	color: #108ee9;
}
::v-deep .hide {
	display: none;
}
</style>
