<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('outInStorageManage.bulkDelivery')" width="600px"
      :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="100px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading">
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item
                :label="$t('outInStorageManage.outTime')"
                prop='operationTime'
                :rules="[{ required: true, message:$t('outInStorageManage.please_select_outTime'), trigger: 'blur' }]">
                <CommonPicker v-model="formData.operationTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss"
                  size="mini" parentOption="betweenDependence" :startDependence="todayTime - 14 * 24 * 60 * 60 * 1000 + 1"
                  :endDependence="todayTime + 24 * 60 * 60 * 1000 - 1000" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="fc-yellow bulkDeliveryTips">{{$t('outInStorageManage.bulkDeliveryTips')}}</div>
          <div class="fc-yellow bulkDeliveryTips">{{$t('outInStorageManage.bulkDeliveryTips1')}}</div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- v-permission="['sys:template:update']" -->
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm('formData')">
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">{{
            $t("common.cancelBtn")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { batchOutCloudOnboundApi } from "@/api/OverseasWarehouse/YunCangManage"
export default {
	name: 'BatchHandlerItemDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		ids: Array
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			formData: { operationTime: null },
			todayTime: null
		}
	},
	computed: {
	},
	created() {
		let time = new Date()
		time.setHours(0)
		time.setMinutes(0)
		time.setSeconds(0)
		time.setMilliseconds(0)
		this.todayTime = time.getTime()
	},
	methods: {
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.loading = true
					let saveData = {
						ids: this.ids,
						operationTime: this.formData.operationTime
					}
					batchOutCloudOnboundApi(saveData).then(res => {
						if (res.ok) {
							this.loading = false
							this.dialogVisible = false
							this.$alert(this.$t('common.delay'), this.$t('common.tips'), {
								confirmButtonText: this.$t('common.theKnow'),
								callback: () => {
									this.$emit('saved')
								}
							})
						} else {
							this.loading = false
						}
					}).catch(() => {
						this.loading = false
					})
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.operationTime = null
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="less" scoped>
.dialog-content {
	max-height: 500px !important;
}
.bulkDeliveryTips {
	line-height: 24px;
	text-indent: 28px;
}
</style>
