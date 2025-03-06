<template>
  <div class="page-edit-container full-page">
    <div class="customer-edit page-edit-content">
      <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form">
        <div class="member-item">
          <div class="title">{{$t('feeItem.add')}}</div>
          <div class="content">
            <el-form-item :label="$t('feeItem.fee_code')" prop="code">
              <el-input v-model="form.code" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('feeItem.fee_short_name')" prop="feeShortName">
              <el-input v-model="form.feeShortName" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('feeItem.chinese_name')" prop="chineseName" class="full-item">
              <el-input v-model="form.chineseName" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('feeItem.english_name')" prop="englishName" class="full-item">
              <el-input v-model="form.englishName" ></el-input>
            </el-form-item>
             <el-form-item :label="$t('feeItem.remark')" prop="remark" class="full-item">
              <el-input v-model="form.remark" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('feeItem.use_business')" prop="businessType" class="full-item">
              <el-checkbox-group v-model="form.businessType" @change="businessChange">
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
                <fee-business :ref="'feeBusinessRef' + item.businessTypeCode" :item="item" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-form>

      <div class="page-edit-footer">
        <el-button size="mini" @click="backList">{{$t("feeItem.cancel")}}</el-button>
        <el-button type="primary" @click="onDraft" size="mini" :loading="loading">
           <span>{{$t("feeItem.save_draft")}}</span>
        </el-button>
        <el-button type="primary" @click="onSubmit" size="mini" :loading="submitLoading">
           <span>{{$t("feeItem.submit")}}</span>
        </el-button>
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
		businessChange(list) {
			let arr = []
			list.forEach(v => {
				let index = this.businessTypeList.findIndex(item => item.code === v)
				if (index >= 0) {
					let item = this.businessTypeList[index]
					let exitIndex = this.dmnFeeItemBusinesses.findIndex(exit => exit.businessTypeCode === v)
					// 如果已经存在的则从存在的取
					// 如果不存在已经在的列表 则取基础数据的值存入
					if (exitIndex >= 0) {
						arr.push(this.dmnFeeItemBusinesses[exitIndex])
					} else {
						arr.push({
							businessTypeCode: item.code,
							businessTypeName: item.chineseName
						})
					}
				}
			})
			this.activeName = arr[0].businessTypeCode
			this.dmnFeeItemBusinesses = arr
		},
		// 保存草稿
		onDraft() {
			let data = {
				id: this.id,
				...this.form,
				dmnFeeItemBusinesses: []
			}
			if (!this.form.code) {
				this.$message.error('请先输入费用代码')
				return
			}
			if (this.form.businessType.length === 0) {
				this.$message.error('请先选择一个应用的业务')
				return
			}
			Object.keys(this.$refs).forEach(v => {
				if (v.indexOf('feeBusinessRef') >= 0) {
					let target = this.$refs[v][0]
					if (target) {
						data.dmnFeeItemBusinesses.push(target.getValue())
					}
				}
			})
			let fn = this.id ? feeUpdateDraftApi : feeAddDraftApi
			fn(data).then(res => {
				if (res.ok) {
					this.$message.success(this.$t("feeItem.save_draft_success"))
					this.backList()
				}
			})
		},
		// 提交
		onSubmit() {
			this.$refs.baseForm.validate(valid => {
				if (valid) {
					let data = {
						...this.form,
						dmnFeeItemBusinesses: []
					}
					let vb = true
					// 定位到未填写完成的那个tab
					let unPassItem = {}
					Object.keys(this.$refs).forEach(v => {
						if (v.indexOf('feeBusinessRef') >= 0) {
							let target = this.$refs[v][0]
							if (target) {
								if (target.validate()) {
									data.dmnFeeItemBusinesses.push(target.getValue())
								} else {
									vb = false
									// 如果没有校验完成，则被记录下来
									// 同时激活对应的Tab
									if (unPassItem.businessTypeCode) {
										unPassItem = target.getValue()
										this.activeName = unPassItem.businessTypeCode
									}
								}
							}
						}
					})
					if (!vb) {
						return
					}
					let fn = this.id ? feeUpdateSubmitApi : feeAddSubmitApi
					fn(data).then(res => {
						if (res.ok) {
							this.$message.success(this.$t("feeItem.submit_success"))
							this.backList()
						}
					})
				}
			})
		},
		handleClick() { },
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `FeeItemListDraft` })
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
</style>
