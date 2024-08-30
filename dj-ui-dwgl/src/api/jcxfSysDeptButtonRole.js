import request from "@/utils/request";


const serviceName = 'JcxfSysDeptButtonRoleService'
export const getDeptButtonRoleByPage = (params) => {
    return request('/getDeptButtonRoleByPage', {
        serviceName: serviceName,
        methodName: 'getDeptButtonRoleByPage',
        bizParams: {
            ...params
        }
    })
}

export const updateDeptButtonRole = (params) => {
    return request('/updateDeptButtonRole', {
        serviceName: serviceName,
        methodName: 'updateDeptButtonRole',
        bizParams: {
            ...params
        }
    })
}

