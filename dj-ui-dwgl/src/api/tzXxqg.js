import request from "@/utils/request";

const serviceName = 'TzXxqgService'

export const downTemplate = (params) => {
    return request('/downTemplate', {
        serviceName: serviceName,
        methodName: 'downTemplate',
        bizParams: {
            ids: params
        },
        responseType: 'blob' // 增加responseType字段
    })
}

export const queryByPage = (params) => {
    return request('/queryByPage', {
        serviceName: serviceName,
        methodName: 'queryByPage',
        bizParams: {
            ...params
        }
    })
}

export const addXxqgList = (data) => {
    return request('/addXxqgList', {
        serviceName: serviceName,
        methodName: 'addXxqgList',
        bizParams: {
            ...data
        }
    })
}
// export const downTemplate = (params) => {
//     return request('/xxx', {
//         serviceName: serviceName,
//         methodName: 'xxx',
//         bizParams: {
//             ids: params
//         },
//         responseType: 'blob'
//     })
// }
