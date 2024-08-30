import { request } from '@/utils/request-news'


export const queryNews = (data) => {
  return request('/api/client/article/list/open'+data, {
	})
}
