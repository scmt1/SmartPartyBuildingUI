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

export const queryTzPartyHonorListOneselfPartyMember = (data) => {
  return request('/queryTzPartyHonorListOneselfPartyMember', {
		serviceName: serviceName,
		methodName: 'queryTzPartyHonorListOneselfPartyMember',
		bizParams: {
			...data
		}
	})
}

export const addTzPartyHonor = (data) => {
  return request('/addTzPartyHonor', {
		serviceName: serviceName,
		methodName: 'addTzPartyHonor',
		bizParams: {
			...data
		}
	})
}

export const delTzPartyHonor = (id) => {
  return request('/delTzPartyHonor', {
		serviceName: serviceName,
		methodName: 'delTzPartyHonor',
		bizParams: {
			id: id +''
		}
	})
}
