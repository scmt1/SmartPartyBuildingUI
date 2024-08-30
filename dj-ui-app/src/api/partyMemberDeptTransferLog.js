import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfPartyMemberTransferService'

export const getTransferPageByPartyMemberId = (params) => {
	return request('/getTransferPageByPartyMemberId', {
		serviceName: serviceName,
		methodName: 'getTransferPageByPartyMemberId',
		bizParams: {
			...params
		}
	})
}

export const addPartyMemberDeptTransfer = (params) => {
	return request('/addPartyMemberDeptTransfer', {
		serviceName: serviceName,
		methodName: 'addPartyMemberDeptTransfer',
		bizParams: {
			...params
		}
	})
}

export const delPartyMemberDeptTransfer = (id) => {
	return request('/delPartyMemberDeptTransfer', {
		serviceName: serviceName,
		methodName: 'delPartyMemberDeptTransfer',
		bizParams: {
			id: id + ''
		}
	})
}

export const getPartyMemberDeptTransferById = (id) => {
	return request('/getPartyMemberDeptTransferById', {
		serviceName: serviceName,
		methodName: 'getPartyMemberDeptTransferById',
		bizParams: {
			id: id+''
		}
	})
}

export const cancelTransferById = (id) => {
	return request('/cancelTransferById', {
		serviceName: serviceName,
		methodName: 'cancelTransferById',
		bizParams: {
			id: id + ''
		}
	})
}
