<template>
    <el-dialog :title="$t('receiveFms.changeTitle')" :visible.sync="visible" width="500px">
      <div class='bill-title'><i class="m-icon el-icon-warning-outline" />
        {{$t('receiveFms.checkPrincipalTypeInfo')}}
      </div>
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item :label="$t('receiveFms.checkPrincipalType')" prop="checkPrincipalType">
          <el-select v-model="formModel.checkPrincipalType" size="mini">
            <el-option v-for="(item, index) in checkPrincipalTypeList" :key="index" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitFn" size="mini" :loading="loading">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>

import { getDictDataApi, changeConfirmationSettlementCheckPrincipalApi, changeChargeSettlementCheckPrincipalApi } from "@/api/financial/fmsReceive"

export default {
	name: "ChangeConfirmSettlement",
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
      ids: [],
			checkPrincipalTypeList: [],
			visible: false,
      loading: false,
			formModel: {
				checkPrincipalType: ''
			},
			formRules: {
				"checkPrincipalType": [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
			}
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			Promise.all([getDictDataApi(30)]).then(results => {
				const checkPrincipalTypeRes = results[0]
				if (checkPrincipalTypeRes.ok) {
					this.checkPrincipalTypeList = checkPrincipalTypeRes.content
				}
			})
		},
		show(ids) {
			this.visible = true
      this.ids = ids
      this.formModel.checkPrincipalType = ''
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {

          let data = {
            ...this.formModel
          }
           let fn = null
          if (this.type === 'CHARGE') {
            fn = changeChargeSettlementCheckPrincipalApi
            data.settlementChargeIds = this.ids
          } else {
             fn = changeConfirmationSettlementCheckPrincipalApi
             data.confirmationIds = this.ids
          }
          this.loading = true
          fn(data).then(res => {
            if (res.ok) {
              this.$emit('success')
              this.$message.success(this.$t('receiveFms.checkPrincipalTypeSuccess'))
              this.visible = false
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.bill-title{
  margin-bottom: 20px;
  line-height: 20px;
  font-size: 16px;
  padding-left: 50px
}


.m-icon{
  color: #1890ff;
  font-size: 20px;
  float: left;
  margin-right: 8px;
}
</style>
