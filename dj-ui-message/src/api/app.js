import request from "@/utils/request";

const serviceName = 'AppService'

export const getDeptByApp = (params) => {
    return request('/getDeptByApp', {
        serviceName: serviceName,
        methodName: 'getDeptByApp',
        bizParams: {
            ...params
        }
    })
}
