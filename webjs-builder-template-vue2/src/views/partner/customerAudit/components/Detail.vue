<template>
  <div>
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
          <label>{{ $t("customerManage.member_type") }}：</label>
          <span>{{enterprise.typeName}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.register_country") }}：</label>
          <span>{{enterprise.countryName}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.submitTime") }}：</label>
          <span>{{enterprise.auditSubmitTime | parseTime}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.authType") }}：</label>
          <span :class="'STATUS_' + enterprise.auditingStatus">{{enterprise.auditingStatusName}}</span>
        </div>
        <div class="item" v-if="false">
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

    <memberFormDetail ref="memberFormDetailRef" :companyInfo="enterprise" />
  </div>
</template>
<script>
import { getCustomerAuditDetailApi } from "@/api/partner/customerAudit";
import memberFormDetail from "@/views/partner/customerManage/components/MemberInfo";

export default {
	name: "CRMCustomerAuditView",
	components: {
    memberFormDetail
	},
  props: {
    enterprise: {
      type: Object,
      default: function () {
       return {}
      }
    }
  },
	data() {
		return {

		};
	},
  mounted() {
    this.$refs.memberFormDetailRef.hideContact()
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
.STATUS_0{
  color: dodgerblue;
  font-weight: 600;
}
.STATUS_1{
  color: #ffdb4b;
  font-weight: 600;
}
.STATUS_2{
  color: springgreen;
  font-weight: 600;
}
.STATUS_3{
  color: red;
  font-weight: 600;
}
</style>
