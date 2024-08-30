import request from '../utils/request';

// 分页查询组工动态
export const getByPage = (params) => {
  return request('/getByPage', {
    serviceName: 'TzOrganizationWorkService',
    methodName: 'getByPage',
    bizParams: {
      ...params,
    },
  });
};
//组工动态添加
export const addNews = (params) => {
    return request('/addNews', {
        serviceName: 'TzOrganizationWorkService',
        methodName: 'addNews',
        bizParams: {
            ...params,
        },
    });
};
//根据id查询详情数据
export const getDataById = (params) => {
    return request('/getDataById', {
        serviceName: 'TzOrganizationWorkService',
        methodName: 'getDataById',
        bizParams: {
            ...params,
        },
    });
};
//根据id删除数据
export const getDelById = (params) => {
    return request('/getDelById', {
        serviceName: 'TzOrganizationWorkService',
        methodName: 'getDelById',
        bizParams: {
            ...params,
        },
    });
};
export const mpUploadVideo = (params) => {
  return request('/mpUploadVideo', {
    serviceName: 'AttachFileService',
    methodName: 'mpUploadVideo',
    bizParams: {
      ...params,
    },
  });
};
