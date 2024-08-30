import request from "@/utils/request";

const serviceName = 'JcxfTermDeptService'
export const deleteTzTermDept = (params) => {
    return request('/deleteTzTermDept', {
        serviceName: serviceName,
        methodName: 'deleteTzTermDept',
        bizParams: {
            ids: params
        }
    })
}

export const queryTzTermDeptList = (params) => {
    return request('/queryTzTermDeptList', {
        serviceName: serviceName,
        methodName: 'queryTzTermDeptList',
        bizParams: {
            ...params
        }
    })
}

export const addTzTermDept = (params) => {
    return request('/addTzTermDept', {
        serviceName: serviceName,
        methodName: 'addTzTermDept',
        bizParams: {
            ...params
        }
    })
}

export const getTzTermDept = (params) => {
    return request('/getTzTermDept', {
        serviceName: serviceName,
        methodName: 'getTzTermDept',
        bizParams: {
            id: params+''
        }
    })
}

export const queryTzTermDeptByDeptPage = (params) => {
    return request('/queryTzTermDeptByDeptPage', {
        serviceName: serviceName,
        methodName: 'queryTzTermDeptByDeptPage',
        bizParams: {
            ...params
        }
    })
}

export const getTzTermStatistics = (id) => {
    return request('/getTzTermStatistics', {
        serviceName: serviceName,
        methodName: 'getTzTermStatistics',
        bizParams: {
            deptId: id + ''
        }
    })
}

