import request from "../utils/request";

const serviceName = 'JcxfOrganizationLifeService'

export const checkMeeting = (data) => {
    return request('/checkMeeting', {
        serviceName: serviceName,
        methodName: 'checkMeeting',
        bizParams: {
            ...data
        }
    })
}

export const updateTzOrganizationLife = (data) => {
    return request('/updateTzOrganizationLife', {
        serviceName: serviceName,
        methodName: 'updateTzOrganizationLife',
        bizParams: {
            ...data
        }
    })
}

export const updateTzOrganizationLifeRecord = (data) => {
    return request('/updateTzOrganizationLifeRecord', {
        serviceName: serviceName,
        methodName: 'updateTzOrganizationLifeRecord',
        bizParams: {
            ...data
        }
    })
}

export const getTzOrganizationLife = (deptId,id) => {
    return request('/getTzOrganizationLife', {
        serviceName: serviceName,
        methodName: 'getTzOrganizationLife',
        bizParams: {
            deptId: deptId,
            id: id,

        }
    })
}

export const endMeeting = (data) => {
    return request('/endMeeting', {
        serviceName: serviceName,
        methodName: 'endMeeting',
        bizParams: {
            ...data
        }
    })
}
export const addTzOrganizationLife = (data) => {
    return request('/addTzOrganizationLife', {
        serviceName: serviceName,
        methodName: 'addTzOrganizationLife',
        bizParams: {
            data: data
        }
    })
}

export const getInfo = (data) => {
    return request('/getInfo', {
        serviceName: serviceName,
        methodName: 'getInfo',
        bizParams: {
            ...data
        }
    })
}
export const queryMeetingClass = (data) => {
    return request('/queryMeetingClass', {
        serviceName: serviceName,
        methodName: 'queryMeetingClass',
        bizParams: {
            ...data
        }
    })
}
export const queryMeetingClassType = (data) => {
    return request('/queryMeetingClassType', {
        serviceName: serviceName,
        methodName: 'queryMeetingClassType',
        bizParams: {
            ...data
        }
    })
}
export const queryMeetingClassTypeByThisMonth = (data) => {
    return request('/queryMeetingClassTypeByThisMonth', {
        serviceName: serviceName,
        methodName: 'queryMeetingClassTypeByThisMonth',
        bizParams: {
            ...data
        }
    })
}


export const findImgById = (id) => {
    return request('/findImgById', {
        serviceName: serviceName,
        methodName: 'findImgById',
        bizParams: {
            id: id
        }
    })
}
export const cancelMeeting = (data) => {
    return request('/cancelMeeting', {
        serviceName: serviceName,
        methodName: 'cancelMeeting',
        bizParams: {
            data: data
        }
    })
}
export const startMeeting = (data) => {
    return request('/startMeeting', {
        serviceName: serviceName,
        methodName: 'startMeeting',
        bizParams: {
            ...data
        }
    })
}
export const deleteTzOrganizationLife = (ids) => {
    return request('/deleteTzOrganizationLife', {
        serviceName: serviceName,
        methodName: 'deleteTzOrganizationLife',
        bizParams: {
            ids: ids
        }
    })
}

export const queryTzOrganizationLifeList = (data) => {
    return request('/queryTzOrganizationLifeList', {
        serviceName: serviceName,
        methodName: 'queryTzOrganizationLifeList',
        bizParams: {
            ...data
        }
    })
}
export const deleteFileById = (id) => {
    return request('/deleteFileById', {
        serviceName: serviceName,
        methodName: 'deleteFileById',
        bizParams: {
            id: id
        }
    })
}

export const saveStudyFile = (data) => {
    return request('/saveStudyFile', {
        serviceName: serviceName,
        methodName: 'saveStudyFile',
        bizParams: {
            ...data
        }
    })
}
export const querytaizhang = (data) => {
    return request('/querytaizhang', {
        serviceName: serviceName,
        methodName: 'querytaizhang',
        bizParams: {
            ...data
        }
    })
}
export const saveImg = (data) => {
    return request('/saveImg', {
        serviceName: serviceName,
        methodName: 'saveImg',
        bizParams: {
            data:data
        }
    })
}

export const findStudyFile = (id) => {
    return request('/findStudyFile', {
        serviceName: serviceName,
        methodName: 'findStudyFile',
        bizParams: {
            meetingId: id
        }
    })
}
export const countMyTotalClassNum = (id) => {
    return request('/countMyTotalClassNum', {
        serviceName: serviceName,
        methodName: 'countMyTotalClassNum',
        bizParams: {
             id:id+''
        }
    })
}

export const setPlanMeetingParty = (params) => {
    return request('/setPlanMeetingParty', {
        serviceName: serviceName,
        methodName: 'setPlanMeetingParty',
        bizParams: {
            ...params
        }
    })
}

export const getOrganizationLifeById = (id) => {
    return request('/getOrganizationLifeById', {
        serviceName: serviceName,
        methodName: 'getOrganizationLifeById',
        bizParams: {
            id: id+''
        }
    })
}

export const getPlanMeetingPartyMemberInfo = (id) => {
    return request('/getPlanMeetingPartyMemberInfo', {
        serviceName: serviceName,
        methodName: 'getPlanMeetingPartyMemberInfo',
        bizParams: {
            id: id+''
        }
    })
}
export const sendMessageByPartyIds = (id) => {
    return request('/sendMessageByPartyIds', {
        serviceName: serviceName,
        methodName: 'sendMessageByPartyIds',
        bizParams: {
            id: id+''
        }
    })
}

export const getMeetingDecadeCount = (id) => {
    return request('/getMeetingDecadeCount', {
        serviceName: serviceName,
        methodName: 'getMeetingDecadeCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getMeetingDecadeCountGroupByYear = (id) => {
    return request('/getMeetingDecadeCountGroupByYear', {
        serviceName: serviceName,
        methodName: 'getMeetingDecadeCountGroupByYear',
        bizParams: {
            deptId: id+''
        }
    })
}

