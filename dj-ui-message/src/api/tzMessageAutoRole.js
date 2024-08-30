import request from "@/utils/request";


const serviceName = 'TzMessageAutoRoleService'
export const getDeptAutoMessageRoleByPage = (params) => {
    return request('/getDeptAutoMessageRoleByPage', {
        serviceName: serviceName,
        methodName: 'getDeptAutoMessageRoleByPage',
        bizParams: {
            ...params
        }
    })
}

export const updateDeptAutoMessageRole = (params) => {
    return request('/updateDeptAutoMessageRole', {
        serviceName: serviceName,
        methodName: 'updateDeptAutoMessageRole',
        bizParams: {
            ...params
        }
    })
}

export const getAutoMessageRoleByDeptId = (params) => {
    return request('/getAutoMessageRoleByDeptId', {
        serviceName: serviceName,
        methodName: 'getAutoMessageRoleByDeptId',
        bizParams: {
            ...params
        }
    })
}

export const updateAutoMessageRoleStatus = (params) => {
    return request('/updateAutoMessageRoleStatus', {
        serviceName: serviceName,
        methodName: 'updateAutoMessageRoleStatus',
        bizParams: {
            ...params
        }
    })
}
