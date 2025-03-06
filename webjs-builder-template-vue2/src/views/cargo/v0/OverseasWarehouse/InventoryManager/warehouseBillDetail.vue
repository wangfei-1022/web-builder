<template>
  <div class="page-edit-container full-page bg-white">
    <el-form label-width="60px" label-position="left" :model="filter" ref="formData">
      <div class="page-edit-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="getZH('customerName', 'common')">{{ formData.customerName || '-' }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="getZH('warehouseName')">{{ formData.warehouseName || '-' }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="getZH('billingDate')">{{ formData.beginTime | formatDate('YYYY-MM-DD') }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="getZH('priceCardName')">{{ formData.priceCardName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="getZH('billingUnit')">{{ formData.unit1Name }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="getZH('cnt')">{{ formData.chargeQuantity1 }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="getZH('currency')">{{ formData.currency | formatCurrencyName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="getZH('estimatedAmount')">{{ formData.amount | _toThousandsAndFixDecimalFilter }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="getZH('charge_calculate_state')">{{ formData.chargeCalculateStateName }}
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex-box">
          <el-form-item :label="getZH('SKUCategory')" prop="skuCode" label-width="100px">
            <el-input class="w-180" size="mini" v-model="filter.skuCode" @keyup.enter.native="list" clearable
              :placeholder="inputZH('SKUCategory')"></el-input>
          </el-form-item>
          <el-form-item class="ml-20" :label="getZH('groundingNo')" prop="groundingNo" label-width="50px">
            <el-input class="w-180" size="mini" v-model="filter.groundingNo" clearable @keyup.enter.native="list"
              :placeholder="inputZH('groundingNo')"></el-input>
          </el-form-item>
          <el-form-item :label="getZH('stockNo')" prop="orderNo" class="ml-20">
            <el-input class="w-150" size="mini" v-model="filter.orderNo" @keyup.enter.native="list" clearable
              @clear="list" :placeholder="inputZH('stockNo')"></el-input>
          </el-form-item>
          <el-form-item :label="getZH('containerNo')" prop="containerNo" class="ml-20">
            <el-input size="mini" class="w-150" v-model="filter.containerNo" @keyup.enter.native="list" clearable
              @clear="list" :placeholder="inputZH('containerNo')"></el-input>
          </el-form-item>
        </div>
        <div class="reset-content flex-right">
          <div>
            <el-button type="primary" icon="el-icon-search" @click="list" size="mini">
              {{ $t("common.searchBtn") }}
            </el-button>
            <el-button @click="reset" icon="el-icon-refresh-left" size="mini">
              {{ $t("common.resetBtn") }}
            </el-button>
          </div>
        </div>
        <div>
          <div class="export-box">
            <el-button type="primary" size="mini" @click="exportDetail()">{{getZH('exportBtn')}}</el-button>
          </div>
          <lb-table :height='tableHeight' v-loading="loading" :column="columnData" :data="dataList" stripe />
          <Pagination :total="total" :limit.sync="filter.pageSize" :page.sync="filter.pageNum" @pagination="list" />
        </div>
      </div>
      <div class="page-edit-footer">
        <div>
          <el-button :loading="loading" size="mini" @click="backList">
            {{ $t('common.cancel') }}
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang="jsx">
import getZHMixin from './components/getZHMixin'
import { toThousandsAndFixDecimalFilter } from '@/utils'
import { getStockDetailApi, exportChargeDetailApi } from '@/api/inventory'
export default {
	name: 'WarehouseBillDetail',
	components: {},
	mixins: [getZHMixin],
	data() {
		let defaultForm = {
			id: null,
			customerName: '',
			warehouseName: '',
			beginTime: '',
			unit: '',
			currency: '',
			currencyName: '',
			amount: '',
			quantity: '',
			unit1Name: '',
			chargeQuantity1: '',
			chargeCalculateState: null,
			chargeCalculateStateName: null,
			priceCardName: null
		}
		let defaultFilter = {
			id: null,
			skuCode: null,
			groundingNo: '',
			orderNo: '',
			containerNo: null,
			orderStockId: null,
			pageNum: 1,
			pageSize: 50
		}
		return {
			tableHeight: document.documentElement.clientHeight - 540,
			defaultForm,
			defaultFilter,
			total: 0,
			formData: this.$extends({}, defaultForm),
			filter: this.$extends({}, defaultFilter),
			columnData: [
				{
					label: this.getZH('SKUCategory'),
					prop: 'skuCode',
					width: 160
				},
				{
					label: this.getZH('length'),
					prop: 'length',
					minWidth: 100,
					align: 'right'
				},
				{
					label: this.getZH('width'),
					prop: 'width',
					minWidth: 100,
					align: 'right'
				},
				{
					label: this.getZH('height'),
					prop: 'height',
					minWidth: 100,
					align: 'right'
				},
				{
					label: this.getZH('stockDate'),
					prop: 'groundingTime',
					minWidth: 100,
					render: (h, { row, $index }) =>
						<div >{this.formatDate(row.groundingTime, "YYYY-MM-DD")}</div>
				},
				{
					label: this.getZH('groundingNo'),
					prop: 'groundingNo',
					minWidth: 100
				},
				// {
				// 	label: this.getZH('stockAmount'),
				// 	prop: 'stockAmount',
				// 	minWidth: 100
				// },
				{
					label: this.getZH('stockAmount'),
					prop: 'quantityGrounding',
					minWidth: 100,
					align: 'right'
				},
				{
					label: this.getZH('stockUpdateTime'),
					prop: 'stockUpdateTime',
					width: 150,
					render: (h, { row, $index }) =>
						<div >{this.formatDate(row.stockUpdateTime, "YYYY-MM-DD HH:mm:ss")}</div>
				},
				{
					label: this.getZH('libraryAge'),
					prop: 'storageAge',
					minWidth: 80,
					align: 'right'
				},
				{
					label: this.getZH('playJoe'),
					prop: '',
					minWidth: 80
				},
				{
					label: this.getZH('quantityHold'),
					prop: '',
					minWidth: 80
				},
				{
					label: this.getZH('chargeOfTora'),
					prop: '',
					minWidth: 140
				},
				{
					label: this.getZH('justInTimeInventory'),
					prop: 'stock',
					minWidth: 120,
					align: 'right'
				},
				// + row.cubeUnitName
				{
					label: this.getZH('cubeQuantity'),
					prop: 'cubeQuantity',
					minWidth: 140,
					align: 'right',
					render: (h, { row, $index }) =>
						<div >
							{
								row.cubeQuantity
							}
						</div>
				},
				{
					label: this.getZH('price'),
					prop: 'price',
					align: 'right',
					minWidth: 120
				},
				{
					label: this.getZH('estimatedAmount'),
					prop: 'amount',
					minWidth: 100,
					align: 'right',
					render: (h, { row, $index }) =>
						<div >
							{
								toThousandsAndFixDecimalFilter(row.amount)
							}
						</div>
				},
				// {
				// 	label: this.getZH('enterAmount'),
				// 	prop: 'amount',
				// 	minWidth: 100,
				//   render: (h, { row, $index }) =>
				//   <div >
				//     {
				//       toThousandsAndFixDecimalFilter(row.amount)
				//     }
				//   </div>
				// },
				{
					label: this.getZH('stockNo'),
					prop: 'orderNo',
					minWidth: 140
				},
				{
					label: this.getZH('containerNo'),
					prop: 'containerNo',
					minWidth: 120
				},

				{
					label: '',
					render: (h, { row }) =>
						<div>
							{
								<div class='fc-blue  pointer'
									onClick={() => {
										this.lookDetail()
									}}>{Number(row.groundingQuantity) > 0 ? this.getZH('lookDetail') : ''}</div>
							}
						</div>
				}
			],
			dataList: [],
			loading: false
		}
	},
	created() {
		if (this.$isNotEmpty(this.$route.query.data)) {
			let data = JSON.parse(this.$route.query.data)
			this.$copyProps(this.formData, data)
			this.list()
		}
	},
	computed: {


	},
	methods: {

		async list() {
			this.loading = true
			this.filter.orderStockId = this.formData.id
			let res = await getStockDetailApi(this.filter).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				this.dataList = res.content.list || []
				this.total = res.content.total
				this.loading = false
			} else {
				this.loading = false
			}
		},
		exportDetail() {
			let data = this.$extends({}, this.filter)
			data.orderStockId = this.formData.id
			delete data.pageNum
			delete data.pageSize
			this.loading = true
			exportChargeDetailApi(data).then(res => {
				if (res.ok) {
					this.$alert(`<div><span class="fc-red fs-16">${this.getZH('handlerTime', 'common')}</span><span class="fs-16">,${this.getZH('handlerRes', 'common')}</span></div>`, this.getZH('handlerExportTips', 'common'), {
						dangerouslyUseHTMLString: true,
						confirmButtonText: this.getZH('theKnow', 'common'),
						callback: () => { }
					})
					this.loading = false
				} else {
					this.loading = false
				}

			})

		},
		/**
		 * 重置查询条件
		 */
		reset() {
			this.$refs.formData.resetFields()
			this.list()
		},
		/**
		* 返回列表
		*/
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			this.loading = false
			this.$router.push({ name: `WarehouseBill`, query: { time: new Date().getTime() } })
		}
	}
}
</script>

<style scoped lang="scss">
.reset-content {
	width: 1024px;
	padding-bottom: 10px;
	// box-shadow: 0 2px rgba(0, 0, 0, 0.05);
	// border-bottom: 1px solid #ccc;
}
.export-box {
	padding: 10px 0px;
	border-bottom: 1px solid #ccc;
	border-top: 1px solid #ccc;
}
</style>
