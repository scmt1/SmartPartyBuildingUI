import { request } from '@/utils/request-gateway.js'

const serviceName = 'JcetService'

export const jcetlogin = (data) => {
	return request('/jcetLogin', {
		serviceName: serviceName,
		methodName: 'jcetLogin',
		bizParams: {
			...data
		}
	})
}