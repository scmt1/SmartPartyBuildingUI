import { request } from '@/utils/request'

export const getGraphicData = () => {
  return request({
    url: '/lessons/getGraphicData',
    method: 'get',
  })
}

export const getVideoData = () => {
  return request({
    url: '/lessons/getVideoData',
    method: 'get',
  })
}

export const getGraphicList = () => {
  return request({
    url: '/lessons/getGraphicList',
    method: 'get'
  })
}

export const getGraphicDetails = (params) => {
  return request({
    url: '/lessons/getGraphicDetails',
    method: 'get',
    params
  })
}

export const getVideoList = () => {
  return request({
    url: '/lessons/getVideoList',
    method: 'get'
  })
}

export const getVideoDetails = (params) => {
  return request({
    url: '/lessons/getVideoDetails',
    method: 'get',
    params
  })
}
