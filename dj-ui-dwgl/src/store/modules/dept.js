import {getTzSysDept} from "@/api/jcxfSysDept";

let state = {
    deptInfo: {}
}

const mutations = {
    SET_DEPT_INFO(state, deptInfo) {
        state.deptInfo = deptInfo
    },
}

const actions = {
    setDeptInfo({ commit }, deptInfo) {
        commit('SET_DEPT_INFO', deptInfo)
    },
    getDeptInfoForVuex({ commit }, id) {
        return new Promise((resolve, reject) => {
            getTzSysDept(id).then(res => {
                const result = res.data
                if (result.code == '00000') {
                    commit('SET_DEPT_INFO', result.data)
                    resolve(result.data)
                }
            })
        })
    }
}

export default {
    namespace: true,
    state,
    mutations,
    actions
}
