let state = {
    userInfo: {},
    tradeUnionRole: false,
    unitedDeptRole: false
}

const mutations = {
    SET_USER_INFO(state, userInfo) {
        state.userInfo = userInfo
    },
    SET_TRADE_UNION_ROLE(state, info) {
        state.tradeUnionRole = info
    },
    SET_UNITED_DEPT_ROLE(state, info) {
        state.unitedDeptRole = info
    },
}

const actions = {
    setUserInfo({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            commit('SET_USER_INFO', userInfo)
            resolve()
        })
    },
    setTradeUnionRole({ commit }, info) {
        return new Promise((resolve, reject) => {
            commit('SET_TRADE_UNION_ROLE', info)
            resolve()
        })
    },
    setUnitedDeptRole({ commit }, info) {
        return new Promise((resolve, reject) => {
            commit('SET_UNITED_DEPT_ROLE', info)
            resolve()
        })
    }
}

export default {
    namespace: true,
    state,
    mutations,
    actions
}
