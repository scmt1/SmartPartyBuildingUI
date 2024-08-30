import request from "../utils/request";


const serviceName = 'TzTradeUnionService'
export const getParentDeptById = (id) => {
    return request('/getParentDeptById', {
        serviceName: serviceName,
        methodName: 'getParentDeptById',
        bizParams: {
           id: id + ''
        }
    })
}

export const getParentDeptByDeptId = (id) => {
    return request('/getParentDeptByDeptId', {
        serviceName: serviceName,
        methodName: 'getParentDeptByDeptId',
        bizParams: {
            deptId: id + ''
        }
    })
}


export const getTradeUnionDeptByName = (params) => {
    return request('/getTradeUnionDeptByName', {
        serviceName: serviceName,
        methodName: 'getTradeUnionDeptByName',
        bizParams: {
            ...params
        }
    })
}

export const getTradeUnionDeptList = (params) => {
    return request('/getTradeUnionDeptList', {
        serviceName: serviceName,
        methodName: 'getTradeUnionDeptList',
        bizParams: {
            ...params
        }
    })
}



export const determineNode = (params) => {
    return request('/determineNode', {
        serviceName: serviceName,
        methodName: 'determineNode',
        bizParams: {
            ...params
        }
    })
}
export const getTradeUnion = (params) => {
    return request('/getTradeUnion', {
        serviceName: serviceName,
        methodName: 'getTradeUnion',
        bizParams: {
            id:params +''
        }
    })
}

export const addTradeUnion = (params) => {
    return request('/addTradeUnion', {
        serviceName: serviceName,
        methodName: 'addTradeUnion',
        bizParams: {
            ...params
        }
    })
}


export const deleteTrade = (params) => {
    return request('/deleteTrade', {
        serviceName: serviceName,
        methodName: 'deleteTrade',
        bizParams: {
            id: params + ''
        }
    })
}
