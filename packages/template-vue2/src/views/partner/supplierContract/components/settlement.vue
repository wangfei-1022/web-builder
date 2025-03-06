<template>
	<div class="contact-table">
    <el-button size="mini" type="primary" @click="addOrEditContact()" class="contact-add" icon="el-icon-plus" v-if="operType !== 'DETAIL'">
      {{$t("contract.settlement_company_name")}}
    </el-button>

		<el-table :data="dataList" border style="width: 100%">
			<el-table-column prop="index" :label='$t("contract.index")' width="50">
				<template slot-scope="{$index}">
					<span>{{$index +1}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="settlementCompanyName" :label='$t("contract.settlement_company_name")' min-width="280"></el-table-column>
      <el-table-column prop="rechargeModeName" :label='$t("contract.recharge_mode")' min-width="160"></el-table-column>
      <el-table-column prop="paymentBaseTypeName" :label='$t("contract.payment_base")' min-width="160">
        <template slot-scope="scope">
					<span>{{scope.row.paymentBaseTypeName}} {{scope.row.paymentOffsetTypeName }}</span>
				</template>
      </el-table-column>
			<el-table-column prop="defaultStartTime" :label='$t("contract.default_start_time")' min-width="160">
				<template slot-scope="scope">
					<span>{{scope.row.defaultStartTime | parseTime}}</span>
				</template>
			</el-table-column>
      <el-table-column prop="businessLicence" :label='$t("contract.businessLicence")' min-width="160">
        <template slot-scope="scope">
					<span v-if="scope.row.businessLicence">
            <a class="link" :href="scope.row.businessLicence.url" target="_blank">{{scope.row.businessLicence.originFileName}}</a>
          </span>
				</template>
      </el-table-column>
			<el-table-column prop="settlementTitleStatusName" :label='$t("contract.settlementTitleStatusName")' min-width="120" v-if="contractType === 2 || contractType === 20"></el-table-column>
      <el-table-column prop="settlementTitleRefusalReason" :label='$t("contract.rejectReason")' min-width="160"></el-table-column>
      <el-table-column prop="oper" :label='$t("contract.operation")' min-width="120" fixed="right">
				<template slot-scope="{row, $index}">
					<span v-if="role === 'PRODUCT' && operType !== 'DETAIL'">
            <a class="link" @click="addOrEditContact(row, $index)" v-if="row.settlementTitleStatus === 10 || row.settlementTitleStatus === 40 || !row.settlementTitleStatus">{{$t("contract.edit")}}</a>
            <a class="link delete" @click="deleteContactFn(row)" v-if="(row.settlementTitleStatus === 40 || !row.settlementTitleStatus) && operType !== 'ADJUST'">{{$t("contract.delete")}}</a>
          </span>
					<a class="link" @click="auditOrDetailFn(row, 'AUDIT')" v-if="role === 'FINANCE' && row.settlementTitleStatus === 20">{{$t("contract.audit")}}</a>
					<a class="link" @click="auditOrDetailFn(row, 'DETAIL')" v-if="operType === 'DETAIL' || operType === 'ADJUST'">{{$t("contract.view")}}</a>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog v-if="settlementVisible" :visible.sync="settlementVisible" @close="closeFn" :close-on-click-modal="false" width="800px" :title="settlementTitle">
			<settlement-form key="1" ref="settlementFormRef" :item="settlementFormData" :contractType="contractType" :detail="detail" :businessList="businessList"></settlement-form>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="settlementVisible = false">{{ $t("contract.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="contactConfirm">{{ $t("contract.confirm") }}</el-button>
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
					<label>{{$t("contract.recharge_mode")}}</label>
					<span>{{auditRow.rechargeModeName}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.payment_base")}}</label>
					<span>{{auditRow.paymentBaseTypeName}} {{auditRow.paymentOffsetTypeName }}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.default_start_time")}}</label>
					<span>{{auditRow.defaultStartTime | parseTime}}</span>
				</div>
				<div class="item">
					<label>{{$t("contract.businessLicence")}}</label>
					<span v-if="auditRow.businessLicence">
						<span class="file-show" v-for="(item,index) in [auditRow.businessLicence]" :key="index">
							<a :href="item.url" target="_blank">{{item.originFileName}}</a><br />
						</span>
					</span>
				</div>
			</div>
			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="auditVisible = false" v-if="auditType === 'DETAIL'">{{ $t("contract.close") }}</el-button>
				<el-button size="mini" @click="auditVisible = false" v-if="auditType === 'AUDIT'">{{ $t("contract.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="auditConfirm" :loading="auditLoading" v-if="auditType === 'AUDIT'">{{ $t("contract.audit_accept") }}</el-button>
        <el-button size="mini" type="primary" @click="auditReject" :loading="auditLoading" v-if="auditType === 'AUDIT'">{{ $t("contract.audit_reject") }}</el-button>
			</div>
		</el-dialog>

    <el-dialog :title="$t('contract.audit_reject')" :visible.sync="rejectVisible" width="500px">
      <el-form ref="rejectFormRef" :model="rejectForm" :rules="rejectFormRules" label-width="120px" label-position="right" size="mini">
        <el-form-item :label="$t('contract.refusalReason')" prop="refusalReason">
          <el-input v-model="rejectForm.refusalReason" type="textarea" :row="3"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitRejectFn" :loading="rejectLoading" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
import settlementForm from "./settlementForm";
import {
  getSettlementInfoApi,
  addReceiveSettlementInfoApi,
  editReceiveSettlementInfoApi,
  deleteReceiveSettlementInfoApi,
  addPaymentSettlementInfoApi,
  editPaymentSettlementInfoApi,
  deletePaymentSettlementInfoApi,
  auditSupplierTitleApi,
  rejectSupplierTitleApi
} from "@/api/partner/supplierContract";
import lodash from "lodash";
export default {
	name: "Settlement",
	components: {
		settlementForm
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
        this.initList()
			},
			deep: true,
			immediate: true
		},
    activeBusiness: {
			handler(val) {
				this.initList()
			},
			deep: true,
			immediate: true
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
      dataList: [],
			settlementFormData: {},

			auditRow: {},
			auditType: "",
			auditVisible: false,
			auditLoading: false,
			index: null,
			multipleSelection: [],
			historicalSettlementList: [],

      rejectLoading: false,
      rejectVisible: false,
      rejectForm: {
        refusalReason: ''
      },
      rejectFormRules: {
        refusalReason: [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
      }
		};
	},
	created() {
		this.type = this.$route.query.type;
		this.role = this.$route.query.role;
	},
	methods: {
    initList(val) {
      let arr = []
      this.settlementList.forEach(v => {
        if (v.businessType === this.activeBusiness) {
          arr.push(v)
        }
      })
			this.dataList = arr
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
		contactConfirm() {
			let valid = this.$refs.settlementFormRef.validate();
			if (valid) {
				let data = this.$refs.settlementFormRef.getValue();
				data.contractId = this.detail.id;
				// 正常的进行编辑和新增 并不提交到后端
				if (this.index !== null && this.index >= 0) {
          if (this.operType === 'ADJUST') {
            let fn = this.contractType === 2 || this.contractType === 20 ? editPaymentSettlementInfoApi : editReceiveSettlementInfoApi;
						fn(data).then(res => {
							if (res.ok) {
								this.settlementVisible = false;
								this.$emit("detailRefresh");
								this.$message.success(this.$t("contract.edit_success"));
							}
						});
          } else {
            this.settlementVisible = false;
            this.settlementList.splice(this.index, 1, data);
            this.initList()
          }
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
          let arrList = []
					for (let i = 0; i < iLength; i++) {
						for (let j = 0; j < jLength; j++) {
							let dataCopy = lodash.cloneDeep(data);
							if (data.settlementCompanyArr[i]) {
								dataCopy.settlementCompanyName = data.settlementCompanyArr[i].chineseName;
								dataCopy.settlementCompanyId = data.settlementCompanyArr[i].id;
							}
							if (data.businessTypeArr[j]) {
								dataCopy.businessType = data.businessTypeArr[j];
                let index = this.businessList.findIndex(item => item.businessType === data.businessTypeArr[j])
                dataCopy.businessTypeName = this.businessList[index].businessTypeName
							}
							delete dataCopy.settlementCompanyArr;
							delete dataCopy.businessTypeArr;

							let isSome = this.settlementList.some(val => dataCopy.settlementCompanyId === val.settlementCompanyId &&
                        dataCopy.businessType === val.businessType &&
                        dataCopy.rechargeMode === val.rechargeMode &&
                        dataCopy.paymentBaseType === val.paymentBaseType &&
                        dataCopy.paymentOffset === val.paymentOffset &&
                        Number(dataCopy.defaultStartTime) === Number(val.defaultStartTime)
              );
							if (isSome) {
                // 存在相同结算主体、业务类型、开始时间、结算方式、付款信息的数据！
								this.$message.error(this.$t("contract.sameDataCheckInfo1"));
								return false;
							}
							arrList.push(dataCopy);
						}
					}
          if (this.operType === 'ADJUST') {
            let fn = this.contractType === 2 || this.contractType === 20 ? addPaymentSettlementInfoApi : addReceiveSettlementInfoApi;
						arrList.forEach(v => {
              fn(v).then(res => {
                if (res.ok) {
                  this.settlementVisible = false;
                  this.$emit("detailRefresh");
                  this.$message.success(this.$t("contract.add_success"));
                }
              });
            })
          } else {
            this.closeFn();
            this.settlementVisible = false;
            this.settlementList = this.settlementList.concat(arrList)
            this.initList()
          }
				}
			}
		},
		addOrEditContact(item, index) {
			if (item) {
				item.isEdit = true;
				this.index = index;
				this.settlementFormData = item;
				this.settlementTitle = this.$t("contract.edit_settlement");
			} else {
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
		deleteContactFn(row) {
			this.$confirm(this.$t("contract.confirm_delete_settlement"), this.$t("receiveFms.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          let deleteIndex = this.settlementList.findIndex(item => item.businessType === row.businessType &&
                   item.settlementCompanyId === row.settlementCompanyId &&
                   item.rechargeMode === row.rechargeMode &&
                   item.paymentBaseType === row.paymentBaseType &&
                   item.paymentOffset === row.paymentOffset)
          if (!row.id) {
            this.settlementList.splice(deleteIndex, 1);
            this.initList()
            this.deleteVisible = false;
          } else {
            let fn = this.contractType === 1 || this.contractType === 3 || this.contractType === 10 ? deleteReceiveSettlementInfoApi : deletePaymentSettlementInfoApi;
            fn(row.id).then(res => {
              if (res.ok) {
                this.settlementList.splice(deleteIndex, 1);
                this.initList()
                this.deleteVisible = false;
                this.$message.success(this.$t("contract.delete_success"));
              }
            });
          }
        })
        .catch(() => { });
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
		},
    auditReject() {
      this.rejectVisible = true
      this.rejectForm = {
        refusalReason: ''
      }
		},
    submitRejectFn() {
      this.$refs.rejectFormRef.validate(valid => {
        if (valid) {
            let data = {
              id: this.auditRow.id,
              refusalReason: this.rejectForm.refusalReason
            }
            this.rejectLoading = true;
            rejectSupplierTitleApi(data).then(res => {
              if (res.ok) {
                this.auditVisible = false
                this.rejectVisible = false;
                this.$emit("detailRefresh");
                this.$message.success(this.$t("contract.auditRejectSuccess"));
              }
              this.rejectLoading = false;
            });
        }
      })
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
