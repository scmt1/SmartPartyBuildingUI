import {getTzSysDept} from "@/api/jcxfSysDept";
import store from "@/store";
import {getDeptByApp} from "@/api/app";

let state = {
    appInfo: {}
}

const mutations = {
    SET_APP_INFO(state, deptInfo) {
        state.appInfo = deptInfo
    },
}

const actions = {
    setAppInfo({ commit }, appInfo) {
        commit('SET_APP_INFO', appInfo)
    },
    getBsinDeptInfoByApp({ commit }) {
        return new Promise((resolve, reject) => {
            let appInfo = store.getters.appInfo
            let userId = JSON.parse(window.localStorage.getItem("userInformation")).userId
            let value = {
                userId: userId,
                appId: appInfo.appId
            }
            getDeptByApp({data: value}).then(res => {
                if (res.code == '000000') {
                    let deptId = res.data.id
                    resolve(deptId)
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
