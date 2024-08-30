import request from "@/utils/request";

const serviceName = 'TzStudyUserService'

export const getTzStudyUserListByPage = (params) => {
    return request('/getTzStudyUserListByPage', {
        serviceName: serviceName,
        methodName: 'getTzStudyUserListByPage',
        bizParams: {
            ...params
        }
    })
}

export const getTzStudyUserList = (id) => {
    return request('/getTzStudyUserList', {
        serviceName: serviceName,
        methodName: 'getTzStudyUserList',
        bizParams: {
            id: id+''
        }
    })
}

