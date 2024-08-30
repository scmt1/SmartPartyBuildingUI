import {getTzSysDeptNameList} from "@/api/jcxfSysDept";
const state = {
    deptList: []
}

const mutations = {
    setDeptList(state, deptList) {
        state.deptList = deptList
    }
}
const cache = {}; // 定义一个空对象，用来保存请求结果
const actions = {
    getUserListFromBackend({commit}, deptId) {
        return new Promise((resolve, reject) =>{
            if (cache[deptId]) { // 如果已经请求过，直接返回缓存的结果
                resolve(cache[deptId])
            } else{
                getTzSysDeptNameList(deptId).then(res => {
                    const data = res.data
                    if (data.code == "00000" && data.data.length > 0) {
                        commit('setDeptList', data.data)
                        cache[deptId] = data.data; // 缓存请求结果
                        resolve(cache[deptId])
                    } else {
                        resolve([])
                    }
                }).catch(err => {
                    console.error(err)
                })
            }
        })
    }
}

export default {
    state,
    mutations,
    actions
}
