import request from "@/utils/request";

const serviceName = 'TzStudyVideoService'
export const deleteTzStudyVideo = (params) => {
    return request('/deleteTzStudyVideo', {
        serviceName: serviceName,
        methodName: 'deleteTzStudyVideo',
        bizParams: {
            ids: params
        }
    })
}

export const postVideo = (params) => {
    return request('/postVideo', {
        serviceName: serviceName,
        methodName: 'postVideo',
        bizParams: {
            ...params
        }
    })
}

export const queryTzStudyVideoList = (params) => {
    return request('/queryTzStudyVideoList', {
        serviceName: serviceName,
        methodName: 'queryTzStudyVideoList',
        bizParams: {
            ...params
        }
    })
}

export const saveVideo = (params) => {
    return request('/saveVideo', {
        serviceName: serviceName,
        methodName: 'saveVideo',
        bizParams: {
            ...params
        }
    })
}

export const getTzStudyVideo = (params) => {
    return request('/getTzStudyVideo', {
        serviceName: serviceName,
        methodName: 'getTzStudyVideo',
        bizParams: {
            id: params
        }
    })
}

export const sendStudyMessage = (id) => {
    return request('/sendStudyMessage', {
        serviceName: serviceName,
        methodName: 'sendStudyMessage',
        bizParams: {
            studyId: id
        }
    })
}
