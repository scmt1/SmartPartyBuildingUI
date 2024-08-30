import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfPartyMemberService'

export const partyMemberLogin = (data) => {
  return request('/partyMemberLogin', {
			serviceName: serviceName,
			methodName: 'partyMemberLogin',
			bizParams: {
					...data
			}
	})
}
export const partyMemberLoginByCode = (data) => {
  return request('/partyMemberLoginByCode', {
			serviceName: serviceName,
			methodName: 'partyMemberLoginByCode',
			bizParams: {
					...data
			}
	})
}

export const sendVCode = (data) => {
  return request('/sendVCode', {
			serviceName: "TzMessageService",
			methodName: 'sendVCode',
			bizParams: {
					data:data
			}
	})
}

export const validNewPhone = (data) => {
  return request('/validNewPhone', {
			serviceName: serviceName,
			methodName: 'validNewPhone',
			bizParams: {
					...data
			}
	})
}

export const changeNewPhone = (data) => {
  return request('/changeNewPhone', {
			serviceName: serviceName,
			methodName: 'changeNewPhone',
			bizParams: {
					...data
			}
	})
}
export const validCode = (data) => {
  return request('/validCode', {
			serviceName: "TzMessageService",
			methodName: 'validCode',
			bizParams: {
					...data
			}
	})
}

export const sendBindVCode = (data) => {
	return request('/sendBindVCode', {
		serviceName: "TzMessageService",
		methodName: 'sendBindVCode',
		bizParams: {
			data:data
		}
	})
}