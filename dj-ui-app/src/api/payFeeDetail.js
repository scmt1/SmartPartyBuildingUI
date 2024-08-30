import { request } from '@/utils/request-gateway.js'

const serviceName = 'JcxfPayFeeDetailService'

export const getPayFeeDetailPageByPartyMember = (data) => {
	return request('/getPayFeeDetailPageByPartyMember', {
		serviceName: serviceName,
		methodName: 'getPayFeeDetailPageByPartyMember',
		bizParams: {
			...data
		}
	})
}

export const getPayFeeDetailListByPartyMember = (data) => {
	return request('/getPayFeeDetailListByPartyMember', {
		serviceName: serviceName,
		methodName: 'getPayFeeDetailListByPartyMember',
		bizParams: {
			...data
		}
	})
}

export const getPayFeeDetailListByDept = (data) => {
	return request('/getPayFeeDetailListByDept', {
		serviceName: serviceName,
		methodName: 'getPayFeeDetailListByDept',
		bizParams: {
			...data
		}
	})
}

export const payByOneself = (data) => {
	return request('/payByOneself', {
		serviceName: serviceName,
		methodName: 'payByOneself',
		bizParams: {
			...data
		}
	})
}

export const payForOther = (data) => {
	return request('/payForOther', {
		serviceName: serviceName,
		methodName: 'payForOther',
		bizParams: {
			...data
		}
	})
}

export const getPayFeeDetailStatistics = (data) => {
	return request('/getPayFeeDetailStatistics', {
		serviceName: serviceName,
		methodName: 'getPayFeeDetailStatistics',
		bizParams: {
			...data
		}
	})
}

export const getNoDonePartyMember = (params) => {
	return request('/getNoDonePartyMember', {
		serviceName: serviceName,
		methodName: 'getNoDonePartyMember',
		bizParams: {
			...params
		}
	})
}