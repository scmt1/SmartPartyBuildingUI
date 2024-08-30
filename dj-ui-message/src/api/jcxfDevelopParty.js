import request from "@/utils/request";

const serviceName = 'JcxfDevelopPartyService'
export const queryDevelopPartyList = (params) => {
    return request('/queryDevelopPartyList', {
        serviceName: serviceName,
        methodName: 'queryDevelopPartyList',
        bizParams: {
            ...params
        }
    })
}

export const deleteDevelopParty = (params) => {
    return request('/deleteDevelopParty', {
        serviceName: serviceName,
        methodName: 'deleteDevelopParty',
        bizParams: {
            ids: params
        }
    })
}

export const addDevelopPartyMember = (params) => {
    return request('/addDevelopPartyMember', {
        serviceName: serviceName,
        methodName: 'addDevelopPartyMember',
        bizParams: {
            ...params
        }
    })
}


export const getDevelopParty = (params) => {
    return request('/getDevelopParty', {
        serviceName: serviceName,
        methodName: 'getDevelopParty',
        bizParams: {
            id: params
        }
    })
}
