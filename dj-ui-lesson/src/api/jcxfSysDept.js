import request from "../utils/request";


const serviceName = 'JcxfSysDeptService'
export const queryTzSysDeptList = (params) => {
    return request('/queryTzSysDeptList', {
        serviceName: serviceName,
        methodName: 'queryTzSysDeptList',
        bizParams: {
           ...params
        }
    })
}

export const getBaseInfoById = (params) => {
    return request('/getBaseInfoById', {
        serviceName: serviceName,
        methodName: 'getBaseInfoById',
        bizParams: {
            id: params+''
        }
    })
}

export const deleteTzSysDept = (params) => {
    return request('/deleteTzSysDept', {
        serviceName: serviceName,
        methodName: 'deleteTzSysDept',
        bizParams: {
            id: params
        }
    })
}

// 机构岗位tree
export const getTzSysDeptNameList = (params) => {
    return request('/getTzSysDeptNameList', {
        serviceName: serviceName,
        methodName: 'getTzSysDeptNameList',
        bizParams: {
            deptId: params+''
        }
    })
}

// 部门getTzSysDeptList
export const getTzSysDeptList = (params) => {
    return request('/getTzSysDeptList', {
        serviceName: serviceName,
        methodName: 'getTzSysDeptList',
        bizParams: {
            deptId: params+''
        }
    })
}

export const getTzSysDept = (params) => {
    return request('/getTzSysDept', {
        serviceName: serviceName,
        methodName: 'getTzSysDept',
        bizParams: {
            id: params+'',
        }
    })
}

export const addTzSysDept = (params) => {
    return request('/addTzSysDept', {
        serviceName: serviceName,
        methodName: 'addTzSysDept',
        bizParams: {
            ...params
        }
    })
}

export const exportProvinceByIds = (params) => {
    return request('/exportProvinceByIds', {
        serviceName: serviceName,
        methodName: 'exportProvinceByIds',
        bizParams: {
            ids: params
        }
    })
}

export const getDeptIntroduceById = (params) => {
    return request('/getDeptIntroduceById', {
        serviceName: serviceName,
        methodName: 'getDeptIntroduceById',
        bizParams: {
            id: params+''
        }
    })
}

export const addActiveInfo = (params) => {
    return request('/addActiveInfo', {
        serviceName: serviceName,
        methodName: 'addActiveInfo',
        bizParams: {
            ...params
        }
    })
}

export const getActiveDept = (params) => {
    return request('/getActiveDept', {
        serviceName: serviceName,
        methodName: 'getActiveDept',
        bizParams: {
            id: params+''
        }
    })
}

export const getChildrenDeptListByName = (params) => {
    return request('/getChildrenDeptListByName', {
        serviceName: serviceName,
        methodName: 'getChildrenDeptListByName',
        bizParams: {
            ...params
        }
    })
}

export const getAllDeptListByName = (params) => {
    return request('/getAllDeptListByName', {
        serviceName: serviceName,
        methodName: 'getAllDeptListByName',
        bizParams: {
            ...params
        }
    })
}

export const getSameClassDeptListByDeptId = (params) => {
    return request('/getSameClassDeptListByDeptId', {
        serviceName: serviceName,
        methodName: 'getSameClassDeptListByDeptId',
        bizParams: {
            deptId: params+''
        }
    })
}

export const queryIsLeafById = (params) => {
    return request('/queryIsLeafById', {
        serviceName: serviceName,
        methodName: 'queryIsLeafById',
        bizParams: {
            deptId: params+'',
        }
    })
}

export const updateDeptTag = (params) => {
    return request('/updateDeptTag', {
        serviceName: serviceName,
        methodName: 'updateDeptTag',
        bizParams: {
            ...params
        }
    })
}
