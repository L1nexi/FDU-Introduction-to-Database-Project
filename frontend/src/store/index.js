import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: -1   // -1: not logged in, 0: admin, >0: user
  },
  getters: {
    getUserState: state => {
      return state.userId
    }
  },
  mutations: {
    setUserState(state, ustate) {
      state.userId = ustate
    },
    clearUserState(state) {
      state.userId = -1
    }
  },
  actions: {
  },
  modules: {
  }
})
