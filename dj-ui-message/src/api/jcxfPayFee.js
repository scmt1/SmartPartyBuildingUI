import request from '../utils/request';

const serviceName = 'JcxfPayFeeService'

// 根据年份和部门id统计支部缴纳党费
export const queryFeeTotalByYear = (params) => {
    return request('/queryFeeTotalByYear', {
        serviceName: serviceName,
        methodName: 'queryFeeTotalByYear',
        bizParams: {
            ...params,
        },
    });
};
// 根据月份和部门id统计支部缴纳党费
export const queryFeeTotalByMonth = (params) => {
    return request('/queryFeeTotalByMonth', {
        serviceName: serviceName,
        methodName: 'queryFeeTotalByMonth',
        bizParams: {
            ...params,
        },
    });
};

export const queryTzPayFeeList = (params) => {
    return request('/queryTzPayFeeList', {
        serviceName: serviceName,
        methodName: 'queryTzPayFeeList',
        bizParams: {
            ...params
        }
    })
}

export const copyDataByMonth = (params) => {
    return request('/copyDataByMonth', {
        serviceName: serviceName,
        methodName: 'copyDataByMonth',
        bizParams: {
            ...params
        }
    })
}

export const deleteById = (id) => {
    return request('/deleteById', {
        serviceName: serviceName,
        methodName: 'deleteById',
        bizParams: {
            id: id + ''
        }
    })
}

export const getCopyInfoByTime = (params) => {
    return request('/getCopyInfoByTime', {
        serviceName: serviceName,
        methodName: 'getCopyInfoByTime',
        bizParams: {
            ...params
        }
    })
}

