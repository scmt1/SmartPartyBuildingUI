import { request } from '@/utils/request-gateway.js'

const serviceName = 'TzPartyHonorService'

export const queryTzPartyHonorListOneselfDept = (data) => {
  return request('/queryTzPartyHonorListOneselfDept', {
			serviceName: serviceName,
			methodName: 'queryTzPartyHonorListOneselfDept',
			bizParams: {
					...data
			}
	})
}
