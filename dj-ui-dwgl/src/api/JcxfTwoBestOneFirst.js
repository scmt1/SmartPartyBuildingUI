import request from "@/utils/request";

const serviceName = 'JcxfTwoBestOneFirstService'

export const queryTzTwoBestOneFirstPage = (params) => {
    return request('/queryTzTwoBestOneFirstPage', {
        serviceName: serviceName,
        methodName: 'queryTzTwoBestOneFirstPage',
        bizParams: {
            ...params
        }
    })
}

export const getTzTwoBestOneFirstById = (id) => {
    return request('/getTzTwoBestOneFirstById', {
        serviceName: serviceName,
        methodName: 'getTzTwoBestOneFirstById',
        bizParams: {
            id: id+''
        }
    })
}

export const deleteTzTwoBestOneFirstById = (id) => {
    return request('/deleteTzTwoBestOneFirstById', {
        serviceName: serviceName,
        methodName: 'deleteTzTwoBestOneFirstById',
        bizParams: {
            id: id+''
        }
    })
}

export const auditTzTwoBestOneFirstById = (params) => {
    return request('/deleteTzTwoBestOneFirstById', {
        serviceName: serviceName,
        methodName: 'deleteTzTwoBestOneFirstById',
        bizParams: {
            ...params
        }
    })
}

export const addTzTwoBestOneFirst = (params) => {
    return request('/addTzTwoBestOneFirst', {
        serviceName: serviceName,
        methodName: 'addTzTwoBestOneFirst',
        bizParams: {
            ...params
        }
    })
}

export const updateTzTwoBestOneFirstById = (params) => {
    return request('/updateTzTwoBestOneFirstById', {
        serviceName: serviceName,
        methodName: 'updateTzTwoBestOneFirstById',
        bizParams: {
            ...params
        }
    })
}

export const getTzTwoBestOneFirstListByPartyMemberId = (params) => {
    return request('/getTzTwoBestOneFirstListByPartyMemberId', {
        serviceName: serviceName,
        methodName: 'getTzTwoBestOneFirstListByPartyMemberId',
        bizParams: {
            ...params
        }
    })
}
