import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './styles/element-variables.module.scss'

import '@/styles/index.scss' // global css
import '@/styles/common.scss' // common css
import '@/styles/iconfont/iconfont.js';

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'


import 'ag-grid-enterprise'
import { LicenseManager } from 'ag-grid-enterprise' // eslint-disable-line
LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__24_November_2018__MTU0MzAxNzYwMDAwMA==a39c92782187aa78196ed1593ccd1527')

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
// import './icons' // icon
import './permission' // permission control
import './hm' // 百度统计路由拦截
import EventBus from './utils/bus' // bus
import './utils/errorLog' // error log
import mixin from '@/utils/mixin'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import permission from '@/directive/permission/index.js' // 权限判断指令
import inputLimit from '@/directive/input-limit/index.js' // 权限判断指令
import inputAuto from "@/directive/input-auto/index.js"
import trim from "@/directive/trim.js"

import Base from './base'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

// 基础方法、指令、组件安装
Vue.use(Base)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

import webTracker from 'web-tracker'
import toEnglish from "@/utils/toEnglish"
Vue.use(webTracker, {
  report: {
    CONSOLE_ERROR: true // 启用
  },
  host: `${process.env.VUE_APP_TRACKER_HOST || ''}`,
  project: `${process.env.VUE_APP_TRACKER_PROJECT || ''}`,
  logstore: `${process.env.VUE_APP_TRACKER_LOG_STORE || ''}`,
  appId: `${process.env.VUE_APP_TRACKER_APP_ID || ''}`, // 项目名称
  version: `${process.env.VUE_APP_VERSION || ''}`
})

// test
window.appMap = {
  version: `${process.env.VUE_APP_VERSION}`
}
Vue.use(toEnglish)
Vue.use(elDragDialog)
Vue.use(permission)
Vue.use(inputLimit)
Vue.use(inputAuto)
Vue.use(trim)

Vue.prototype.$bus = EventBus
Vue.config.productionTip = false
// 全局混入
Vue.mixin(mixin)

const vue = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
export default vue
