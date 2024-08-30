import request from "../utils/request";



const serviceName = 'CqSysOrgService'


export const getTzSysOrgList = (params) => {
    return request('/getTzSysOrgList', {
        serviceName: serviceName,
        methodName: 'getTzSysOrgList',
        bizParams: {
            deptId: params
        }
    })
}

export const getTzSysOrg = (params) => {
    return request('/getTzSysOrg', {
        serviceName: serviceName,
        methodName: 'getTzSysOrg',
        bizParams: {
            id: String(params)
        }
    })
}
export const getOrgListByName = (params) => {
    return request('/getOrgListByName', {
        serviceName: serviceName,
        methodName: 'getOrgListByName',
        bizParams: {
            ...params
        }
    })
}
