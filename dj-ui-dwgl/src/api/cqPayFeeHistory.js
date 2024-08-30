import request from "../utils/request";



const serviceName = 'CqPayFeeHistoryService'


export const getPayFeeHistoryList = (params) => {
    return request('/getPayFeeHistoryList', {
        serviceName: serviceName,
        methodName: 'getPayFeeHistoryList',
        bizParams: {
            ...params
        }
    })
}
