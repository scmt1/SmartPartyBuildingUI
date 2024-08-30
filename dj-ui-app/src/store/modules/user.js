// userStore

export default {
  state: {
    token: '',
		userInfo: {},
		timer: 60,
		timerShow:false,
		loading: true,
  },
  // getters: {
  //   numAdd(state) {
  //     console.log(123)
  //     return state.num++
  //   }
  // },
  mutations: {
    tokenMutation(state, payload) {
      state.token = payload
    },
		setUserInfo(state, payload) {
			state.userInfo = payload
		},
		setTimer(state, payload) {
			state.timer = payload
		},
		setTimerShow(state, payload) {
			state.timerShow = payload
		},
		setLoading(state, payload) {
			state.loading = payload
		}
  },
  actions: {
    tokenAction(content, payload) {
      content.commit('tokenMutation', payload)
    },
		setUserInfo(content, payload) {
			content.commit('setUserInfo', payload)
		}
  },
  namespaced: true
}
