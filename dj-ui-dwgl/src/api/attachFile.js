import request from "@/utils/request";

const serviceName = 'AttachFileService'
export const uploadImages = (params) => {
    return request('/uploadImages', {
        serviceName: serviceName,
        methodName: 'uploadImages',
        bizParams: {
            ...params
        }
    })
}


export const uploadTinymceEditor = (params) => {
    return request('/uploadTinymceEditor', {
        serviceName: serviceName,
        methodName: 'uploadTinymceEditor',
        bizParams: {
            ...params
        }
    })
}

export const uploadVideo = (params) => {
    return request('/uploadVideo', {
        serviceName: serviceName,
        methodName: 'uploadVideo',
        bizParams: {
            ...params
        }
    })
}

export const getFileDateForDown = (params) => {
    return request('/getFileDateForDown', {
        serviceName: serviceName,
        methodName: 'getFileDateForDown',
        bizParams: {
            url: params
        }
    })
}
export const downloadLocalFile = (params) => {
    return request('/downloadLocalFile', {
        serviceName: serviceName,
        methodName: 'downloadLocalFile',
        bizParams: {
            url: params
        }
    })
}
