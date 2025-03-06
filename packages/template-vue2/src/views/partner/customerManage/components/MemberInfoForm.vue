<template>
	<div>
		<el-form ref="memberForm" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form">
			<div class="member-item">
				<div class="title">
					{{ $t("customerManage.company_auth_info") }}
				</div>
				<div class="content">
					<el-form-item :label="$t('customerManage.croporateName')" prop="chineseName">
						<el-input v-model="form.chineseName" disabled></el-input>
					</el-form-item>
					<el-form-item :label="$t('customerManage.company_english_name')" prop="englishName" :rules="[{ required: !isCN, message: this.$t('common.cannot_be_null'), trigger: 'change' }]">
						<el-input v-model="form.englishName" :disabled="!!form.id"></el-input>
					</el-form-item>
					<el-form-item :label="$t('customerManage.registered_address')" prop="registeredAddressNormalizedCode" v-if="isCN">
						<provinces :value="form.registeredAddressNormalizedCode" :valueName="form.registeredAddressNormalizedName" @change="provincesChange" :disabled="!!form.id"></provinces>
					</el-form-item>
					<el-form-item :label="$t('customerManage.licenceNo')" prop="businessLicenceNo" :rules="[{ required: isCN, message: $t('customerManage.business_licence_no_cannot_be_null') }]">
						<el-input v-model="form.businessLicenceNo" :disabled="basicDisabled"></el-input>
					</el-form-item>
					<el-form-item :label="$t('customerManage.company_address')" prop="registeredAddress">
						<el-input v-model="form.registeredAddress" :disabled="basicDisabled"></el-input>
					</el-form-item>
					<el-form-item :label="$t('customerManage.capital')" prop="registeredCapital" class="height33">
						<el-input type="age" v-model="form.registeredCapital" :disabled="basicDisabled">
							<template slot="append">
								{{ $t("customerManage.capital_unit")}}
							</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="$t('customerManage.operation_period')" class="height33">
						<common-picker :disabled="basicDisabled" :pikcerType="'daterange'" :pickerFormat="'yyyy-MM-dd'"  v-model="form.rangeDate" />
					</el-form-item>
					<el-form-item :label="$t('customerManage.registered_date')" prop="registeredDate" class="height33">
						<common-picker :colSpace="true" :disabled="basicDisabled" :pikcerType="'date'" :pickerFormat="'yyyy-MM-dd'" v-model="form.registeredDate" />
					</el-form-item>

					<el-form-item :label="$t('customerManage.business_scope')" prop="businessScope">
						<el-input type="textarea" :rows="7" :disabled="basicDisabled" v-model="form.businessScope" maxlength="800" show-word-limit></el-input>
					</el-form-item>

					<el-form-item :label="$t('customerManage.corporate_telephone')" prop="corporateTelephone">
						<el-input v-model="form.corporateTelephone" oninput="value=value.replace(/[^\d.-]/g,'')"></el-input>
					</el-form-item>

					<el-form-item :label="$t('customerManage.business_license')" prop="businessLicense">
						<upload-file accept=".jpg,.png,.pdf" :value="form.businessLicenseUrl" @success="businessLicenseSuccess" type="SINGLE_FILE_PREVIEW"/>
					</el-form-item>
				</div>
			</div>
			<div class="member-item">
				<div class="title">
					{{ $t("customerManage.company_corporate_info") }}
				</div>
				<div class="content">
					<el-form-item :label="$t('customerManage.corporate_name')" prop="corporateName">
						<el-input v-model="form.corporateName" :disabled="basicDisabled"></el-input>
					</el-form-item>
					<el-form-item :label="$t('customerManage.corporate_mobile')" prop="corporateMobile">
						<el-input v-model="form.corporateMobile"></el-input>
					</el-form-item>
					<el-form-item :label="$t('customerManage.corporate_identity_card_number')" prop="identityCardNumber" class="full-line">
						<el-input v-model="form.identityCardNumber"></el-input>
					</el-form-item>
					<el-form-item :label="$t('customerManage.identity_card_face')" prop="identityCardFace">
						<upload-file accept=".jpg,.png" :value="form.identityCardFaceUrl" @success="identityCardFaceSuccess"  type="SINGLE_FILE_PREVIEW"/>
					</el-form-item>
					<el-form-item :label="$t('customerManage.identity_card_back')" prop="identityCardBack">
						<upload-file accept=".jpg,.png" :value="form.identityCardBackUrl" @success="identityCardBackSuccess"  type="SINGLE_FILE_PREVIEW"/>
					</el-form-item>
				</div>
			</div>
		</el-form>

		<div class="member-item">
			<div class="title">
				<span>{{ $t("customerManage.contact") }}</span>
			</div>
			<div class="content">
				<contact-list ref="contactRef" :postList="postList" :list="contactList" :type="type" />
			</div>

		</div>
	</div>
</template>
<script>
import { getCustomerByNameApi, getCustomerTypeListApi, submitCustomerApi, getCustomerDetailApi, getPostTypeListApi, updateCustomerApi } from "@/api/partner/customerManage";
import { creditCodeIsUniqueApi, mobileIsUniqueApi, emailIsUniqueApi, idCardIsUniqueApi } from "@/api/partner/member";
import { getCountryListApi } from "@/api/country";
import ContactList from "./ContactList"
import { validateEmail, validateMobile } from "@/utils/validate";

