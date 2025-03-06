<template>
<div class="page-edit-container bg-white">
  <div class="page-edit-content">
      <div v-loading="loading" class="right-main-wrapper">
      <div class="info-title">{{ getZH("baseInfo") }}</div>
      <FlexDetailView :detailList="detailInfo" />
      <div class="info-title">{{ getZH("skuInfo") }}</div>
      <lbTable :column="columnFields" stripe border :data="skuInfo" />
    </div>
  </div>
  <div class="page-edit-footer">
    <el-button :loading="loading" size="mini" @click="backList">
      {{$t('common.close')}}
    </el-button>
  </div>
</div>
</template>
<script>
import SectionTitle from '@/components/Cargo/Common/sectionTitle'
import FlexDetailView from '@/components/Cargo/Common/FlexDetailView'
import { getDeatilInfoApi } from '@/api/OverseasWarehouse/GRNManager'
import getZHMixin from './components/getZHMixin'
export default {
	name: 'StorageReservationFormDetail',
	mixins: [getZHMixin],
	components: {
		SectionTitle,
		FlexDetailView
	},
	data() {
		return {
			loading: false,
			detailInfo: [],
			skuInfo: [],
			offetsetNumber: new Date().getTimezoneOffset() * 60 * 1000,
			totalData: 0,
			gridApi: null,
			columnApi: null,
			gridOptions: null,
			sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },
			columnFields: []
		}
	},
	computed: {

	},
	watch: {

	},
	methods: {
		async getDetailInfo() {
			const res = await getDeatilInfoApi(this.$route.query.id)
			if (res.ok) {
				if (this.$isNotEmpty(res.content.expectArriveWarehouseTime)) {
					res.content.expectArriveWarehouseTime = Number(res.content.expectArriveWarehouseTime) + this.offetsetNumber
				}
				const _info = res.content
				this.detailInfo = [
					{
						label: this.getZH('customerName'),
						value: _info.customerName
					},
					{
						label: this.getZH('storageReservationNumber'),
						value: _info.no
					},
					{
						label: this.getZH('orderState'),
						value: _info.orderStateName,
						tooltip: _info.refuseReason
					},
					{
						label: this.getZH('inWarehouseType'),
						value: _info.inWarehouseTypeName
					},
					{
						label: this.getZH('warehouse'),
						value: _info.warehouseName
					},
					{
						label: this.getZH('expectTrayCount'),
						value: _info.expectTrayCount
					},
					{
						label: this.getZH('expectArriveWarehouseTime'),
						value: this.formatDate(_info.expectArriveWarehouseTime, 'YYYY-MM-DD')
					},
					{
						label: this.getZH('remark'),
						value: _info.remarks
					}
				]

				this.skuInfo = _info.appointInboundGoodsList
			}
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.$router.push({ name: `StorageReservationForm` })
		}
	},
	mounted() { },
	created() {
		this.columnFields = [
			{
				prop: 'systemCode',
				label: this.getZH('sysCode', 'goodsManagement'),
				minWidth: 120
			},
			{
				prop: 'systemBarCode',
				label: this.getZH('sysBarCode', 'goodsManagement'),
				width: 140
			},
			{
				prop: 'skuCode',
				label: this.getZH('elecSkuCode', 'goodsManagement'),
				minWidth: 120
			},
			{
				prop: 'name',
				label: this.getZH('goodsCnName', 'goodsManagement'),
				minWidth: 100
			},
			{
				prop: 'englishName',
				label: this.getZH('goodsEnName', 'goodsManagement'),
				minWidth: 100
			},
			{
				prop: 'quantity',
				label: this.getZH('inventoryQuantity'),
				minWidth: 120
			},
			{
				prop: 'length',
				label: this.getZH('length'),
				minWidth: 80
			},
			{
				prop: 'width',
				label: this.getZH('width'),
				minWidth: 80
			},
			{
				prop: 'height',
				label: this.getZH('height'),
				minWidth: 80
			},
			{
				prop: 'weight',
				label: this.getZH('weight'),
				width: 120
			}
		]

		if (this.$route.query.id) {
			this.getDetailInfo()
		}
	}
}
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
}
.btn-wrap {
	text-align: center;
}
</style>
