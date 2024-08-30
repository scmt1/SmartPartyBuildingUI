import request from "../utils/request";

const serviceName = 'JcxfPartyMemberService'

export const delPartyMember = (ids) => {
    return request('/deletePartyMemberInfo', {
        serviceName: serviceName,
        methodName: 'deletePartyMemberInfo',
        bizParams: {
            ids
        }
    })
}

export const queryPartyMemberList = (data) => {
    return request('/queryPartyMemberList', {
        serviceName: serviceName,
        methodName: 'queryPartyMemberList',
        bizParams: {
            ...data
        }
    })
}

export const queryCountActive = (params) => {
    return request('/queryCountActive', {
        serviceName: serviceName,
        methodName: 'queryCountActive',
        bizParams: {
            partyMember: params
        }
    })
}

export const resetPassword = (id) => {
    return request('/resetPassword', {
        serviceName: serviceName,
        methodName: 'resetPassword',
        bizParams: {
            id: id
        }
    })
}

export const getInfo = (deptId) => {
    return request('/getStatisticsInfo', {
        serviceName: serviceName,
        methodName: 'getStatisticsInfo',
        bizParams: {
            deptId: deptId
        }
    })
}
export const queryDeletePartyMemberList = (data) => {
    return request('/queryDeletePartyMemberList', {
        serviceName: serviceName,
        methodName: 'queryDeletePartyMemberList',
        bizParams: {
            ...data
        }
    })
}

export const recoverDeletePartyMemberInfo = (ids) => {
    return request('/recoverDeletePartyMemberInfo', {
        serviceName: serviceName,
        methodName: 'recoverDeletePartyMemberInfo',
        bizParams: {
            ids: ids
        }
    })
}

export const getPartyInfo = (id) => {
    return request('/getPartyInfo', {
        serviceName: serviceName,
        methodName: 'getPartyInfo',
        bizParams: {
            id: id
        }
    })
}

export const addPartyMember = (partyMember) => {
    return request('/addPartyMember', {
        serviceName: serviceName,
        methodName: 'addPartyMember',
        bizParams: {
            ...partyMember
        }
    })
}
export const uploadImages = (imgUrl) => {
    return request('/uploadImages', {
        serviceName: serviceName,
        methodName: 'uploadImages',
        bizParams: {
            imgUrl:imgUrl
        }
    })
}

export const flowOutPartyMemberList = (params) => {
    return request('/flowOutPartyMemberList', {
        serviceName: serviceName,
        methodName: 'flowOutPartyMemberList',
        bizParams: {
            ...params
        }
    })
}
export const queryOneselfPartyMemberList = (data) => {
    return request('/queryOneselfPartyMemberList', {
        serviceName: serviceName,
        methodName: 'queryOneselfPartyMemberList',
        bizParams: {
            ...data
        }
    })
}

export const queryOneselfFlowPartyMemberList = (data) => {
    return request('/queryOneselfFlowPartyMemberList', {
        serviceName: serviceName,
        methodName: 'queryOneselfFlowPartyMemberList',
        bizParams: {
            data
        }
    })
}
export const uploadPartyMemberFile = (data) => {
    return request('/uploadPartyMemberFile', {
        serviceName: serviceName,
        methodName: 'uploadPartyMemberFile',
        bizParams: {
            data: data

        }
    })
}






export const setReturnPartyMember = (params) => {
    return request('/setReturnPartyMember', {
        serviceName: serviceName,
        methodName: 'setReturnPartyMember',
        bizParams: {
            ids: params
        }
    })
}

export const addFlowOutPartyMember = (params) => {
    return request('/addFlowOutPartyMember', {
        serviceName: serviceName,
        methodName: 'addFlowOutPartyMember',
        bizParams: {
            ...params
        }
    })
}
export const downFormwork = () => {
    return request('/downFormwork', {
        serviceName: serviceName,
        methodName: 'downFormwork',
        bizParams: {

        }
    })
}


export const queryBoss = (deptId,positionType) => {
    return request('/queryBoss', {
        serviceName: serviceName,
        methodName: 'queryBoss',
        bizParams: {
            deptId,
            positionType
        }
    })
}


export const getPartMemberListByIdCard = (params) => {
    return request('/getPartMemberListByIdCard', {
        serviceName: serviceName,
        methodName: 'getPartMemberListByIdCard',
        bizParams: {
            ...params
        }
    })
}

export const getPartMemberListByDeptId = (id) => {
    return request('/getPartMemberListByDeptId', {
        serviceName: serviceName,
        methodName: 'getPartMemberListByDeptId',
        bizParams: {
            deptId: id
        }
    })
}

export const getPayFeePartyMemberByDeptId = (data) => {
    return request('/getPayFeePartyMemberByDeptId', {
        serviceName: serviceName,
        methodName: 'getPayFeePartyMemberByDeptId',
        bizParams: {
            ...data
        }
    })
}

export const getPartyMemberCountDetail = (id) => {
    return request('/getPartyMemberCountDetail', {
        serviceName: serviceName,
        methodName: 'getPartyMemberCountDetail',
        bizParams: {
            id: id + ''
        }
    })
}

export const setRole = (data) => {
    return request('/setRole', {
        serviceName: serviceName,
        methodName: 'setRole',
        bizParams: {
            ...data
        }
    })
}

export const resetDeptTreePartyMemberPassword = (id) => {
    return request('/resetDeptTreePartyMemberPassword', {
        serviceName: serviceName,
        methodName: 'resetDeptTreePartyMemberPassword',
        bizParams: {
            deptId: id + ''
        }
    })
}
