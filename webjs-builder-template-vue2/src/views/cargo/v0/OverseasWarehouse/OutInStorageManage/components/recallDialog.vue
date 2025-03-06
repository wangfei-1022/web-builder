<template>
  <el-dialog :visible.sync="dialogVisible" :title="getZH('recall')" width="1200px" :close-on-click-modal="false">
    <div class="dialog-content" v-loading="loading">
			<div class="top-content">
				<span>{{ getZH('userOutBoundNo') }}：{{ data.customerOutboundNo || '-' }}</span>
				<span class="ml-20">{{ getZH('isPickup') }}：{{ data.pickup ? 'Y' : 'N' }}</span>
			</div>
      <el-table border size="mini" :data="dataList" height="400">
        <el-table-column :label="getZH('number')" width="80">
          <template slot-scope="{$index}">
            {{$index + 1}}
          </template>
        </el-table-column>
        <el-table-column  prop="orderNo" :label="getZH('orderNo')"></el-table-column>
        <el-table-column  prop="statusName" :label="getZH('status')"></el-table-column>
        <el-table-column  prop="actualPalletQuantity" :label="getZH('actualPalletQuantity')"></el-table-column>
        <el-table-column  prop="skuQuantity" :label="getZH('numberPackages')">
          <template slot-scope="{row}">
           <span>{{row.skuQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="totalWeight" :label="getZH('netWeightTotal')">
           <template slot-scope="{row}">
            {{row.totalWeight || '-'}}
          </template>
        </el-table-column>
        <el-table-column  :label="getZH('operation','common')" width="90" v-if="data.pickup">
          <template slot-scope="{row}">
            <el-button type="text" v-if="row.status===390 " @click="recall(row.id)">{{getZH('recall')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button	size="mini" type="primary" v-if="!data.pickup"	@click="callBackAgain()">	{{ getZH('recallMergeCallback') }}</el-button>
      <el-button	size="mini"	@click="dialogVisible = false">	{{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import getZHMixin from './getZHMixin'
import { getOutboundByIdApi, recallOutboundTaskApi, callTaskOutboundApi } from "@/api/OverseasWarehouse/outInStorageManage.js"
export default {
	name: 'RecallDialog',
	mixins: [getZHMixin],
	components: {},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String,
		data: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			dataList: []
		}

	},
	methods: {
		async list() {
			if (this.$isEmpty(this.id)) {
				return
			}
			this.loading = true
			let res = await getOutboundByIdApi(this.id)
			if (res.ok) {
				this.dataList = res.content || []
			}
			this.loading = false

		},
		/**
	 * 处理异常
	 */
		async recall(id) {
			this.confirmTips(this.getZH('recallConfirm', 'putInStorageManage')).then(() => {
				recallOutboundTaskApi(id).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('recallSuccess', 'putInStorageManage'))
						this.list()
					}
				})
			}).catch(() => { })
		},
		/**
	 * 处理异常
	 */
		async callBackAgain() {
			this.confirmTips(this.getZH('recallConfirm', 'putInStorageManage')).then(() => {
				let id = this.id
				callTaskOutboundApi({id, confirmOutboundDTO: {}}).then(res => {
					if (res.ok) {
						this.$message.success(this.getZH('recallSuccess', 'putInStorageManage'))
						this.dialogVisible = false
					}
				})
			}).catch(() => { })
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
				this.list()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.top-content {
	margin-bottom: 20px;
	font-size: 16px;
	font-weight: 700;
}
</style>
