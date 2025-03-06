<template>
  <el-dialog v-if="visible" :title="$t('receiveFms.profit_and_loss_audit')" :visible.sync="visible" width="500px" :close-on-click-modal="false"	>
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" label-position="right" size="mini">
      <el-form-item :label='$t("receiveFms.accounting_period")' prop="period">
        <el-select v-model="form.period" size="mini" >
          <el-option v-for="(item, index) in periodList" :key="index" :label="item.periodName" :value="item.periodCode"/>
        </el-select>
      </el-form-item>
      <el-form-item :label='$t("receiveFms.export_file")' prop="clearedDate">
        <upload-file @success="uploadSuccessFn"></upload-file>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="submitFn" size="mini" :loading="loading">{{$t("common.confirm")}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { markProfitApi, getProfitPeriodListApi } from '@/api/financial/fmsReceive'

export default {
	name: "ReceiveInvoice",
	props: {
		info: {
			type: Object,
			default: function () {
				return {
					ids: [],
					totalAmount: {}
				}
			}
		},
		type: {
			type: String,
			default: ''
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	data() {
		return {
			loading: false,
			visible: false,
			periodList: [],
			form: {
				period: ''
			},
			formRules: {
				period: [{ required: true, message: this.$t('receiveFms.cannot_be_null') }]
			},
			chargeFile: {}
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			Promise.all([getProfitPeriodListApi()]).then(results => {
				const periodRes = results[0]
				if (periodRes.ok) {
					this.periodList = periodRes.content
				}
			})
		},
		show() {
			this.visible = true
			this.form.period = ''
		},
		uploadSuccessFn(file) {
			this.chargeFile = file
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					if (this.chargeFile && !this.chargeFile.url) {
            // 请先上传文件
						this.$message.error(this.$t('receiveFms.pleaseSelectFile'))
						return
					}
					let data = {
						period: this.form.period,
						chargeFile: this.chargeFile
					}
					this.loading = true
					markProfitApi(data).then(res => {
						if (res.ok) {
							this.visible = false
              // 盈亏审核提交成功，导入结果可到任务列表查看！
							this.$confirm(this.$t('receiveFms.markProfitInfo'), this.$t('receiveFms.profit_and_loss_audit'), {
								confirmButtonText: this.$t("common.confirm"),
								cancelButtonText: this.$t("common.cancel")
							}).then(() => {
								this.$emit('success')
								this.$router.push({ name: `TaskList` })
							}).catch(() => {
								// 取消
							});
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
.create-bill {
	text-align: center;
	i {
		font-size: 60px;
		color: rgb(82, 196, 26);
	}
	.render {
		font-family: "PingFangSC-Semibold", "PingFang SC Semibold", "PingFang SC";
		font-weight: 650;
		font-style: normal;
		font-size: 24px;
		color: rgba(0, 0, 0, 0.847058823529412);
		line-height: 32px;
		margin: 10px 0;
	}
	.bill-no-info {
		font-family: "PingFangSC-Regular", "PingFang SC";
		font-weight: 400;
		font-style: normal;
		text-align: center;
		line-height: 22px;
	}
	.link {
		color: #108ee9;
		text-decoration: underline;
	}
}
</style>

