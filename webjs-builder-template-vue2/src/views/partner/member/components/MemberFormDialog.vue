<template>
  <el-dialog v-if="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :title="title"  :visible.sync="dialogVisible" width="1000px">
    <div style="height: 525px; overflow-y: auto; padding-right: 15px;">
      <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form" :close-on-click-modal="false">
        <div class="info-section-module">
          <div class="info-title">{{ $t('authorization.detail.baseInfoLabel') }}</div>
          <div class="info-content">
            <el-form-item :label="$t('authorization.member_id')" prop="no" :class="!!form.no ? '' : 'full-line'" v-if="!!form.no">
              <el-input v-model="form.no" :disabled="!!form.no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.admin_name')" prop="adminUser.chineseName" :class="!!form.no ? '' : 'full-line'" v-if="form.type === 2 && form.createAdminUserFlag">
              <el-input v-model="form.adminUser.chineseName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.detail.mobileLabel')" prop="adminUser.mobile" v-if="form.createAdminUserFlag">
              <el-input v-model="form.adminUser.mobile" :placeholder="$t('authorization.mobile_des')" :disabled="!!form.no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.member_type')" prop="type" required>
              <el-select v-model="form.type" :placeholder="$t('authorization.please_select')" disabled style="width: 100%">
                <el-option key="2" :label="$t('authorization.memberType.company')" :value="2"></el-option>
                <el-option key="1" :label="$t('authorization.memberType.personal')" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('authorization.detail.emailLabel')" prop="adminUser.email" v-if="form.createAdminUserFlag">
              <el-input v-model="form.adminUser.email" :placeholder="$t('authorization.email_des')" :disabled="!!form.no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.register_country')" prop="country" required>
              <base-select v-model="form.country" type="country" filterable disabled  />
            </el-form-item>
          </div>
        </div>
        <div class="info-section-module" v-if="form.type === 2">
          <div class="info-title">
            {{$t('authorization.company_auth_info')}}
            <el-button type="primary" @click="getCompanyDetail(form.chineseName)" class="get" size="mini" v-if="!!form.no">
              {{$t('authorization.get_company_info')}}
            </el-button>
          </div>
          <div class="info-content">
            <el-form-item :label="$t('authorization.detail.croporateNameLabel')" prop="chineseName">
              <company-select :value="form.chineseName" :isCN="isCN" @change="companyChange" :disabled="!!form.no"></company-select>
            </el-form-item>
            <el-form-item :label="$t('authorization.detail.licenceNoLabel')" prop="businessLicenceNo" :rules="[{ required: isCN, message: this.$t('authorization.business_licence_no_cannot_be_null'), trigger: 'change' },{ validator: validateCreditCode, trigger: 'change' }]">
              <el-input v-model="form.businessLicenceNo" :disabled="basicDisabled"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.member_abbreviation')" prop="abbreviation">
              <el-input v-model="form.abbreviation" :disabled="!!form.no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.registered_address')" prop="registeredAddressNormalizedCode" v-if="isCN">
              <provinces
                :value="form.registeredAddressNormalizedCode"
                :valueName="form.registeredAddressNormalizedName"
                @change="provincesChange"
                :disabled="basicDisabled">
              </provinces>
            </el-form-item>
            <el-form-item :label="$t('authorization.company_english_name')" prop="englishName" :rules="[{ required: !isCN, message: this.$t('common.cannot_be_null'), trigger: 'change' }]">
              <el-input v-model="form.englishName" :disabled="basicDisabled"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.company_address')" prop="registeredAddress">
              <el-input v-model="form.registeredAddress" :disabled="basicDisabled"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.capital')" prop="registeredCapital">
              <el-input type="age" v-model="form.registeredCapital" :disabled="basicDisabled">
                <template slot="append">{{$t('authorization.capital_unit')}}</template>
              </el-input>
            </el-form-item>

            <el-form-item :label="$t('authorization.operation_period')">
              <common-picker :disabled="basicDisabled" :pikcerType="'daterange'" :pickerFormat="'yyyy-MM-dd'" v-model="form.rangeDate"/>
            </el-form-item>
            <el-form-item :label="$t('authorization.registered_date')" prop="registeredDate">
              <common-picker :disabled="basicDisabled" :pikcerType="'date'" :pickerFormat="'yyyy-MM-dd'" v-model="form.registeredDate"/>
            </el-form-item>
            <el-form-item :label="$t('authorization.corporate_telephone')" prop="corporateTelephone">
              <el-input v-model="form.corporateTelephone"></el-input>
            </el-form-item>

            <el-form-item :label="$t('authorization.business_scope')" prop="businessScope">
              <el-input
                type="textarea"
                :rows="2"
                :disabled="basicDisabled"
                v-model="form.businessScope"
                maxlength="800"
                show-word-limit></el-input>
            </el-form-item>

            <el-form-item :label="$t('authorization.business_license')" prop="businessLicense">
              <upload-file accept=".jpg,.png,.pdf" :value="form.businessLicenseUrl" @success="businessLicenseSuccess"  type="SINGLE_FILE_PREVIEW"/>
            </el-form-item>
          </div>
        </div>
        <div class="info-section-module" v-if="form.type === 2">
          <div class="info-title">{{$t('authorization.company_corporate_info')}}</div>
          <div class="info-content">
            <el-form-item :label="$t('authorization.corporate_name')" prop="corporateName">
              <el-input v-model="form.corporateName" :disabled="basicDisabled"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.corporate_mobile')" prop="corporateMobile">
              <el-input v-model="form.corporateMobile"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.corporate_identity_card_number')" prop="identityCardNumber" class="full-line">
              <el-input v-model="form.identityCardNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.identity_card_face')" prop="identityCardFace">
              <upload-file accept=".jpg,.png" :value="form.identityCardFaceUrl" @success="identityCardFaceSuccess" type="SINGLE_FILE_PREVIEW"/>
            </el-form-item>
            <el-form-item :label="$t('authorization.identity_card_back')" prop="identityCardBack">
              <upload-file accept=".jpg,.png" :value="form.identityCardBackUrl" @success="identityCardBackSuccess" type="SINGLE_FILE_PREVIEW"/>
            </el-form-item>
          </div>
        </div>
        <div class="info-section-module" v-if="form.type === 1">
          <div class="info-title">{{$t('authorization.personal_corporate_info')}}</div>
          <div class="info-content">
            <el-form-item :label="$t('authorization.personal_name')" prop="userIdentityCardName">
              <el-input v-model="form.userIdentityCardName"  :disabled="!!form.no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.identity_card_number')" prop="userIdentityCardNumber">
              <el-input v-model="form.userIdentityCardNumber" :disabled="!!form.no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('authorization.identity_card_face')" prop="identityCardFace">
              <upload-file accept=".jpg,.png" :value="form.identityCardFaceUrl" @success="identityCardFaceSuccess" type="SINGLE_FILE_PREVIEW"/>
            </el-form-item>
            <el-form-item :label="$t('authorization.identity_card_back')" prop="identityCardBack">
              <upload-file accept=".jpg,.png"  :value="form.identityCardBackUrl" @success="identityCardBackSuccess" type="SINGLE_FILE_PREVIEW"/>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="onSubmit" size="mini">{{$t('common.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
	companyIsUniqueApi,
	creditCodeIsUniqueApi,
	mobileIsUniqueApi,
	emailIsUniqueApi,
	idCardIsUniqueApi,
	getReginInfoApi,
	addCompanyApi,
	updateCompanyApi,
	addPersonalApi,
	updatePersonalApi,
	getCompanyDetailByTianYanChaApi,
	getCompanyDetailByOwnApi,
	getMemberTypeApi
} from '@/api/partner/member'
import { validateEmail, validateMobile } from "@/utils/validate";

export default {
  name: 'MemberFormDialog',
	props: {
		addPreData: {
			type: Object,
			default: function () {
				return {}
			}
		},
		countryList: {
			type: Array,
			default: function () {
				return []
			}
		}
	},
	watch: {
		addPreData: {
			handler(val) {

			},
			deep: true
		}
	},
	data() {
		const validateMobile = (rule, value, callback) => {
			if (this.isCN) {
				let _reg = /^1[3|4|5|6|7|8][0-9]{9}$/
				if (value && !_reg.test(value)) {
					callback(this.$t('authorization.mobile_error'))
				} else {
					callback()
				}
			} else {
				callback()
			}
		}

		const validateCorporateTelephone = (rule, value, callback) => {
			if (this.isCN) {
				let _reg = /^[()0-9-\s]+$/
				if (value && !_reg.test(value)) {
					callback(this.$t('authorization.company_phone_error'))
				} else {
					callback()
				}
			} else {
				callback()
			}
		}

		const validateMobileUnique = (rule, value, callback) => {
			if (this.form.no) {
				callback()
				return
			}
			let reg = /^1[3|4|5|6|7|8][0-9]{9}$/
			if (value) {
				if (reg.test(value)) {
					mobileIsUniqueApi({ mobile: value }).then(res => {
						if (res.content) {
							callback(this.$t('authorization.mobile_cannot_be_repeat'))
						} else {
							callback()
						}
					})
				} else {
					return callback(this.$t('authorization.mobile_error'))
				}
			} else {
				callback()
			}
		}

		const validateEmailFn = (rule, value, callback) => {
			if (this.form.no) {
				callback()
				return
			}
			if (value) {
				if (validateEmail(value)) {
					emailIsUniqueApi({ email: value }).then(res => {
						if (res.content) {
							callback(this.$t('authorization.email_cannot_be_repeat'))
						} else {
							callback()
						}
					})
				} else {
					return callback(this.$t('authorization.email_error'))
				}
			} else {
				callback()
			}
		}

		const validateIdentityUnique = (rule, value, callback) => {
			if (this.form.no) {
				callback()
				return
			}
			const _reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
			if (value) {
				if (this.isCN && !_reg.test(value)) {
					return callback(this.$t('authorization.identity_card_number_error'))
				}
				idCardIsUniqueApi({ country: this.form.country, identify: value }).then(res => {
					if (res && res.ok && res.content) {
						callback(this.$t('authorization.identity_card_number_cannot_be_repeat'))
					} else {
						callback()
					}
				}).catch(error => {
					callback(new Error(error.msg ? error.msg : '验证出错'))
				})
			} else {
				callback()
			}
		}

		const validateIdentity = (rule, value, callback) => {
			if (this.isCN) {
				const _reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
				if (value) {
					if (_reg.test(value)) {
						callback()
					} else {
						return callback(this.$t('authorization.identity_card_number_error'))
					}
				} else {
					callback()
				}
			} else {
				callback()
			}
		}
		const validateCreditCode = (rule, value, callback) => {
			if (this.form.no) {
				callback()
				return
			}
			if (value) {
				creditCodeIsUniqueApi({ country: this.form.country, creditCode: value }).then(res => {
					if (res && res.ok && res.content) {
						callback(this.$t('authorization.business_licence_no_cannot_be_repeat'))
					} else {
						callback()
					}
				})
			} else {
				callback()
			}
		}
		const validateCompany = (rule, value, callback) => {
			if (this.form.no) {
				callback()
				return
			}
			if (value) {
				companyIsUniqueApi({ country: this.form.country, name: value }).then(res => {
					if (res && res.ok && res.content) {
						callback(this.$t('authorization.company_name_cannot_be_repeat'))
					} else {
						callback()
					}
				})
			} else {
				return callback(this.$t('authorization.company_name_cannot_be_null'))
			}
		}

		return {
			title: this.$t('authorization.new_member'),
			isCN: false,
			basicDisabled: false,
			dialogVisible: false,
			form: {
				createAdminUserFlag: false,
				adminUser: {},
				rangeDate: []
			},
			formRule: {
				'adminUser.chineseName': [
					{ required: true, message: this.$t('authorization.admin_name_cannot_be_null') }
				],
				'abbreviation': [
					{ required: true, message: this.$t('authorization.member_abbreviation_cannot_be_null') }
				],
				chineseName: [
					{ required: true, message: this.$t('authorization.company_name_cannot_be_null'), trigger: 'change' },
					{ validator: validateCompany, trigger: 'change' }
				],
				corporateTelephone: [
					{ validator: validateCorporateTelephone, trigger: 'change' }
				],
				corporateMobile: [
					{ validator: validateMobile, trigger: 'blur' }
				],
				'adminUser.mobile': [
					{ validator: validateMobileUnique, trigger: 'blur' }
				],
				'adminUser.email': [
					{ validator: validateEmailFn, trigger: 'blur' }
				],
				identityCardNumber: [
					{ validator: validateIdentity, trigger: 'blur' }
				],
				'userIdentityCardName': [
					{ required: true, message: this.$t('authorization.personal_name_cannot_be_null'), trigger: 'blur' }
				],
				userIdentityCardNumber: [
					{ required: true, message: this.$t('authorization.identity_card_number_cannot_be_null'), trigger: 'blur' },
					{ validator: validateIdentityUnique, trigger: 'blur' }
				]
			},
			loading: false
		}
	},
	created() {
		this.formInit()
	},
	methods: {
    validateCreditCode (rule, value, callback) {
			if (this.form.no) {
				callback()
				return
			}
			if (value) {
				creditCodeIsUniqueApi({ country: this.form.country, creditCode: value }).then(res => {
					if (res && res.ok && res.content) {
						callback(this.$t('authorization.business_licence_no_cannot_be_repeat'))
					} else {
						callback()
					}
				})
			} else {
				callback()
			}
		},
		initRender() {
			if (this.form.country === 'CN') {
				this.isCN = true
				this.basicDisabled = true
			} else {
				this.isCN = false
				this.basicDisabled = false
			}
		},
		async getCompanyDetail(id) {
			let fn = this.isCN ? getCompanyDetailByTianYanChaApi : getCompanyDetailByOwnApi
			await fn({ companyName: id }).then(res => {
				if (res && res.ok) {
					if (res.content) {
						delete res.content.id
						Object.keys(res.content).forEach(v => {
							this.form[v] = res.content[v]
						})
						this.form.rangeDate = [res.content.businessStartDate, res.content.businessEndDate]
					}
				}
			})
		},
		formInit() {
			this.form = {
				adminUser: {
					mobile: '',
					email: '',
					chineseName: ''
				},
				rangeDate: [],
				type: '',
				country: '',
				abbreviation: '',
				chineseName: '',
				englishName: '',
				businessLicenceNo: '',
				businessStartDate: null,
				businessEndDate: null,
				registeredAddressNormalizedCode: '',
				registeredAddressNormalizedName: '',
				registeredAddress: '',
				registeredCapital: '',
				registeredDate: null,
				businessScope: '',
				corporateTelephone: '',
				businessLicense: '',
				businessLicenseUrl: '',

				corporateName: '',
				corporateMobile: '',
				identityCardNumber: '',

				identityCardFace: '',
				identityCardFaceUrl: '',

				identityCardBack: '',
				identityCardBackUrl: '',

				userIdentityCardName: '',
				userIdentityCardNumber: ''
			}
		},
		formCompanyInit() {
			let obj = {
				rangeDate: [],
				abbreviation: '',
				chineseName: '',
				englishName: '',
				businessLicenceNo: '',
				businessStartDate: null,
				businessEndDate: null,
				registeredAddressNormalizedCode: '',
				registeredAddressNormalizedName: '',
				registeredAddress: '',
				registeredCapital: '',
				registeredDate: null,
				businessScope: '',
				corporateTelephone: '',
				businessLicense: '',
				businessLicenseUrl: '',

				corporateName: '',
				corporateMobile: '',
				identityCardNumber: '',

				identityCardFace: '',
				identityCardFaceUrl: '',

				identityCardBack: '',
				identityCardBackUrl: '',

				userIdentityCardName: '',
				userIdentityCardNumber: ''
			}
			Object.keys(obj).forEach(v => {
				this.form[v] = obj[v]
			})
		},
		async companyChange(company) {
			if (company && company.id) {
				this.basicDisabled = true
				await this.getCompanyDetail(company.id)
			} else if (company.value) {
				this.formCompanyInit()
				this.form.chineseName = company.value
				this.basicDisabled = false
			}
			this.$refs.baseForm.validateField('chineseName', () => { })
		},
		provincesChange(val) {
			this.form.registeredAddressNormalizedCode = val.code
			this.form.registeredAddressNormalizedName = val.name
		},
		show(type, val) {
      if (type === 'ADD') {
        this.formInit()
				this.title = this.$t('authorization.new_member')
				this.form.type = val.type
				this.form.country = val.country
				this.form.createAdminUserFlag = val.createAdminUserFlag
      } else {
        this.title = this.$t('authorization.edit_member')
        val.adminUser = val.adminUser || {}
        this.form = {
          ...val,
          rangeDate: [val.businessStartDate, val.businessEndDate]
        }
        this.form.createAdminUserFlag = !!val.adminUser.mobile || !!val.adminUser.email
        if (val.type === 1) {
          this.form.userIdentityCardNumber = this.form.identityCardNumber
          this.form.userIdentityCardName = this.form.chineseName
        }
      }
			this.initRender()
			this.dialogVisible = true
		},
		onSubmit() {
			if (this.form.createAdminUserFlag && !this.form.adminUser.mobile && !this.form.adminUser.email) {
				this.$message.error(this.$t('authorization.mobile_or_email_cannot_be_null'))
				return
			}
			this.$refs.baseForm.validate(valid => {
				if (valid) {
					this.loading = true
					let fn = null
					if (this.form.type === 2) {
						fn = this.form.no ? updateCompanyApi : addCompanyApi
					} else {
						fn = this.form.no ? updatePersonalApi : addPersonalApi
					}
					if (this.form.type === 1) {
						this.form.chineseName = this.form.userIdentityCardName
						this.form.identityCardNumber = this.form.userIdentityCardNumber
					}
					if (this.form.rangeDate && this.form.rangeDate.length) {
						this.form.businessStartDate = this.form.rangeDate[0]
						this.form.businessEndDate = this.form.rangeDate[1]
					}
					fn(this.form).then(res => {
						if (res.ok) {
							this.dialogVisible = false
							if (this.form.id) {
								this.$message.success(this.$t('authorization.edit_success'))
							} else {
								let no = res.content
								const h = this.$createElement;
								this.$msgbox({
									title: this.$t('authorization.msg'),
									message: h('div', { class: 'no' }, [
										h('span', null, this.$t('authorization.member_id_is') + no)
									]),
									confirmButtonText: this.$t('authorization.confirm')
								})
								setTimeout(() => {
									this.$msgbox.close()
								}, 5000);
							}
							this.$emit('success')
						}
					})
				}
			})
		},
		businessLicenseSuccess(file) {
			this.form.businessLicense = file.cloudFileName
		},
		identityCardFaceSuccess(file) {
			this.form.identityCardFace = file.cloudFileName
		},
		identityCardBackSuccess(file) {
			this.form.identityCardBack = file.cloudFileName
		}
	}
}
</script>
<style scoped lang="scss">
.no {
	font-size: 34px;
	color: rgb(51, 51, 153);
	margin-top: 30px;
	text-align: center;
}
.info-section-module{
  padding: 0;
  .info-title{
    padding: 0 20px 10px 20px;
  }

  ::v-deep .el-form-item {
		width: 50%;
		float: left;
	}
  ::v-deep .el-form-item--mini .el-form-item__content {
    line-height: 30px;
  }
}

.full-line {
  margin-right: 10px;
}
</style>
