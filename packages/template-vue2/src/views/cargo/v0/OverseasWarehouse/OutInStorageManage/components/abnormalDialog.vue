<template>
	<div>
		<el-dialog :visible.sync="dialogVisible" :title="$t('outInStorageManage.exceptionHandle')"	width="520px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <div class="flex-box mb-10">
          <div>{{$t('outInStorageManage.orderNo')}}：</div>
          {{orderNo}}
        </div>
        <lb-table :column="columnData" :data="dataList" v-loading="loading" stripe border />
      </div>
			<span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false" :disabled="loading">{{ $t("common.cancelBtn") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script lang="jsx">
import { getInterfaceLogListApi } from '@/api/OverseasWarehouse/InterfaceLog'
import { exceptionRetryApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'SupplementaryInfoDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String,
		orderNo: String
	},

	data() {
		return {
			loading: false,
			dialogVisible: false,
			dataList: [],
			columnData: [
				{
					prop: 'remark',
					label: this.$t('outInStorageManage.exceptionReason')
				},
				{
					label: this.$t('outInStorageManage.operation'),
					width: '100',
					render: (h, { row }) =>
						<div>
							{
								<div class='fc-blue  pointer' onClick={() => {
									this.saveForm(row.id)
								}}>{this.$t('outInStorageManage.recharge')}</div>
							}
						</div>
				}
			]
		}
	},
	methods: {
		/**
		 * 获取异常列表
		 */
		async init() {
			if (this.id) {
				this.loading = true
				let res = await getInterfaceLogListApi({ businessMark: this.id, logDealStatus: 1, pageSize: 10, pageNum: 1 })
				if (res.ok) {
					this.loading = false
					this.dataList = res.content.list || []
				} else {
					this.loading = false
				}
			}
		},
		/**
		 * 保存数据
		 */
		saveForm(id) {
			if (id) {
				this.loading = true
				exceptionRetryApi(id).then(res => {
					if (res.ok) {
						this.loading = false
						this.$message.success(this.$t('outInStorageManage.rechargeSuccess'))
						this.dialogVisible = false
						this.$emit('saved')
					} else {
						this.loading = false
					}
				})
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.dataList = []
				this.init()
			}

			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.tips {
	font-size: 12px;
	// margin-bottom: 10px;
}
</style>
