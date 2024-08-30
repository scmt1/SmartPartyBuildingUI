import request from "@/utils/request";

const serviceName = 'TzQuestionBankService'
export const addQuestionBank = (params) => {
    return request('/addQuestionBank', {
        serviceName: serviceName,
        methodName: 'addQuestionBank',
        bizParams: {
            ...params
        }
    })
}
export const findAllBankBy = (params) => {
    return request('/findAllBankBy', {
        serviceName: serviceName,
        methodName: 'findAllBankBy',
        bizParams: {
            ...params
        }
    })
}
export const queryQuestionBankByPage = (params) => {
    return request('/queryQuestionBankByPage', {
        serviceName: serviceName,
        methodName: 'queryQuestionBankByPage',
        bizParams: {
            ...params
        }
    })
}
export const findQuestionBankById = (params) => {
    return request('/findQuestionBankById', {
        serviceName: serviceName,
        methodName: 'findQuestionBankById',
        bizParams: {
            ...params
        }
    })
}

export const deleteQuestionBank = (params) => {
    return request('/deleteQuestionBank', {
        serviceName: serviceName,
        methodName: 'deleteQuestionBank',
        bizParams: {
            ids:params
        }
    })
}

