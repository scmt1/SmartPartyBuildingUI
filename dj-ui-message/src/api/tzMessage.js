import request from "@/utils/request";

const serviceName = 'TzMessageService'



export const sendMessage = (params) => {
    return request('/sendMessage', {
        serviceName: serviceName,
        methodName: 'sendMessage',
        bizParams: {
            data:params
        }
    })
}
export const sendTemplateMessage = (params) => {
    return request('/sendTemplateMessage', {
        serviceName: serviceName,
        methodName: 'sendTemplateMessage',
        bizParams: {
            data:params
        }
    })
}
export const queryMessage = (params) => {
    return request('/queryMessage', {
        serviceName: serviceName,
        methodName: 'queryMessage',
        bizParams: {
            data:params
        }
    })
}
export const queryMessageTemplate = (params) => {
    return request('/queryMessageTemplate', {
        serviceName: serviceName,
        methodName: 'queryMessageTemplate',
        bizParams: {
            data:params
        }
    })
}
export const queryMessageDetail = (params) => {
    return request('/queryMessageDetail', {
        serviceName: serviceName,
        methodName: 'queryMessageDetail',
        bizParams: {
            data:params
        }
    })
}
export const recallSend = (params) => {
    return request('/recallSend', {
        serviceName: serviceName,
        methodName: 'recallSend',
        bizParams: {
            data:params
        }
    })
}


export const baseInfo = (params) => {
    return request('/baseInfo', {
        serviceName: serviceName,
        methodName: 'baseInfo',
        bizParams: {
            ...params
        }
    })
}
export const baseInfoByToday = (params) => {
    return request('/baseInfoByToday', {
        serviceName: serviceName,
        methodName: 'baseInfoByToday',
        bizParams: {
            ...params
        }
    })
}

export const recentlySendCount = () => {
    return request('/recentlySendCount', {
        serviceName: serviceName,
        methodName: 'recentlySendCount',
        bizParams: {}
    })
}

export const recentlySuccessRate = (params) => {
    return request('/recentlySuccessRate', {
        serviceName: serviceName,
        methodName: 'recentlySuccessRate',
        bizParams: {
            ...params
        }
    })
}

export const queryBirthdayMessageDetail = (params) => {
    return request('/queryBirthdayMessageDetail', {
        serviceName: serviceName,
        methodName: 'queryBirthdayMessageDetail',
        bizParams: {
            data:params
        }
    })
}
