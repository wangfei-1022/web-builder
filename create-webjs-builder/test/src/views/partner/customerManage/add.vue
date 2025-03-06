<template>
	<div class="page-edit-container full-page">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form">
				<div class="member-item">
					<div class="title">{{ $t("customerManage.baseInfo") }}</div>
					<div class="content">
						<el-form-item :label="$t('customerManage.customer_abbreviation')" prop="abbreviation">
							<el-input v-model="form.abbreviation" :disabled="!!this.form.no"></el-input>
						</el-form-item>
						<el-form-item :label="$t('customerManage.register_country')" prop="country" required>
							<el-select v-model="form.country" size="mini" :placeholder="$t('customerManage.please_select')" disabled style="width: 100%">
								<el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('customerManage.customer_type')" prop="directCustomerType">
							<el-select v-model="form.directCustomerType" size="mini" :placeholder="$t('customerManage.please_select')" style="width: 100%">
								<el-option v-for="item in customerTypeList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>

						<el-form-item :label="$t('contract.sales')" prop="sellerId">
							<el-select filterable clearable v-model="form.sellerId" size="mini" style="width: 100%">
								<el-option v-for="(item, index) in salesList" :key="index" :label="item.chineseName" :value="item.id" />
							</el-select>
						</el-form-item>

						<el-form-item :label="$t('customerManage.if_member_admin_account')" prop="createAdminUserFlag" class="if_member_admin_account">
							<el-radio-group v-model="form.createAdminUserFlag" :disabled="!!form.no">
								<el-radio :label="true">{{ $t("customerManage.yes") }}</el-radio>
								<el-radio :label="false">{{ $t("customerManage.no") }}</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item :label="$t('customerManage.admin_name')" prop="adminUser.chineseName" :class="!!form.no ? '' : 'full-line'" v-if="form.createAdminUserFlag">
							<el-input v-model="form.adminUser.chineseName" :disabled="adminUserChineseNameDisabled"></el-input>
						</el-form-item>
						<el-form-item :label="$t('customerManage.mobile')" prop="adminUser.mobile" v-if="form.createAdminUserFlag">
							<el-input v-model="form.adminUser.mobile" :placeholder="$t('customerManage.mobile_des')" :disabled="!!form.no"></el-input>
						</el-form-item>
						<el-form-item :label="$t('customerManage.email')" prop="adminUser.email" v-if="form.createAdminUserFlag">
							<el-input v-model="form.adminUser.email" :placeholder="$t('customerManage.email_des')" :disabled="!!form.no"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-form>

			<member-info-form ref="memberFormRef" :enterprise="enterprise" :linkman="linkman" type='CUSTOMER' />

			<div class="page-edit-footer">
				<el-button size="mini" @click="backList">{{$t("customerManage.cancel")}}</el-button>
				<el-button type="primary" @click="onSubmit" size="mini" :loading="loading">
					<span v-if="!id">{{$t("customerManage.submit")}}</span>
					<span v-if="id">{{$t("customerManage.save")}}</span>
				</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { getCustomerByNameApi, getCustomerTypeListApi, submitCustomerApi, getCustomerDetailApi, getPostTypeListApi, updateCustomerApi } from "@/api/partner/customerManage";
import { creditCodeIsUniqueApi, mobileIsUniqueApi, emailIsUniqueApi, idCardIsUniqueApi } from "@/api/partner/member";
import { getSalesApi } from "@/api/partner/base";
import { getCountryListApi } from "@/api/country";
import MemberInfoForm from "./components/MemberInfoForm";
import { validateEmail, validateMobile, validateCorporateTelephone, validateIdentity } from "@/utils/validate";

