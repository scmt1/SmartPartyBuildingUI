import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfPartyMemberService'

export const queryOneselfPartyMemberList = (data) => {
	return request('/queryOneselfPartyMemberList', {
		serviceName: serviceName,
		methodName: 'queryOneselfPartyMemberList',
		bizParams: {
			...data
		}
	})
}

export const addFlowOutPartyMember = (params) => {
	return request('/addFlowOutPartyMember', {
		serviceName: serviceName,
		methodName: 'addFlowOutPartyMember',
		bizParams: {
			...params
		}
	})
}

export const getPartyInfo = (id) => {
	return request('/getPartyInfo', {
		serviceName: serviceName,
		methodName: 'getPartyInfo',
		bizParams: {
			id: id + ''
		}
	})
}

export const setReturnPartyMember = (params) => {
	return request('/setReturnPartyMember', {
		serviceName: serviceName,
		methodName: 'setReturnPartyMember',
		bizParams: {
			ids: params
		}
	})
}

export const updatePartyMemberAvatar = (params) => {
	return request('/updatePartyMemberAvatar', {
		serviceName: serviceName,
		methodName: 'updatePartyMemberAvatar',
		bizParams: {
			...params
		}
	})
}

export const partyMemberPasswordVerify = (params) => {
	return request('/partyMemberPasswordVerify', {
		serviceName: serviceName,
		methodName: 'partyMemberPasswordVerify',
		bizParams: {
			...params
		}
	})
}


export const partyMemberPasswordUpdate = (params) => {
	return request('/partyMemberPasswordUpdate', {
		serviceName: serviceName,
		methodName: 'partyMemberPasswordUpdate',
		bizParams: {
			...params
		}
	})
}

export const getPoliticalBirthdayByDeptId = (params) => {
	return request('/getPoliticalBirthdayByDeptId', {
		serviceName: serviceName,
		methodName: 'getPoliticalBirthdayByDeptId',
		bizParams: {
			...params
		}
	})
}

export const getPartyMemberCounts = (params) => {
	return request('/getPartyMemberCounts', {
		serviceName: serviceName,
		methodName: 'getPartyMemberCounts',
		bizParams: {
			...params
		}
	})
}

export const getPartyMemberFlowCount = (params) => {
	return request('/getPartyMemberFlowCount', {
		serviceName: serviceName,
		methodName: 'getPartyMemberFlowCount',
		bizParams: {
			...params
		}
	})
}


export const getPartyMemberCountByDeptIdsAndVeteran = (params) => {
	return request('/getPartyMemberCountByDeptIdsAndVeteran', {
		serviceName: serviceName,
		methodName: 'getPartyMemberCountByDeptIdsAndVeteran',
		bizParams: {
			...params
		}
	})
}

export const getPartyMemberCountFlowAndInFlow = (params) => {
	return request('/getPartyMemberCountFlowAndInFlow', {
		serviceName: serviceName,
		methodName: 'getPartyMemberCountFlowAndInFlow',
		bizParams: {
			...params
		}
	})
}

export const getPartyInfoByApp = (id) => {
	return request('/getPartyInfoByApp', {
		serviceName: serviceName,
		methodName: 'getPartyInfoByApp',
		bizParams: {
			id: id + ''
		}
	})
}

export const changePhone = (params) => {
	return request('/changePhone', {
		serviceName: serviceName,
		methodName: 'changePhone',
		bizParams: {
			...params
		}
	})
}

export const getPartyMemberManagepower = (params) => {
	return request('/getPartyMemberManagepower', {
		serviceName: serviceName,
		methodName: 'getPartyMemberManagepower',
		bizParams: {
			...params
		}
	})
}
export const wxLogin = (data) => {
	return request('/wxLogin', {
		serviceName: serviceName,
		methodName: 'wxLogin',
		bizParams: {
			...data
		}
	})
}
export const wxBindPhone = (data) => {
	return request('/wxBindPhone', {
		serviceName: serviceName,
		methodName: 'wxBindPhone',
		bizParams: {
			...data
		}
	})
}