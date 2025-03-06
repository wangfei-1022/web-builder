import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, setToken, getUserInfo } from '@/utils/auth' // get token from cookie
import webTracker from 'web-tracker'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
import { generateTitle } from '@/utils/i18n'

const whiteList = ['/login', '/auth-redirect', '/notify/identification/email', 'EmailIdentification', '/CharteredBoat/ReleaseBillListBusiness', '/CharteredBoat/ReleaseBillListOperate', 'BIV2'] // no redirect whitelist
const loginFreeWhiteList = ['/CharteredBoat/ReleaseBillListBusiness', '/CharteredBoat/ReleaseBillListOperate'] // 免登录白名单

function checkIfToRouterNameExists(to, layer) {
  let res = 0
  layer.forEach(l => {
    res += l.children ? checkIfToRouterNameExists(to, l.children) : l.name === to.name ? 1 : 0
  })
  return res
}

router.beforeEach(async (to, from, next) => {
  if (to.query.authorization || to.query.token) {
    store.dispatch('user/updateToken', to.query.authorization || to.query.token)
    await store.dispatch('user/getUserBaseInfo')
  }

  // 终止所有请求
  if (store.getters.cancelList.length > 0) {
    store.getters.cancelList.forEach(cancel => {
      cancel('cancelRequest')
    })

    // 清空cancel 列表
    store.dispatch('axiosCancel/clearList')
  }

  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken && !to.query.token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        let checked = checkIfToRouterNameExists(to, store.getters.permission_routes)
        if (checked) {
          return next()
        } else {
          return next('/401')
        }
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles, menu } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const menuList = await store.dispatch('permission/setTopMenu', menu)

          // dynamically add accessible routes
          router.addRoutes(menuList.realPathRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1 || whiteList.indexOf(to.name) !== -1) {
      // in the free login whitelist, go directly
      if (!!to.query && !!to.query.token && loginFreeWhiteList.indexOf(to.path) !== -1) {
        next({
          path: to.path,
          query: {
            releaseNo: to.query.releaseNo
          }
        })
      } else {
        next()
      }
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  // finish progress bar
  NProgress.done()

  // 当 /redirect/
  if (to.fullPath.indexOf('/redirect/') < 0) {
    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    if (hasRoles) {
      let checked = checkIfToRouterNameExists(to, store.getters.permission_routes)
      if (checked) {
        let userInfo = getUserInfo()
        let titleArr = []
        if (to.meta && to.meta.code) {
          // 如果有code 则从menuList里去取
          function findParentIdsRecursive(root, childCode) {
            if (root === null) {
              return
            }
            root.forEach(node => {
              node.parentName = node.parentName || []
              if (node.code === childCode) {
                node.parentName.push(node.title)
                titleArr = node.parentName
              } else {
                if (node.children) {
                  let nodeParentName = JSON.parse(JSON.stringify(node.parentName))
                  nodeParentName.push(node.title)
                  node.children.forEach(v => {
                    v.parentName = nodeParentName
                  })
                  findParentIdsRecursive(node.children, childCode)
                }
              }
            })
          }
          findParentIdsRecursive(userInfo.menus, to.meta.code)
        } else {
          let matched = to.matched.filter(item => item.name && item.meta && item.meta.title && item.meta.breadcrumb !== false)
          titleArr = matched.reduce(function (arr, item) {
            arr.push(generateTitle(item.meta.title))
            return arr
          }, [])
        }

        setTimeout(() => {
          webTracker.send({
            logType: 'business',
            logCode: 'menu',
            logName: '菜单',
            elementType: 'button',
            event: 'click',
            userId: userInfo.id,
            userName: userInfo.chineseName,
            menuName: titleArr.join('-')
          })
        }, 0)
      }
    }
  }
})