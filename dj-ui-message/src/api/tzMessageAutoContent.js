import request from "@/utils/request";


const serviceName = 'TzMessageAutoContentService'
export const editAutoContent = (params) => {
    return request('/editAutoContent', {
        serviceName: serviceName,
        methodName: 'editAutoContent',
        bizParams: {
            ...params
        }
    })
}