export default {
	name: "CRMCustomerAdd",
	components: {
		MemberInfoForm
	},
	data() {
		const validateMobileFn = (rule, value, callback) => {
			if (this.isCN) {
				if (value && !validateMobile(value)) {
					callback(this.$t("customerManage.mobile_error"));
				} else {
					callback();
				}
			} else {
				callback();
			}
		};

		const validateCorporateTelephoneFn = (rule, value, callback) => {
			if (this.isCN) {
				if (value && !validateCorporateTelephone(value)) {
					callback(this.$t("customerManage.company_phone_error"));
				} else {
					callback();
				}
			} else {
				callback();
			}
		};

		const validateMobileUnique = (rule, value, callback) => {
			if (this.form.no) {
				callback();
				return;
			}
			if (value) {
				if (validateMobile(value)) {
					// mobileIsUniqueApi({ mobile: value }).then((res) => {
					//   if (res.content) {
					//     callback(this.$t("customerManage.mobile_cannot_be_repeat"));
					//   } else {
					callback();
					//   }
					// });
				} else {
					return callback(this.$t("customerManage.mobile_error"));
				}
			} else {
				callback();
			}
		};

		const validateEmailFn = (rule, value, callback) => {
			if (this.form.no) {
				callback();
				return;
			}
			if (value) {
				if (validateEmail(value)) {
					// emailIsUniqueApi({ email: value }).then((res) => {
					//   if (res.content) {
					//     callback(this.$t("customerManage.email_cannot_be_repeat"));
					//   } else {
					callback();
					//   }
					// });
				} else {
					return callback(this.$t("customerManage.email_error"));
				}
			} else {
				callback();
			}
		};

		const validateIdentityUnique = (rule, value, callback) => {
			if (this.form.no) {
				callback();
				return;
			}
			if (value) {
				if (this.isCN && !validateIdentity(value)) {
					return callback(this.$t("customerManage.identity_card_number_error"));
				}
				idCardIsUniqueApi({ country: this.form.country, identify: value })
					.then(res => {
						if (res && res.ok && res.content) {
							callback(this.$t("customerManage.identity_card_number_cannot_be_repeat"));
						} else {
							callback();
						}
					})
					.catch(error => {
						callback(new Error(error.msg ? error.msg : this.$t("customerManage.checkError")));
					});
			} else {
				callback();
			}
		};

		const validateIdentity = (rule, value, callback) => {
			if (this.isCN) {
				if (value) {
					if (validateIdentity(value)) {
						callback();
					} else {
						return callback(this.$t("customerManage.identity_card_number_error"));
					}
				} else {
					callback();
				}
			} else {
				callback();
			}
		};
		const validateCreditCode = (rule, value, callback) => {
			if (this.form.no) {
				callback();
				return;
			}
			if (value) {
				creditCodeIsUniqueApi({
					country: this.form.country,
					creditCode: value
				}).then(res => {
					if (res && res.ok && res.content) {
						callback(this.$t("customerManage.business_licence_no_cannot_be_repeat"));
					} else {
						callback();
					}
				});
			} else {
				callback();
			}
		};

		return {
			adminUserChineseNameDisabled: false,
			abbreviationDisabled: false,
			id: "",
			customerTypeList: [],
			contactVisible: false,
			countryList: [],
			postList: [],
			salesList: [],
			isCN: false,
			basicDisabled: false,
			form: {
				adminUser: {
					mobile: "",
					email: "",
					chineseName: ""
				},
				abbreviation: "",
				createAdminUserFlag: false,
				directCustomerType: "",
				sellerId: ""
			},
			formRule: {
				"adminUser.chineseName": [
					{
						required: true,
						message: this.$t("customerManage.admin_name_cannot_be_null")
					}
				],
				abbreviation: [
					{
						required: true,
						message: this.$t("customerManage.customer_abbreviation_cannot_be_null"),
						trigger: "change"
					}
				],
				directCustomerType: [
					{
						required: true,
						message: this.$t("customerManage.customer_type_cannot_be_null")
					}
				],
				sellerId: [
					{
						required: true,
						message: this.$t("customerManage.cannot_be_null")
					}
				],
				"adminUser.mobile": [
					{
						validator: validateMobileUnique,
						trigger: "blur"
					}
				],
				"adminUser.email": [
					{
						validator: validateEmailFn,
						trigger: "blur"
					}
				]
			},
			loading: false,
			enterprise: {},
			linkman: []
		};
	},
	created() {
		let country = this.$route.query.country;
		let name = this.$route.query.name;
		this.id = this.$route.query.id;
		if (this.id) {
			this.getCustomerDetailById();
		} else if (country) {
			this.getCustomerByName(country, name);
		}
		this.getBaseDataFn();
	},
	methods: {
		getCustomerDetailById() {
			getCustomerDetailApi(this.id).then(res => {
				if (res.ok) {
					this.initData(res.content);
				}
			});
		},
		getCustomerByName(country, name) {
			let data = {
				countryCode: country,
				name: name
			};
			getCustomerByNameApi(data).then(res => {
				if (res.ok) {
					let detail = {
						linkman: [],
						enterprise: {},
						customer: {}
					};
					// 拿到了客户信息
					if (res.content) {
						delete res.content.id;
						detail.enterprise = res.content || {};
					}
					detail.enterprise.chineseName = name;
					detail.enterprise.country = country;
					this.initData(detail);
				}
			});
		},
		getBaseDataFn() {
			Promise.all([getCountryListApi(), getCustomerTypeListApi(), getPostTypeListApi(), getSalesApi()]).then(results => {
				const countryRes = results[0];
				const customerTypeRes = results[1];
				const postRes = results[2];
				const salesRes = results[3];
				if (countryRes.ok) {
					this.countryList = countryRes.content;
				}
				if (customerTypeRes.ok) {
					this.customerTypeList = customerTypeRes.content;
				}
				if (postRes.ok) {
					this.postList = postRes.content;
				}
				if (salesRes.ok) {
					this.salesList = salesRes.content;
				}
			});
		},
		initData(detail) {
			this.linkman = detail.linkman || [];
			detail.enterprise = detail.enterprise || {};
			detail.enterprise.adminUser = detail.enterprise.adminUser || {};
			this.enterprise = detail.enterprise;
			this.form = {
				...this.form,
				...detail.enterprise,
				directCustomerType: detail.customer.directCustomerType || "",
				createAdminUserFlag: !!detail.enterprise.adminUser.mobile || !!detail.enterprise.adminUser.email,
				sellerId: detail.customer.sellerId || ""
			};

			this.adminUserChineseNameDisabled = !this.form.adminUser.chineseName ? false : !!this.form.no;
			this.abbreviationDisabled = !this.form.abbreviation ? false : !!this.form.no;

			if (this.form.country === "CN") {
				this.isCN = true;
				this.basicDisabled = true;
			} else {
				this.isCN = false;
				this.basicDisabled = !!this.form.no;
			}
		},
		onSubmit() {
			if (this.form.createAdminUserFlag && !this.form.adminUser.mobile && !this.form.adminUser.email) {
				this.$message.error(this.$t("customerManage.mobile_or_email_cannot_be_null"));
				return;
			}
			this.$refs.baseForm.validate(valid => {
				if (valid) {
					if (!this.$refs.memberFormRef.validate()) {
						return;
					}
					let memberData = this.$refs.memberFormRef.getValue();
					memberData.enterprise.abbreviation = this.form.abbreviation;
					let data = {
						...memberData,
						customer: {
							directCustomerType: this.form.directCustomerType,
							sellerId: this.form.sellerId,
							sellerName: this.form.sellerName
						},
						id: this.id
					};
					data.enterprise.createAdminUserFlag = this.form.createAdminUserFlag;
					data.enterprise.adminUser = this.form.adminUser;
					if (data.customer.sellerId) {
						this.salesList.forEach(x => {
							if (x.id === data.customer.sellerId) {
								data.customer.sellerName = x.chineseName;
							}
						});
					}
					let fn = data.id ? updateCustomerApi : submitCustomerApi;
					if (data.enterprise.rangeDate) {
						data.enterprise.businessStartDate = data.enterprise.rangeDate[0];
						data.enterprise.businessEndDate = data.enterprise.rangeDate[1];
					}
					this.loading = true;
					fn(data).then(res => {
						if (res.ok) {
							let msg = data.id ? this.$t("customerManage.edit_success") : this.$t("customerManage.submit_success");
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
			this.$router.push({ name: `CRMCustomerList` });
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

.if_member_admin_account {
	::v-deep.el-form-item__label {
		width: 200px !important;
	}
}
</style>
