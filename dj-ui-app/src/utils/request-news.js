// const baseURL = 'http://101.206.141.236:7380/fastcms'
// const baseURL = 'http://10.4.117.31:7380/fastcms'
const baseURL = '/fastcmsApi'
// const baseURL = 'http://192.168.6.6:7380/fastcms'
export const request = (url, options) => {

	// 判断一些
	const headers = {
	    'Content-Type': 'application/json',
	    Accept: 'application/json',
	}

  return new Promise((resolve, reject) => {
    uni.request({
			header: headers,
      url: `${baseURL}`+url,
      method: 'get',
      success: (res) => {
        const { data } = res
        const code = data.code
        if (code === 500) {
          uni.showToast({
              icon: 'error',
              title: data.message,
              duration: 2000
          })
          return
        }
        if (code !== 200) {
            uni.showToast({
              icon: 'error',
              title: '获取数据失败!',
              duration: 2000
            })
            return
        }
        resolve(data)
      },
      fail: (fail) => {
        uni.showToast({
          icon: 'none',
          title: '服务器响应失败!',
          duration: 2000
        })
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}
