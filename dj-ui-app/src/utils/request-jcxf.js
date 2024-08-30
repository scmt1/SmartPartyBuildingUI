const baseURL = 'https://lz12371.cn/'

export const request = (url, options) => {
	let data = options
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: baseURL + url,
			files: [{
				file: options,
				uri: ''
			}],
			success: (res) => {
				resolve(JSON.parse(res.data))
			}
		})
		
	})
}