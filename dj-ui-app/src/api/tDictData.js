import { request } from '@/utils/request-gateway'

export const getDictByType = (params) => {
	return request('/getDictItemList', {
		serviceName: 'DictService',
		methodName: 'getDictItemList',
		bizParams: {
			dictType: params
		}
	})
}