<template>
	<div class="card-content">
		<div v-if="Number(data.priceCardType) === 12">
			<p>{{$t('channelPriceCard.lower_price_info_mention_one')}}</p>
			<p>{{$t('channelPriceCard.lower_price_info_mention_two')}}</p>
			<p>{{$t('channelPriceCard.lower_price_info_mention_three')}}</p>
			<p>{{$t('channelPriceCard.lower_price_info_mention_four')}}</p>
			<p>{{$t('channelPriceCard.lower_price_info_mention_five')}}</p>
		</div>
		<div v-if="Number(data.priceCardType) === 11">
			<p>{{$t('channelPriceCard.guide_price_info_mention_one')}}</p>
			<p>{{$t('channelPriceCard.guide_price_info_mention_two')}}</p>
			<p>{{$t('channelPriceCard.guide_price_info_mention_three')}}</p>
			<p>{{$t('channelPriceCard.guide_price_info_mention_four')}}</p>
			<p>{{$t('channelPriceCard.guide_price_info_mention_five')}}</p>
		</div>
		<div v-if="Number(data.priceCardType) === 13">
			<p>{{$t('channelPriceCard.customer_price_info_mention_one')}}</p>
			<p>{{$t('channelPriceCard.customer_price_info_mention_two')}}</p>
		</div>

		<div>
			<el-row :gutter="20">
				<el-col :span="12" v-if="Number(data.priceCardType) === 13">
					<el-form-item
						:label="$t('channelPriceCard.customer_name')"
						prop="customerId"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_select_customer_name'),
								trigger: 'blur',
							},
						]"
					>
            <MemberList v-model="data.customerId"	@selected="setCustomerInfo"	clearable class="w-full"	/>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item
						:label="$t('channelPriceCard.price_card_name')"
						prop="priceCardName"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_enter_price_card_name'),
							},
						]"
					>
						<el-input
							v-model="data.priceCardName"
							:placeholder="$t('channelPriceCard.please_enter_price_card_name')"
							size="mini"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item
						:label="$t('channelPriceCard.channel')"
						prop="channelCode"
						:rules="[
							{
								required: true,
								message: $t('channelPriceCard.please_select_channel'),
							},
						]"
					>
          <type-select  v-model="data.channelCode" channelKey="channelCode" type="channel" @selected="channelChange" clearable />
					</el-form-item>
				</el-col>
					<el-col :span="12">
					<el-form-item
						:label="$t('channelPriceCard.product_code')"
						required
					>
					<el-input size='mini' v-model="data.productName" disabled />
					</el-form-item>
				</el-col>
			</el-row>
			<div v-if="$isNotEmpty(data.productId)">
				<div class="mb-10">
					<ChannelPriceCardTable :cardType="data.priceCardType" :data="data" />
				</div>
				<div v-if="Number(data.productType) === 1">
					<div class="flex-between">
						<h4 class="fw-bold">{{$t('channelPriceCard.delivery_charge_coefficient')}}：</h4>
					</div>
					<DistributionCostCoefficient
						:productType="1"
						:data="data"
						:productId="data.productId"
					/>
					<el-row :gutter="20">
						<el-col :span="8">
							<h4 class="fw-bold">{{$t('channelPriceCard.surcharge_coefficient')}}：</h4>
							<el-row>
								<el-col>
									<el-form-item
										:label="$t('channelPriceCard.adjustment_coefficient')"
										prop="surchargeCoefficient"
										:rules="[
											{
												required: true,
												message: $t('channelPriceCard.please_enter_adjustment_coefficient'),
											},
											{ validator: $validators.checkNumerGreaterZero },
										]"
									>
										<el-input v-model="data.surchargeCoefficient" size="mini" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" />
									</el-form-item>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="8">
							<h4 class="fw-bold">{{$t('channelPriceCard.pss_coefficient')}}：</h4>
							<el-row>
								<el-col>
									<el-form-item
                    :label="$t('channelPriceCard.adjustment_coefficient')"
										prop="pssCoefficient"
										:rules="[
											{
												required: true,
												message: $t('channelPriceCard.please_enter_adjustment_coefficient'),
											},
											{ validator: $validators.checkNumerGreaterZero },
										]"
									>
										<el-input v-model="data.pssCoefficient" size="mini" />
									</el-form-item>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="8" v-if="Number(data.priceCardType) === 13">
							<h4 class="fw-bold">{{$t('channelPriceCard.coefficient_of_return')}}：</h4>
							<el-row>
								<el-col>
									<el-form-item
                    :label="$t('channelPriceCard.coefficient_of_return')"
										prop="returnCoefficient"
										:rules="[
											{
												required: true,
												message: $t('channelPriceCard.please_enter_coefficient_of_return'),
											},
											{ validator: $validators.checkNumerGreaterZero },
										]"
									>
										<el-input v-model="data.returnCoefficient" size="mini" />
									</el-form-item>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</div>
				<div v-if="Number(data.productType) === 2">
					<h4 class="fw-bold">{{$t('channelPriceCard.carriage_coefficient')}}：</h4>
					<DistributionCostCoefficient
						:productType="2"
						:productId="data.productId"
						:data="data"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ChannelPriceCardTable from './ChannelPriceCardTable.vue'
import DistributionCostCoefficient from './DistributionCostCoefficient.vue'
import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
export default {
	name: 'LowestPrice',
	components: { ChannelPriceCardTable, DistributionCostCoefficient, cargoLimitedSelect },
	props: {
		data: {
			type: Object,
			require: true
		}
	},
	data() {
		return {

		}
	},
	created() {
	},
	mounted() {

	},
	methods: {
		setCustomerInfo(customer) {
			this.data.customerId = customer.id
			this.data.customerName = customer.chineseName
		},
		/**
		 * 物流产品变更
		 */
		channelChange(selectData) {
			this.data.productName = selectData.productName
			this.data.productCode = selectData.productCode
			this.data.countryCode = selectData.countryCode
			this.data.countryName = selectData.countryName
			this.data.productId = selectData.productId
			this.data.channelId = selectData.id
			// 1 快递 2卡车
			this.data.productType = Number(selectData.productType) || 1
		}
	}
}
</script>

<style scoped lang="scss">
.card-content {
	height: 400px;
	overflow-y: auto;
	overflow-x: hidden;
	padding-right: 15px;
	.icon {
		font-size: 18px;
		cursor: pointer;
	}
}
</style>
