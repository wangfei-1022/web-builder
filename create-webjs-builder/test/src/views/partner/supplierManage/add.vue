<template>
	<div class="page-edit-container full-page">
		<div class="customer-edit page-edit-content">
			<el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form">
				<div class="member-item">
					<div class="title">{{ $t('customerManage.supplier_type') }}</div>
					<div class="content">
						<el-checkbox-group v-model="supplierType" class="supplier-checkbox">
							<div v-for="item in supplierTypeList" :key="item.code" class="supplier-line">
								<div v-if="calcSupplierShow(item)">
									<span class="supplier-title">{{item.name}}</span>
									<span v-for="v in item.children" :key="v.code">
										<el-checkbox disabled :label="v.code" v-if="supplierType.indexOf(v.code) >= 0">{{v.name}}</el-checkbox>
									</span>
								</div>
							</div>
						</el-checkbox-group>
					</div>
				</div>
				<div class="member-item">
					<div class="title">{{ $t("customerManage.baseInfo") }}</div>
					<div class="content">
						<el-form-item :label="$t('customerManage.supplier_abbreviation')" prop="abbreviation">
							<el-input v-model="form.abbreviation" :disabled="!!this.form.no"></el-input>
						</el-form-item>
						<el-form-item :label="$t('customerManage.register_country')" prop="country" required>
							<el-select v-model="form.country" size="mini" :placeholder="$t('customerManage.please_select')" disabled style="width: 100%">
								<el-option v-for="item in countryList" :key="item.code2" :label="item.chineseName" :value="item.code2" />
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('customerManage.supplier_level')" prop="scoreLevelType">
							<el-select v-model="form.scoreLevelType" size="mini" :placeholder="$t('customerManage.please_select')" style="width: 100%">
								<el-option v-for="item in scoreLevelTypeList" :key="item.code" :label="item.name" :value="item.code" />
							</el-select>
						</el-form-item>

						<el-form-item :label="$t('contract.product')" prop="principleId">
							<el-select filterable clearable v-model="form.principleId" size="mini" style="width: 100%">
								<el-option v-for="(item, index) in productList" :key="index" :label="item.chineseName" :value="item.id" />
							</el-select>
						</el-form-item>

						<el-form-item label="关联快递公司" prop="deliveryCompanyId" v-if="supplierType.indexOf(12012) >= 0">
							<type-select v-model="form.deliveryCompanyId" type='deliveryCompany' :defaultDisplay="form.deliveryCompanyName" @selected="deliveryCompanyChange" disabled></type-select>
						</el-form-item>
						<el-form-item label="关联船公司" prop="shippingCompanyId" v-if="supplierType.indexOf(12013) >= 0">
							<type-select v-model="form.shippingCompanyId" type='shippingCompany' :defaultDisplay="form.shippingCompanyName" @selected="shippingCompanyChange" disabled></type-select>
						</el-form-item>
						<el-form-item label="关联航空公司" prop="airCompanyId" v-if="supplierType.indexOf(12013) >= 0">
							<type-select v-model="form.airCompanyId" type='airLine' :defaultDisplay="form.airCompanyName" @selected="airCompanyChange" disabled></type-select>
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

			<member-info-form ref="memberFormRef" :enterprise="enterprise" :linkman="linkman" type='SUPPLIER' />

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
import { getCustomerByNameApi, submitCustomerApi, getCustomerDetailApi, getPostTypeListApi, updateCustomerApi } from "@/api/partner/customerManage";
import { getScoreLevelTypeApi, getSupplierTypeApi, submitSupplierApi, updateSupplierApi, getSupplierDetailApi } from "@/api/supplierManage";
import { getProductApi, getSalesApi } from "@/api/partner/base";
import { getCountryListApi } from "@/api/country";
import MemberInfoForm from "@/views/partner/customerManage/components/MemberInfoForm";
import { validateEmail, validateMobile } from "@/utils/validate";

