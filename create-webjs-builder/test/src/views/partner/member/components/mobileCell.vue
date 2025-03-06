<template>
  <div>{{params.data.mobile}}
    <el-popover v-if="params.data.mobile && !params.data.mobileFlag" placement="top-start" title="" width="200" trigger="hover">
      <div>{{$t('authorization.mobile_un_auth_cannot_receive_message')}}<a class='resend' @click="resend(params.data, 'mobile')">{{$t('authorization.afresh_send')}}</a></div>
      <span slot="reference"><i class="el-icon-info unAuth"></i></span>
    </el-popover>
  </div>
</template>
<script>
import { sendMobileApi } from '@/api/partner/member'
export default {
	data() {
		return {}
	},
	methods: {
		resend() {
			sendMobileApi(this.params.data.adminUserId).then(res => {
				if (res && res.ok) {
					this.$message.success(this.$t('authorization.send_success'))
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.unAuth {
	color: #f4bd00;
}
.resend {
	color: #337ab7;
}
</style>
