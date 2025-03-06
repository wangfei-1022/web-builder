<template>
  <div>
    <div class="info-title">{{ getZH("outBoundSelect") }}</div>
    <div class="page-content mt-20 mb-10 flex-box">
      <!-- <div class="mr-20">
        <span>{{getZH('customsClearanceType')}}：</span>
        <span>{{detailContent.clearanceType || '-'}}</span>
      </div> -->
      <div class="mr-20">
        <span>{{getZH('customsClearanceState')}}：</span>
        <span>{{detailContent.clearanceStatus || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('loadingPlanTime')}}：</span>
        <span>{{detailContent.planLoadingTime | formatDate('YYYY-MM-DD','-')}}</span>
      </div>
      <div class="mr-20">
        <span>timeSlot：</span>
        <span v-if="detailContent.timeSlotStartTime">{{detailContent.timeSlotStartTime | formatDate('HH:mm')}}</span>-
        <span v-if="detailContent.timeSlotEndTime">{{detailContent.timeSlotEndTime  | formatDate('HH:mm')}}</span>
        <span v-else>-</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('customsClearanceAgent')}}：</span>
        <span>{{detailContent.clearanceAgent || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('customsClearancePerson')}}：</span>
        <span>{{detailContent.clearanceCustoms || '-'}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('customsClearanceCompletionDate')}}：</span>
        <span>{{detailContent.clearanceCompleteTime | formatDate('YYYY-MM-DD','-')}}</span>
      </div>
      <div class="mr-20">
        <span>{{getZH('expectedDeliveryTime')}}：</span>
        <span>{{detailContent.expectDeliveryTime | formatDate('YYYY-MM-DD','-')}}</span>
      </div>
      <!-- <div class="mr-20" v-if="detailContent.pickup">
        <span>{{getZH('carrierName')}}：</span>
        <span>{{detailContent.carrierName}}</span>
      </div>
      <div class="mr-20" v-if="detailContent.pickup">
        <span>{{getZH('carNo')}}：</span>
        <span>{{detailContent.carNo}}</span>
      </div> -->

    </div>
  </div>
</template>

<script>
import getZHMixin from './getZHMixin'
export default {
	name: 'OutBoundSelectInfo',
	mixins: [getZHMixin],
	props: {
		detailContent: {
			type: Object,
			default: () => { }
		}
	},
	data() {
		return {

		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		getStatus() {
			let state = this.detailContent.orderStatus
			switch (state) {
				case 4:
					return 'green-state'
				case 5:
					return 'yellow-state'
				case 6:
					return 'danger-state'
				default:
					return 'blue-state'
			}
		}
	}
};
</script>

<style scoped lang="less">
.page-content {
	color: #606266;
	font-size: 14px;
	flex-wrap: wrap;
	& > div {
		white-space: nowrap;
		margin-bottom: 22px;
		min-width: 300px;
	}
}
</style>
