import request from "@/utils/request";

const serviceName = 'TzVoteUserService'

export const queryTzVoteUserListByPage = (params) => {
    return request('/queryTzVoteUserListByPage', {
        serviceName: serviceName,
        methodName: 'queryTzVoteUserListByPage',
        bizParams: {
            ...params
        }
    })
}
