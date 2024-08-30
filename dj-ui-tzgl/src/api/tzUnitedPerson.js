import request from "../utils/request";


const serviceName = 'TzUnitedPersonService'
export const queryUnitedPersonList = (params) => {
    return request('/queryUnitedPersonList', {
        serviceName: serviceName,
        methodName: 'queryUnitedPersonList',
        bizParams: {
            ...params
        }
    })
}


export const getUnitePerson = (params) => {
    return request('/getUnitePerson', {
        serviceName: serviceName,
        methodName: 'getUnitePerson',
        bizParams: {
            id:params
        }
    })
}

export const addUnitedPerson = (params) => {
    return request('/addUnitedPerson', {
        serviceName: serviceName,
        methodName: 'addUnitedPerson',
        bizParams: {
            ...params
        }
    })
}


export const deleteUnitePerson = (params) => {
    return request('/deleteUnitePerson', {
        serviceName: serviceName,
        methodName: 'deleteUnitePerson',
        bizParams: {
            ids: params
        }
    })
}

export const addUnitedPersonList = (params) => {
    return request('/addUnitedPersonList', {
        serviceName: serviceName,
        methodName: 'addUnitedPersonList',
        bizParams: {
            unitedPersonList: params
        }
    })
}

export const getPersonNumberByUnitedObject = (params) => {
    return request('/getPersonNumberByUnitedObject', {
        serviceName: serviceName,
        methodName: 'getPersonNumberByUnitedObject',
        bizParams: {
            ...params
        }
    })
}

