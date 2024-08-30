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

export const getBaseCount = (params) => {
    return request('/getBaseCount', {
        serviceName: serviceName,
        methodName: 'getBaseCount',
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
export const updateDevelopPartyMember = (params) => {
    return request('/updateDevelopPartyMember', {
        serviceName: serviceName,
        methodName: 'updateDevelopPartyMember',
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
export const getDevelopPartyListByPartyMemberId = (partyMemberId) => {
    return request('/getDevelopPartyListByPartyMemberId', {
        serviceName: serviceName,
        methodName: 'getDevelopPartyListByPartyMemberId',
        bizParams: {
            partyMemberId: partyMemberId
        }
    })
}
