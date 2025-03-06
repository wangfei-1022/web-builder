<template>
    <div>
      <div class="mb-10" v-if='!isEnd'>
        <!-- <el-progress :percentage="percentage>100?100:percentage"></el-progress> -->
      </div>
      <div>{{tips.content}}</div>
    </div>
</template>

<script>
export default {
	name: 'TempContent',
	props: {
		tips: Object,
		isEnd: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			percentage: 0,
			timerId: null
		}
	},
	watch: {
		tips: {
			handler(val) {
				if (val.isEnd) {
					clearInterval(this.timerId)
				} else {
					this.percentage = 0
					this.setTimer()
				}
			},
			deep: true

		}
	},
	created() {
		this.setTimer()
	},
	mounted() {

	},
	methods: {
		setTimer() {
			// clearInterval(this.timerId)
			// this.timerId = setInterval(() => {
			// if (this.percentage >= 100) {
			//   clearInterval(this.timerId)
			//   this.$emit('end')
			// } else if (this.percentage >= 90 && this.percentage < 98) {
			//   this.percentage += 3
			// } else if (this.percentage > 98 && this.percentage < 100) {
			//   this.percentage += 0.5
			// } else {
			//   this.percentage += 10
			// }
			// }, 100)
		}
	},
	beforeDestroy() {
		clearInterval(this.timerId)
	}
}
</script>

<style scoped lang="scss">
</style>
