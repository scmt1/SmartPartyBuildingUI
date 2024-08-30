import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfSysAreaService'

export const getAreaList = (params) => {
    return request('/getAreaList', {
        serviceName: serviceName,
        methodName: 'getAreaList',
        bizParams: {
            ...params
        }
    })
}

export const getAreaTree = (params) => {
    return request('/getAreaTree', {
        serviceName: serviceName,
        methodName: 'getAreaTree',
        bizParams: {
            ...params
        }
    })
}


export const getAreaTreeAll = (params) => {
    return request('/getAreaTreeAll', {
        serviceName: serviceName,
        methodName: 'getAreaTreeAll',
        bizParams: {
            ...params
        }
    })
}


