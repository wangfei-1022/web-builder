<template>
	<div class="page-edit-container full-page">
		<div class="custmer-detail page-edit-content">
			<div class="module">
				<div class="title">
					{{ $t("customerManage.baseInfo") }}
					<span class="is-spread" @click="setSpread">{{isSpread ? $t("customerManage.spread") : $t("customerManage.unspread")}}</span>
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
						<label>{{ $t("customerManage.customer_type") }}：</label>
						<span>{{customer.directCustomerTypeName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("customerManage.sales_names") }}：</label>
						<span>{{customer.sellerName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("contract.department_by") }}：</label>
						<span>{{customer.sellerDepartmentName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("contract.area_by") }}：</label>
						<span>{{customer.sellerAreaName}}</span>
					</div>
					<div class="item">
						<label>{{ $t("contract.company_by") }}：</label>
						<span>{{customer.sellerOfficeName}}</span>
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
				</div>
			</div>

			<member-info v-show="!isSpread" :contactList="contactList" :companyInfo="enterprise" />

      <div class="module">
        <div class="title">{{ $t("customerManage.saleRecord") }}</div>
        <div class="content">
          <sales-list :isDetail="true" :id="id"></sales-list>
        </div>
      </div>

      <member-contract-list :id="this.id" type="CUSTOMER" />

		</div>
		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList">{{$t('contract.close')}}</el-button>
		</div>
	</div>

</template>
<script>
import { getCustomerDetailApi, getCustomerBusinessApi } from "@/api/partner/customerManage";
import MemberInfo from "./components/MemberInfo";
import MemberContractList from "./components/MemberContractList";
import SalesList from "./components/SalesList"

export default {
	name: "CRMCustomerDetail",
	components: {
		MemberInfo,
		MemberContractList,
    SalesList
	},
	data() {
		return {
			id: "",
			isSpread: true,
			contactList: [],
			customer: {},
			enterprise: {}
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.getDetail();
	},
	methods: {
		setSpread() {
			this.isSpread = !this.isSpread;
		},
		backList() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.push({ name: `CRMCustomerList` });
		},
		getDetail() {
			getCustomerDetailApi(this.id).then(res => {
				if (res.ok) {
					this.contactList = res.content.linkman;
					let enterprise = res.content.enterprise || {};

					enterprise.adminUser = enterprise.adminUser || {};
					enterprise.createAdminUserFlag = !!enterprise.adminUser.mobile || !!enterprise.adminUser.email;
					this.customer = res.content.customer || {};
					this.enterprise = enterprise;
				}
			});
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
</style>
