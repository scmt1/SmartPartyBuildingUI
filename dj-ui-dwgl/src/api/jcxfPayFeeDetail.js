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

export const queryAllTzPayFeeDetailList = (params) => {
    return request('/queryAllTzPayFeeDetailList', {
        serviceName: serviceName,
        methodName: 'queryAllTzPayFeeDetailList',
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
export const downloadTzPayFeeDetailList = (params) => {
    return request('/downloadTzPayFeeDetailList', {
        serviceName: serviceName,
        methodName: 'downloadTzPayFeeDetailList',
        bizParams: {
            ...params
        }
    })
}

export const getPayFeeDetailPersonList = (params) => {
    return request('/getPayFeeDetailPersonList', {
        serviceName: serviceName,
        methodName: 'getPayFeeDetailPersonList',
        bizParams: {
            ...params
        }
    })
}
export const getShouldPayData = (params) => {
    return request('/getShouldPayData', {
        serviceName: serviceName,
        methodName: 'getShouldPayData',
        bizParams: {
            ...params
        }
    })
}
export const updatePayFeeDetailByBatchMonth = (params) => {
    return request('/updatePayFeeDetailByBatchMonth', {
        serviceName: serviceName,
        methodName: 'updatePayFeeDetailByBatchMonth',
        bizParams: {
            ...params
        }
    })
}
export const queryPayFeeDetailByPerson = (params) => {
    return request('/queryPayFeeDetailByPerson', {
        serviceName: serviceName,
        methodName: 'queryPayFeeDetailByPerson',
        bizParams: {
            ...params
        }
    })
}
export const addPartMemberToPayFee = (params) => {
    return request('/addPartMemberToPayFee', {
        serviceName: serviceName,
        methodName: 'addPartMemberToPayFee',
        bizParams: {
            ...params
        }
    })
}
export const queryPartMemberRePayData = (params) => {
    return request('/queryPartMemberRePayData', {
        serviceName: serviceName,
        methodName: 'queryPartMemberRePayData',
        bizParams: {
            ...params
        }
    })
}
export const updateRePayFeeDetail = (params) => {
    return request('/updateRePayFeeDetail', {
        serviceName: serviceName,
        methodName: 'updateRePayFeeDetail',
        bizParams: {
            ...params
        }
    })
}
export const queryPartMemberDeleteData = (params) => {
    return request('/queryPartMemberDeleteData', {
        serviceName: serviceName,
        methodName: 'queryPartMemberDeleteData',
        bizParams: {
            ...params
        }
    })
}
export const importPayFeeStandard = (params) => {
    return request('/importPayFeeStandard', {
        serviceName: serviceName,
        methodName: 'importPayFeeStandard',
        bizParams: {
            ...params
        }
    })
}
export const exportPayFeeDetailPersonList = (params) => {
    return request('/exportPayFeeDetailPersonList', {
        serviceName: serviceName,
        methodName: 'exportPayFeeDetailPersonList',
        bizParams: {
            ...params
        }
    })
}
export const queryPartyMemberListByDeptId = (params) => {
    return request('/queryPartyMemberListByDeptId', {
        serviceName: serviceName,
        methodName: 'queryPartyMemberListByDeptId',
        bizParams: {
            ...params
        }
    })
}

export const getPayFeeStatistics = (params) => {
    return request('/getPayFeeStatistics', {
        serviceName: serviceName,
        methodName: 'getPayFeeStatistics',
        bizParams: {
            ...params
        }
    })
}