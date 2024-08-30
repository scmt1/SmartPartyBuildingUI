import request from "@/utils/request";

const serviceName = 'TzVoteService'

export const addVote = (data) => {
    return request('/addVote', {
        serviceName: serviceName,
        methodName: 'addVote',
        bizParams: {
            ...data
        }
    })
}

export const queryTzVoteList = (data) => {
    return request('/queryTzVoteList', {
        serviceName: serviceName,
        methodName: 'queryTzVoteList',
        bizParams: {
            data
        }
    })
}


export const queryTzVoteById = (id) => {
    return request('/queryTzVoteById', {
        serviceName: serviceName,
        methodName: 'queryTzVoteById',
        bizParams: {
            id:id
        }
    })
}

export const deleteTzVoteById = (ids) => {
    return request('/deleteTzVoteById', {
        serviceName: serviceName,
        methodName: 'deleteTzVoteById',
        bizParams: {
            ids
        }
    })
}

export const updateStatusById = (params) => {
    return request('/updateStatusById', {
        serviceName: serviceName,
        methodName: 'updateStatusById',
        bizParams: {
            ...params
        }
    })
}

export const updateVoteById = (params) =>{
    return request('/updateVoteById', {
        serviceName: serviceName,
        methodName: 'updateVoteById',
        bizParams: {
            ...params
        }
    })
}

