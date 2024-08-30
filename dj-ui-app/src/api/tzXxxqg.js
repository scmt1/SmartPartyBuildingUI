import { request } from '@/utils/request-gateway'

const serviceName = 'TzXxqgService'

export const queryByPage = (params) => {
	return request('/queryByPage', {
		serviceName: serviceName,
		methodName: 'queryByPage',
		bizParams: {
			...params
		}
	})
}