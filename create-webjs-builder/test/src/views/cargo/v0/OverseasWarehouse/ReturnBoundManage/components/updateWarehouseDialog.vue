<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('outInStorageManage.updateStatus')" width="550px"
      :close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="100px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible"
          v-loading="loading">
          <el-row :gutter='20'>
            <el-col :span='12'>
              <el-form-item :label="$t('common.customerName')">
                <span>{{ formData.customerName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item
                :label="$t('outInStorageManage.returnOrderNo')">
                <span>{{ formData.orderNo }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20'>
            <el-col :span='12'>
              <el-form-item :label="$t('outInStorageManage.warehouseZone')">
                <span>{{ formData.warehouseZoneName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="formData.goods" class='mb-10'>
            <el-table-column prop="skuCode" :label="$t('outInStorageManage.skuNumber')" min-width="120" />
            <el-table-column prop='quantity' :label="$t('outInStorageManage.returnQuantity')" min-width="100">
            </el-table-column>
          </el-table>
          <el-row :gutter='20'>
            <el-col :span='24'>
              <el-form-item :label="''" label-width='0px'>
                <el-radio-group v-model="formData.zone">
                  <el-radio :label="formData.warehouseZone">{{ $t('outInStorageManage.warehouseZone') }}</el-radio>
                  <el-radio :label="8" v-if="formData.warehouseZone!=8">{{ $t('outInStorageManage.beijingTime') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span='24'>
              <el-form-item :label="$t('outInStorageManage.arrivalTime')" prop='arrivalTime'
                :rules="[{ required: true, message:$t('outInStorageManage.please_select_arrivalTime'), trigger: 'blur' }]">
                <CommonPicker v-model="formData.arrivalTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss"
                  size="mini" parentOption="betweenDependence" :startDependence="todayTime - getLimitTime * 24 * 60 * 60 * 1000 + 1"
                  :endDependence="todayTime + 24 * 60 * 60 * 1000 - 1" />
              </el-form-item>
            </el-col>
          </el-row>
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
import { detailReturnOutboundApi, returnArrivalWarehouseApi } from '@/api/OverseasWarehouse/returnManage'
import constant from '../../WarehouseManagement/components/constant'
export default {
	name: 'HandlerItemDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		// 是否为出库
		isOutbound: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			formData: {},
			todayTime: null
		}
	},
	computed: {
		getLimitTime() {
			let limit = 7
			if (this.isOutbound) {
				if (Number(this.formData.type) !== 10) {
					limit = 14
				}
			}
			return limit
		}
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
					let saveForm = {
						id: this.formData.id,
						orderNo: this.formData.orderNo,
						arrivalTime: this.formData.arrivalTime,
						zone: this.formData.zone
					}
					returnArrivalWarehouseApi(saveForm).then(res => {
						if (res.ok) {
							this.loading = false
							this.dialogVisible = false
							this.$emit('saved')
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
		},
		/**
		 * 上传时
		 */
		async getDetail() {
			this.loading = true
			let res = await detailReturnOutboundApi(this.id)
			if (res.ok) {
				if (this.$isNotEmpty(res.content.warehouseZone)) {
					res.content.zone = res.content.warehouseZone
					res.content.arrivalTime = null
					let selected = constant.timeZones.find(item => item.value === res.content.warehouseZone)
					if (this.$isNotEmpty(selected)) {
						res.content.warehouseZoneName = selected.label
					}
				}
				this.formData = res.content
				this.loading = false
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
				this.getDetail()
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
</style>
