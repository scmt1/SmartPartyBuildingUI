import request from '../utils/request';

const serviceName = 'TzPayFeeDetailService'

export const queryTzPayFeeDetailList = (params) => {
    return request('/queryTzPayFeeDetailList', {
        serviceName: serviceName,
        methodName: 'queryTzPayFeeDetailList',
        bizParams: {
            ...params
        }
    })
}

export const importPayFee = (params) => {
    return request('/importPayFee', {
        serviceName: serviceName,
        methodName: 'importPayFee',
        bizParams: {
            ...params
        }
    })
}
