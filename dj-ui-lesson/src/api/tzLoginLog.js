import request from "@/utils/request";

const serviceName = 'TzLoginLogService'

export const queryLoginLogByPage = (data) => {
    return request('/queryLoginLogByPage', {
        serviceName: serviceName,
        methodName: 'queryLoginLogByPage',
        bizParams: {
            ...data
        }
    })
}
