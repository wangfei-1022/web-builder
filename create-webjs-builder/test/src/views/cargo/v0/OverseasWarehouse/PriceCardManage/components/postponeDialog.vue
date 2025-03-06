<template>
	<div>
		<el-dialog :visible.sync="dialogVisible" :title="$t('channelPriceCard.postpone')"	width="500px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="70px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading">
          <el-form-item :label="$t('channelPriceCard.postponeTime')">
            <CommonPicker
              size='mini'
              :useUTC="true"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="formData.expireTime"
              valueFormat="timestamp"
              type="datetime"
              class="w-full"
              :clearable="false"
              :parentOption="'followingDate'"
              :defaultTimeStr="'23:59:59'"
              />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" @click="saveForm" >
          {{ $t("common.confirmBtn") }}
        </el-button>
        <el-button size="mini" @click="dialogVisible = false">
          {{ $t("common.cancelBtn") }}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { postponeWarehousePriceCardApi } from '@/api/OverseasWarehouse/warehousePriceCard'
import { postponeChannelPriceCardApi } from '@/api/OverseasWarehouse/PriceCardManage'
export default {
	name: 'PostponeDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		data: {
			type: Object,
			default: () => { }
		},
		// 是不是仓库价卡
		isWarehousePrice: {
			type: Boolean,
			default: true
		}

	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			formData: {
				expireTime: null
			}
		}
	},
	computed: {
		getTimeLimit() {
			return this.isWarehousePrice ? 'followingDate' : {
				disabledDate: time => time.getTime() < Number(this.data.expiryDateEnd) - 24 * 60 * 60 * 1000 || time.getTime() < new Date().getTime()
			}
		}
	},
	methods: {
		async saveForm() {
			if (this.$isEmpty(this.formData.expireTime)) {
				this.$message.error(this.$t('channelPriceCard.postponeTimeEmpty'))
				return
			}

			let saveForm = {
				expireTime: this.formData.expireTime,
				cardId: this.data.id
			}
			// 价卡延期 限制只能选今天之后的日期
			// 获取当天的 23：59：59
			let time = new Date()
			time.setHours(23)
			time.setMinutes(59)
			time.setSeconds(59)
			// 获取O时区的时间戳
			let dataTime = time.getTime() - new Date().getTimezoneOffset() * 60 * 1000
			if (dataTime > this.formData.expireTime) {
				this.$message.error(this.$t('channelPriceCard.postponeTimeError'))
				return
			}
			this.loading = true
			let fn = this.isWarehousePrice ? postponeWarehousePriceCardApi : postponeChannelPriceCardApi
			let rs = await fn(saveForm).catch(() => {
				this.loading = false
			})
			if (rs.ok) {
				this.loading = false
				this.dialogVisible = false
				this.$emit('saved')
				this.$message.success(this.$t('channelPriceCard.postponeSuccess'))
			} else {
				this.loading = false
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.expireTime = null
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
