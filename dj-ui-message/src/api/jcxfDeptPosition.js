import request from "@/utils/request";

const serviceName = 'JcxfDeptPositionService'

export const getJcxfDeptPositionByDeptId = (params) => {
    return request('/getJcxfDeptPositionByDeptId', {
        serviceName: serviceName,
        methodName: 'getJcxfDeptPositionByDeptId',
        bizParams: {
            deptId: params+''
        }
    })
}

export const addOrUpdateJcxfDeptPosition = (params) => {
    return request('/addOrUpdateJcxfDeptPosition', {
        serviceName: serviceName,
        methodName: 'addOrUpdateJcxfDeptPosition',
        bizParams: {
            ...params
        }
    })
}
