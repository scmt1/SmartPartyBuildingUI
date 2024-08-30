import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfOrganizationLifeService'

// 获取今年所有、三会一课的数量
export const getPlanMeetingAllNumAndTypeNum = (data) => {
	return request('/getPlanMeetingAllNumAndTypeNum', {
		serviceName: serviceName,
		methodName: 'getPlanMeetingAllNumAndTypeNum',
		bizParams: {
			...data
		}
	})
}

// 查询会议列表
export const queryTzOrganizationLifeList = (data) => {
	return request('/queryTzOrganizationLifeList', {
		serviceName: serviceName,
		methodName: 'queryTzOrganizationLifeList',
		bizParams: {
			...data
		}
	})
}

export const appQueryTzOrganizationLifeList = (data) => {
	return request('/appQueryTzOrganizationLifeList', {
		serviceName: serviceName,
		methodName: 'appQueryTzOrganizationLifeList',
		bizParams: {
			...data
		}
	})
}

// 查询会议详情
export const getTzOrganizationLife = (data) => {
	return request('/getTzOrganizationLife', {
		serviceName: serviceName,
		methodName: 'getTzOrganizationLife',
		bizParams: {
			...data
		}
	})
}

// 设置拟参会人员
export const setPlanMeetingParty = (params) => {
	return request('/setPlanMeetingParty', {
		serviceName: serviceName,
		methodName: 'setPlanMeetingParty',
		bizParams: {
			...params
		}
	})
}

// 获取拟参会人员列表
export const getPlanMeetingPartyMemberInfo = (id) => {
	return request('/getPlanMeetingPartyMemberInfo', {
		serviceName: serviceName,
		methodName: 'getPlanMeetingPartyMemberInfo',
		bizParams: {
			id: id+''
		}
	})
}

// 删除会议
export const deleteTzOrganizationLife = (ids) => {
	return request('/deleteTzOrganizationLife', {
		serviceName: serviceName,
		methodName: 'deleteTzOrganizationLife',
		bizParams: {
				ids: ids
		}
	})
}

// 开始会议
export const startMeeting = (params) => {
	return request('/startMeeting', {
		serviceName: serviceName,
		methodName: 'startMeeting',
		bizParams: {
			...params
		}
	})
}

// 根据id查询会议照片列表
export const findImgById = (id) => {
	return request('/findImgById', {
		serviceName: serviceName,
		methodName: 'findImgById',
		bizParams: {
			id: id +''
		}
	})
}

// 根据id查询会议资料
export const findStudyFile = (id) => {
	return request('/findStudyFile', {
		serviceName: serviceName,
		methodName: 'findStudyFile',
		bizParams: {
			meetingId: id +''
		}
	})
}

// 新增会议
export const addTzOrganizationLife = (data) => {
	return request('/addTzOrganizationLife', {
		serviceName: serviceName,
		methodName: 'addTzOrganizationLife',
		bizParams: {
			data: data
		}
	})
}

export const updateTzOrganizationLife = (data) => {
	return request('/updateTzOrganizationLife', {
		serviceName: serviceName,
		methodName: 'updateTzOrganizationLife',
		bizParams: {
			data: data
		}
	})
}

export const cancelMeeting = (params) => {
	return request('/cancelMeeting', {
		serviceName: serviceName,
		methodName: 'cancelMeeting',
		bizParams: {
			data: params
		}
	})
}

export const getOrganizationLifeRanking = (params) => {
	return request('/getOrganizationLifeRanking', {
		serviceName: serviceName,
		methodName: 'getOrganizationLifeRanking',
		bizParams: {
			...params
		}
	})
}

export const getOrganizationLifeRankingOther = (params) => {
	return request('/getOrganizationLifeRankingOther', {
		serviceName: serviceName,
		methodName: 'getOrganizationLifeRankingOther',
		bizParams: {
			...params
		}
	})
}


export const getLifeCountToRankOfMeetingType = (params) => {
	return request('/getLifeCountToRankOfMeetingType', {
		serviceName: serviceName,
		methodName: 'getLifeCountToRankOfMeetingType',
		bizParams: {
			...params
		}
	})
}

export const getLifeDetailByDept = (params) => {
	return request('/getLifeDetailByDept', {
		serviceName: serviceName,
		methodName: 'getLifeDetailByDept',
		bizParams: {
			...params
		}
	})
}
