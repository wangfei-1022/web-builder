<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('outInStorageManage.updateStatus')" width="1200px"
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
                :label="isOutbound ? $t('outInStorageManage.outBoundNo') : $t('outInStorageManage.inBoundNo')">
                <span>{{ formData.orderNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' v-if='!isOutbound '>
              <el-form-item :label="$t('putInStorageManage.containerNo')">
                <span>{{ formData.containerNo || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12' v-if='!isOutbound '>
              <el-form-item :label="$t('putInStorageManage.warehouseName')">
                <span>{{ formData.warehouseName || '-' }}</span>
              </el-form-item>
            </el-col>
            <!-- && formData.businessLine !== "PV" -->
            <el-col :span='12' v-if='!isOutbound && formData.businessLine === "PV"'>
              <el-form-item :label="$t('putInStorageManage.mrnNo')">
                <span v-if='formData.mrnNo'>{{ formData.mrnNo || '-' }}</span>
                <el-input v-else v-model="mrnNo" size="mini" :placeholder="$t('putInStorageManage.mrnNo')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12' v-if='!isOutbound && formData.businessLine === "PV"'>
              <el-form-item :label="$t('putInStorageManage.mrnCreateTime')">
                <span v-if='formData.mrnCreateTime'>{{ formData.mrnCreateTime | formatDate('YYYY-MM-DD') }}</span>
                <span v-else>
                  <CommonPicker v-model="mrnCreateTime" pikcer-type="date" pickerFormat="yyyy-MM-dd" size="mini" />
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter='20' v-if='isOutbound'>
            <el-col :span='12'>
              <el-form-item :label="$t('outInStorageManage.orderType')">
                <span>{{ formData.typeName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('outInStorageManage.isPickup')">
                <span>{{ formData.pickup ? $t('common.trueText') : $t('common.falseText') }}</span>
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
          <el-table :data="formData.goods" class='mb-10' size="mini">
            <el-table-column prop="skuCode" :label="$t('outInStorageManage.skuNumber')" min-width="120">
               <template slot-scope="{row}">
                <span>{{row.skuCode}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('outInStorageManage.theDelivery')" prop='outQuantity' min-width="100" v-if='isOutbound'>
              <template slot-scope="{row}">
                <span>{{row.outQuantity}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='quantity' :label="$t('putInStorageManage.expectedNumberShelves')" width="100" v-if='!isOutbound'>
              <template slot-scope="{row}">
                <span>{{row.quantity}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='groundingNo' :label="$t('putInStorageManage.trayNo')" min-width="100" v-if='!isOutbound && formData.businessLine === "PV"' >
              <template slot-scope="{row}">
                <span>{{row.groundingNo}}</span>
              </template>
            </el-table-column>
            <el-table-column prop='groupingSkuQuantity' :label="$t('putInStorageManage.groupingSkuQuantity')" width="100" v-if='!isOutbound'>
              <template slot-scope="{row}">
                <span>{{row.groupingSkuQuantity}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('putInStorageManage.actualNumberShelves')" min-width="100" v-if='!isOutbound'>
              <template slot-scope="{row,$index}">
                <el-form-item label="" label-width='0px' class="mb-0" :prop="'goods.' + $index + '.groundingQuantity'"
                  :rules="[{ required: true, message: $t('putInStorageManage.please_input_actualNumberShelves'), trigger: 'blur' }]">
                  <el-input size="mini" v-model="row.groundingQuantity"
                    :placeholder="$t('putInStorageManage.please_input_actualNumberShelves')"
                    oninput="value=value.replace(/[^\d]/g,'')" :min="0" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('putInStorageManage.location')" min-width="100" v-if='!isOutbound && formData.businessLine === "PV"'>
              <template slot-scope="{row,$index}">
                <el-form-item label="" label-width='0px' class="mb-0" :prop="'goods.' + $index + '.stockLocationCode'">
                  <el-input size="mini" v-model="row.stockLocationCode" :placeholder="$t('putInStorageManage.please_input_location')" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('putInStorageManage.damageQuantity')" min-width="100" v-if='!isOutbound && formData.businessLine === "PV"'>
              <template slot-scope="{row,$index}">
                <el-form-item label="" label-width='0px' class="mb-0" :prop="'goods.' + $index + '.damageQuantity'">
                  <el-input size="mini" v-model="row.damageQuantity" :placeholder="$t('putInStorageManage.please_input_damageQuantity')" oninput="value=value.replace(/[^\d]/g,'')" :min="0" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop='batchNo' :label="$t('putInStorageManage.batchNo')" min-width="100" v-if='isOutbound && formData.batchFlag'>
              <template slot-scope="{row}">
                <span>{{row.batchNo}}</span>
              </template>
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
              <el-form-item
                :label="isOutbound ? $t('outInStorageManage.outTime') : $t('putInStorageManage.operationTime')"
                prop='operationTime'
                :rules="[{ required: true, message: isOutbound ? $t('outInStorageManage.please_select_outTime') : $t('putInStorageManage.please_select_operationTime'), trigger: 'blur' }]">
                <!-- <CommonPicker v-model="formData.operationTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss"
                  size="mini" parentOption="betweenDependence" :startDependence="todayTime - getLimitTime * 24 * 60 * 60 * 1000 + 1"
                  :endDependence="todayTime + 24 * 60 * 60 * 1000 - 1" /> -->
                  <CommonPicker v-model="formData.operationTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" parentOption='previousDate' />
              </el-form-item>
            </el-col>
            <el-col :span='24' v-if='isOutbound'>
              <el-form-item :label="$t('outInStorageManage.shipmentNo')" prop='shipmentNo'
                :rules="[{ required: formData.pickup && formData.transportMode === 1 , message: $t('outInStorageManage.please_input_shipmentNumber'), trigger: 'blur' }]">
                <el-input size='mini' v-model='formData.shipmentNo'
                  :placeholder="$t('outInStorageManage.please_input_shipmentNumber')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='24' v-if='isOutbound && formData.palletFlag'>
              <el-form-item :label="$t('outInStorageManage.actualPalletQuantityOut')">
                <el-input size='mini' v-model='formData.actualPalletQuantity' :placeholder="$t('outInStorageManage.please_input_actualPalletQuantity')" maxlength="10" oninput="value=value.replace(/[^\d]/g,'')" />
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
import { updateCloudOnboundApi, partCloudInboundApi, getSkuInfoCloudInboundApi, getSkuInfoCloudOutboundApi } from "@/api/OverseasWarehouse/YunCangManage"
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
			todayTime: null,
			mrnCreateTime: null,
			mrnNo: null
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
					if (!this.isOutbound && this.formData.businessLine === "PV") {
						this.formData.mrnCreateTime = this.mrnCreateTime || this.formData.mrnCreateTime
						this.formData.mrnNo = this.mrnNo || this.formData.mrnNo
					}
					if (!this.isOutbound) {
						let errorGoods = this.formData.goods.filter(item => Number(item.groupingSkuQuantity) >= Number(item.quantity))
						if (this.$isNotEmpty(errorGoods)) {
							this.$confirm(this.$t('outInStorageManage.groundingQuantityTips'), this.$t("common.tips"), {
								confirmButtonText: this.$t("common.confirm"),
								cancelButtonText: this.$t("common.cancel"),
								type: "warning"
							}).then(() => {
								this.submitData()
							}).catch(() => { });
						} else {
							this.submitData()
						}
					} else {
						this.submitData()
					}
				} else {
					this.mixinsFormScrollIntoView()
					return false
				}
			})
		},
		//提交数据
		submitData() {
			let fn = this.isOutbound ? updateCloudOnboundApi : partCloudInboundApi
			this.loading = true
			fn(this.formData).then(res => {
				if (res.ok) {
					this.loading = false
					this.$alert(this.$t('common.delay'), this.$t('common.tips'), {
						confirmButtonText: this.$t('common.theKnow'),
						callback: () => {
							this.dialogVisible = false
							this.$emit('saved')
						}
					})
				} else {
					this.loading = false
				}
			}).catch(() => {
				this.loading = false
			})
		},
		/**
		 * 上传时
		 */
		async getDetail() {
			this.loading = true
			let fn = this.isOutbound ? getSkuInfoCloudOutboundApi : getSkuInfoCloudInboundApi
			let res = await fn(this.id)
			if (res.ok) {
				res.content.goods.forEach(item => {
					if (this.isOutbound) {
						item.outQuantity = item.quantity
					} else {
						item.groupingSkuQuantity = item.groundingQuantity || 0
						item.groundingQuantity = item.quantity
					}
				})
				if (this.$isNotEmpty(res.content.warehouseZone)) {
					res.content.zone = res.content.warehouseZone
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
				this.mrnNo = null
				this.mrnCreateTime = null
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
