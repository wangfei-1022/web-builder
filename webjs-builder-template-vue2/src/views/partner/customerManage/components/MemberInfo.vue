<template>
  <div>
    <div class="module">
      <div class="title">{{ $t("customerManage.company_auth_info") }}</div>
      <div class="content">
        <div class="item">
          <label>{{ $t("customerManage.chinese_name") }}：</label>
          <span>{{enterprise.chineseName}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.english_name") }}：</label>
          <span>{{enterprise.englishName}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.corporateTelephone") }}：</label>
          <span>{{enterprise.corporateTelephone}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.licenceNo") }}：</label>
          <span>{{enterprise.businessLicenceNo}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.registered_address") }}：</label>
          <span>{{enterprise.registeredAddressNormalizedName}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.address") }}：</label>
          <span>{{enterprise.registeredAddress}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.capital") }}({{ $t("customerManage.capital_unit") }})：</label>
          <span>{{enterprise.registeredCapital}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.registered_date") }}：</label>
          <span>{{enterprise.registeredDate}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.operation_period") }}：</label>
          <span v-if="enterprise.businessStartDate">
            {{enterprise.businessStartDate}}
            {{$t("customerManage.to")}}
            {{enterprise.businessEndDate ? enterprise.businessEndDate : $t("customerManage.un_limit_date")}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.business_scope") }}：</label>
          <span>{{enterprise.businessScope}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.business_license") }}：</label>
          <span>
            <file-preview v-if="enterprise.businessLicenseUrl" :file-list="[{url: enterprise.businessLicenseUrl}]" />
          </span>
        </div>
      </div>
    </div>

    <div class="module">
      <div class="title">{{ $t("customerManage.company_corporate_info") }}</div>
      <div class="content">
        <div class="item">
          <label>{{ $t("customerManage.corporate_name") }}：</label>
          <span>{{enterprise.corporateName}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.corporate_mobile") }}：</label>
          <span>{{enterprise.corporateMobile}}</span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.corporate_identity_card_number") }}：</label>
          <span>{{enterprise.identityCardNumber}}</span>
        </div>
        <div class="item"  style="clear: both;">
          <label>{{ $t("customerManage.identity_card_face") }}：</label>
          <span>
            <file-preview v-if="enterprise.identityCardFaceUrl" :file-list="[{url: enterprise.identityCardFaceUrl}]" />
          </span>
        </div>
        <div class="item">
          <label>{{ $t("customerManage.identity_card_back") }}：</label>
          <span>
            <file-preview v-if="enterprise.identityCardBackUrl" :file-list="[{url: enterprise.identityCardBackUrl}]" />
          </span>
        </div>
      </div>
    </div>

    <div class="module" v-if="showContactList">
      <div class="title">{{ $t("customerManage.contact") }}</div>
      <div class="content">
        <contact-list :list="contactList" :isDetail="true" />
      </div>
    </div>
  </div>

</template>
<script>
import { getCustomerDetailApi, getCustomerBusinessApi } from "@/api/partner/customerManage"
import ContactList from "./ContactList"
import { parseTime } from "@/utils"

export default {
	name: 'MemberFormDetail',
	components: {
		ContactList
	},
	props: {
		companyInfo: {
			type: Object,
			default: function () {
				return {}
			}
		},
		contactList: {
			type: Array,
			default: function () {
				return []
			}
		}
	},
	watch: {
		companyInfo: {
			handler(val) {
				this.enterprise = {
					...val,
					businessStartDate: parseTime(val.businessStartDate, '{y}-{m}-{d}'),
					businessEndDate: parseTime(val.businessEndDate, '{y}-{m}-{d}'),
					registeredDate: parseTime(val.registeredDate, '{y}-{m}-{d}'),
					registeredAddressNormalizedName: val.registeredAddressNormalizedName.replaceAll('@', '')
				}
			}
		}
	},
	data() {
		return {
			customer: {},
			enterprise: {},
      showContactList: true
		}
	},
	created() {
	},
	methods: {
    hideContact() {
      this.showContactList = false
    }
	}
}
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
.link {
	color: #1890ff;
	cursor: pointer;
}
.business-item {
	overflow: hidden;
	-webkit-box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
	box-shadow: 0 2px 4px 0 #eee, 0 0 6px 0 #eee;
	margin: 10px 0;
	padding: 20px;
	font-weight: 500;
	position: relative;
	background: rgb(250, 250, 250);
	padding-left: 70px;
	border-radius: 10px;
	font-size: 15px;

	.icon {
		position: absolute;
		left: 20px;
		width: 30px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		top: 13px;
		background: #1890ff;
		border-radius: 5px;
		i {
			font-size: 20px;
			color: white;
		}
	}

	.item-info {
		width: 25%;
		float: left;
		height: 40px;
		display: flex;

		label {
			text-align: right;
			font-weight: 500;
			font-size: 14px;
			margin-right: 18px;
			float: left;
			min-width: 56px;
		}
		span {
			font-size: 14px;
		}
	}
}
</style>
