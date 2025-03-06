<template>
  <div class="page-edit-container" v-loading="loading">
    <div class="page-edit-content">
      <el-form ref="formData" :model="formData" label-width="110px" :rules="rules">
        <div class="flex-box">
          <div class="content-title">{{$t('warehousePriceCard.base_info')}}</div>
        </div>

        <div style="margin: 20px 0;overflow:hidden;">
          <el-form-item :label="$t('warehousePriceCard.customer_name')" v-if="formData.priceCardType == 13">
            <span class="span-item">{{formData.customerName}}</span>
          </el-form-item>
          <el-form-item :label="$t('warehousePriceCard.price_card_name')">
            <span class="span-item">{{formData.priceCardName}}</span>
          </el-form-item>
          <el-form-item :label="$t('channelPriceCard.price_card_code')">
            <span >{{ formData.priceCardNo }}</span>
          </el-form-item>
          <el-form-item :label="$t('warehousePriceCard.warehouse_name')">
            <span class="span-item">{{formData.warehouseName}}</span>
          </el-form-item>
          <el-form-item :label="$t('warehousePriceCard.price_card_type')">
            <span class="span-item">{{formData.priceCardTypeName}}</span>
          </el-form-item>
          <el-form-item :label="$t('warehousePriceCard.currency')">
            <span class="span-item">{{formData.currencyName}}</span>
          </el-form-item>
          <el-form-item :label="$t('warehousePriceCard.effective_time')" prop="validTimeRange">
            <span class="span-item">{{formData.expiryDateStart}} - {{formData.expiryDateEnd}}</span>
          </el-form-item>
          <el-form-item :label="$t('warehousePriceCard.unit_category_type')">
            <span class="span-item">{{formData.unitCategoryTypeName}}</span>
          </el-form-item>
          <el-form-item :label="$t('channelPriceCard.meter_bubble_coefficient')" prop="meterBubbleCoefficient">
            <span class="span-item">{{ $isNotEmpty(formData.meterBubbleCoefficient)?formData.meterBubbleCoefficient:'-' }}</span>
          </el-form-item>
        </div>


        <div class="tab-container-wrap">
          <el-tabs style="width: 100%" v-model="activeName">
            <el-tab-pane v-for="(item, index) in formData.chargeTypeList" :key="index" :label="item.chargeTypeName" :name="item.id">
               <el-form-item v-if="item.chargeType === 11" :label="$t('warehousePriceCard.minCalculateQuantity')">
                <span>{{ item.minCalculateQuantity || '-'}}</span>
                <span class="ml-10" v-if="$isNotEmpty(item.minCalculateQuantity)">{{formData.unitCategoryType === 10 ? $t('warehousePriceCard.cubicMeter') : $t('warehousePriceCard.cubicFoot') }}</span>
              </el-form-item>
              <charge-table :chargeTypeItem="item" :priceCardType="formData.priceCardType" @update="updateCharge" :isDetail="true"></charge-table>
            </el-tab-pane>
          </el-tabs>
        </div>


      </el-form>
    </div>
    <div class="page-edit-footer">
      <el-button size="mini" @click="backList()">{{$t('warehousePriceCard.back')}}</el-button>
    </div>
  </div>
</template>

<script>
import ChargeTable from './components/chargeTable'
import {
	getWarehouseCostPriceCardsDetailApi,
	getWarehouseNotCostPriceCardsDetailApi,
	getWarehouseCustomerPriceCardsDetailApi,
} from '@/api/OverseasWarehouse/warehousePriceCard'
import { parseTime } from "@/utils"

export default {
	name: 'ChannelPriceCardDetail',
	components: {
		ChargeTable
	},
	data() {
		return {
			loading: false,
			draftLoading: false,
			submitLoading: false,
			formData: {
				priceCardName: '',
				warehouseName: '',
				priceCardType: '',
				priceCardTypeName: '',
				validTimeRange: [],
				currencyName: '',
				unitCategoryType: '',
				unitCategoryTypeName: '',
				chargeTypeList: [],
				priceCardNo: null
			},
			activeName: '',
			currenciesList: [],
			productList: [],
			rules: {},
			id: '',
			priceCardType: ''
		}
	},
	created() {
		this.id = this.$route.query.id
		this.priceCardType = Number(this.$route.query.priceCardType)
		this.getDetail()
	},
	mounted() {

	},
	methods: {
		updateCharge() {

		},
		async getDetail() {
			let fn = null
			if (this.priceCardType === 10) {
				fn = getWarehouseCostPriceCardsDetailApi
			} else if (this.priceCardType === 11 || this.priceCardType === 12) {
				fn = getWarehouseNotCostPriceCardsDetailApi
			} else if (this.priceCardType === 13) {
				fn = getWarehouseCustomerPriceCardsDetailApi
			}
			if (!fn) {
				this.$message.warning(this.$t('warehousePriceCard.exception_info'))
				return
			}
			this.loading = true
			let res = await fn(this.id).catch(() => {
				this.loading = false
			})
			if (res.ok) {
				if (!res.content) {
					this.$message.warning(this.$t('warehousePriceCard.exception_data'))
					return
				}
				this.loading = false
				res.content.expiryDateStart = res.content.expiryDateStart ? this.$moment(parseInt(res.content.expiryDateStart, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : ''
				res.content.expiryDateEnd = res.content.expiryDateEnd ? this.$moment(parseInt(res.content.expiryDateEnd, 10)).utc().format("YYYY-MM-DD HH:mm:ss") : ''
				this.formData = res.content
				this.activeName = res.content.chargeTypeList[0].id
			}
		},
		backList() {
			this.$store.dispatch('tagsView/delView', this.$route)
			let name = 'WarehousePriceCardList'
			if (this.formData.priceCardType === 13) {
				name = 'WarehouseCustomerPriceCardList'
			}
			this.$router.push({ name: name })
		}
	}
}
</script>

<style scoped lang="less">
.page-edit-container {
	background: #fff;
}
.el-form-item {
	margin-bottom: 0px;
	width: 450px;
	float: left;
	color: #606266;
	font-size: 12px;
}
.tab-container-wrap {
	clear: both;
}
.el-select {
	width: 100%;
}
</style>
