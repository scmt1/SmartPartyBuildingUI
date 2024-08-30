import { request } from '@/utils/request-gateway'

const serviceName = 'TzPersonMeetingService'

export const getJoinsPartyMemberListByMeetingId = (id) => {
  return request('/getJoinsPartyMemberListByMeetingId', {
			serviceName: serviceName,
			methodName: 'getJoinsPartyMemberListByMeetingId',
			bizParams: {
				meetingId: id + ''
			}
	})
}

