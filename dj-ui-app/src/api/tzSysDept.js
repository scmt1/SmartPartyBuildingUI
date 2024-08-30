import { request } from '@/utils/request-gateway'

const serviceName = 'JcxfSysDeptService'

export const getTzSysDept = (params) => {
    return request('/getTzSysDept', {
        serviceName: serviceName,
        methodName: 'getTzSysDept',
        bizParams: {
					id: params+'',
        }
    })
}

export const getDeptIntroduceById = (params) => {
    return request('/getDeptIntroduceById', {
        serviceName: serviceName,
        methodName: 'getDeptIntroduceById',
        bizParams: {
					id: params+''
        }
    })
}

export const getChildrenDeptListByName = (params) => {
	return request('/getChildrenDeptListByName', {
		serviceName: serviceName,
		methodName: 'getChildrenDeptListByName',
		bizParams: {
			...params
		}
	})
}

export const getAllDeptListByName = (params) => {
	return request('/getAllDeptListByName', {
		serviceName: serviceName,
		methodName: 'getAllDeptListByName',
		bizParams: {
			...params
		}
	})
}


export const getPartyCommitteeCount = (params) => {
	return request('/getPartyCommitteeCount', {
		serviceName: serviceName,
		methodName: 'getPartyCommitteeCount',
		bizParams: {
			...params
		}
	})
}

export const getDeptTree = (params) => {
	return request('/getDeptTree', {
		serviceName: serviceName,
		methodName: 'getDeptTree',
		bizParams: {
			...params
		}
	})
}
export const getNoDoneDeptTree = (params) => {
	return request('/getNoDoneDeptTree', {
		serviceName: serviceName,
		methodName: 'getNoDoneDeptTree',
		bizParams: {
			...params
		}
	})
}