import request from "@/utils/request";

const serviceName = 'JcxfPartyFloatingMemberService'

export const flowOutPartyMemberList = (params) => {
    return request('/flowOutPartyMemberList', {
        serviceName: serviceName,
        methodName: 'flowOutPartyMemberList',
        bizParams: {
            ...params
        }
    })
}
export const getPartyFloatingListByPartyMemberId = (partyMemberId) => {
    return request('/getPartyFloatingListByPartyMemberId', {
        serviceName: serviceName,
        methodName: 'getPartyFloatingListByPartyMemberId',
        bizParams: {
            partyMemberId:partyMemberId
        }
    })
}

export const getPartyFloatingById = (params) => {
    return request('/getPartyFloatingById', {
        serviceName: serviceName,
        methodName: 'getPartyFloatingById',
        bizParams: {
            id: params+''
        }
    })
}

export const addFloatingMember = (params) => {
    return request('/addFloatingMember', {
        serviceName: serviceName,
        methodName: 'addFloatingMember',
        bizParams: {
            ...params
        }
    })
}


export const updateFloatingMember = (params) => {
    return request('/updateFloatingMember', {
        serviceName: serviceName,
        methodName: 'updateFloatingMember',
        bizParams: {
            ...params
        }
    })
}

export const delFloatingMember = (params) => {
    return request('/delFloatingMember', {
        serviceName: serviceName,
        methodName: 'delFloatingMember',
        bizParams: {
            id: params+''
        }
    })
}

export const setReturnPartyMember = (params) => {
    return request('/setReturnPartyMember', {
        serviceName: serviceName,
        methodName: 'setReturnPartyMember',
        bizParams: {
            id: params +''
        }
    })
}
