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
          <el-form ref="formData" :model="formData" label-width="100px" size="mini">
            <el-form-item prop="signFlag" style="width: 100%" v-if="formData.businessType === 'INTERNATIONAL_LINE'">
              <el-checkbox v-model="formData.signFlag" disabled>{{ $t("customerManage.openAuditInfo") }}</el-checkbox>
						</el-form-item>
						<el-form-item :label='$t("customerManage.business_type")' prop="businessTypeName">
							<el-input v-model="formData.businessTypeName" type="text" disabled />
						</el-form-item>
						<el-form-item :label="$t('customerManage.sales_names')" prop="sellerId">
              <el-select filterable clearable v-model="formData.sellerId" size="mini" >
                <el-option v-for="(item, index) in salesList" :key="index" :label="item.chineseName" :value="item.id"/>
              </el-select>
						</el-form-item>
						<el-form-item :label="$t('customerManage.remark')" prop="auditRemark">
              <el-input v-model="formData.auditRemark" type="textarea"></el-input>
						</el-form-item>
					</el-form>
        </div>
      </div>
		</div>
		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList">{{$t('common.close')}}</el-button>
      <el-button type="primary" size="mini" @click="auditFn" :loading="auditLoading">{{$t('customerManage.auditedCustomer')}}</el-button>
      <el-button type="primary" size="mini" @click="rejectFn">{{$t('customerManage.rejectCustomer')}}</el-button>
		</div>

    <el-dialog :title="$t('customerManage.reject')" :visible.sync="rejectVisible" width="500px">
      <el-form ref="rejectForm" :model="rejectForm" :rules="rejectFormRule" label-position="left" label-width="80px" size="mini">
        <el-form-item :label="$t('customerManage.rejectReason')" prop="reason" style="width:100%">
          <el-input v-model="rejectForm.reason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rejectVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="rejectConfirmFn" size="mini" :loading="rejectLoading">{{$t('common.confirm')}}</el-button>
      </div>
    </el-dialog>
	</div>

</template>
<script>
import { getCustomerAuditDetailApi, auditCustomerApi } from "@/api/partner/customerAudit";
import Detail from './components/Detail'
import { getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage";

export default {
	name: "CRMCustomerAuditAudit",
	components: {
    Detail
	},
	data() {
		return {
			id: "",
      salesList: [],
      formData: {
        businessTypeName: '',
        auditRemark: '',
        sellerId: ''
      },
      rejectForm: {
        reason: ''
      },
      rejectFormRule: {
        reason: [{ required: true, message: this.$t('common.cannot_be_null'), trigger: 'blur' }]
      },
      auditLoading: false,
      rejectLoading: false,
      rejectVisible: false,

      enterprise: {}
		};
	},
	created() {
		this.id = this.$route.query.id;
		this.origin = this.$route.query.origin;
    this.getBaseDataFn()
    this.getDetail()
	},
	methods: {
    getBaseDataFn() {
			Promise.all([getSalesListApi()]).then(results => {
				const salesRes = results[0];
				if (salesRes.ok) {
					this.salesList = salesRes.content;
				}
			});
		},
		backList() {
      if (this.origin) {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({ name: this.origin });
      }
		},
		getDetail() {
      if (this.id) {
        getCustomerAuditDetailApi(this.id).then(res => {
          if (res.ok) {
            this.formData.businessType = res.content.business.businessType
            this.formData.businessTypeName = res.content.business.businessTypeName
            this.formData.signFlag = !!Number(res.content.business.signFlag)

            let enterprise = res.content.memberInfo.enterpriseDTO || {};
            delete res.content.memberInfo.registeredDate
            let data = {
              ...enterprise,
              ...res.content.memberInfo,
              ...res.content.business
            }
            enterprise.adminUser = enterprise.adminUser || {};
            enterprise.createAdminUserFlag = !!enterprise.adminUser.mobile || !!enterprise.adminUser.email;
            this.customer = res.content.customer || {};
            this.enterprise = data;
          }
        })
      }
		},
    auditFn() {
      let data = {
        ...this.formData,
        signFlag: this.formData.signFlag ? 1 : 0,
        id: this.id,
        status: 2
      }
      if (this.formData.sellerId) {
        this.salesList.forEach(v => {
          if (v.id === this.formData.sellerId) {
            data.sellerName = v.chineseName
          }
        })
      }

      this.auditLoading = true
      auditCustomerApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('customerManage.auditSuccess'))
          this.backList()
        }
        this.auditLoading = false
      })
    },
    rejectFn() {
      this.rejectVisible = true
    },
    rejectConfirmFn() {
      this.$refs.rejectForm.validate(valid => {
        if (valid) {
          let data = {
            id: this.id,
            status: 3,
            ...this.rejectForm
          }
          this.rejectLoading = true
          auditCustomerApi(data).then(res => {
            if (res.ok) {
              this.rejectVisible = false
              this.$message.success(this.$t('customerManage.rejectSuccess'))
              this.backList()
            }
            this.rejectLoading = false
          })
        }
      })
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

::v-deep .el-form-item--mini.el-form-item {
    margin-bottom: 18px;
    width: 50%;
    float: left;
    margin-right: 0;
}
</style>
