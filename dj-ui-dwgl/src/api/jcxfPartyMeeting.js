import request from "../utils/request";

const serviceName = 'JcxfMeetingService'

export const getMeetingByPartyMemberId = (partyMemberId) => {
    return request('/getMeetingByPartyMemberId', {
        serviceName: serviceName,
        methodName: 'getMeetingByPartyMemberId',
        bizParams: {
            partyMemberId:partyMemberId
        }
    })
}
