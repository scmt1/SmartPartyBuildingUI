import { request } from '@/utils/request-news'

export const queryNews = (data) => {
    return request('/api/client/article/list/open'+data, {
    })
}
export const queryCategory = (id) => {
    return request('/api/client/article/category/'+id, {
    })
}
export const queryVideos = (data) => {
    return request('/api/client/video/list/open' + data, {})
}

export const queryNewsDetails = (id) => {
    return request('/api/client/article/get/'+id, {
    })
}

export const like = (data) => {
    return request('/api/client/article/like' + data, {
    })
}