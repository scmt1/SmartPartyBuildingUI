
import { Random } from 'mockjs'

import { decrypt } from '@/utils/jsencrypt'

export const login = (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username === 'test', decrypt(password) === '123456') {
    return {
      code: 0,
      message: 'success',
      data: {
        token: 'weaweacawgadawdawdawd'
      }
    }
  } else {
    //console.log(23)
    return {
      code: -1,
      message: '用户名或密码不匹配',
    }
  }

}

export const getUser = (options) => {
  //console.log(options)
  return {
    code: 0,
    message: 'success',
    data: {
      id: Random.id(),
      name: Random.cname(),
      age: Random.integer(10, 20),
      gender: Random.integer(0, 1)
    }
  }
}
