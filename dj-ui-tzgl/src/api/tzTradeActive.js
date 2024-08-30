import request from "../utils/request";


const serviceName = 'TzTradeActiveService'
export const addTradeActive = (params) => {
    return request('/addTradeActive', {
        serviceName: serviceName,
        methodName: 'addTradeActive',
        bizParams: {
           ...params
        }
    })
}

export const queryTradeActiveList = (params) => {
    return request('/queryTradeActiveList', {
        serviceName: serviceName,
        methodName: 'queryTradeActiveList',
        bizParams: {
            ...params
        }
    })
}
export const getTradeActiveById = (params) => {
    return request('/getTradeActiveById', {
        serviceName: serviceName,
        methodName: 'getTradeActiveById',
        bizParams: {
            id:params
        }
    })
}
export const deleteTradeActive = (params) => {
    return request('/deleteTradeActive', {
        serviceName: serviceName,
        methodName: 'deleteTradeActive',
        bizParams: {
            ids: params
        }
    })
}
