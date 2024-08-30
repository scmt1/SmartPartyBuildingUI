import router from './router'
import store from '@/store'
import {Notification} from "element-ui";
router.beforeEach(async(to, from, next) => {
    try {
        let appInfo = store.getters.appInfo
        if (!appInfo || appInfo == null || appInfo == undefined || Object.keys(store.getters.appInfo).length == 0) {
            Notification.error({
                title: '',
                message: '未获取到获取应用信息'
            });
        } else {
            let deptId = await store.dispatch('getBsinDeptInfoByApp')
            await store.dispatch('getDeptInfoForVuex', deptId)
            next()
        }
        /*let userInformation = JSON.parse(window.localStorage.getItem("userInformation"))
        await store.dispatch('setUserInfo', userInformation)
        if (Object.keys(store.getters.deptInfo).length == 0) {
            await store.dispatch('getDeptInfoForVuex', userInformation.deptId)
            next()
        } else {
            next()
        }*/
    } catch (error) {
        this.$message.error('获取部门信息错误！')
    }
})
