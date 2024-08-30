import request from "../utils/request";



const serviceName = 'TzTeamService'
export const queryTeamByDeptId = (params) => {
    return request('/queryTeamByDeptId', {
        serviceName: serviceName,
        methodName: 'queryTeamByDeptId',
        bizParams: {
            deptId:params
        }
    })
}

export const addTeam = (params) => {
    return request('/addTeam', {
        serviceName: serviceName,
        methodName: 'addTeam',
        bizParams: {
            ...params
        }
    })
}

