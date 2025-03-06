const state = {
  cancelList: []
}

const mutations = {
  PUSH_LIST: (state, cancel) => {
    state.cancelList.push(cancel)
  },
  CLEAR_LIST: state => {
    state.cancelList = []
  }
}

const actions = {
  pushList: ({commit, state}, cancel) => new Promise((resolve, reject) => {
    const _isExsit = state.cancelList.some(item => item === cancel)
    if (!_isExsit) {
      commit('PUSH_LIST', cancel)
    }
    resolve(state.cancelList)
  }),
  clearList: ({commit}) => new Promise((resolve, reject) => {
    commit('CLEAR_LIST')
    resolve(state.cancelList)
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
