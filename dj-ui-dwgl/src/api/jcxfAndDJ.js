import request from "@/utils/request";

const serviceName = 'JcxfAndDjService'

export const resetAllMemberPassword = () => {
    return request('/resetAllMemberPassword', {
        serviceName: serviceName,
        methodName: 'resetAllMemberPassword',
        bizParams: {

        }
    })
}
