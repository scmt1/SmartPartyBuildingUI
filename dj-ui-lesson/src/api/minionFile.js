import request from "@/utils/request";

const serviceName = 'SysFileService'

export const uploadFile = (params) => {
    return request('/uploadFile', {
        serviceName: serviceName,
        methodName: 'uploadFile',
        bizParams: {
            ...params,
        }
    })
}
