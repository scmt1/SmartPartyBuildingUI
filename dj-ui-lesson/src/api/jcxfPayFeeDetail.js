import request from '../utils/request';

const serviceName = 'JcxfPayFeeDetailService'

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

export const importPayFeeVerify = (params) => {
    return request('/importPayFeeVerify', {
        serviceName: serviceName,
        methodName: 'importPayFeeVerify',
        bizParams: {
            ...params
        }
    })
}

export const getPayFeeDetailById = (id) => {
    return request('/getPayFeeDetailById', {
        serviceName: serviceName,
        methodName: 'getPayFeeDetailById',
        bizParams: {
            id: id + ''
        }
    })
}

export const updatePayFeeDetail = (params) => {
    return request('/updatePayFeeDetail', {
        serviceName: serviceName,
        methodName: 'updatePayFeeDetail',
        bizParams: {
            ...params
        }
    })
}