export default {
	name: "CRMSupplierAdd",
	components: {
		MemberInfoForm
	},
	data() {
		const validateMobileUnique = (rule, value, callback) => {
			if (this.form.no) {
				callback();
				return;
			}
			if (value) {
				if (validateMobile(value)) {
					callback();
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
					callback();
				} else {
					return callback(this.$t("customerManage.email_error"));
				}
			} else {
				callback();
			}
		};

		return {
			adminUserChineseNameDisabled: false,
			abbreviationDisabled: false,

			id: "",
			supplierType: [], // 选中的供应商类型
			supplierTypeList: [],
			scoreLevelTypeList: [],
			contactVisible: false,
			countryList: [],
			postList: [],
			productList: [],
			isCN: false,
			basicDisabled: false,
			form: {
				adminUser: {
					mobile: "",
					email: "",
					chineseName: ""
				},
				createAdminUserFlag: false,
				scoreLevelType: "", // 供应商等级
				principleId: "",
				type: "",
				country: "",
				abbreviation: "",

				deliveryCompanyId: "",
				deliveryCompanyName: "",
				shippingCompanyId: "",
				shippingCompanyName: "",
				airCompanyId: "",
				airCompanyName: ""
			},
			formRule: {
				"adminUser.chineseName": [
					{
						required: true,
						message: this.$t("customerManage.admin_name_cannot_be_null")
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
				abbreviation: [
					{
						required: true,
						message: this.$t("customerManage.customer_abbreviation_cannot_be_null"),
						trigger: "change"
					}
				],
				scoreLevelType: [
					{
						required: true,
						message: this.$t("customerManage.customer_type_cannot_be_null")
					}
				],
				principleId: [
					{
						required: true,
						message: this.$t("customerManage.cannot_be_null")
					}
				]
			},
			supplier: {},
			enterprise: {},
			linkman: [],
			loading: false
		};
	},
	created() {
		this.id = this.$route.query.id;
		// 编辑回显
		if (this.id) {
			this.getCustomerDetailById();
		} else {
			// 新增
			let country = this.$route.query.country;
			let supplierName = this.$route.query.supplierName;
			this.form.deliveryCompanyId = this.$route.query.deliveryCompanyId;
			this.form.deliveryCompanyName = this.$route.query.deliveryCompanyName;
			this.form.shippingCompanyId = this.$route.query.shippingCompanyId;
			this.form.shippingCompanyName = this.$route.query.shippingCompanyName;
			this.form.airCompanyId = this.$route.query.airCompanyId;
			this.form.airCompanyName = this.$route.query.airCompanyName;

			try {
				this.supplierType = JSON.parse(this.$route.query.supplierType) || [];
			} catch (err) {
				console.log(err);
			}
			this.getCustomerByName(country, supplierName);
		}
		this.getBaseDataFn();
	},
	methods: {
		shippingCompanyChange(item) {
			this.form.shippingCompanyName = item.chineseName;
		},
		deliveryCompanyChange(item) {
			this.form.deliveryCompanyName = item.chineseName;
		},
		airCompanyChange(item) {
			this.form.airCompanyName = item.chineseName;
		},
		getCustomerDetailById() {
			getSupplierDetailApi(this.id).then(res => {
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
						supplier: {}
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
			Promise.all([getCountryListApi(), getScoreLevelTypeApi(), getPostTypeListApi(), getProductApi(), getSupplierTypeApi()]).then(results => {
				const countryRes = results[0];
				const scoreLevelTypeRes = results[1];
				const postRes = results[2];
				const productRes = results[3];
				const supplierTypeRes = results[4];
				if (countryRes.ok) {
					this.countryList = countryRes.content;
				}
				if (scoreLevelTypeRes.ok) {
					this.scoreLevelTypeList = scoreLevelTypeRes.content;
				}
				if (postRes.ok) {
					this.postList = postRes.content;
				}
				if (productRes.ok) {
					this.productList = productRes.content;
				}
				if (supplierTypeRes.ok) {
					this.supplierTypeList = supplierTypeRes.content;
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
				adminUser: detail.enterprise.adminUser,
				createAdminUserFlag: !!detail.enterprise.adminUser.mobile || !!detail.enterprise.adminUser.email,
				...detail.enterprise,
				...detail.supplier
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

			// 取值
			if (this.id) {
				let supplierType = [];
				detail.supplier.partnerRoles.forEach(v => {
					supplierType.push(v.partnerRole);

					// 关联快递公司
					if (v.partnerRole === 12012) {
						this.form.deliveryCompanyId = v.relatedId;
						this.form.deliveryCompanyId = v.relatedName;
					}
					// 关联船公司
					if (v.partnerRole === 12013) {
						this.form.shippingCompanyId = v.relatedId;
						this.form.shippingCompanyName = v.relatedName;
					}
					// 关联航空公司
					if (v.partnerRole === 12015) {
						this.form.airCompanyId = v.relatedId;
						this.form.airCompanyName = v.relatedName;
					}
				});
				this.supplierType = supplierType;
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
						supplier: {
							partnerRoles: [],
							scoreLevelType: this.form.scoreLevelType,
							principleId: this.form.principleId,
							principleName: this.form.principleName
						},
						id: this.id
					};
					data.enterprise.createAdminUserFlag = this.form.createAdminUserFlag;
					data.enterprise.adminUser = this.form.adminUser;
					this.supplierType.forEach(v => {
						this.supplierTypeList.forEach(item => {
							item.children.forEach(x => {
								if (x.code === v) {
									let target = {
										partnerRole: x.code,
										partnerRoleName: x.name
									};
									// 关联快递公司
									if (v === 12012) {
										target.relatedId = this.form.deliveryCompanyId;
										target.relatedName = this.form.deliveryCompanyName;
										target.relatedType = "delivery_company";
									}
									// 关联船公司
									if (v === 12013) {
										target.relatedId = this.form.shippingCompanyId;
										target.relatedName = this.form.shippingCompanyName;
										target.relatedType = "shipping_company"; // 关联的类型shipping_company, airline_company, delivery__company
									}
									// 关联航空公司
									if (v === 12015) {
										target.relatedId = this.form.airCompanyId;
										target.relatedName = this.form.airCompanyName;
										target.relatedType = "airline_company"; // 关联的类型shipping_company, airline_company, delivery__company
									}
									data.supplier.partnerRoles.push(target);
								}
							});
						});
					});
					if (data.supplier.principleId) {
						this.productList.forEach(x => {
							if (x.id === data.supplier.principleId) {
								data.supplier.principleName = x.chineseName;
							}
						});
					}
					let fn = data.id ? updateSupplierApi : submitSupplierApi;
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
			this.$router.push({ name: `CRMSupplierList` });
		},
		calcSupplierShow(item) {
			let flag = false;
			item.children.forEach(v => {
				if (this.supplierType.indexOf(v.code) >= 0) {
					flag = true;
				}
			});
			return flag;
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

.supplier-line {
	margin-bottom: 15px;

	.supplier-title {
		font-size: 14px;
		margin-right: 13px;
		width: 70px;
		display: inline-block;
		text-align: right;
	}
}
.supplier-checkbox {
	::v-deep .el-checkbox {
		width: 125px;
	}
}
</style>
