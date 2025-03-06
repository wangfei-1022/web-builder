<template>
	<div>
		<div class="flex-box">
			<div class="flex-box top-tips" v-if="productType === 2">
				<span class="label">{{$t('channelPriceCard.compute_mode')}}：</span>
				<span class="label ml-10">
					{{ Number(data.computeMode) === 1 ? $t('channelPriceCard.computeMode.UNIT') : $t('channelPriceCard.computeMode.ALL') }}
				</span>
			</div>
		</div>

		<DistributionCostCoefficient
			:productId="productId"
			:productType="productType"
			:moduleType="productType === 1 ? '2' : '1'"
			:data="data"
			:isAdd="false"
			:type="type"
		>
			<div slot="refresh">
				<div class="flex-between">
					<el-button
						v-if="Number(type) === 0"
						type="primary"
						size="mini"
						class="ml-10"
						@click="refreshThePriceCard('formData')"
						v-loading="loading"
					>
            {{$t('channelPriceCard.refresh_price_card')}}
					</el-button>
					<div v-else></div>
          <el-form-item v-if="Number(formData.priceCardType) === 13" class="mb-0" :label="$t('channelPriceCard.coefficient_of_return')" prop="returnCoefficient" :rules="[{required: true,message: $t('channelPriceCard.please_enter_coefficient_of_return')},{ validator: $validators.checkNumerGreaterZero }, ]">
            <el-input v-model="formData.returnCoefficient" size="mini" :disabled="type != 0" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" />
          </el-form-item>
					<span class="tips h-36 flex-center ml-10">
						{{$t('channelPriceCard.price_card_show_mention')}}
					</span>
				</div>
			</div>
		</DistributionCostCoefficient>
		<DistributionFeeArea
			v-if="Number(productType) === 1"
			:data="data"
			:isBasePrice="false"
			v-loading="loading"
		/>

		<!--  -->
		<DistributionTruckFeeArea
			v-if="Number(productType) === 2"
			:data="data"
			:isBasePrice="false"
		/>
	</div>
</template>

<script>
import DistributionCostCoefficient from './DistributionCostCoefficient.vue'
import DistributionFeeArea from '../components/DistributionFeeArea'
import DistributionTruckFeeArea from '../components/DistributionTruckFeeArea'
export default {
	name: 'ProductDeliveryFee',
	components: { DistributionCostCoefficient, DistributionTruckFeeArea, DistributionFeeArea },
	props: {
		data: {
			type: Object,
			require: true
		},
		refreshThePriceCard: Function,
		productId: String,
		formData: {
			type: Object,
			default: () => { }
		},
		productType: Number,
		type: String
	},
	data() {
		return {
			loading: false
		}
	},
	created() {
	},
	mounted() {

	},
	methods: {

	}
}
</script>

<style scoped lang="less">
.tips {
	margin-right: 10px;
	color: #f78989;
	font-size: 14px;
}
.top-tips {
	padding: 15px;
	margin-left: 0px;
	.label {
		font-size: 14px;
		color: #606266;
	}
}
</style>
