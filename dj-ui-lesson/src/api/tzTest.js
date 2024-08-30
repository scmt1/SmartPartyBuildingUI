import request from "@/utils/request";

const serviceName = 'TzTestService'
export const addTest = (params) => {
    return request('/addTest', {
        serviceName: serviceName,
        methodName: 'addTest',
        bizParams: {
            ...params
        }
    })
}
export const queryTestByPage = (params) => {
    return request('/queryTestByPage', {
        serviceName: serviceName,
        methodName: 'queryTestByPage',
        bizParams: {
            ...params
        }
    })
}
export const findTestById = (params) => {
    return request('/findTestById', {
        serviceName: serviceName,
        methodName: 'findTestById',
        bizParams: {
            ...params
        }
    })
}
export const findTestByQuestionId = (params) => {
    return request('/findTestByQuestionId', {
        serviceName: serviceName,
        methodName: 'findTestByQuestionId',
        bizParams: {
            ...params
        }
    })
}

