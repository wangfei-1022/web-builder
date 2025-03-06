<template>
	<div>
		<div v-if="$isNotEmpty(data.warehouseTruckChargeDetailList)">
			<el-tabs v-model="activeTabName" style="width: 100%">
				<el-tab-pane
					v-for="(item, index) in data.warehouseTruckChargeDetailList"
					:key="index"
					:label="item.labelName"
					:name="String(index + 1)"
				></el-tab-pane>
			</el-tabs>
			<el-table :data="getTableList()">
				<el-table-column :label="$t('channelPriceCard.tray')" prop="endTray" />
				<el-table-column
					:label="item"
					v-for="(item, index) in getColumns()"
					:key="index"
				>
					<template slot-scope="{ row }">
						<span>{{ getColumnVal(row, item) }}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DistributionTruckFeeArea',
	props: {
		data: {
			type: Object,
			require: true
		},
		// 是否为成本价卡
		isBasePrice: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			columns: [],
			activeTabName: '1'
		}
	},
	watch: {
	},
	methods: {
		/**
		 * 获取动态头
		 */
		getTableList() {
			if (this.$isEmpty(this.data.warehouseTruckChargeDetailList)) {
				return []
			}
			return this.data.warehouseTruckChargeDetailList[Number(this.activeTabName) - 1].chargeDetailForWarehouseTruckList
		},
		/**
		 * 获取动态列
		 */
		getColumns() {
			let dataList = this.getTableList()
			let handlerData = dataList[0]
			let columns = []
			for (let key in handlerData.warehouseChargeValueDTOMap) {
				columns.push(key)
			}
			return columns
		},
		/**
		 * 获取动态列数据
		 */
		getColumnVal(row, key) {
			if (this.isBasePrice) {
				return row.warehouseChargeValueDTOMap[key].basePrice
			} else {
				return row.warehouseChargeValueDTOMap[key].basePrice + '/' + row.warehouseChargeValueDTOMap[key].adjustmentPrice
			}
		}
	}
}
</script>

<style scoped >
</style>
