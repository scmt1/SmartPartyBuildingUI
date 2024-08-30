import request from "@/utils/request";

const serviceName = 'TzStudyFileService'


export const cancelPostIt = (params) =>{
    return request('/cancelPostIt', {
        serviceName: serviceName,
        methodName: 'cancelPostIt',
        bizParams: {
            id: params+''
        }
    })
}
export const deleteTzSysDept = (params) => {
    return request('/deleteTzSysDept', {
        serviceName: serviceName,
        methodName: 'deleteTzSysDept',
        bizParams: {
            id: params+''
        }
    })
}

export const postIt = (params) => {
    return request('/postIt', {
        serviceName: serviceName,
        methodName: 'postIt',
        bizParams: {
            id: params+''
        }
    })
}


export const queryTzTStudyFile = (params) => {
    return request('/queryTzTStudyFile', {
        serviceName: serviceName,
        methodName: 'queryTzTStudyFile',
        bizParams: {
            ...params
        }
    })
}

export const deleteTStudyFile = (params) => {
    return request('/deleteTStudyFile', {
        serviceName: serviceName,
        methodName: 'deleteTStudyFile',
        bizParams: {
            ids: params
        }
    })
}

export const saveStudyFile = (params) => {
    return request('/saveStudyFile', {
        serviceName: serviceName,
        methodName: 'saveStudyFile',
        bizParams: {
            ...params
        }
    })
}

export const getStudyFile = (params) => {
    return request('/getStudyFile', {
        serviceName: serviceName,
        methodName: 'getStudyFile',
        bizParams: {
            id: params
        }
    })
}
