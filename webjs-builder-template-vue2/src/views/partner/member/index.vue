<template>
  <div class="app-main-inner" v-loading="loading">
    <div class="sigle-search-wrap">
      <el-form style="width: 400px;float: left;" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="searchStr" size="mini" type="text" clearable :placeholder="$t('authorization.topSearchPlaceholder')" @keyup.enter.native="getList">
            <el-button slot="append" type="primary" @click="getList">
              {{ $t('authorization.topSearchBtnTxt') }}
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div style="float: right;">
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="addMember"  v-permission="['mem:user:omc:add']">{{$t('authorization.new_member')}}</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="getList">{{$t('authorization.refresh_list')}}</el-button>
      </div>
    </div>
    <div class="user-table">
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="userList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        style="width:100%; height:calc(100vh - 300px);"
        class="ag-theme-balham"
      />
      <pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" :title="$t('authorization.detail.addAccount')">
      <div class="reject-reason-wrap">
        <p> {{ $t('authorization.detail.addAccountTitle') }}</p>
        <el-select v-model="currency">
          <el-option v-for="item in accounts" :key="item.code" :label="item.name" :value="item.code"/>
        </el-select>
      </div>
      <div slot="footer" class="option-btn-wrap">
        <el-button type="primary" :disabled="$isEmpty(currency)" @click="saveForm">
          {{ $t('authorization.detail.addAccountBtn') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="changeNameVisible" :close-on-click-modal="false" width="500px" :title="$t('authorization.changeName')">
      <el-form v-if="changeNameVisible" ref="changeNameFormRef" :model="changeNameForm" :rules="changeNameFormRule" label-width="150px" size="mini" class="member-form">
        <el-form-item :label="$t('authorization.register_country')" prop="country">
          <base-select v-model="changeNameForm.countryCode" type="country" filterable @change="countryChange"/>
        </el-form-item>
        <el-form-item :label="$t('authorization.detail.croporateNameLabel')" prop="chineseName">
          <company-select :value="changeNameForm.chineseName" :isCN="changeNameForm.isCN" @change="companyChange"></company-select>
        </el-form-item>
        <el-form-item :label="$t('authorization.company_english_name')" prop="englishName" :rules="[{ required: !changeNameForm.isCN, message: this.$t('common.cannot_be_null'), trigger: 'change' }]">
          <el-input v-model="changeNameForm.englishName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('authorization.member_abbreviation')" prop="abbreviation">
          <el-input v-model="changeNameForm.abbreviation"></el-input>
        </el-form-item>
        <el-form-item :label="$t('authorization.detail.licenceNoLabel')" prop="businessLicenceNo" :rules="[{ required: changeNameForm.isCN, message: this.$t('common.cannot_be_null'), trigger: 'change' },{ validator: validateCreditCode, trigger: 'change' }]">
          <el-input v-model="changeNameForm.businessLicenceNo" :disabled="changeNameForm.isCN"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button @click="changeNameVisible = false"  size="mini">{{$t('authorization.cancel')}}</el-button>
        <el-button type="primary" @click="changeNameFormConfirm"  size="mini">{{$t('authorization.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="addVisible" :close-on-click-modal="false" width="500px" :title="$t('authorization.new_member')">
      <el-form ref="addPreDataForm" :model="addPreData" :rules="addPreDataRule" label-width="150px" size="mini" class="member-form">
        <el-form-item :label="$t('authorization.member_type')" prop="type">
          <el-select v-model="addPreData.type" :placeholder="$t('authorization.please_select')" style="width: 100%">
            <el-option  key="1" :label="$t('authorization.memberType.company')" :value="2"></el-option>
            <el-option  key="2" :label="$t('authorization.memberType.personal')" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('authorization.register_country')" prop="country">
          <base-select v-model="addPreData.country" type="country" filterable />
        </el-form-item>
        <el-form-item :label="$t('authorization.if_member_admin_account')" prop="createAdminUserFlag">
          <el-radio-group v-model="addPreData.createAdminUserFlag">
            <el-radio :label="true">{{$t('authorization.yes')}}</el-radio>
            <el-radio :label="false">{{$t('authorization.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button @click="addVisible = false"  size="mini">{{$t('authorization.cancel')}}</el-button>
        <el-button type="primary" @click="addPreConfirm"  size="mini">{{$t('authorization.confirm')}}</el-button>
      </div>
    </el-dialog>

    <member-form-dialog ref="memberFormDialogRef" @success="getList" />
    <member-detail-dialog ref="memberDetailDialogRef"  @success="getList" />
  </div>
</template>

<script>
import {
  getAuthListApi,
  getAuthDetailApi,
  submitAuthApi,
  getCompanyDetailApi,
  getPersonalDetailApi,
  creditCodeIsUniqueApi,
  getCompanyDetailByTianYanChaApi,
  getCompanyDetailByOwnApi,
  changeMemberNameApi,
  getAuthLoginApi
} from '@/api/partner/member'
import { getCountryListApi } from '@/api/country'
import MemberDetailDialog from './components/MemberDetailDialog'
import optionBtn from './optionBtn'
import emailCell from './components/emailCell'
import mobileCell from './components/mobileCell'
import MemberFormDialog from './components/MemberFormDialog'
import { AgGridVue } from 'ag-grid-vue'

export default {
	name: 'MemberUserList',
	components: {
		MemberFormDialog,
		MemberDetailDialog,
		AgGridVue,
		optionBtn,
		emailCell,
		mobileCell
	},
	data() {
		return {
			addVisible: false,
			addPreData: {
				type: '',
				country: '',
				createAdminUserFlag: false
			},
			addPreDataRule: {
				type: [
					{ required: true, message: this.$t('authorization.member_type_cannot_be_null'), trigger: 'blur' }
				],
				country: [
					{ required: true, message: this.$t('authorization.register_country_cannot_be_null'), trigger: 'blur' }
				]
			},

      changeNameVisible: false,
      changeNameForm: {
        chineseName: "",
        englishName: "",
        abbreviation: "",
        countryCode: "",
        businessLicenceNo: "",
        isCN: false,
        id: ''
      },
      changeNameFormRule: {
        countryCode: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
        chineseName: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }],
        abbreviation: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }]
      },

			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 0,
			total: 0,
			userList: [],
			searchStr: '',

			columnFields: [],
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			gridOptions: {
			context: {
				componentParent: this
			},
			rowSelection: 'single', // 设置多行可选
			animateRows: true,
			suppressRowClickSelection: true // 选中单元格后可以复制内容
		},
			loading: false,
			memberId: null,
			currency: '',
			accounts: [],
			originCorporateName: ''
		}
	},
	created() {
		this.columnFields = [
			{
				field: 'no',
				headerName: '会员ID'
			},
			{
				field: 'chineseName',
				headerName: this.$t('authorization.table.nameLabel')
			},
			{
				field: 'typeName',
				headerName: this.$t('authorization.table.memberTypeLabel')
			},
			{
				field: 'mobile',
				headerName: this.$t('authorization.table.contactMobileLabel'),
				cellRendererFramework: 'mobileCell'
			},
			{
				field: 'email',
				headerName: this.$t('authorization.table.contactEmailLabel'),
				cellRendererFramework: 'emailCell'
			},
			{
				field: 'auditingStatus',
				headerName: this.$t('authorization.table.statusLabel'),
				cellRenderer: params => {
					if (params.value === 0) {
						return `<div class='status-wrap'><span class='status-dot'></span>${this.$t('authorization.status.unSubmit')}</div>`
					} else if (params.value === 1) {
						return `<div class='status-wrap'><span class='status-dot processing'></span>${this.$t('authorization.status.processing')}</div>`
					} else if (params.value === 2) {
						return `<div class='status-wrap'><span class='status-dot successed'></span>${this.$t('authorization.status.success')}</div>`
					} else {
						return `<div class='status-wrap'><span class='status-dot rejected'></span>${this.$t('authorization.status.rejected')}</div>`
					}
				}
			},
			{
				field: 'createTime',
				headerName: this.$t('authorization.table.registeredDateLabel'),
				cellRenderer: params =>	params.value ? this.$moment(Number(params.value)).format('YYYY-MM-DD') : ''
			},
			{
				field: 'id',
				headerName: this.$t('authorization.table.optionLabel'),
				cellRendererFramework: 'optionBtn',
				minWidth: 280
			}
		]
		this.getList()
	},
	methods: {
		editFn(row) {
			let fn = null
			if (row.type === 1) {
				fn = getPersonalDetailApi
			} else {
				fn = getCompanyDetailApi
			}
			fn(row.id).then(res => {
        if (res.ok) {
          this.$refs.memberFormDialogRef.show('EDIT', res.content)
        }
      })
		},
    viewFn(row) {
      let data = {
        memberId: row.id
      }
			getAuthDetailApi(data).then(res => {
        if (res.ok) {
          this.$refs.memberDetailDialogRef.show(res.content)
        }
      })
    },
    authLoginFn(row) {
			getAuthLoginApi(row.id).then(res => {
				if (res.ok && res.content) {
					let link = document.createElement('a')
					link.setAttribute('href', res.content)
					link.setAttribute('target', '_blank')
					link.click()
				}
			})
		},
		addPreConfirm() {
			this.$refs.addPreDataForm.validate(valid => {
				if (valid) {
					this.addVisible = false
					this.$refs.memberFormDialogRef.show('ADD', this.addPreData)
				}
			})
		},
		addMember() {
			this.addVisible = true
			this.addPreData = {
				type: '',
				country: '',
				createAdminUserFlag: false
			}
		},
		onReady(params) {
			params.api.sizeColumnsToFit()
			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit()
				})
			})
		},
		/**
		 * 新增账户
		 */
		async addAccount(id) {
			// this.memberId = id
			// this.dialog.visible = true
			// this.currency = null
			// const res = await getAccountListBy(id)
			// if (res.ok) {
			// 	this.accounts = res.content || []
			// } else {
			// 	this.accounts = []
			// }
		},
		/**
		 * 开通账户
		 */
		async saveForm() {
			// const res = await saveAccount({ memberId: this.memberId, currency: this.currency })
			// if (res.ok) {
			// 	this.$message.success(this.$t('authorization.detail.addAccountSuccess'))
			// 	this.dialog.visible = false
			// }
		},
		async getList() {
			this.loading = true
			const _params = {
				pageSize: this.pageSize,
				pageNum: this.pageNum,
				keyword: this.searchStr
			}
			const res = await getAuthListApi(_params)
			if (res.ok) {
        res.content.list.forEach(v => {
          v.typeName = v.type === 0 ? this.$t('authorization.table.unauthorized') : v.type === 1 ? this.$t('authorization.table.personalTyep') : this.$t('authorization.table.enterpriseTyep')
        })
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.$message({
					type: 'warning',
					message: this.$t('authorization.listEmpty')
				})
				this.total = 0
				this.userList = []
			}
			this.loading = false
		},
		changeNameFn(row) {
      let data = {
        memberId: row.id
      }
      getAuthDetailApi(data).then(res => {
        if (res.ok) {
          this.changeNameForm = {
            chineseName: res.content.chineseName,
            englishName: res.content.englishName,
            abbreviation: res.content.abbreviation,
            countryCode: res.content.countryCode,
            businessLicenceNo: res.content.enterpriseDTO.businessLicenceNo,
            isCN: res.content.countryCode === 'CN',
            id: res.content.id
          }
          this.changeNameVisible = true
        }
      })
		},
    countryChange() {
      this.changeNameForm.isCN = this.changeNameForm.countryCode === 'CN'
    },
    changeNameFormConfirm() {
      this.$refs.changeNameFormRef.validate(valid => {
        if (valid) {
          changeMemberNameApi(this.changeNameForm).then(res => {
            if (res.ok) {
              this.changeNameVisible = false
              this.$message.success(this.$t('authorization.changeMemberNameSuccess'))
              this.getList()
            }
          })
        }
      })
    },
    async companyChange(company) {
			if (company && company.id) {
				await this.getCompanyDetail(company.id)
			} else if (company.value) {
				this.changeNameForm.chineseName = company.value
			}
		},
    validateCreditCode (rule, value, callback) {
			if (value) {
        let data = {
          country: this.changeNameForm.countryCode,
          creditCode: value,
          memberId: this.changeNameForm.id
        }
				creditCodeIsUniqueApi(data).then(res => {
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
    async getCompanyDetail(id) {
			let fn = this.changeNameForm.isCN ? getCompanyDetailByTianYanChaApi : getCompanyDetailByOwnApi
			await fn({ companyName: id }).then(res => {
				if (res && res.ok) {
					if (res.content) {
            this.changeNameForm.chineseName = res.content.chineseName
						this.changeNameForm.abbreviation = res.content.abbreviation
						this.changeNameForm.englishName = res.content.englishName
            this.changeNameForm.businessLicenceNo = res.content.businessLicenceNo
					}
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
@mixin rowFlexBase {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
}
@mixin rowFlexRight {
	@include rowFlexBase;
	justify-content: flex-end;
}
@mixin columnFlexBase {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: flex-end;
}
.sigle-search-wrap {
	padding: 20px 20px 0 20px;
  overflow: hidden;
}
.user-table {
	padding: 0px 20px;
}
::v-deep .el-pagination {
	width: auto;
}
::v-deep .status-wrap {
	width: 100%;
	height: 100%;
	@include rowFlexBase;
	.status-dot {
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 6px;
		background: #ccc;
		margin-right: 4px;
		&.processing {
			background: #e6a23c;
		}
		&.successed {
			background: #67c23a;
		}
		&.rejected {
			background: #f56c6c;
		}
	}
}
.option-span {
	display: inline-block;
	margin-right: 3px;
	cursor: pointer;
	&.check {
		color: #1989fa;
	}
	&.revoke {
		color: #e6a23c;
	}
	&.successed {
		color: #67c23a;
	}
	&.rejected {
		color: #f56c6c;
	}
}
</style>
