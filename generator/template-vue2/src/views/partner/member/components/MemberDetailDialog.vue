<template>
  <div>
    <el-dialog custom-class="detail-dialog" :visible.sync="showDetailDialog"  width="1000px"  top="2vh" :title="$t('authorization.view')" :close-on-click-modal="false">
      <div class="auth-detail-wrap" style="max-height: calc(100vh - 200px); overflow-y: auto; ">
        <div class="auth-detail-info enterprise-info" v-if="detail && detail.type === 2">
          <div class="info-section-module">
            <div class="info-title">
              {{ $t('authorization.detail.baseInfoLabel') }}
            </div>
            <div class="info-content">
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.idLabel') }}：</span>
                <span class="info-span">{{ detail.no }}</span>
              </div>
              <div class="info-item" v-if="detail.mobile || detail.email">
                <span class="info-label">{{ $t('authorization.admin_name') }}：</span>
                <span class="info-span">{{detail.adminUserChineseName}}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.register_country') }}：</span>
                <span class="info-span">{{detail.countryName}}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.typeLabel') }}：</span>
                <span class="info-span">{{ $t('authorization.table.enterpriseTyep') }}</span>
              </div>
              <div class="info-item" v-if="detail.mobile || detail.email">
                <span class="info-label">{{ $t('authorization.detail.mobileLabel') }}：</span>
                <span class="info-span">{{ detail.mobile }}</span>
              </div>
              <div class="info-item" v-if="detail.mobile || detail.email">
                <span class="info-label">{{ $t('authorization.detail.emailLabel') }}：</span>
                <span class="info-span">{{ detail.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.registerDateLabel') }}：</span>
                <span class="info-span">{{ $moment(Number(detail.createTime)).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.authTypeLabel') }}：</span>
                <span class="info-span">{{ switchAuditingStatus }}</span>
              </div>
            </div>
          </div>
          <div v-if="enterpriseDTO">
            <div class="info-section-module">
              <div class="info-title">{{ $t('authorization.detail.authInfoLabel') }}</div>
              <div class="info-content">
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.croporateNameLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.chineseName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.licenceNoLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.businessLicenceNo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.member_abbreviation') }}：</span>
                  <span class="info-span">{{detail.abbreviation}}</span></div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.capitalLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.registeredCapital }}{{ $t('authorization.detail.capitalUnit') }}：</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.company_english_name') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.englishName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.addressLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.registeredAddressNormalizedName | filterRegion }} {{ enterpriseDTO.registeredAddress }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.registerDateLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.registeredDate | parseDate }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.corporateTelephoneLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.corporateTelephone }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.bussinessDateLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.businessStartDate }} - {{ enterpriseDTO.businessEndDate }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.bussinessScopeLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.businessScope }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.bussinessLicenseLabel') }}：</span>
                  <span class="info-span">
                    <file-preview v-if="enterpriseDTO.businessLicenseUrl" :file-list="[{url: enterpriseDTO.businessLicenseUrl}]" />
                  </span>
                </div>
              </div>
            </div>
            <div class="info-section-module">
              <div class="info-title">
                {{ $t('authorization.detail.legalLabel') }}
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.nameLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.corporateName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.mobileLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.corporateMobile }}</span>
                </div>
                <div class="info-item full-line">
                  <span class="info-label">{{ $t('authorization.detail.identityNumLabel') }}：</span>
                  <span class="info-span">{{ enterpriseDTO.identityCardNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.identityFaceLabel') }}：</span>
                  <span class="info-span">
                    <file-preview v-if="enterpriseDTO.businessLicenseUrl" :file-list="[{url: enterpriseDTO.identityCardFaceUrl}]" />
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.identityBackLabel') }}：</span>
                  <span class="info-span" @click="showImagesByComponent(2)">
                    <file-preview v-if="enterpriseDTO.businessLicenseUrl" :file-list="[{url: enterpriseDTO.identityCardBackUrl}]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!enterpriseDTO">
            <div class="info-section-module">
              <div class="info-title">
                {{ $t('authorization.auth_message_null') }}
              </div>
            </div>
          </div>
        </div>
        <div class="auth-detail-info personal-info"  v-if="detail && detail.type === 1">
          <div class="info-section-module">
            <div class="info-title">{{ $t('authorization.detail.baseInfoLabel') }}</div>
            <div class="info-item-list">
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.idLabel') }}：</span>
                <span class="info-span">{{ baseInfo.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.typeLabel') }}：</span>
                <span class="info-span">{{ $t('authorization.table.personalTyep') }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.register_country') }}：</span>
                <span class="info-span">{{baseInfo.countryName}}</span>
              </div>
              <div class="info-item" v-if="baseInfo.mobile || baseInfo.email">
                <span class="info-label">{{ $t('authorization.detail.mobileLabel') }}：</span>
                <span class="info-span">{{ baseInfo.mobile }}</span>
              </div>
              <div class="info-item" v-if="baseInfo.mobile || baseInfo.email">
                <span class="info-label">{{ $t('authorization.detail.emailLabel') }}：</span>
                <span class="info-span">{{ baseInfo.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.registerDateLabel') }}：</span>
                <span class="info-span">{{ baseInfo.createTime | parseTime }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('authorization.detail.authTypeLabel') }}：</span>
                <span class="info-span">{{ switchAuditingStatus }}</span>
              </div>
            </div>
          </div>
          <div v-if="individualDTO">
            <div class="info-section-module">
              <div class="info-title">{{ $t('authorization.detail.authInfoLabel') }}</div>
              <div class="info-item-list">
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.nameLabel') }}：</span>
                  <span class="info-span">{{ individualDTO.chineseName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.identityNumLabel') }}：</span>
                  <span class="info-span">{{ individualDTO.identityCardNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.identityFaceLabel') }}：</span>
                  <span class="info-span" @click="showImagesByComponent(0)" v-if="individualDTO.identityCardFaceUrl">
                    <img :src="individualDTO.identityCardFaceUrl" alt="">
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('authorization.detail.identityBackLabel') }}：</span>
                  <span class="info-span" @click="showImagesByComponent(1)" v-if="individualDTO.identityCardBackUrl">
                    <img :src="individualDTO.identityCardBackUrl" alt="">
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!individualDTO">
            <div class="info-section-module">
              <div class="info-title">{{ $t('authorization.auth_message_null') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button type="primary" plain @click="showDetailDialog = false" size="mini" v-if="detail.auditingStatus !== 1">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="setAbbreviation" size="mini" v-if="detail.auditingStatus === 1">{{ $t('authorization.detail.resolve') }}</el-button>
        <el-button type="danger" @click="showReasonDialog = true" size="mini" v-if="detail.auditingStatus === 1">{{ $t('authorization.detail.reject') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showReasonDialog" :close-on-click-modal="false" :title="$t('authorization.detail.rejectReason')">
      <div class="reject-reason-wrap">
        <p>{{ $t('authorization.detail.rejectTitle') }}</p>
        <el-input  v-model="rejectReason" type="textarea" :autosize="{ minRows: 3}"/>
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button type="danger" @click="submitReject"  size="mini">
          {{ $t('authorization.detail.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showAbbreviation" :close-on-click-modal="false"  :title="$t('authorization.detail.abbreviationDesc')">
      <div class="reject-reason-wrap">
        <el-form ref="abbForm" :model="abbForm" :inline="true" :rules="abbFormRules" label-width="100" style="width: 80%;">
          <el-form-item prop="abbreviation" :label="$t('authorization.member_abbreviation')">
            <el-input v-model="abbForm.abbreviation" size="mini" maxlength="20" :placeholder="$t('authorization.please_enter_member_abbreviation')" />
          </el-form-item>
          <el-form-item prop="adminUserChineseName" :label="$t('authorization.admin_name')">
            <el-input v-model="abbForm.adminUserChineseName" size="mini" maxlength="20" :placeholder="$t('authorization.please_enter_admin_name')" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button type="primary" @click="resolveAuth" size="mini">
          {{ $t('authorization.detail.confirmBtn') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { submitAuthApi } from '@/api/partner/member'
export default {
  name: 'MemberDetailDialog',
	filters: {
		filterRegion(str) {
			return str.split('@@@').join(' ')
		}
	},
	data() {
		return {
      showDetailDialog: false,
      showAbbreviation: false,
			showReasonDialog: false,
			authDetial: null,
			rejectReason: '',
      detail: {},
      baseInfo: null,
			enterpriseDTO: null,
			auditingStatus: 0,
			srcList: [],
			currIndex: 0,

      abbForm: {
				abbreviation: '',
				adminUserChineseName: ''
			},
			abbFormRules: {
				abbreviation: [
					{ required: true, message: this.$t('authorization.please_enter_member_abbreviation'), trigger: 'blur' }
				],
				adminUserChineseName: [
					{ required: true, message: this.$t('authorization.please_enter_admin_name'), trigger: 'blur' }
				]
			}
    }
	},
	computed: {
		switchAuditingStatus() {
			return this.auditingStatus === 1 ? this.$t('authorization.status.processing') : this.auditingStatus === 2 ? this.$t('authorization.status.success') : this.$t('authorization.status.rejected')
		}
	},
	methods: {
    show(row) {
      this.detail = row
      if (row && row.type === 2) {
        this.baseInfo = row
        this.auditingStatus = row.auditingStatus
        this.enterpriseDTO = row.enterpriseDTO
        if (this.enterpriseDTO) {
          this.enterpriseDTO.createTime = this.enterpriseDTO.createTime ? this.$moment(Number(this.enterpriseDTO.createTime)).format('YYYY-MM-DD') : ''
          this.enterpriseDTO.businessStartDate = this.enterpriseDTO.businessStartDate ? this.$moment(Number(this.enterpriseDTO.businessStartDate)).format('YYYY-MM-DD') : ''
          this.enterpriseDTO.businessEndDate = this.enterpriseDTO.businessEndDate ? this.$moment(Number(this.enterpriseDTO.businessEndDate)).format('YYYY-MM-DD') : ''
          this.srcList = [
            row.enterpriseDTO.businessLicenseUrl,
            row.enterpriseDTO.identityCardFaceUrl,
            row.enterpriseDTO.identityCardBackUrl
          ]
        }
      }
      if (row && row.type === 1) {
        this.baseInfo = row
        this.auditingStatus = row.auditingStatus
        this.individualDTO = row.individualDTO
        if (this.individualDTO) {
          this.srcList = [
            row.individualDTO.identityCardFaceUrl,
            row.individualDTO.identityCardBackUrl
          ]
        }
      }
      this.showDetailDialog = true
    },
    // 审核前填写简称
		setAbbreviation() {
			if (this.detail.enterpriseDTO) {
				this.abbForm.abbreviation = this.detail.abbreviation
				this.abbForm.adminUserChineseName = this.detail.adminUserChineseName
			} else if (this.detail.individualDTO) {
				this.abbForm.abbreviation = this.detail.individualDTO.chineseName
			} else {
				this.$message.error('数据错误')
				return false
			}
			this.showAbbreviation = true
		},
		resolveAuth() {
			this.$refs.abbForm.validate(valid => {
				if (valid) {
					const _data = {
						auditingStatus: 2,
						failureReason: '',
						abbreviation: this.abbForm.abbreviation,
						adminUserChineseName: this.abbForm.adminUserChineseName,
						memberId: this.detail.id
					}
					submitAuthApi(JSON.stringify(_data)).then(res => {
						if (res.ok) {
							this.$message({
								type: 'success',
								message: this.$t('authorization.detail.resolveSuccess')
							})
							this.$emit('success')
              this.showDetailDialog = false
							this.showReasonDialog = false
							this.showAbbreviation = false
							this.rejectReason = ''
							this.detail = null
						}
					})
				}
			})
		},
		async submitReject() {
			if (this.rejectReason) {
				const _data = {
					auditingStatus: 3,
					failureReason: this.rejectReason,
					memberId: this.detail.id
				}
				const res = await submitAuthApi(JSON.stringify(_data))
				if (res.ok) {
					this.$emit('success')
					this.showDetailDialog = false
					this.showReasonDialog = false
					this.rejectReason = ''
					this.$message({
						type: 'warning',
						message: this.$t('authorization.detail.rejectSuccess')
					})
				}
			} else {
				this.$message({
					type: 'warning',
					message: this.$t('authorization.detail.reasonEmpty')
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.info-section-module .info-item{
  margin-bottom: 0;
}
.info-section-module .info-item .info-label {
  width: 128px
}

.info-section-module{
  padding: 0;
  .info-title{
    padding: 0 20px 10px 20px;
  }
}
</style>
