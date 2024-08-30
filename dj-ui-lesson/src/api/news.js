import { request } from '@/utils/request-news'


export const queryNews = (data) => {
  return request('api/article/listByCategorySlug'+data, {
	})
}

export const queryNewsByPage = (data) => {
  return request('api/article/paginate'+data, {
	})
}

export const queryNewsDetailById = (data) => {
  return request('api/article/detail'+data, {
	})
}

export const querySpecial = (data) => {
  return request('api/article/category/listByType'+data, {
	})
}
export const querySpecialDetail = (data) => {
  return request('api/article/category/detail'+data, {
	})
}
