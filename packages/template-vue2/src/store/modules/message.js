import { getUnreadNmberApi } from '@/api/middleware/message'

const state = {
  unreadNumber: 0
}

const mutations = {
  SET_UNREAD_COUNT: (state, number) => {
    state.unreadNumber = number
  }
}

const actions = {
  getUnreadNumber({ commit }) {
    return new Promise((resolve, reject) => {
      getUnreadNmberApi().then(res => {
        if (res && res.ok) {
          commit('SET_UNREAD_COUNT', Number(res.content))
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
