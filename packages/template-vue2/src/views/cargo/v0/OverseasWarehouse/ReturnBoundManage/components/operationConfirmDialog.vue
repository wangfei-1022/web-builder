<template>
	<div>
		<el-dialog :visible.sync="dialogVisible" :title="Number(type) === 1 ? $t('outInStorageManage.shelvesConfirm') : $t('outInStorageManage.destroyConfirm')"	width="520px" :close-on-click-modal="false">
			<el-form :model="formData" ref="formData" label-width="100px">
        <el-form-item :label="$t('outInStorageManage.returnOrderNo')">
          {{data.orderNo || "-"}}
        </el-form-item>
        <el-form-item :label="$t('outInStorageManage.skuNumber')">
           {{data.skuCode || "-"}}
        </el-form-item>
        <el-form-item :label="Number(type) === 1 ?$t('outInStorageManage.shelvesNum') : $t('outInStorageManage.destroyNum')">
          1
        </el-form-item>
        <el-form-item :label="Number(type) === 1?$t('outInStorageManage.shelvesTime') : $t('outInStorageManage.destroyTime')"  prop="operationTime" :rules="[{ required:true, message:Number(type) === 1 ? $t('outInStorageManage.please_select_shelves_time'): $t('outInStorageManage.please_select_destroy_time')}]">
         <div class="flex-box">
          <el-select class="w-100"	v-model="formData.zone"  size="mini">
            <el-option v-for="(item,key) in zoneObj" :key="item" :label="item" :value="Number(key)" />
          </el-select>
           <CommonPicker class="ml-10" v-model="formData.operationTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" parentOption="betweenDependence" :startDependence="todayTime - getLimitTime * 24 * 60 * 60 * 1000 + 1"
            :endDependence="todayTime + 24 * 60 * 60 * 1000 - 1" />
         </div>
        </el-form-item>
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button	size="mini" type="primary" :loading="loading"	@click="saveForm('formData')">	{{ $t("common.saveBtn") }}</el-button>
				<el-button	size="mini"	@click="dialogVisible = false" :loading="loading" >	{{ $t("common.cancel") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { groundingReturnboundApi, destroyReturnboundApi } from '@/api/OverseasWarehouse/returnManage'
export default {
	name: 'OperationConfirmDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		data: Object,
		// 1上架 2销毁
		type: Number
	},
	data() {
		let defaultForm = {
			id: null,
			orderNo: null,
			skuCode: null,
			skuId: null,
			zone: -new Date().getTimezoneOffset() / 60
		}
		return {
			defaultForm,
			formData: this.$extends({}, defaultForm),
			dialogVisible: false,
			dateTime: [],
			loading: false,
			queryZone: -new Date().getTimezoneOffset() / 60,
			zoneObj: {
				'0': '中时区',
				'1': '东一区',
				'2': '东二区',
				'3': '东三区',
				'4': '东四区',
				'5': '东五区',
				'6': '东六区',
				'7': '东七区',
				'8': '东八区',
				'9': '东九区',
				'10': '东十区',
				'11': '东十一区',
				'12': '东十二区',
				'-11': '西十一区',
				'-10': '西十区',
				'-9': '西九区',
				'-8': '西八区',
				'-7': '西七区',
				'-6': '西六区',
				'-5': '西五区',
				'-4': '西四区',
				'-3': '西三区',
				'-2': '西二区',
				'-1': '西一区'
			}
		}

	},
	methods: {
		typeSelect(data) {
			this.formData.carrierName = data.chineseName
		},
		/**
		* 保存数据
		*/
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					let fn = this.type === 1 ? groundingReturnboundApi : destroyReturnboundApi
					this.loading = true
					this.formData = {
						...this.formData,
						id: this.data.id,
						skuCode: this.data.skuCode,
						skuId: this.data.skuId
					}
					fn(this.formData).then(res => {
						if (res.ok) {
							this.loading = false
							this.$message.success(this.$t('common.confirmSuccess'))
							this.$emit('saved')
							this.dialogVisible = false
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
			if (!val) {
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			if (val) {
				this.formData = this.$extends({}, this.defaultForm)
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.item-box {
	width: 150px;
	height: 100px;
	background-color: #108ee9;
	color: #fff;
	border-radius: 4px;
	cursor: pointer;
	.item-icon {
		text-align: center;
		font-size: 26px;
		margin-bottom: 4px;
		width: 100%;
	}
}
</style>
