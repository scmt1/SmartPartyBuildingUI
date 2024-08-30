import request from "@/utils/request";

const serviceName = 'JcxfSysAreaService'

export const getAreaList = (params) => {
    return request('/getAreaList', {
        serviceName: serviceName,
        methodName: 'getAreaList',
        bizParams: {
            ...params
        }
    })
}
