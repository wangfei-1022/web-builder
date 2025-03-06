import { constantRoutes, asyncRoutesMap } from '@/router'
import {
  saveFavoriteApi,
  removeFavoriteApi,
  getFavoriteListApi,
  getLastestVisitedListApi,
  getUserMenuApi
} from '@/api/user'
import Layout from '@/layout'

// 记录全部子路由 - 去重使用
let genalChildRoutes = []

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 递归三级路由表
function generateRoutes(menuList) {
  let realPathRoutes = []
  menuList.forEach(function (menuItem) {
    if (asyncRoutesMap[menuItem.code]) {
      menuItem.component = asyncRoutesMap[menuItem.code].component
      menuItem.name = asyncRoutesMap[menuItem.code].name || menuItem.code
      menuItem.alwaysShow = !!asyncRoutesMap[menuItem.code].alwaysShow
      menuItem.meta = {
        code: menuItem.code,
        icon: menuItem.icon,
        title: menuItem.title,
        status: asyncRoutesMap[menuItem.code].status,
        noCache: asyncRoutesMap[menuItem.code].noCache ? asyncRoutesMap[menuItem.code].noCache : null
      }
    } else {
      menuItem.component = Layout
      menuItem.name = `commonLayout_${menuItem.id}`
      menuItem.alwaysShow = true
      menuItem.meta = {
        icon: '',
        title: menuItem.title,
        status: null,
        noCache: null
      }
    }

    // list菜单
    let childrenMock = []

    menuItem.children.forEach(function (detailMenu) {
      delete detailMenu.children
      if (asyncRoutesMap[detailMenu.code]) {
        detailMenu.component = asyncRoutesMap[detailMenu.code].component
        detailMenu.name = asyncRoutesMap[detailMenu.code].name || detailMenu.code
        detailMenu.meta = {
          code: detailMenu.code,
          title: detailMenu.title,
          status: asyncRoutesMap[detailMenu.code].status,
          noCache: asyncRoutesMap[detailMenu.code].noCache ? asyncRoutesMap[detailMenu.code].noCache : null
        }
        if (detailMenu.path.startsWith('/')) {
          detailMenu.path = detailMenu.path.substr(1)
        }
        childrenMock.push(detailMenu)
        // 将详情页推入router
        if (asyncRoutesMap[detailMenu.code].children && asyncRoutesMap[detailMenu.code].children.length > 0) {
          const childArr = loopChildPages(asyncRoutesMap[detailMenu.code])
          childrenMock = childrenMock.concat(childArr)
        }
      }
    })
    // let obj = {}
    // menuItem.children = childrenMock.reduce(function(menuItem, next) {
    //    obj[next.path] ? '' : obj[next.path] = true && menuItem.push(next);
    //    return menuItem;
    // }, [])

    menuItem.children = childrenMock

    if (menuItem.children.length > 0) {
      menuItem.redirect = 'noredirect'
    }

    realPathRoutes.push(menuItem)
  })

  return realPathRoutes
}

function loopChildPages(childPages) {
  let childContainer = []
  childPages.children.map(v => {
    if (asyncRoutesMap[v]) {
      let newItem = asyncRoutesMap[v]
      if (!genalChildRoutes.includes(v)) {
        genalChildRoutes.push(v)
        // 还有下一级
        if (newItem.children && newItem.children.length > 0) {
          const childArr = loopChildPages(newItem)
          childContainer = childContainer.concat(childArr)
        }
        // 删除字符串children
        delete newItem.children
        childContainer.push(newItem)
      }
    }
  })
  return childContainer
}

const state = {
  routes: [],
  addRoutes: [],
  favourRoutes: [],
  lastestRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_FAVOURROUTES: (state, newFavorite) => { // 获取已收藏的菜单且倒序
    state.favourRoutes = newFavorite
  },
  SET_LASTESTROUTES: (state, lastVisited) => { // 最近使用按时间倒序再取前5
    state.lastestRoutes = lastVisited
  }
}

const actions = {
  setTopMenu({ dispatch, commit, state }, menu) {
    // 清除全局router去重列表
    genalChildRoutes = []
    return new Promise(resolve => {
      let accessedRoutes = []
      let realPathRoutes = []
      menu.map(item => {
        const menuLevel1 = {
          code: item.code,
          title: item.title,
          topMenu: true,
          children: []
        }
        if (item.children) {
          item.children.map(subItem => {
            const menuLevel2 = {
              code: subItem.code,
              title: subItem.title,
              children: []
            }

            if (subItem.children.length > 0) {
              const realItem = generateRoutes(subItem.children)
              menuLevel2.children = realItem
              realPathRoutes = realPathRoutes.concat(realItem)
            }

            menuLevel1.children.push(menuLevel2)
          })
        }
        accessedRoutes.push(menuLevel1)
      })
      commit('SET_ROUTES', accessedRoutes)
      dispatch('user/refreshUserMenu', accessedRoutes, { root: true })
      resolve({ accessedRoutes, realPathRoutes })
    })
  },
  // 点击收藏某个菜单
  favourMenu({ dispatch, commit }, menuObj) {
    return new Promise(async (resolve, reject) => {
      let res = null
      if (menuObj.favorite) {
        res = await removeFavoriteApi(menuObj.id)
        if (res && res.ok) {
          dispatch('refreshMenu')
          dispatch('getFavoriteRoutes')
          resolve('ok')
        } else {
          reject('err')
        }
      } else {
        res = await saveFavoriteApi(menuObj.id)
        if (res && res.ok) {
          dispatch('refreshMenu')
          dispatch('getFavoriteRoutes')
          resolve('ok')
        } else {
          reject('err')
        }
      }
    })
  },
  async refreshMenu({ dispatch }) {
    const res = await getUserMenuApi()
    if (res && res.ok) {
      dispatch('setTopMenu', res.content)
    }
  },
  async getFavoriteRoutes({ commit }) {
    const res = await getFavoriteListApi()
    if (res && res.ok) {
      let favoriteList = generateRoutes(res.content)
      commit('SET_FAVOURROUTES', favoriteList)
    }
  },
  async getLatestRoutes({ commit }) {
    const res = await getLastestVisitedListApi()
    if (res && res.ok) {
      const lastestList = generateRoutes(res.content)
      commit('SET_LASTESTROUTES', lastestList)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
