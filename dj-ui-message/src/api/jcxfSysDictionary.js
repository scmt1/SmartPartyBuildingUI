import request from "../utils/request";


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
