import { chitchatReq } from '../request'

export const createArticleApi = (data: any, config: any) => {
  return chitchatReq.post('/article', data, config)
}

export const getArticleApi = (id: any, config: any) => {
  return chitchatReq.get(`/article/${id}`, config)
}

export const renewArticleApi = (id: any, data: any, config: any) => {
  return chitchatReq.put(`/article/${id}`, data, config)
}

export const deleteArticleApi = (id: any, config: any) => {
  return chitchatReq.delete(`/delete/${id}`, config)
}

export const pagelistApi = (
  config: any,
  pageNum?: number,
  pageSize?: number
) => {
  return chitchatReq.get(`/article/pagelist?${pageNum}&${pageSize}`, config)
}
