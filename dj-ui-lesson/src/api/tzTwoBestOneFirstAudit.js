import request from "@/utils/request";

const serviceName = 'TzTwoBestOneFirstAuditService'

export const getAuditListByTbofId = (id) => {
    return request('/getAuditListByTbofId', {
        serviceName: serviceName,
        methodName: 'getAuditListByTbofId',
        bizParams: {
            tbofId: id + ''
        }
    })
}

export const addAudit = (params) => {
    return request('/addAudit', {
        serviceName: serviceName,
        methodName: 'addAudit',
        bizParams: {
            ...params
        }
    })
}

