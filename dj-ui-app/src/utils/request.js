// 请求封装

const all_url = {
  'development': 'http://localhost:8080/mock'
}

const baseURL = all_url[process.env.NODE_ENV]

export const request = (options = {}) => {
  const { url, method, data, params } = options
  // uni.showLoading({
  //   title: '加载中...',
  //   mask: true
  // })
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseURL}${url}`,
      method: method || 'get',
      data,
      params,
      success: (res) => {
        const { statusCode, data } = res
        if (statusCode === 401) {
          uni.showToast({
            icon: 'error',
            title: '登录已失效, 请先登录!',
            duration: 2000
          })
        }
        if (statusCode === 404) {
          uni.showToast({
            icon: 'error',
            title: '获取数据失败!',
            duration: 2000
          })
        }
        if (statusCode === 200) {
          if (data.code !== 0) {
            uni.showToast({
              icon: 'error',
              title: '获取数据失败!',
              duration: 2000
            })
            return
          }
          resolve(data)
        }
      },
      fail: (fail) => {
        uni.showToast({
          icon: 'none',
          title: '服务器响应失败!',
          duration: 2000
        })
        reject(fail)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}
