<template>
	<div style="display: none" />
</template>

<script>
export default {
	name: 'Notification',
	components: {

  },
	data() {
		return {
			
		}
	},
	created() {
    this.$bus.$on('system/message', this.onMessageReceived)
	},
  beforeDestory() {
    this.$bus.$off('system/message', this.onMessageReceived)
  },
	methods: {
		clickRow(row) {
			this.$router.push('/message/detail?id=' + row.id)
		},
		onMessageReceived(item) {
			// 获取最新数目
			this.$store.dispatch('message/getUnreadNumber')
			this.$notify({
				title: item.title,
				message: item.content,
				position: 'top-right',
				duration: 6000,
				customClass: 'notification-send',
				iconClass: 'iconfont icon-xiaoxi1',
				onClick: () => {
					this.clickRow(item)
				}
			})
		}
	}
}
</script>

<style lang="scss">
.el-notification.notification-send {
	width: 275px;
}

.notification-send {
	.el-notification__icon.icon-xiaoxi1 {
		color: #5f7197;
		font-size: 24px;
	}
	.el-notification__title {
		font-size: 14px;
	}
	.el-notification__content {
		font-size: 12px;
		color: #333;

		p {
			display: inline-block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 170px;
		}
	}
}
</style>
