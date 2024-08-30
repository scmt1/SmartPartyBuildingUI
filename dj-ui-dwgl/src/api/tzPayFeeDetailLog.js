import request from "@/utils/request";

const serviceName = 'TzPayFeeDetailLogService'

export const queryTzPayFeeDetailLogPage = (data) => {
    return request('/queryTzPayFeeDetailLogPage', {
        serviceName: serviceName,
        methodName: 'queryTzPayFeeDetailLogPage',
        bizParams: {
            ...data
        }
    })
}
