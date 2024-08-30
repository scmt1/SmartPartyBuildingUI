import request from "@/utils/request";

const serviceName = 'TzTwoBestOneFirstTimeService'

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

export const getIsAddTime = (params) => {
    return request('/getIsAddTime', {
        serviceName: serviceName,
        methodName: 'getIsAddTime',
        bizParams: {
            ...params
        }
    })
}

export const getIsAuditTime = (params) => {
    return request('/getIsAuditTime', {
        serviceName: serviceName,
        methodName: 'getIsAuditTime',
        bizParams: {
            ...params
        }
    })
}

export const getAddTimeList = (params) => {
    return request('/getAddTimeList', {
        serviceName: serviceName,
        methodName: 'getAddTimeList',
        bizParams: {
            ...params
        }
    })
}

export const queryTimeByContent = (params) => {
    return request('/queryTimeByContent', {
        serviceName: serviceName,
        methodName: 'queryTimeByContent',
        bizParams: {
            ...params
        }
    })
}

