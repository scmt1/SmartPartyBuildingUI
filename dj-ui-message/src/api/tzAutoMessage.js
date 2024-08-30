import request from "@/utils/request";

const serviceName = 'TzMessageAutoService'



export const queryMessageAuto = (params) => {
    return request('/queryMessageAuto', {
        serviceName: serviceName,
        methodName: 'queryMessageAuto',
        bizParams: {
            ...params
        }
    })
}
export const queryMessageAutoById = (params) => {
    return request('/queryMessageAutoById', {
        serviceName: serviceName,
        methodName: 'queryMessageAutoById',
        bizParams: {
            ...params
        }
    })
}
export const updateMessageAutoById = (params) => {
    return request('/updateMessageAutoById', {
        serviceName: serviceName,
        methodName: 'updateMessageAutoById',
        bizParams: {
            ...params
        }
    })
}


export const getMessageAutoList = (params) => {
    return request('/getMessageAutoList', {
        serviceName: serviceName,
        methodName: 'getMessageAutoList',
        bizParams: {
            ...params
        }
    })
}

export const getMessageAutoPageByAdmin = (params) => {
    return request('/getMessageAutoPageByAdmin', {
        serviceName: serviceName,
        methodName: 'getMessageAutoPageByAdmin',
        bizParams: {
            ...params
        }
    })
}

export const queryMessageAutoByAdmin = (id) => {
    return request('/queryMessageAutoByAdmin', {
        serviceName: serviceName,
        methodName: 'queryMessageAutoByAdmin',
        bizParams: {
            id: id + ''
        }
    })
}

export const updateAutoMessageOpenStatus = (params) => {
    return request('/updateAutoMessageOpenStatus', {
        serviceName: serviceName,
        methodName: 'updateAutoMessageOpenStatus',
        bizParams: {
            ...params
        }
    })
}

export const queryBirthdayTemplate = (params) => {
    return request('/queryBirthdayTemplate', {
        serviceName: serviceName,
        methodName: 'queryBirthdayTemplate',
        bizParams: {
            ...params
        }
    })
}


