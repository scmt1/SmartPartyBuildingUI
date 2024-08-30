import request from "@/utils/request";

const serviceName = 'TzExamService'
export const queryExamByPage = (params) => {
    return request('/queryExamByPage', {
        serviceName: serviceName,
        methodName: 'queryExamByPage',
        bizParams: {
            ...params
        }
    })
}


