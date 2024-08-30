import { request } from '@/utils/request-gateway.js'

const serviceName = 'WxService'

export const createJsapiSignature = (data) => {
	return request('/createJsapiSignature', {
		serviceName: serviceName,
		methodName: 'createJsapiSignature',
		bizParams: {
			...data
		}
	})
}