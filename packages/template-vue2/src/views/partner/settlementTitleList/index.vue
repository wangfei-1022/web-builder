<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="list" :resetFun="reset">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData"  :inline="true"  :model="formData"  label-width="100px" >
            <el-form-item :label='$t("customerManage.settlement_title")' prop="memberId">
              <type-select v-model="formData.memberId" type="settlementCompany" @selected="list" />
            </el-form-item>
            <el-form-item :label="$t('customerManage.business_type')" prop="businessType">
              <el-select v-model="formData.businessType" size="mini"  @change="list">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
      </div>
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
        :style="gridHeight"
        class="ag-theme-balham"
      />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list"/>
    </div>

    <el-dialog v-if="addVisible" :visible.sync="addVisible" :close-on-click-modal="false" width="580px" :title='$t("customerManage.checkBillEmail")'>
      <el-form ref="editFormForm" :model="editForm" :rules="editFormRule" label-width="100px" size="mini" class="edit-form">
        <div class="send-title">{{$t("customerManage.checkBillEmailInfo")}}</div>
        <el-form-item :label='$t("customerManage.settlement_title")' prop="chineseName">
          <el-input v-model="editForm.chineseName" disabled />
        </el-form-item>
        <el-form-item :label="$t('customerManage.business_type')" prop="businessType">
          <el-select v-model="editForm.businessType" size="mini" disabled>
            <el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.chineseName" :value="item.code"/>
          </el-select>
        </el-form-item>

        <el-row v-for="(item, index) in editForm.billReceiverEmail" :key="index">
          <el-col :span="14">
            <el-form-item :label='$t("customerManage.bill_email")' :prop="`billReceiverEmail[${index}].email`" :rules='[{ validator: validateEmailFn, trigger: "blur" }]'>
              <el-input v-model="item.email"  />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <i class="iconfont icon-add-circle" @click="addEmail"/>
            <i class="iconfont icon-minus-circle" @click="removeEmail(index)" v-if="editForm.billReceiverEmail.length > 1"/>
          </el-col>
          <el-col :span="6" class="default-flag" v-if="false">
            <el-checkbox v-model="item.defaultFlag">{{$t("customerManage.defaultFlag")}}</el-checkbox>
          </el-col>
        </el-row>

        <div class="send-title">{{$t("customerManage.billCondig")}}</div>
        <el-form-item :label='$t("customerManage.billGenerate")' prop="autoGenerateBillFlag">
          <el-radio-group v-model="editForm.autoGenerateBillFlag">
            <el-radio :label="true">{{$t("customerManage.SYSTERM_BILL")}}</el-radio>
            <el-radio :label="false">{{$t("customerManage.HUMAN_BILL")}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label='$t("customerManage.billSend")' prop="autoSendBillFlag">
          <el-radio-group v-model="editForm.autoSendBillFlag">
            <el-radio :label="true">{{$t("customerManage.SYSTERM_SEND_BILL")}}</el-radio>
            <el-radio :label="false">{{$t("customerManage.HUMAN_SEND_BILL")}}</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="addVisible = false">{{ $t("common.cancel")}}</el-button>
        <el-button size="mini" type="primary" @click="addPreConfirm">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerSettlementListApi, getBusinessTypeListApi, updateCustomerSettlementEmailApi } from "@/api/partner/customerManage"
import optionBtn from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { validateEmail, validateMobile } from "@/utils/validate";

