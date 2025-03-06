<template>
	<div class="page-edit-container full-page">
		<div class="custmer-detail page-edit-content">
      <detail :enterprise="enterprise"></detail>
      <div class="module">
        <div class="title">
          <!--审核信息-->
          {{ $t("customerManage.auditInfo") }}
        </div>
        <div class="content">
          <div class="item" v-if="enterprise.businessType === 'INTERNATIONAL_LINE'" style="width: 100%;">
            <label></label>
            <span><el-checkbox v-model="enterprise.signFlag" disabled>{{ $t("customerManage.openAuditInfo") }}</el-checkbox></span>
          </div>
          <div class="item">
            <label>{{ $t("customerManage.business_type") }}：</label>
            <span>{{enterprise.businessTypeName}}</span>
          </div>
          <div class="item">
            <label>{{ $t("customerManage.sales_names") }}：</label>
            <span>{{enterprise.sellerName}}</span>
          </div>
          <div class="item">
            <label>{{ $t("customerManage.remark") }}：</label>
            <span>{{enterprise.auditRemark}}</span>
          </div>
        </div>
      </div>
		</div>
		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList">{{$t('contract.close')}}</el-button>
		</div>
	</div>

</template>
<script>
import { getCustomerAuditDetailApi } from "@/api/partner/customerAudit";
import Detail from './components/Detail'

export default {
	name: "CRMCustomerAuditDetail",
	components: {
    Detail
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
		this.origin = this.$route.query.origin;
    if (this.id) {
      this.getDetail()
    }
	},
	methods: {
		backList() {
      if (this.origin) {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ name: this.origin });
      }

		},
		getDetail() {
      getCustomerAuditDetailApi(this.id).then(res => {
				if (res.ok) {
					let enterprise = res.content.memberInfo.enterpriseDTO || {};
          delete res.content.memberInfo.registeredDate
          let data = {
            ...enterprise,
            ...res.content.memberInfo,
            ...res.content.business
          }
          data.signFlag = !!Number(data.signFlag)
					enterprise.adminUser = enterprise.adminUser || {};
					enterprise.createAdminUserFlag = !!enterprise.adminUser.mobile || !!enterprise.adminUser.email;
					this.customer = res.content.customer || {};
					this.enterprise = data;
				}
			});
		}
	}
};
</script>
<style scoped lang="scss">
.custmer-detail {
	font-size: 14px;

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
</style>
