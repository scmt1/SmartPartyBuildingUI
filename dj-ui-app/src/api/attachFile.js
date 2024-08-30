import { request } from '@/utils/request-gateway.js'

const serviceName = 'AttachFileService'

export const uploadImages = (params) => {
	return request('/uploadImages', {
		serviceName: serviceName,
		methodName: 'uploadImages',
		bizParams: {
			...params
		}
	})
}

export const uploadTinymceEditor = (params) => {
	return request('/uploadTinymceEditor', {
		serviceName: serviceName,
		methodName: 'uploadTinymceEditor',
		bizParams: {
			...params
		}
	})
}