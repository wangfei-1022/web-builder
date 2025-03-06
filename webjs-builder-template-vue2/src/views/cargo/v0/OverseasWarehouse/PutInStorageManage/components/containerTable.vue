<template>
	<div>
		<div class="totalBox flex-box">
			<div class="flex-box total-item" v-if="isNeedTray">
				<span>{{ $t("putInStorageManage.trayCount") }}：</span>
				{{ totalTray }}
			</div>
			<div class="flex-box total-item w-300">
				<span>{{ $t("putInStorageManage.boxCount") }}：</span>
				{{ totalBox }}
        <span class="ml-20 fs-18 link-box" @click="exportBoxInfo">{{ $t("putInStorageManage.usingTheInformationExport") }}</span>
			</div>

		</div>
		<lb-table
      border
			:column="columnData"
			:data="dataList"
			:merge="['trayNo', 'boxNo']"
			stripe
			:maxHeight="400"
		>
		</lb-table>
	</div>
</template>

<script>
import lodash from 'lodash'
export default {
	name: 'ContainerTable',
	props: {
		dataList: Array,
		inWarehouseType: {
			type: Number,
			default: 1
		},
		type: Number
	},
	data() {
		return {
			dialogVisible: false,
			totalTray: null,
			totalBox: null,
			columnData: [

				{
					prop: 'boxNo',
					label: this.$t("putInStorageManage.cartonNo"),
					align: "center"
				},
				{
					prop: 'skuCode',
					label: this.$t("putInStorageManage.skuCode")
				},
				{
					prop: 'name',
					label: this.$t("putInStorageManage.chineseName")
				},
				{
					prop: 'quantity',
					label: this.$t("putInStorageManage.singleBoxNumber")
				}
			]
		}
	},
	computed: {
		/**
		 * 是否需要托盘
		 */
		isNeedTray() {
			return this.inWarehouseType === 1 || this.inWarehouseType === 3
		}
	},
	watch: {
		// 数据变更重新合并单元格
		dataList: {
			handler(val) {
				if (this.isNeedTray || this.type === 2) {
					const groupTray = lodash.groupBy(this.dataList, item => item.trayNo)
					const groupBox = lodash.groupBy(this.dataList, item => item.boxNo)
					Object.keys(groupTray).forEach(key => {
						this.$nextTick(() => {
							this.totalTray += 1
						})
					})
					Object.keys(groupBox).forEach(key => {
						this.$nextTick(() => {
							this.totalBox += 1
						})
					})
				}
			},
			immediate: true,
			deep: true
		},
		isNeedTray: {
			handler(val) {
				if (val) {
					console.log(val)
					this.columnData.unshift({
						prop: 'trayNo',
						label: this.$t("putInStorageManage.trayNo"),
						align: "center"
					})
				}
			},
			immediate: true
		}
	},
	created() {
		this.totalTray = 0
		this.totalBox = 0
	},
	methods: {
		// 导出装箱信息
		exportBoxInfo() {
			this.$emit('exportBoxInfo')
		}
	}
}
</script>

<style scoped lang="scss">
.input-width {
	width: calc(100% - 14px);
}
.totalBox {
	height: 32px;
	margin-bottom: 10px;
	.total-item {
		width: 150px;
		color: #666;
		font-size: 14px;
	}
}
</style>
