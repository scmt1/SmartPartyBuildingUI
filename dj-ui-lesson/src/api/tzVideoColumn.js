import request from "@/utils/request";

const serviceName = 'TzVideoColumnService'
export const queryAll = (params) => {
    return request('/queryAll', {
        serviceName: serviceName,
        methodName: 'queryAll',
        bizParams: {
            ...params
        }
    })
}

export const queryVideoColumnByPage = (params) => {
    return request('/queryVideoColumnByPage', {
        serviceName: serviceName,
        methodName: 'queryVideoColumnByPage',
        bizParams: {
            ...params
        }
    })
}

export const addVideoColumn = (params) => {
    return request('/addVideoColumn', {
        serviceName: serviceName,
        methodName: 'addVideoColumn',
        bizParams: {
            ...params
        }
    })
}

export const getVideoColumn = (params) => {
    return request('/getVideoColumn', {
        serviceName: serviceName,
        methodName: 'getVideoColumn',
        bizParams: {
            id: params+''
        }
    })
}

export const deleteVideoColumn = (params) => {
    return request('/deleteVideoColumn', {
        serviceName: serviceName,
        methodName: 'deleteVideoColumn',
        bizParams: {
            id: params +''
        }
    })
}
