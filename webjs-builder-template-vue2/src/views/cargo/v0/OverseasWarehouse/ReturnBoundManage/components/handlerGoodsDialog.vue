<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="$t('outInStorageManage.handlerGoods')"
    width="480px"
    :close-on-click-modal="false"
    :show-close="false"
  >
  <div slot="title">
   <div class="flex-between">
    <span class="title">{{$t('outInStorageManage.handlerGoods')}}</span>
    <span class="el-icon-close icon-close" @click="closeDialog"></span>
   </div>
  </div>
   <el-row :gutter="10">
    <el-col :span="12" class="mb-10">{{$t('outInStorageManage.returnOrderNo')}}：{{formData.orderNo || '-'}}</el-col>
    <el-col :span="12" class="mb-10">{{$t('outInStorageManage.associateOrderNo')}}：{{formData.outboundNo || '-'}}</el-col>
    <el-col :span="12" class="mb-10">{{$t('outInStorageManage.skuNumber')}}：{{formData.skuCode || '-'}}</el-col>
    <el-col :span="12" class="mb-10">{{$t('outInStorageManage.arrivalNum')}}：{{formData.quantity || '-'}}</el-col>
   </el-row>
   <div class="flex-center" v-if="step!=1">
    <span :class="step==2?'fc-red':'fc-blue'"><span class="el-icon-warning mr-5"></span >{{step==2?$t('outInStorageManage.destroyTips'):$t('outInStorageManage.shelfTips')}}</span>
   </div>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button type="danger"	size="mini" :loading="loading"	@click="destroy()" v-if="step==1">{{$t('outInStorageManage.destroyBtn')}}</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="shelf()" v-if="step==1">{{$t('outInStorageManage.shelfBtn')}}</el-button>
      <el-button type="danger" size="mini" :loading="loading" @click="operation(2)" v-if="step==2">{{$t('outInStorageManage.confirmDestroyBtn')}}</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="operation(1)" v-if="step==3">{{$t('outInStorageManage.confirmShelf')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { destroyReturnboundApi, groundingReturnboundApi } from '@/api/OverseasWarehouse/returnManage'
export default {
	name: 'HandlerGoodsDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		formData: Object
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			step: 1
		}

	},
	methods: {
		// 销毁
		destroy() {
			this.step = 2
		},
		// 上架
		shelf() {
			this.step = 3
		},
		// 客户操作
		async operation(type) {
			this.loading = true
			let fn = type === 1 ? groundingReturnboundApi : destroyReturnboundApi
			let res = await fn(this.formData.id)
			if (res.ok) {
				let msg = type === 1 ? this.$t('outInStorageManage.shelfSuccess') : this.$t('outInStorageManage.destroySuccess')
				this.$message.success(msg)
				this.$emit('saved')
				this.dialogVisible = false
				this.loading = false
			} else {
				this.loading = false
			}
		},
		closeDialog() {
			if (this.step === 1) {
				this.dialogVisible = false
			} else {
				this.step = 1
			}
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
				this.step = 1
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.title {
	color: #fff;
}
.icon-close {
	padding: 8px;
	font-size: 18px;
	color: #fff;
}
</style>
