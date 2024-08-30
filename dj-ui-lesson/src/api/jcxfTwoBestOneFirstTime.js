import request from "@/utils/request";

const serviceName = 'JcxfTwoBestOneFirstTimeService'

export const queryTzTwoBestOneFirstTimePage = (params) => {
    return request('/queryTzTwoBestOneFirstTimePage', {
        serviceName: serviceName,
        methodName: 'queryTzTwoBestOneFirstTimePage',
        bizParams: {
            ...params
        }
    })
}

export const addTzTwoBestOneFirstTime = (params) => {
    return request('/addTzTwoBestOneFirstTime', {
        serviceName: serviceName,
        methodName: 'addTzTwoBestOneFirstTime',
        bizParams: {
            ...params
        }
    })
}

export const updateTzTwoBestOneFirstTime = (params) => {
    return request('/updateTzTwoBestOneFirstTime', {
        serviceName: serviceName,
        methodName: 'updateTzTwoBestOneFirstTime',
        bizParams: {
            ...params
        }
    })
}

export const getTzTwoBestOneFirstTimeById = (id) => {
    return request('/getTzTwoBestOneFirstTimeById', {
        serviceName: serviceName,
        methodName: 'getTzTwoBestOneFirstTimeById',
        bizParams: {
            id: id + ''
        }
    })
}

export const deleteTzTwoBestOneFirstTimeById = (id) => {
    return request('/deleteTzTwoBestOneFirstTimeById', {
        serviceName: serviceName,
        methodName: 'deleteTzTwoBestOneFirstTimeById',
        bizParams: {
            id: id + ''
        }
    })
}

export const updateTimeStatusById = (params) => {
    return request('/updateTimeStatusById', {
        serviceName: serviceName,
        methodName: 'updateTimeStatusById',
        bizParams: {
            ...params
        }
    })
}

export const getIsAddTime = () => {
    return request('/getIsAddTime', {
        serviceName: serviceName,
        methodName: 'getIsAddTime',
        bizParams: {
        }
    })
}

export const getIsAuditTime = () => {
    return request('/getIsAuditTime', {
        serviceName: serviceName,
        methodName: 'getIsAuditTime',
        bizParams: {
        }
    })
}
