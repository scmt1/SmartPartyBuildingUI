import request from "../utils/request";


const serviceName = 'TzTeamActiveService'
export const addTeamActive = (params) => {
    return request('/addTeamActive', {
        serviceName: serviceName,
        methodName: 'addTeamActive',
        bizParams: {
           ...params
        }
    })
}

export const queryTeamActiveList = (params) => {
    return request('/queryTeamActiveList', {
        serviceName: serviceName,
        methodName: 'queryTeamActiveList',
        bizParams: {
            ...params
        }
    })
}
export const getTeamActiveById = (params) => {
    return request('/getTeamActiveById', {
        serviceName: serviceName,
        methodName: 'getTeamActiveById',
        bizParams: {
            id:params + ''
        }
    })
}
export const deleteTeamActive = (params) => {
    return request('/deleteTeamActive', {
        serviceName: serviceName,
        methodName: 'deleteTeamActive',
        bizParams: {
            ids: params
        }
    })
}
