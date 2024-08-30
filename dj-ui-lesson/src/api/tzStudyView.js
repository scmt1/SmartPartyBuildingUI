import request from "@/utils/request";

const serviceName = 'TzStudyViewService'

export const saveTzStudyView = (params) => {
    return request('/saveTzStudyView', {
        serviceName: serviceName,
        methodName: 'saveTzStudyView',
        bizParams: {
            ...params
        }
    })
}

export const getTzStudyViewByStudyId = (id) => {
    return request('/getTzStudyViewByStudyId', {
        serviceName: serviceName,
        methodName: 'getTzStudyViewByStudyId',
        bizParams: {
            studyId: id
        }
    })
}

export const getViewScopeInfoByStudyId = (data) => {
    return request('/getViewScopeInfoByStudyId', {
        serviceName: serviceName,
        methodName: 'getViewScopeInfoByStudyId',
        bizParams: {
            ...data
        }
    })
}