export default {
	// 客户和供应商复用的 会员信息
	name: "MemberForm",
	components: {
		ContactList
	},
	data() {
		const validateMobile = (rule, value, callback) => {
			if (this.isCN) {
				let _reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
				if (value && !_reg.test(value)) {
					callback(this.$t("customerManage.mobile_error"));
				} else {
					callback();
				}
			} else {
				callback();
			}
		};

		const validateCorporateTelephone = (rule, value, callback) => {
			if (this.isCN) {
				let _reg = /^[()0-9-\s]+$/;
				if (value && !_reg.test(value)) {
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
			let reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
			if (value) {
				if (reg.test(value)) {
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
			const _reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
			if (value) {
				if (this.isCN && !_reg.test(value)) {
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
				const _reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
				if (value) {
					if (_reg.test(value)) {
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
			id: "",
			contactVisible: false,
			contactList: [],
			countryList: [],
			postList: [],
			isCN: false,
			basicDisabled: false,
			form: {
				id: "",
				rangeDate: [],
				type: "",
				country: "",
				abbreviation: "",
				chineseName: "",
				englishName: "",
				businessLicenceNo: "",
				businessStartDate: null,
				businessEndDate: null,
				registeredAddressNormalizedCode: "",
				registeredAddressNormalizedName: "",
				registeredAddress: "",
				registeredCapital: "",
				registeredDate: null,
				businessScope: "",
				corporateTelephone: "",
				businessLicense: "",
				businessLicenseUrl: "",

				corporateName: "",
				corporateMobile: "",
				identityCardNumber: "",

				identityCardFace: "",
				identityCardFaceUrl: "",

				identityCardBack: "",
				identityCardBackUrl: "",

				userIdentityCardName: "",
				userIdentityCardNumber: ""
			},
			formRule: {
				corporateTelephone: [
					{
						validator: validateCorporateTelephone,
						trigger: "change"
					}
				],
				corporateMobile: [
					{
						validator: validateMobile,
						trigger: "blur"
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
				],
				identityCardNumber: [
					{
						validator: validateIdentity,
						trigger: "blur"
					}
				]

				// userIdentityCardName: [{
				//     required: true,
				//     message: this.$t("customerManage.personal_name_cannot_be_null"),
				//     trigger: "blur",
				// }],
				// userIdentityCardNumber: [{
				//     required: true,
				//     message: this.$t("customerManage.identity_card_number_cannot_be_null"),
				//     trigger: "blur",
				//   },{
				//     validator: validateIdentityUnique,
				//     trigger: "blur"
				// }]
				// ,
			},
			loading: false
		};
	},
	props: {
		type: {
			type: String,
			default: ""
		},
		linkman: {
			type: Array,
			default: function () {
				return [];
			}
		},
		enterprise: {
			type: Object,
			default: function () {
				return {};
			}
		}
	},
	watch: {
		linkman: {
			handler(val) {
				this.contactList = val;
			},
			deep: true,
			immediate: true
		},
		enterprise: {
			handler(val) {
				if (val.country === "CN") {
					this.isCN = true;
					this.basicDisabled = true;
				} else {
					this.isCN = false;
					this.basicDisabled = !!this.form.no;
				}
				this.form = {
					...this.form,
					...val,
					rangeDate: [val.businessStartDate, val.businessEndDate]
				};
			},
			deep: true,
			immediate: true
		}
	},
	created() {
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getCountryListApi(), getPostTypeListApi()]).then(results => {
				const countryRes = results[0];
				const postRes = results[1];
				if (countryRes.ok) {
					this.countryList = countryRes.content;
				}
				if (postRes.ok) {
					this.postList = postRes.content;
				}
			});
		},
		provincesChange(val) {
			this.form.registeredAddressNormalizedCode = val.code;
			this.form.registeredAddressNormalizedName = val.name;
		},
		validate() {
			let v = true;
			this.$refs.memberForm.validate(valid => {
				if (!valid) {
					v = valid;
					this.mixinsFormScrollIntoView();
				}
			});
			if (!v) {
				return false;
			}
			if (this.form.createAdminUserFlag && !this.form.adminUser.mobile && !this.form.adminUser.email) {
				this.$message.error(this.$t("customerManage.mobile_or_email_cannot_be_null"));
				return false;
			}
			let linkman = this.$refs.contactRef.getValue();
			if (linkman.length <= 0) {
				this.$message.warning(this.$t("customerManage.contact_at_least_one"));
				return false;
			}
			return true;
		},
		getValue() {
			let linkman = this.$refs.contactRef.getValue();
			let data = {
				enterprise: this.form,
				linkman: linkman
			};
			if (data.enterprise.rangeDate) {
				data.enterprise.businessStartDate = data.enterprise.rangeDate[0];
				data.enterprise.businessEndDate = data.enterprise.rangeDate[1];
			}
			return data;
		},
		businessLicenseSuccess(file) {
			this.form.businessLicense = file.cloudFileName;
		},
		identityCardFaceSuccess(file) {
			this.form.identityCardFace = file.cloudFileName;
		},
		identityCardBackSuccess(file) {
			this.form.identityCardBack = file.cloudFileName;
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
	height: 33px;

	::v-deep.el-form-item__label {
		width: 200px !important;
	}
}
</style>
