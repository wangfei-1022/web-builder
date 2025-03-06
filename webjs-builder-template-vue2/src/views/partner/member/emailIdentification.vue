<template>
  <div class="login-wrap">
    <div class="logo-yht">
      <img src="@/assets/logo-yht.png">
    </div>
    <div class="login-box-wrap">
      <el-row class="row-info" v-if="success === null">
        <div class="email">请耐心等待邮箱激活结果...</div>
      </el-row>
      <el-row class="row-info" v-if="success === true">
        <el-col :span="6" style="text-align: center;">
          <i class="check-icon-success el-icon-success" />
        </el-col>
        <el-col :span="18">
          <div class="email">{{ $t('receiverManage.emailIdentification') }}</div>
        </el-col>
      </el-row>
      <el-row class="row-info" v-if="success === false">
        <el-col :span="6" style="text-align: center;">
          <i class="check-icon-error el-icon-error" />
        </el-col>
        <el-col :span="18">
          <div class="email">激活邮箱操作失败。请稍后进行再次尝试。</div>
        </el-col>
      </el-row>
    </div>
    <div class="footer">{{ $t('common.copyright') }}</div>
  </div>
</template>

<script>
import { identificationEmailStatusApi } from '@/api/middleware/message'

export default {
	name: 'EmailIdentification',
	components: {},
	data() {
		return {
			success: null
		}
	},
	mounted() {
		this.putEmail()
	},
	methods: {
		putEmail() {
			const id = this.$route.params.id
			const token = this.$route.query.token
			identificationEmailStatusApi({ id: id, token: token }).then(res => {
				if (res.ok) {
					this.success = true
				}
			}).catch(() => {
				this.success = false
			})
		}
	}
}
</script>

<style lang='scss' scoped>
@mixin flex-row-between {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
}

@mixin flex-column-center {
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
}

.login-wrap {
	height: 100%;
	overflow: auto;
	background: #ebf3fb;
}

.logo-yht {
	width: 830px;
	margin: 2% auto 20px auto;
	img {
		width: 190px;
	}
}

.login-box-wrap {
	font-family: "Microsoft Yahei";
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	width: 830px;
	margin: 0 auto;
	height: 662px; /*calc(100vh - 50px);*/
	min-width: 830px;
	min-height: 662px;
	background: #fff;
	box-shadow: 5px 5px 10px 0 rgb(204, 205, 205);
	.banner {
		width: 695px;
		height: 100%;
		position: relative;
		img {
			position: absolute;
			width: 100%;
			height: 740px;
			bottom: 0;
			left: 0;
		}
	}
	.login-tool {
		width: 100%;
		@include flex-row-between;
	}
	.title {
		height: 56px;
		line-height: 56px;
		margin: 0;
	}
	.login-please {
		font-size: 24px;
		color: #666;
		font-weight: bold;
		margin-bottom: 30px;
	}
}

.footer {
	width: 100%;
	text-align: center;
	color: #666;
	font-size: 14px;
	margin-top: 30px;
	padding-bottom: 20px;
}

$placeholderColor: #222;

.login-box {
	width: 375px;
	height: 100%;
	margin-right: 14%;
	@include flex-column-center;
	justify-content: flex-start;
	.left-box,
	.right-box {
		margin-top: 120px;
		width: 100%;
	}
}

.row-info {
	width: 500px;
	margin: 0 auto;
	padding-top: 250px;
}

.check-icon-success {
	color: rgb(19, 190, 28);
	font-size: 80px;
}
.check-icon-error {
	color: rgba(243, 12, 57, 70%);
	font-size: 80px;
}

.email {
	font-size: 22px;
	font-weight: 600;
	line-height: 40px;
}
</style>
