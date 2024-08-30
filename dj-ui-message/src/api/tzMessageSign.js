import request from "@/utils/request";

const serviceName = 'TzMessageSignService'

export const saveMessageSign = (params) => {
    return request('/saveMessageSign', {
        serviceName: serviceName,
        methodName: 'saveMessageSign',
        bizParams: {
            data: params
        }
    })
}


export const deleteMessageSign = (id) => {
    return request('/deleteMessageSign', {
        serviceName: serviceName,
        methodName: 'deleteMessageSign',
        bizParams: {
            id: id+''
        }
    })
}
export const updateMessageSign = (params) => {
    return request('/updateMessageSign', {
        serviceName: serviceName,
        methodName: 'updateMessageSign',
        bizParams: {
            data: params
        }
    })
}


export const getMessageSign = (id) => {
    return request('/getMessageSign', {
        serviceName: serviceName,
        methodName: 'getMessageSign',
        bizParams: {
            id: id+''
        }
    })
}
export const queryMessageSign = (params) => {
    return request('/queryMessageSign', {
        serviceName: serviceName,
        methodName: 'queryMessageSign',
        bizParams: {
            data: params
        }
    })
}
export const queryMessageSignList = (params) => {
    return request('/queryMessageSignList', {
        serviceName: serviceName,
        methodName: 'queryMessageSignList',
        bizParams: {
            data: params
        }
    })
}