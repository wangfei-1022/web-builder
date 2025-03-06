<template>
  <div class="login-container" style="height: calc(100vh);display: flex;flex-direction:row; justify-content: center; align-items: center; background-image: url('./static/bg.jpg');background-size:cover;">
    <div style="display: flex; padding: 0 20px; justify-content: space-between; background-color: #0000008c; border-radius: 6px;position: relative; left: 0px;">
      <!--      <svg-icon icon-class="cargoware-logo-login" style="position:absolute;top:-60px;left:-5px;color:#ffffff;width:300px;height:50px;" />-->
      <div style="width:310px;position:relative;">
        <div style="display: flex; justify-content: space-between; height: 45px; border-bottom: 1px solid rgba(27,95,108,0.27); margin-bottom: 20px;">
          <div :style="typeToLoginStyle" @click="typeToLogin = true"><img src="@/assets/logo-icon.png" style="height:20px;margin-right: 10px;"> 账号登录</div>
          <!-- <div :style="scanToLoginStyle" @click="typeToLogin = false">扫码登录</div> -->
        </div>
        <el-form v-show="typeToLogin" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <el-form-item prop="username" style="margin-bottom:18px;">
            <el-input v-model="loginForm.loginName" type="text" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="password" style="margin-bottom:0px;">
            <el-input v-model="loginForm.password" :type="passwordType" placeholder="密码" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <div style="margin-bottom: 18px;">
            <!--<el-button type="text">忘记密码？</el-button>-->
          </div>
          <div style="display: flex; justify-content: space-between;">
            <el-button type="primary" style="width:100%" @click="handleLogin"> 登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录 </el-button>
            <!--<el-button id="for-change-color" type="primary" plain>试用申请 <svg-icon icon-class="fast-forward" /></el-button>-->
            <!-- <el-button id="for-change-color" type="primary" style="width:49%" plain @click="window.open('https://www.xxxx.cn/?page_id=20267')">试用申请</el-button> -->
          </div>
        </el-form>
        <div v-if="!typeToLogin" style="display:flex; justify-content: center;">
          <img src="/static/qrcode.jpg" style="height:144px;width:144px;">
        </div>
        <div style="position:relative;border-top:1px solid  rgba(27,95,108,0.27);margin-top:40px;padding-top:5px; display: flex;justify-content: space-between">
          <!-- <div style="height:45px;" @mouseenter="showMobileEdition=true" @mouseleave="showMobileEdition=false"><el-button type="text"><svg-icon icon-class="mini-program" style="font-size:1.1em" /> 移动应用</el-button></div>
          <lang-select class="set-language" style="line-height:36px;color:#409EFF;" />
          <el-button type="text"><svg-icon icon-class="rookie" style="font-size:1.1em" /> 新手上路</el-button>
          <img v-show="showMobileEdition" src="/static/mini-program.jpg" style="height:145px;width:145px;position:absolute;top:40px;"> -->
        </div>
      </div>
    </div>
    <!-- <div style="position:fixed;top:0;height:32px;width:100%;background-color: #00000055;color:white;line-height:32px;font-size:13px;display: flex; justify-content: flex-end">
      <span style="margin-right:40px;cursor: pointer" @click="detectCompatibility">体检</span>
      <span style="margin-right:40px;cursor: pointer">帮助</span>
      <span style="margin-right:40px;cursor: pointer" @click="goToPrime">优选</span>
      <span style="margin-right:50px;cursor: pointer" @click="toggleMessageBox">消息<small v-if="areThereAnyNewMessage > 0">{{ '('+areThereAnyNewMessage+')' }}</small></span>
    </div> -->
    <!--    <div style="position:fixed;bottom:0;height:32px;width:100%;background-color: #00000055">-->
    <!--      <span style="color:white;line-height:32px;font-size:1.02em;float:right;font-size:13px;">Cargoware | eTower | ePinn&nbsp;&nbsp;&nbsp;&nbsp;©2011-2019&nbsp;&nbsp;<a href="http://www.beian.miit.gov.cn" target="_blank">沪 ICP备14001465号-1</a>沪公网安备 31011002002106 号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
    <!--    </div>-->

    <div id="messageBox" style="background-color:#00000088;height:calc(100vh - 32px - 32px); width:400px;position:fixed;top:32px;right:-400px;transition: all 0.6s;">
      <el-scrollbar class="news-list" style="color: white;height:calc(100vh - 32px - 32px - 100px);padding-left:15px;">
        <div v-for="a in newsData.articleList" :key="a.key" style="margin-bottom: 58px;">
          <div class="title" style="margin: 18px 0; font-size: 20px;cursor:pointer" @click="window.open(a.url)">{{ a.title }}</div>
          <div class="body" style="position: relative;width:365px;">
            <img :src="a.img" style="width:364px;height:230px;display:block;cursor:pointer" @click="window.open(a.url)">
            <div class="more-bar" style="position: absolute;width:100%;padding:8px 16px;bottom:0px;text-align:right;background-color: #00000088;cursor:pointer;" @click="window.open('https://www.xxx.cn/?page_id=21435&'+new Date().getTime())">更多</div>
            <div class="summary" style="position: absolute;font-size:13px;margin: 12px 0;color:#c7c7c7;cursor:pointer" @click="window.open(a.url)">{{ a.summery }}</div>
          </div>
        </div>
      </el-scrollbar>
      <div class="prev-and-next" style="height:100px; display: flex; justify-content: center;align-items: center;">
        <div class="pagination-arrow" :style="hasPrevious" @click="goNewsPrev">
          <svg-icon icon-class="pagination-prev" />
        </div>
        <div class="pagination-arrow pagination-arrow-right" :style="hasNext" @click="goNewsNext">
          <svg-icon icon-class="pagination-next" />
        </div>
      </div>
    </div>
    <div v-if="isShowingCompatibilityDetectionResult" style="height:100%;width:100%;background-color:#0000004E;position:absolute;display: flex;justify-content: center;align-items:center;">
      <div style="background-color: #333333;color:white; width:700px;position: relative;border-radius:4px;">
        <div style="position: absolute; top: 20px; right: 8px; width:18px; height:18px;cursor:pointer" @click="isShowingCompatibilityDetectionResult=false">
          <i class="el-icon-close" style="font-size:18px;line-height:18px;" />
        </div>
        <div style="margin-top:10px;background-color:#2078dc;font-size:1.2em;font-weight:bold;padding: 10px;padding-left:15px;">设备兼容性检测</div>
        <div style="display: flex; justify-content: space-between; padding: 0 15px;height:45px;line-height:45px; font-size:1.1em;font-weight:bold">
          <div style="width:20%">项目</div>
          <div style="width:28%">我的电脑</div>
          <div style="width:24%">推荐配置</div>
          <div style="width:20%">匹配度</div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0 15px;height:45px;line-height:45px;border-top: 1px dashed white;">
          <div style="width:20%">网速</div>
          <div style="width:28%">{{ speed }} KB/S</div>
          <div style="width:24%">1024 KB/S</div>
          <div style="width:20%">
            <i :class="speedCnt > 0 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class="speedCnt > 1 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class="speedCnt > 2 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class="speedCnt > 3 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class="speedCnt > 4 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0 15px;height:45px;line-height:45px;border-top: 1px dashed white;">
          <div style="width:20%">浏览器内核</div>
          <div style="width:28%"><small>{{ browserInfo.parsedResult.browser.name }} {{ browserInfo.parsedResult.browser.version }}</small></div>
          <div style="width:24%"><small>Chrome 69, Firefox 60</small></div>
          <div style="width:20%">
            <i :class=" browserCnt > 0 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" browserCnt > 0 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" browserCnt > 0 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" browserCnt > 0 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" browserCnt > 0 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0 15px;height:45px;line-height:45px;border-top: 1px dashed white;">
          <div style="width:20%">分辨率</div>
          <div style="width:28%">{{ resolution }}</div>
          <div style="width:24%">1920x1080</div>
          <div style="width:20%">
            <i :class=" resolutionCnt > 0 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" resolutionCnt > 1 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" resolutionCnt > 2 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" resolutionCnt > 3 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
            <i :class=" resolutionCnt > 4 ? 'el-icon-star-on' : 'el-icon-star-off'" style="color:gold" />
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="icp-space">
      {{$t('common.copyrightFront')}}{{copyRightCurrYear}}{{$t('common.copyrightEnd')}}
      <a href="https://beian.miit.gov.cn/" target="_blank">{{$t("common.copyrightLink")}}</a>
    </div> -->
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import { loginInitRedisInfo } from '@/api/login'
import { setUserInfo } from '@/utils/auth'
import { decodeToken } from '@/utils/index'
import bowser from 'bowser'
import axios from 'axios'

