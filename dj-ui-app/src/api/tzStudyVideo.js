import { request } from '@/utils/request-gateway.js'
import { param } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags'

const serviceName = 'TzStudyVideoService'

export const getTzStudyVideoListByType = (param) => {
  return request('/getTzStudyVideoListByType', {
		serviceName: serviceName,
		methodName: 'getTzStudyVideoListByType',
		bizParams: {
			...param
		}
	})
}

export const getTzStudyVideoByApp = (param) => {
	return request('/getTzStudyVideoByApp', {
		serviceName: serviceName,
		methodName: 'getTzStudyVideoByApp',
		bizParams: {
			...param
		}
	})
}

export const getVideoColumnListByPage = (param) => {
  return request('/getVideoColumnListByPage', {
		serviceName: serviceName,
		methodName: 'getVideoColumnListByPage',
		bizParams: {
			...param
		}
	})
}

export const getPastVideoColumnList = (param) => {
  return request('/getPastVideoColumnList', {
		serviceName: serviceName,
		methodName: 'getPastVideoColumnList',
		bizParams: {
			...param
		}
	})
}

export const addTzStudyUser = (param) => {
  return request('/addTzStudyUser', {
		serviceName: serviceName,
		methodName: 'addTzStudyUser',
		bizParams: {
			...param
		}
	})
}

export const queryStudyStatus = (param) => {
  return request('/queryStudyStatus', {
		serviceName: serviceName,
		methodName: 'queryStudyStatus',
		bizParams: {
			...param
		}
	})
}

export const queryStudyCount = (id) => {
  return request('/queryStudyCount', {
		serviceName: serviceName,
		methodName: 'queryStudyCount',
		bizParams: {
			studyId: id + ''
		}
	})
}

export const getLastStudyByUserId = (id) => {
  return request('/getLastStudyByUserId', {
		serviceName: serviceName,
		methodName: 'getLastStudyByUserId',
		bizParams: {
			userId: id + ''
		}
	})
}
