<template>
  <div>
    <el-form-item :label="$t('channelPriceCard.bubble_ounting_ondition')" label-width="80px" prop="bubbleConditionMap.volume" :rules="[{required:data.checked && isEdit,message: $t('channelPriceCard.bubble_ounting_ondition_empty'),trigger:'blur'}]">
      <div v-if="isEdit">
        <el-checkbox v-model="data.checked"></el-checkbox>
        <span class="ml-10 label">{{$t('channelPriceCard.bubble_ounting_ondition_tip')}}</span>
        <el-input  v-if="isEdit" class="w-80 ml-10" v-model="data.volume" size="mini" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g,'$1')" :placeholder="$t('common.placeholder')" />
        <span class="ml-10 label">{{getShowUinitTips}}</span>
      </div>
      <div v-else>
        <div v-if="data.checked">
          <span class="ml-10 label">{{$t('channelPriceCard.bubble_ounting_ondition_tip')}}</span>
          <span class="ml-10 label">{{data.volume}}</span>
          <span class="ml-10 label">{{$t('channelPriceCard.bubble_ounting_ondition_tip1')}}</span>
        </div>
        <div v-else>-</div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
	name: 'BubbleCountingCondition',
	props: {
		data: {
			type: Object,
			require: true
		},
		isEdit: {
			type: Boolean,
			require: true
		},
		unitCategoryType: {
			type: Number,
			require: true
		}
	},
	data() {
		return {
		};
	},
	created() {

	},
	computed: {
		getShowUinitTips() {
			let type = this.unitCategoryType
			let tips = ''
			// 公制
			if ([10, 20].includes(type)) {
				tips = this.$t('channelPriceCard.bubble_ounting_ondition_tip2')
			}
			// 英制
			if ([11, 21].includes(type)) {
				tips = this.$t('channelPriceCard.bubble_ounting_ondition_tip1')
			}
			return tips
		}
	},
	methods: {

	}
};
</script>

<style scoped lang="less">
.label {
	font-size: 12px;
	color: #606266;
}
</style>
