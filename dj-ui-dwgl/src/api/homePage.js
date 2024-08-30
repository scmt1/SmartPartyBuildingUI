import request from "@/utils/request";

const serviceName = 'HomePageService'

export const getPartyMemberCount = (id) => {
    return request('/getPartyMemberCount', {
        serviceName: serviceName,
        methodName: 'getPartyMemberCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getDeptCount = (id) => {
    return request('/getDeptCount', {
        serviceName: serviceName,
        methodName: 'getDeptCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getMeetingCountThisMonth = (id) => {
    return request('/getMeetingCountThisMonth', {
        serviceName: serviceName,
        methodName: 'getMeetingCountThisMonth',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getMeetingCountThisYear = (id) => {
    return request('/getMeetingCountThisYear', {
        serviceName: serviceName,
        methodName: 'getMeetingCountThisYear',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPayFeeMoneyByMonth = (id) => {
    return request('/getPayFeeMoneyByMonth', {
        serviceName: serviceName,
        methodName: 'getPayFeeMoneyByMonth',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getGenderCount = (id) => {
    return request('/getGenderCount', {
        serviceName: serviceName,
        methodName: 'getGenderCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getFloatingPartyMemberCount = (id) => {
    return request('/getFloatingPartyMemberCount', {
        serviceName: serviceName,
        methodName: 'getFloatingPartyMemberCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getAgeDistribution = (id) => {
    return request('/getAgeDistribution', {
        serviceName: serviceName,
        methodName: 'getAgeDistribution',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPartyStandingDistribution = (id) => {
    return request('/getPartyStandingDistribution', {
        serviceName: serviceName,
        methodName: 'getPartyStandingDistribution',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getTermInfo = (id) => {
    return request('/getTermInfo', {
        serviceName: serviceName,
        methodName: 'getTermInfo',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPayFeeNearlyYearCount = (id) => {
    return request('/getPayFeeNearlyYearCount', {
        serviceName: serviceName,
        methodName: 'getPayFeeNearlyYearCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getMeetingNearlyYearCount = (id) => {
    return request('/getMeetingNearlyYearCount', {
        serviceName: serviceName,
        methodName: 'getMeetingNearlyYearCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPartyMemberYuBeiCount = (id) => {
    return request('/getPartyMemberYuBeiCount', {
        serviceName: serviceName,
        methodName: 'getPartyMemberYuBeiCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPartyWorkerCount = (id) => {
    return request('/getPartyWorkerCount', {
        serviceName: serviceName,
        methodName: 'getPartyWorkerCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPartyLostCount = (id) => {
    return request('/getPartyLostCount', {
        serviceName: serviceName,
        methodName: 'getPartyLostCount',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPositionDistribution = (id) => {
    return request('/getPositionDistribution', {
        serviceName: serviceName,
        methodName: 'getPositionDistribution',
        bizParams: {
            deptId: id+''
        }
    })
}

export const getPayFeeTotal = (id) => {
    return request('/getPayFeeTotal', {
        serviceName: serviceName,
        methodName: 'getPayFeeTotal',
        bizParams: {
            deptId: id+''
        }
    })
}
