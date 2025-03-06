<template>
  <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini" class="member-form">
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
  </el-form>
</template>
<script>

export default {
	name: 'FeeItemAdd',
	components: {
	},
	props: {
		item: {
			type: Object,
			default: function () {
				return {}
			}
		}
	},
	watch: {
		item: {
			handler(val) {
				this.form.feeShortName = val.feeShortName
				this.form.chineseName = val.chineseName
				this.form.englishName = val.englishName
				this.form.remark = val.remark
			},
			immediate: true
		}
	},
	data() {
		return {
			form: {
				feeShortName: '',
				chineseName: '',
				englishName: '',
				remark: ''
			},
			formRule: {
				feeShortName: [{ required: true, message: this.$t("customerManage.cannot_be_null") }],
				chineseName: [{ required: true, message: this.$t("customerManage.cannot_be_null") }],
				englishName: [{ required: true, message: this.$t("customerManage.cannot_be_null") }]
			}
		}
	},
	created() {
	},
	methods: {
		validate() {
			let valid = true
			this.$refs.baseForm.validate(v => {
				valid = v
			})
			if (!valid) {
				setTimeout(() => {
					this.$message.error(this.item.businessTypeName + '的信息未填写完整！')
				}, 0)
				return false
			}
			return valid
		},
		getValue() {
			return {
				...this.item,
				...this.form
			}
		}
	}
}
</script>
<style scoped lang="scss">
.full-item {
	width: 100% !important;
}
</style>
