import request from "@/utils/request";

const serviceName = 'TzVoteDetailService'

export const queryTzVoteDetailListByPage = (params) => {
    return request('/queryTzVoteDetailListByPage', {
        serviceName: serviceName,
        methodName: 'queryTzVoteDetailListByPage',
        bizParams: {
            ...params
        }
    })
}

export const queryTzVoteDetailById = (params) => {
    return request('/queryTzVoteDetailById', {
        serviceName: serviceName,
        methodName: 'queryTzVoteDetailById',
        bizParams: {
            ...params
        }
    })
}

export const getVoteDetailInfoById = (params) => {
    return request('/getVoteDetailInfoById', {
        serviceName: serviceName,
        methodName: 'getVoteDetailInfoById',
        bizParams: {
            id: params+''
        }
    })
}

export const addVoteDetail = (params) => {
    return request('/addVoteDetail', {
        serviceName: serviceName,
        methodName: 'addVoteDetail',
        bizParams: {
            ...params
        }
    })
}

export const editVoteDetail = (params) => {
    return request('/editVoteDetail', {
        serviceName: serviceName,
        methodName: 'editVoteDetail',
        bizParams: {
            ...params
        }
    })
}

export const editVoteDetailStatus = (params) => {
    return request('/editVoteDetailStatus', {
        serviceName: serviceName,
        methodName: 'editVoteDetailStatus',
        bizParams: {
            ...params
        }
    })
}

export const deleteVoteDetail = (id) => {
    return request('/deleteVoteDetail', {
        serviceName: serviceName,
        methodName: 'deleteVoteDetail',
        bizParams: {
            id: id+''
        }
    })
}

