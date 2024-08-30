import request from "../utils/request";


const serviceName = 'TzUnitedDeptService'
export const getParentDeptById = (params) => {
    return request('/getParentDeptById', {
        serviceName: serviceName,
        methodName: 'getParentDeptById',
        bizParams: {
           id: params +''
        }
    })
}

export const getParentDeptByDeptId = (params) => {
    return request('/getParentDeptByDeptId', {
        serviceName: serviceName,
        methodName: 'getParentDeptByDeptId',
        bizParams: {
            deptId: params +''
        }
    })
}

export const getUnitedDeptList = (params) => {
    return request('/getUnitedDeptList', {
        serviceName: serviceName,
        methodName: 'getUnitedDeptList',
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
export const getUnitedDept = (params) => {
    return request('/getUnitedDept', {
        serviceName: serviceName,
        methodName: 'getUnitedDept',
        bizParams: {
            id:params
        }
    })
}

export const addUnitedDept = (params) => {
    return request('/addUnitedDept', {
        serviceName: serviceName,
        methodName: 'addUnitedDept',
        bizParams: {
            ...params
        }
    })
}


export const deleteUnitedDept = (params) => {
    return request('/deleteUnitedDept', {
        serviceName: serviceName,
        methodName: 'deleteUnitedDept',
        bizParams: {
            id: params + ''
        }
    })
}

export const getUnitedDeptByName = (params) => {
    return request('/getUnitedDeptByName', {
        serviceName: serviceName,
        methodName: 'getUnitedDeptByName',
        bizParams: {
            ...params
        }
    })
}

