import { request } from '@/utils/request-gateway'

const serviceName = 'TzVideoColumnService'

export const getVideoColumnListByType = (params) => {
	return request('/getVideoColumnListByType', {
		serviceName: serviceName,
		methodName: 'getVideoColumnListByType',
		bizParams: {
			...params
		}
	})
}

export const getVideoColumn = (params) => {
	return request('/getVideoColumn', {
		serviceName: serviceName,
		methodName: 'getVideoColumn',
		bizParams: {
			id: params+''
		}
	})
}