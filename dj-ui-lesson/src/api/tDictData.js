import request from "../utils/request";

export const getDictByType = (params) => {
    return request('/getByType', {
        serviceName: 'TDictDataService',
        methodName: 'getByType',
        bizParams: {
            type: params
        }
    })
}


export const getDictByType2 = (params) => {
    return request('/getDictItemList', {
        serviceName: 'DictService',
        methodName: 'getDictItemList',
        bizParams: {
            dictType: params
        }
    })
}
