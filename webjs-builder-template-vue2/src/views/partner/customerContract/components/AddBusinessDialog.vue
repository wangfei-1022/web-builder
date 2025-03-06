<template>
  <el-dialog v-if="addNewBusinessVisible" :visible.sync="addNewBusinessVisible" :close-on-click-modal="false" width="500px" :title='$t("contract.new_business")'>
    <el-form ref="addNewBusinessForm" :model="addNewBusinessForm" label-width="120px" size="mini">
      <el-form-item :label="$t('contract.business_type')" prop="businessTypes" :rules='[{ required: true,message: $t("contract.cannot_be_null") }]'>
        <base-select type="businessType" v-model="addNewBusinessForm.businessTypes" multiple  @selected="selectedFn" style="width: 300px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="option-btn-wrap">
      <el-button size="mini" @click="addNewBusinessVisible = false">{{ $t("contract.cancel") }}</el-button>
      <el-button size="mini" type="primary" @click="addNewBusinessConfirmNew" :loading="addNewBusinessLoading">{{ $t("contract.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
	addNewBusinessReceiveApi, // 收款合同-新增业务
	addNewBusinessPaymentApi, // 付款合同-新增业务
} from '@/api/partner/customerContract'
export default {
  name: 'AddBusinessDialog',
  data() {
    return {
      addNewBusinessLoading: false,
			addNewBusinessVisible: false,
      addNewBusinessForm: {
        businessTypes: []
      },
			addNewBusinessRow: {},
      selectedBusinessLisst: []
    }
  },
  methods: {
    show(row) {
      this.addNewBusinessRow = row
			this.addNewBusinessVisible = true
    },
    selectedFn(list) {
      this.selectedBusinessLisst = list
    },
    addNewBusinessConfirmNew() {
      let valid = this.$refs.addNewBusinessForm.validate(valid => {
        if (valid) {
          let data = []
          this.selectedBusinessLisst.map(val => {
            data.push({
              businessType: val.code,
              businessTypeName: val.chineseName
            })
          })
          // let item = this.addNewBusinessForm
          // 子合同获取的Id方式不太一样
          let contractId = this.addNewBusinessRow.oldId || this.addNewBusinessRow.id
          let fn = this.addNewBusinessRow.contractType === 1 ? addNewBusinessReceiveApi : addNewBusinessPaymentApi
          // item.settlementCompanyId = item.settlementCompanyArr[0].id
          // item.settlementCompanyName = item.settlementCompanyArr[0].chineseName
          this.addNewBusinessLoading = true
          fn({businessTypes: data}, contractId).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("contract.addBusinessSuccess"))
              this.$emit("success")
              this.addNewBusinessForm.businessTypes = []
              this.addNewBusinessVisible = false
            }
            this.addNewBusinessLoading = false
          })
        }
      })

    },
		addNewBusinessConfirm() {
			let valid = this.$refs.accountPeriodAddRef.validate()
			if (valid) {
				let item = this.$refs.accountPeriodAddRef.getValue()
				// 子合同获取的Id方式不太一样
				let contractId = this.addNewBusinessRow.oldId || this.addNewBusinessRow.id
				let fn = this.addNewBusinessRow.contractType === 1 ? addNewBusinessReceiveApi : addNewBusinessPaymentApi
        this.addNewBusinessLoading = true
				fn({ businessTypes: [item] }, contractId).then(res => {
					if (res.ok) {
						this.$message.success(this.$t("contract.addBusinessSuccess"))
						this.$emit("success")
						this.addNewBusinessVisible = false
					}
          this.addNewBusinessLoading = false
				})
			}
		}
  }
}

</script>

<style>

</style>
