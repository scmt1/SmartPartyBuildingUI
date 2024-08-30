import { request } from '@/utils/request'

export const getAnswerList = () => {
  return request({
    url: '/answer/getAnswerList',
    method: 'get',
  })
}