export default {
	name: 'Login',
	components: { LangSelect },
	data() {
		return {
			areThereAnyNewMessage: 0,
			newsData: {
				articleList: [],
				currentPage: 0,
				hasNext: false,
				lastPage: -1,
				nextPage: 1
			},
			speed: '---',
			isShowingCompatibilityDetectionResult: false,
			showMobileEdition: false,
			loginToggleStyle: {
				// width: '48%',
				textAlign: 'center',
				lineHeight: '45px',
				cursor: 'pointer',
				display: 'flex',
				'align-items': 'center',
				'white-space': 'nowrap'
			},
			typeToLogin: true,
			loginForm: {
				loginName: '',
				password: ''
			},
			loginRules: {},
			passwordType: 'password',
			loading: false,
			showDialog: false,
			redirect: undefined
		}
	},
	computed: {
		hasNext() {
			const s = {}
			s.color = this.newsData.hasNext ? 'white' : 'gray'
			return s
		},
		hasPrevious() {
			const s = {}
			s.color = this.newsData.currentPage > 0 ? 'white' : 'gray'
			return s
		},
		speedCnt() {
			const s = parseFloat(this.speed)
			if (s === +s) { // 如果speed是数值
				return parseInt(this.speed / 1024 * 5, 10)
			}
			return 0
		},
		browserInfo() {
			return bowser.getParser(window.navigator.userAgent)
		},
		browserCnt() {
			if (this.browserInfo.parsedResult.browser.name === 'Chrome' && parseFloat(this.browserInfo.parsedResult.browser.version) >= 69 ||
				this.browserInfo.parsedResult.browser.name === 'Firefox' && parseFloat(this.browserInfo.parsedResult.browser.version) >= 60) {
				return 1
			}
			return 0
		},
		resolution() {
			return window.screen.width + 'x' + window.screen.height
		},
		resolutionCnt() {
			return parseInt(window.screen.height * window.screen.width / (1920 * 1080) * 5, 10)
		},
		typeToLoginStyle() {
			const t = { ...this.loginToggleStyle }
			t.fontWeight = this.typeToLogin ? 'bold' : 'normal'
			t.color = this.typeToLogin ? '#409EFF' : '#ffffff'
			return t
		},
		scanToLoginStyle() {
			const t = { ...this.loginToggleStyle }
			t.fontWeight = !this.typeToLogin ? 'bold' : 'normal'
			t.color = !this.typeToLogin ? '#409EFF' : '#ffffff'
			return t
		},
		copyRightCurrYear() {
			return new Date().getFullYear()
		}
	},
	watch: {
		$route: {
			handler: function (route) {
				this.redirect = route.query && route.query.redirect
			},
			immediate: true
		}
	},
	created() {
	},
	mounted() {
	},
	destroyed() {
		// window.removeEventListener('storage', this.afterQRScan)
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			const lastLoginedUsername = window.localStorage.getItem('loginForm.username')
			if (lastLoginedUsername) {
				vm.loginForm.loginName = lastLoginedUsername
			}
		})
	},
	methods: {
		handleLogin() {
			/** ****测试添加业务按钮数据收集******/
			this.$webTracker.send({
				logType: 'business',
				logCode: 'login',
				logName: '登录',
				elementType: 'button',
				event: 'click',
				loginAccount: this.loginForm.loginName
			})
			/** ****测试添加业务按钮数据收集******/
			window.localStorage.setItem('loginForm.username', this.loginForm.loginName)
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.$store.dispatch('user/login', this.loginForm)
						.then(async res => {
							if (res.ok) {
								let userInfo = decodeToken(res.content)
								// 设置ARMS的uid为用户id
								if (this.$aliArms) {
									this.$aliArms.setConfig({ uid: userInfo.id })
								}
								this.$webTracker.send({
									logType: 'business',
									logCode: 'login_success',
									logName: '登录成功',
									elementType: 'button',
									event: 'click',
									result: '登录成功',
									loginAccount: this.loginForm.loginName,
									userId: userInfo.id
								})
								return this.$store.dispatch('user/getUserBaseInfo')
							} else {
								this.$webTracker.send({
									logType: 'business',
									logCode: 'login_failed',
									logName: '登录失败',
									elementType: 'button',
									event: 'click',
									errors: JSON.stringify(res.errors || {}),
									result: '登录失败',
									loginAccount: this.loginForm.loginName
								})

								return Promise.reject('登录失败')
							}
						}).then(res => {
							// console.log('loginInitRedisInfo', res)
							// this.$store.dispatch('user/setUserInfo', res.content)
							// setUserInfo(res.content)
							this.loading = false
							// this.$router.push({ path: this.redirect || '/' })
              window.location.href = window.location.origin + (this.redirect || '/')
						}).catch(err => {
							console.log(err)
							this.loading = false
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		detectCompatibility() {
			this.speed = '---'
			const start = new Date().getTime()
			this.isShowingCompatibilityDetectionResult = true
			axios.get(`/static/bg4-half.jpg?t=${start}`).then(res => {
				const end = new Date().getTime()
				const period = end - start
				this.speed = (5 * 1024 / period * 1000).toFixed(1) // 文件大小是4MB，但transfered data大概5.1MB
			})
		},
		goToPrime() {
			window.open('http://old.xxxx.cn/b2b/index.html')
		},
		toggleMessageBox() {
			const mb = document.querySelector('#messageBox')
			mb.style.right = mb.style.right === '0px' ? '-400px' : '0px'
		},
		loadNewsOnPage(pageNum) {
			axios({ url: `https://old.xxxxx.cn/news/data?pageNum=${pageNum}`, headers: { 'Accept': 'text/html;charset=UTF-8' } }).then(res => {
				const end = res.data.length - 1
				this.newsData = JSON.parse(res.data.substring(5, end))
			})
		},
		goNewsPrev() {
			if (this.newsData.currentPage) {
				this.loadNewsOnPage(this.newsData.lastPage)
			}
		},
		goNewsNext() {
			if (this.newsData.hasNext) {
				this.loadNewsOnPage(this.newsData.nextPage)
			}
		}
	}
}
</script>

<style scoped>
/*#for-change-color:hover {*/
/*color: #409EFFdd;*/
/*border: 1px solid #409EFF22;*/
/*background-color: #409EFF22;*/
/*}*/

.pagination-arrow {
	height: 40px;
	width: 40px;
	text-align: center;
	line-height: 40px;
	cursor: pointer;
}
.pagination-arrow-right {
	margin-left: 30px;
}
.icp-space {
	position: absolute;
	bottom: 20px;
	width: 100%;
	text-align: center;
	font-size: 14px;
	color: #666;
}
</style>
<style>
#messageBox .el-scrollbar__wrap {
	overflow-x: hidden;
}
</style>
