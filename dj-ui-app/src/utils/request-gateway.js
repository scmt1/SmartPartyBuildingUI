// 请求封装
import {getLocalStorageInfo} from '@/utils/localStorageInfo'

// const baseURL = 'http://192.168.6.6:7097/gateway'
// const baseURL = 'http://192.168.6.88:7097/gateway'
//机关工委
// let baseURL = "http://101.206.141.236:7097/gateway";//旧版
// let baseURL = "http://10.4.117.31:7097/gateway";//新版
let baseURL = "/appApi";//新版
// 请求方法不需要token白名单
const methodNameWhiteList = [
    'jcetLogin',
    'sendVCode',
    'partyMemberLogin',
    'partyMemberLoginByCode',
    'wxLogin',
    'wxBindPhone',
    'sendBindVCode',
    'createJsapiSignature'
]
export const request = (url, options) => {
    let userInfo = getLocalStorageInfo('userInfo')
    let token = getLocalStorageInfo('token')

    /* if ((!userInfo || !token) && options.methodName != 'partyMemberLogin'&& options.methodName != 'partyMemberLoginByCode'&& options.methodName != 'sendVCode') {
        uni.navigateTo({
            url: "/pages/Home/Home"
        })
        return
    } */
    let pass = false
    if (methodNameWhiteList) {
        pass = methodNameWhiteList.some((item) => {
            if (typeof (item) === 'object' && item.pattern) {
                return item.pattern.test(options.methodName)
            }
            return options.methodName === item
        })
    }
    if (!pass && (!userInfo || !token)) {
        uni.navigateTo({
            url: "/pages/Home/Home"
        })
        return
    }
    // if ((!userInfo || !token) && options.methodName != 'jcetLogin') {
    //     uni.navigateTo({
    //         url: "/pages/Home/Home"
    //     })
    //     return
    // }
    // 判断一些
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token
    }

    let data = {
        serviceName: options?.serviceName,
        methodName: options?.methodName,
        bizParams: options?.bizParams
    }

    data.bizParams.tenantId = userInfo.tenantId

    return new Promise((resolve, reject) => {
        uni.showLoading({mask: true})
        uni.request({
            header: headers,
            url: `${baseURL}`,
            method: 'post',
            data,
            success: (res) => {
                const {data} = res
                const code = data.code
                if (code != '000000' && code != '222222' && code != '666666') {
                    uni.hideLoading()
                    uni.showToast({
                        icon: 'error',
                        title: data.message,
                        duration: 2000
                    })
                    return
                }
                uni.hideLoading()
                resolve(data.data)
            },
            fail: (fail) => {
                uni.hideLoading()
                uni.showToast({
                    icon: 'none',
                    title: '服务器响应失败!',
                    duration: 2000
                })
                reject(fail)
            },
            complete: () => {

            }
        })
    })
}
