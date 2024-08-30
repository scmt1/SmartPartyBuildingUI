import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfSysDictionaryService'

export const getDictByCode = (params) => {
    return request('/getDictByCode', {
        serviceName: serviceName,
        methodName: 'getDictByCode',
        bizParams: {
            code: params+''
        }
    })
}
