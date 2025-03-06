import { loginByUsername, getUserInfo, logout, loginInitRedisInfo } from '@/api/login'
import { getUserMenuApi } from '@/api/user'
import { getToken, setToken, removeToken, setUserInfo, getUserInfo as utilGetUserInfo } from '@/utils/auth'
import Websocket from '@/utils/websocket'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {},
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menu: [],
  departmentList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
    // state.roles = roles.concat('cas:flash:del','cas:flash:edit','cas:flash:stop','cas:flash:copy','cas:flash:create')
  },
  SET_DEPARTMENTLIST: (state, list) => {
    state.departmentList = list
  },
  REFRESH_USER_MENU: (state, menuList) => {
    state.userInfo.menus = menuList
  }
}

const actions = {
  updateToken({ commit }, token) {
    commit('SET_TOKEN', token)
    setToken(token)
  },
  // user login
  login({ commit }, userInfo) {
    const { loginName, password } = userInfo
    return new Promise((resolve, reject) => {
      loginByUsername({ loginName: loginName.trim(), password: password }).then(res => {
        if (res.ok) {
          commit('SET_TOKEN', res.content)
          setToken(res.content)
          Websocket.connect()
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserBaseInfo({ commit }) {
    return new Promise((resolve, reject) => {
      Promise.all([loginInitRedisInfo(), getUserMenuApi()]).then(values => {
        let userInfo = values[0].content
        let menuList = values[1].content
        userInfo.menus = menuList
        commit('SET_MENU', menuList)
        commit('SET_USERINFO', userInfo)
        setUserInfo(userInfo) // util set
        resolve(userInfo)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const data = response
        Websocket.connect()
        if (data.name) {
          commit('SET_NAME', data.name)
        }
        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.roles)
        } else {
          reject('未向该用户分配任何角色！')
        }
        resolve({ roles: data.roles, menu: data.menus })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        Websocket.disconnect()
        resolve()
      }).catch(error => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  setUserInfo({ commit }, userInfo) {
    return new Promise(resolve => {
      commit('SET_USERINFO', userInfo)
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles, menu } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', menu, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  },

  // Department list
  setDepartmentList({ commit }, list) {
    return new Promise(resolve => {
      commit('SET_DEPARTMENTLIST', list)
      resolve()
    })
  },

  // 收藏后更新菜单
  refreshUserMenu({ commit }, menuList) {
    return new Promise(resolve => {
      const userInfo = utilGetUserInfo()
      userInfo.menus = menuList
      commit('SET_USERINFO', userInfo)
      setUserInfo(userInfo)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
