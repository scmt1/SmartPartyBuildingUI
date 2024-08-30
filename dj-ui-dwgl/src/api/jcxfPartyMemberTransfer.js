import request from "../utils/request";

const serviceName = 'JcxfPartyMemberTransferService'
export const queryPartyMemberDeptTransferLogList = (params) => {
    return request('/queryPartyMemberDeptTransferLogList', {
        serviceName: serviceName,
        methodName: 'queryPartyMemberDeptTransferLogList',
        bizParams: {
            ...params
        }
    })
}

export const addPartyMemberDeptTransfer = (params) => {
    return request('/addPartyMemberDeptTransfer', {
        serviceName: serviceName,
        methodName: 'addPartyMemberDeptTransfer',
        bizParams: {
            ...params
        }
    })
}

export const delPartyMemberDeptTransfer = (id) => {
    return request('/delPartyMemberDeptTransfer', {
        serviceName: serviceName,
        methodName: 'delPartyMemberDeptTransfer',
        bizParams: {
            id: id + ''
        }
    })
}

export const getPartyMemberDeptTransferById = (id) => {
    return request('/getPartyMemberDeptTransferById', {
        serviceName: serviceName,
        methodName: 'getPartyMemberDeptTransferById',
        bizParams: {
            id: id+''
        }
    })
}

export const updateTransferStatusById = (params) => {
    return request('/updateTransferStatusById', {
        serviceName: serviceName,
        methodName: 'updateTransferStatusById',
        bizParams: {
            ...params
        }
    })
}
