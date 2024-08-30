import request from "@/utils/request";

const serviceName = 'TzUserTagService'

export const addCustomUserTag = (params) => {
    return request('/addCustomUserTag', {
        serviceName: serviceName,
        methodName: 'addCustomUserTag',
        bizParams: {
            data: params
        }
    })
}


export const deleteCustomUserTag = (params) => {
    return request('/deleteCustomUserTag', {
        serviceName: serviceName,
        methodName: 'deleteCustomUserTag',
        bizParams: {
            data: params
        }
    })
}
export const queryCustomUserTag = (params) => {
    return request('/queryCustomUserTag', {
        serviceName: serviceName,
        methodName: 'queryCustomUserTag',
        bizParams: {
            data: params
        }
    })
}


export const getCustomUserTag = (params) => {
    return request('/getCustomUserTag', {
        serviceName: serviceName,
        methodName: 'getCustomUserTag',
        bizParams: {
            data: params
        }
    })
}
