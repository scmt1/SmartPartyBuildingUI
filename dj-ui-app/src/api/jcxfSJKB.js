import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfSJKBService'

export const partMeeting = (params) => {
    return request('/partMeeting', {
        serviceName: serviceName,
        methodName: 'partMeeting',
        bizParams: {
            ...params
        }
    })
}

export const theoryMetting = (params) => {
    return request('/theoryMetting', {
        serviceName: serviceName,
        methodName: 'theoryMetting',
        bizParams: {
            ...params
        }
    })
}

export const qtpartMeeting = (params) => {
    return request('/qtpartMeeting', {
        serviceName: serviceName,
        methodName: 'qtpartMeeting',
        bizParams: {
            ...params
        }
    })
}

export const qttheoryMetting = (params) => {
    return request('/qttheoryMetting', {
        serviceName: serviceName,
        methodName: 'qttheoryMetting',
        bizParams: {
            ...params
        }
    })
}

export const getLifeDetailByDept = (params) => {
    return request('/getLifeDetailByDept', {
        serviceName: serviceName,
        methodName: 'getLifeDetailByDept',
        bizParams: {
            ...params
        }
    })
}