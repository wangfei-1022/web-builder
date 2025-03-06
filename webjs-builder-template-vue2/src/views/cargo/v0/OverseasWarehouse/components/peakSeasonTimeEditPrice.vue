<template>
	<div>
		<div
			v-for="(item, index) in data.peakSeasonTimeChargeDetailDTOList"
			:key="index"
		>
			<div class="flex-box content-title mb-20">
				{{item.chargeItemName}}
			</div>
			<div
				class="flex-box"
				v-for="(itemDate, itemIndex) in item.peakSeasonTimeList"
				:key="itemIndex"
			>
				<el-form-item	:label="getZH('seasonTime') + (itemIndex + 1)">
					<div class="flex-box">
            <div v-if='itemDate.endTime'>
            <span>{{ $moment(parseInt(itemDate.startTime, 10)).utc().format("YYYY-MM-DD HH:mm:ss") }}</span>{{getZH('to')}}
            <span>{{ $moment(parseInt(itemDate.endTime, 10)).utc().format("YYYY-MM-DD HH:mm:ss") }}</span>
            </div>
            <div v-else>
              {{ $moment(parseInt(itemDate.startTime, 10)).utc().format("YYYY-MM-DD HH:mm:ss") }}
            </div>
					</div>
				</el-form-item>
				<el-form-item	:label="getZH('seasonTimePrice') + (itemIndex + 1)" class="ml-20" label-width="130px"
          :prop="
						'peakSeasonTimeChargeDetailDTOList.' +
						index +
						'.peakSeasonTimeList.' +
						itemIndex +'.costPrice'
					"
					:rules="[
						{
							required: true,
							message: inputZH('costPrice'),
							trigger: 'change',
						}]"
				>
          <InputNumber
            size="mini"
            class="w-120"
						:placeholder="inputZH('costPrice')"
            v-model="itemDate.costPrice"
          />
				</el-form-item>
				<el-form-item	:label="getZH('currency') + (itemIndex + 1)" class="ml-20" label-width="100px"
          :prop="'peakSeasonTimeChargeDetailDTOList.' +index +'.peakSeasonTimeList.' +itemIndex +'.currencyCode'"
					:rules="[	{required: true,message: selectZH('currency')}]"
				>
         <CurrencySelect  v-model="itemDate.currencyCode" :placeholder="selectZH('currency')" @selected="(val)=>itemDate.currencyName=val.name" />
				</el-form-item>
			</div>
		</div>
	</div>
</template>

<script>
import { getPeakByProductApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
import getZHMixin from '../PeakSeasonTimeManage/components/getZHMixin'
import CurrencySelect from './CurrencySelect'
export default {
	name: 'PeakSeasonTimeEdit',
	components: { CurrencySelect },
	mixins: [getZHMixin],
	props: {
		data: Object,
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {

		}
	},
	created() {
	},
	watch: {
		'data.productCode': {
			handler(val) {
				if (this.$isEmpty(val) || this.isDetail) {
					return
				} else {
					this.getPeakSeasonDetail(val)
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		/**
		 * 通过物流产品获取旺季时间
		 */
		async getPeakSeasonDetail(productCode) {
			let res = await getPeakByProductApi({ productCode, peakSeasonEndTimeStartDate: new Date().getTime() })
			if (res.ok) {
				let list = res.content || []
				list.forEach(item => {
					if (item.peakSeasonTimeList) {
						item.peakSeasonTimeList.forEach(data => {
							data.costPrice = null
						})
					}
				})
				this.$set(this.data, 'peakSeasonTimeChargeDetailDTOList', list)
			}
		}
	}
}
</script>

<style scoped lang="less">
</style>
