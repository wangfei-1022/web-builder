<template>
	<div class="page-edit-container full-page">
		<div class="custmer-detail page-edit-content">
			<div class="module">
				<div class="title">
					{{ $t("customerManage.supplier_type") }}
					<span class="is-spread" @click="setSpread">{{isSpread ? $t("customerManage.spread") : $t("customerManage.unspread")}}</span>
				</div>
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
			<div class="module">
				<div class="title">
					{{ $t("customerManage.baseInfo") }}
				</div>
				<div class="content">
					<div class="item">
						<label>{{ $t("customerManage.customer_id") }}：</label>
						<span>{{enterprise.no}}</span>
					</div>
					<div class="item">
						<label>{{ $t("customerManage.customer_abbreviation") }}：</label>
						<span>{{enterprise.abbreviation}}</span>
					</div>
					<div class="item">
						<label>{{ $t("customerManage.register_country") }}：</label>
						<span>{{enterprise.countryName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("customerManage.supplier_level") }}：</label>
						<span>{{enterprise.scoreLevelTypeName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("contract.product") }}：</label>
						<span>{{supplier.principleName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("contract.department_by") }}：</label>
						<span>{{supplier.principleDepartmentName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("contract.area_by") }}：</label>
						<span>{{supplier.principleAreaName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("contract.company_by") }}：</label>
						<span>{{supplier.principleOfficeName}}</span>
					</div>
					<div class="item">
						<label style="width: 180px;margin-left: 46px;">{{ $t("customerManage.if_member_admin_account") }}：</label>
						<span>{{enterprise.createAdminUserFlag ? $t("customerManage.yes") : $t("customerManage.no")}}</span>
					</div>
					<div class="item" v-if="enterprise.createAdminUserFlag">
						<label>{{ $t("customerManage.admin_name") }}：</label>
						<span>{{enterprise.adminUser.chineseName}}</span>
					</div>
					<div class="item" v-if="enterprise.createAdminUserFlag">
						<label>{{ $t("customerManage.mobile") }}：</label>
						<span>{{enterprise.adminUser.mobile}}</span>
					</div>
					<div class="item" v-if="enterprise.createAdminUserFlag">
						<label>{{ $t("customerManage.email") }}：</label>
						<span>{{enterprise.adminUser.email}}</span>
					</div>
					<div class="item" v-if="supplierType.indexOf(12012) >= 0">
						<label>{{ $t("customerManage.deliveryCompany") }}：</label>
						<span>{{enterprise.deliveryCompanyName}}</span>
					</div>
					<div class="item" v-if="supplierType.indexOf(12013) >= 0">
						<label>{{ $t("customerManage.shippingCompany") }}：</label>
						<span>{{enterprise.shippingCompanyName}}</span>
					</div>
					<div class="item" v-if="supplierType.indexOf(12013) >= 0">
						<label>{{ $t("customerManage.airCompany") }}：</label>
						<span>{{enterprise.airCompanyName}}</span>
					</div>
				</div>
			</div>

			<member-info v-show="!isSpread" :contactList="contactList" :companyInfo="enterprise" />
			<member-contract-list :id="this.id" type='SUPPLIER' />

		</div>
		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList">{{$t('contract.close')}}</el-button>
		</div>
	</div>

</template>
<script>
import { getSupplierTypeApi, getSupplierDetailApi } from "@/api/supplierManage";
import MemberInfo from "@/views/partner/customerManage/components/MemberInfo";
import MemberContractList from "@/views/partner/customerManage/components/MemberContractList";

export default {
	name: "CRMSupplierDetail",
	components: {
		MemberInfo,
		MemberContractList
	},
	data() {
		return {
			id: "",
			isSpread: true,
			contactList: [],
			enterprise: {},
			supplier: {},
			supplierType: [],
			supplierTypeList: []
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.getDetail();
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getSupplierTypeApi()]).then(results => {
				const supplierTypeRes = results[0];
				if (supplierTypeRes.ok) {
					this.supplierTypeList = supplierTypeRes.content;
				}
			});
		},
		setSpread() {
			this.isSpread = !this.isSpread;
		},
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: `CRMSupplierList` });
		},
		getDetail() {
			getSupplierDetailApi(this.id).then(res => {
				if (res.ok) {
					this.contactList = res.content.linkman || [];
					let enterprise = res.content.enterprise || {};
					enterprise.adminUser = enterprise.adminUser || {};
					// 基础信息
					enterprise.createAdminUserFlag = !!enterprise.adminUser.mobile || !!enterprise.adminUser.email;
					enterprise.scoreLevelTypeName = res.content.supplier.scoreLevelTypeName;
					this.enterprise = enterprise;
					this.supplier = res.content.supplier;

					let supplierType = [];
					res.content.supplier.partnerRoles.forEach(v => {
						supplierType.push(v.partnerRole);
						// 关联快递公司
						if (v.partnerRole === 12012) {
							this.enterprise.deliveryCompanyId = v.relatedId;
							this.enterprise.deliveryCompanyName = v.relatedName;
						}
						// 关联船公司
						if (v.partnerRole === 12013) {
							this.enterprise.shippingCompanyId = v.relatedId;
							this.enterprise.shippingCompanyName = v.relatedName;
						}
						// 关联航空公司
						if (v.partnerRole === 12015) {
							this.enterprise.airCompanyId = v.relatedId;
							this.enterprise.airCompanyName = v.relatedName;
						}
					});
					this.supplierType = supplierType;
				}
			});
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
.custmer-detail {
	font-size: 14px;

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
			overflow: hidden;
		}
		.img {
			display: block !important;
			border: 1px dashed #ccc;
			border-radius: 6px;
			width: 300px;
			height: 180px;
			line-height: 180px;
			text-align: center;
			cursor: pointer;
			padding: 0;
			float: left;

			img {
				width: 100%;
				height: 100%;
				-o-object-fit: conver;
				object-fit: conver;
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
}
.is-spread {
	float: right;
	font-size: 14px;
	font-weight: 500;
	color: #1890ff;
	cursor: pointer;
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
