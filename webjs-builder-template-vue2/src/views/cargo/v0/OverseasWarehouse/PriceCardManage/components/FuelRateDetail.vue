
<template>
	<div class="mb-10">
		<div class="pd-16 content-title">{{$t('channelPriceCard.fuel_rate')}}</div>
		<div class="content-container">
			<div v-for="(item, index) in dataList" :key="index" class="mt-10">
				<span class="label">
					{{$t('channelPriceCard.rate_time_range')}}： {{ $moment(parseInt(item.startTime, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}}
          <span v-if='$isNotEmpty(item.endTime)'>{{$t('channelPriceCard.to')}}{{ $moment(parseInt(item.endTime, 10)).utc().format("YYYY-MM-DD HH:mm:ss")}} </span>
				</span>
				<span class="ml-20 label">{{$t('channelPriceCard.rate')}}：{{ item.rate+'%' }}</span>
			</div>
			<div class="empty-text" v-if="$isEmpty(dataList)">{{$t('channelPriceCard.no_data')}}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FuelRate',
	props: {
		dataList: {
			type: Array,
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

	}
}
</script>

<style scoped lang="scss">
.content-container {
	padding-left: 40px;
	.label {
		font-size: 14px;
		color: #606266;
	}
	.empty-text {
		height: 60px;
		line-height: 60px;
		color: #999;
	}
}
</style>
