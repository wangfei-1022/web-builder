<template>
  <div class="page-edit-container full-page">
    <div class="customer-edit page-edit-content">
      <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form">
        <div class="member-item">
          <div class="title">{{$t('feeItem.view')}}</div>
          <div class="content">
            <el-form-item :label="$t('feeItem.fee_code')" prop="code">
              <span class="span">{{form.code}}</span>
            </el-form-item>
            <el-form-item :label="$t('feeItem.fee_short_name')" prop="feeShortName">
              <span class="span">{{form.feeShortName}}</span>
            </el-form-item>
            <el-form-item :label="$t('feeItem.chinese_name')" prop="chineseName" class="full-item">
              <span class="span">{{form.chineseName}}</span>
            </el-form-item>
            <el-form-item :label="$t('feeItem.english_name')" prop="englishName" class="full-item">
              <span class="span">{{form.englishName}}</span>
            </el-form-item>
             <el-form-item :label="$t('feeItem.remark')" prop="remark" class="full-item">
               <span class="span">{{form.remark}}</span>
            </el-form-item>
            <el-form-item :label="$t('feeItem.use_business')" prop="businessType" class="full-item">
              <el-checkbox-group v-model="form.businessType" disabled>
                <el-checkbox v-for="item in businessTypeList" :label="item.code" :key="item.code">{{item.chineseName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
        <div class="member-item" v-if="dmnFeeItemBusinesses.length">
          <div class="title">
            {{$t('feeItem.use_business')}}
          </div>
          <div class="content">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane v-for="item in dmnFeeItemBusinesses" :key="item.businessTypeCode" :label="item.businessTypeName" :name="item.businessTypeCode">
                <div>
                  <el-form-item :label="$t('feeItem.fee_short_name')" prop="feeShortName">
                    <span class="span">{{item.feeShortName}}</span>
                  </el-form-item>
                  <el-form-item :label="$t('feeItem.chinese_name')" prop="chineseName" class="full-item">
                     <span class="span">{{item.chineseName}}</span>
                  </el-form-item>
                  <el-form-item :label="$t('feeItem.english_name')" prop="englishName" class="full-item">
                    <span class="span">{{item.englishName}}</span>
                  </el-form-item>
                  <el-form-item :label="$t('feeItem.remark')" prop="remark" class="full-item">
                    <span class="span">{{item.remark}}</span>
                  </el-form-item>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-form>

      <div class="page-edit-footer">
        <el-button size="mini" @click="backList">{{$t("feeItem.close")}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getBusinessTypeListApi } from "@/api/partner/customerManage"
import { feeAddDraftApi, getFeeItemDetailApi, feeUpdateDraftApi, feeAddSubmitApi, feeUpdateSubmitApi } from "@/api/financial/feeItem"
import FeeBusiness from './feeBusiness'
export default {
	name: 'FeeItemAdd',
	components: {
		FeeBusiness
	},
	data() {
		return {
			id: '',
			activeName: '',
			businessTypeList: [],
			dmnFeeItemBusinesses: [],
			form: {
				code: '',
				feeShortName: '',
				chineseName: '',
				englishName: '',
				remark: '',
				businessType: []
			},
			formRule: {
				code: [{ required: true, message: this.$t("feeItem.cannot_be_null") }],
				feeShortName: [{ required: true, message: this.$t("feeItem.cannot_be_null") }],
				chineseName: [{ required: true, message: this.$t("feeItem.cannot_be_null") }],
				englishName: [{ required: true, message: this.$t("feeItem.cannot_be_null") }],
				businessType: [{ required: true, message: this.$t("feeItem.cannot_be_null") }]
			},
			loading: false,
			submitLoading: false
		}
	},
	created() {
		this.id = this.$route.query.id
		if (this.id) {
			this.getDetail()
		}
		this.getBaseDataFn()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getBusinessTypeListApi()]).then(results => {
				const countryRes = results[0]
				if (countryRes.ok) {
					this.businessTypeList = countryRes.content
				}
			})
		},
		getDetail() {
			getFeeItemDetailApi(this.id).then(res => {
				if (res.ok) {
					let businessType = []
					if (res.content.dmnFeeItemBusinesses.length > 0) {
						this.dmnFeeItemBusinesses = res.content.dmnFeeItemBusinesses
						res.content.dmnFeeItemBusinesses.forEach(v => {
							businessType.push(v.businessTypeCode)
						})
						this.activeName = this.dmnFeeItemBusinesses[0].businessTypeCode
					}
					delete res.content.dmnFeeItemBusinesses
					this.form = {
						...res.content,
						businessType: businessType
					}
				}
			})
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `FeeItemList` })
		}
	}
}
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
.full-item {
	width: 100% !important;
}

.if_member_admin_account {
	::v-deep.el-form-item__label {
		width: 200px !important;
	}
}
.span {
	font-size: 12px;
	color: #606266;
}
</style>