export default {
	name: "CRMSettlementTitleList",
	components: {
		AgGridVue,
		optionBtn
	},
	data() {
    const validateEmailFn = (rule, value, callback) => {
			if (value) {
				if (validateEmail(value)) {
					callback();
				} else {
					return callback(this.$t("customerManage.email_error"));
				}
			} else {
				callback();
			}
		};

		return {
			formData: {
				memberId: '',
				businessType: '',
				createBy: ''
			},
      validateEmailFn: validateEmailFn,
			addVisible: false,
			editForm: {
        id: '',
        chineseName: '',
        businessType: '',
				billReceiverEmail: [],
        autoGenerateBillFlag: true,
        autoSendBillFlag: true
			},
			editFormRule: {
				businessType: [{ required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        autoGenerateBillFlag: [{ required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        autoSendBillFlag: [{ required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
			pageSize: 50,
			pageNum: 1,
			total: 0,
			userList: [],
			columnFields: [{
				field: "index",
				headerName: this.$t("customerManage.index"),
        minWidth: 80
			}, {
				field: "no",
				headerName: this.$t("customerManage.member_id"),
        minWidth: 100
			}, {
				field: "chineseName",
				headerName: this.$t("customerManage.settlement_title"),
        minWidth: 150
			}, {
				field: "billEmail",
				headerName: this.$t("customerManage.bill_email"),
        minWidth: 150
			}, {
				field: "businessTypeName",
				headerName: this.$t("customerManage.business_type"),
        minWidth: 150
			}, {
				field: "operation",
				headerName: this.$t("customerManage.operation"),
				cellRendererFramework: "optionBtn",
				minWidth: 80
			}],
			sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
			gridOptions: {
				rowSelection: "single", // 设置多行可选
				animateRows: true,
				suppressRowClickSelection: true, // 选中单元格后可以复制内容
				context: {
					componentParent: this
				}
			},
			loading: false,
			businessTypeList: []
		}
	},
	activated() {
		this.list()
	},
	created() {
		this.list()
		this.getBaseDataFn()
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getBusinessTypeListApi()]).then(results => {
				const businessTypeRes = results[0]
				if (businessTypeRes.ok) {
					this.businessTypeList = businessTypeRes.content
				}
			})
		},
		onReady(params) {
			this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
		},
		async list() {
			this.loading = true
			const params = {
				...this.formData,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			}
			const res = await getCustomerSettlementListApi(params)
			if (res.ok) {
				res.content.list.forEach(function (v, index) {
          v.index = index + 1
					v.createTime = parseTime(v.createTime, '{y}-{m}-{d} {h}:{i}:{s}')

          let billEmail = []
          v.billReceiverEmail.forEach(e => {
            if (e.defaultFlag) {
              billEmail.push(e.email)
            }
          })
          v.billEmail = billEmail.join(';')
				})
				this.total = parseInt(res.content.total, 10)
				this.userList = res.content.list
			} else {
				this.total = 0
				this.userList = []
			}
			this.loading = false
		},
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		},
		addPreConfirm() {
      let data = {
        ...this.editForm
      }
      let billReceiverEmail = []
      data.billReceiverEmail.forEach(v => {
        if (v.email) {
          billReceiverEmail.push(v)
        }
      })
      data.billReceiverEmail = billReceiverEmail

      // 校验 如果是系统自动生成 则需要填写邮箱
      if (data.autoSendBillFlag && data.billReceiverEmail.length <= 0) {
        this.$message.error(this.$t("customerManage.emailCheckInfo"))
        return
      }

			this.$refs.editFormForm.validate(valid => {
				if (valid) {
          updateCustomerSettlementEmailApi(data).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("customerManage.updateSuccess"))
              this.list()
            }
          })
					this.addVisible = false
				}
			})
		},
		editFn(row) {
      let item = this.$extends(true, {}, row)
      let billReceiverEmail = item.billReceiverEmail.length > 0 ? item.billReceiverEmail : [{}]
      // 先都设置好默认
      billReceiverEmail.forEach(v => {
        v.defaultFlag = true
      })
      this.editForm = {
        id: item.id,
        chineseName: item.chineseName,
        businessType: item.businessType,
				billReceiverEmail: billReceiverEmail,
        autoGenerateBillFlag: item.autoGenerateBillFlag,
        autoSendBillFlag: item.autoSendBillFlag
			}
      this.addVisible = true
		},
    addEmail() {
      this.editForm.billReceiverEmail.push({
        defaultFlag: true
      })
    },
    removeEmail(index) {
      this.editForm.billReceiverEmail.splice(index, 1)
    }
	},
	mounted() {}
}
</script>
<style lang="scss" scoped>
.pagination-container {
	margin-top: 0px;
}

.icon-add-circle,
.icon-minus-circle {
	color: #1890ff;
	font-size: 24px;
	margin-left: 10px;
}
.send-title{
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}
.edit-form {
  max-height: 400px;
  overflow: auto;
}
.default-flag {
  line-height: 28px;
}
</style>
