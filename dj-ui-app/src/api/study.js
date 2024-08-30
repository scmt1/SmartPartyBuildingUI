import { request } from '@/utils/request'

export const getData = () => {
  return request({
    url: '/study/getData',
    method: 'get',
  })
}

export const getUserData = () => {
  return request({
    url: '/study/getUserData',
    method: 'get',
  })
}

