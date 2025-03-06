<template>
    <div>
      <div class="mb-10" >
        <el-progress :percentage="percentage >100?100:parseInt(percentage)"></el-progress>
      </div>
      <div>处理时间跟账单数据量成正比</div>
    </div>
</template>

<script>
import { receiveBillConfirmApi } from "@/api/fmsReceiveOvl"
export default {
	name: 'ProgressContent',
	props: {
		id: String
	},
	data() {
		return {
			percentage: 0,
			timerId: null,
			isEnd: false
		}
	},

	created() {
		this.setTimer()
		this.submitData()
	},
	mounted() {

	},
	methods: {
		// 设置定时器
		setTimer() {
			clearInterval(this.timerId)
			this.timerId = setInterval(() => {
				if (this.percentage >= 100) {
					clearInterval(this.timerId)
					this.percentage = 100
					this.$emit('end')
				} else if (this.percentage >= 80 && this.percentage < 98) {
					if (this.isEnd) {
						this.percentage += 2
					} else {
						this.percentage += 0.05
					}
				} else if (this.percentage > 98 && this.percentage < 100) {
					if (this.isEnd) {
						this.percentage += 0.2
					} else {
						this.percentage += 0
					}
				} else if (this.percentage >= 60) {
					if (this.isEnd) {
						this.percentage += 5
					} else {
						this.percentage += 0.1
					}
				} else {
					if (this.isEnd) {
						this.percentage += 20
					} else {
						this.percentage += 2
					}
				}
			}, 100)
		},
		// 清除定时器
		clearTimer() {
			clearInterval(this.timerId)
		},
		async submitData() {
			if (this.id) {
				let res = await receiveBillConfirmApi(this.id)
				if (res.ok) {
					this.isEnd = true
				}
			}
		}
	},
	beforeDestroy() {
		clearInterval(this.timerId)
	}
}
</script>

<style scoped lang="scss">
</style>
