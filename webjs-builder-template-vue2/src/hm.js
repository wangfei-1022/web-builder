// 百度统计
import router from './router'

router.beforeEach((to, from, next) => {
  if (to.path) {
    window._hmt && window._hmt.push(['_trackPageview', to.fullPath]) // eslint-disable-line
  }
  next()
})
