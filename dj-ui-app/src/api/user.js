import { request } from '@/utils/request'

import { encrypt } from '@/utils/jsencrypt'

export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      ...data,
      password: encrypt(data.password)
    }
  })
}

// export const getUser = (data) => {
//   return request({
//     url: '/user/getUser',
//     method: 'post',
//     data
//   })
// }
