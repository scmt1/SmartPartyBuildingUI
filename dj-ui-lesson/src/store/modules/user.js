let state = {
    userInfo: {}
}

const mutations = {
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
    },
}

const actions = {
    setUserInfo({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            commit('SET_USER_INFO', userInfo)
            resolve()
        })
    },
}

export default {
    namespace: true,
    state,
    mutations,
    actions
}
