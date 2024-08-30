import { request } from '@/utils/request'

export const getData = () => {
  return request({
    url: '/credit/getData',
    method: 'get',
  })
}
