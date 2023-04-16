import { blogReq } from '../request'

export const setArticleHistoryApi = (id: any, config: any) => {
  return blogReq.post(`/history/article/${id}`, {}, config)
}

export const setPostHistoryApi = (id: any, config: any) => {
  return blogReq.post(`/history/post/${id}`, {}, config)
}

export const setZipfileHistoryApi = (id: any, config: any) => {
  return blogReq.post(`/history/zipfile/${id}`, config)
}

export const getArticleHistoryApi = (config: any, start: any, end: any) => {
  return blogReq.get(`/history/article?start=${start}&end=${end}`, config)
}

export const getPostHistoryApi = (config: any, start: any, end: any) => {
  return blogReq.get(`/history/post?start=${start}&end=${end}`, config)
}

export const getZipfileHistoryApi = (config: any, start: any, end: any) => {
  return blogReq.get(`/history/zipfile?start=${start}&end=${end}`, config)
}

export const deleteArticleHistoryApi = (id: any, config: any) => {
  return blogReq.delete(`/history/article/${id}`, config)
}

export const deletePostHistoryApi = (id: any, config: any) => {
  return blogReq.delete(`/history/post/${id}`, config)
}

export const deleteZipfileHistoryApi = (id: any, config: any) => {
  return blogReq.delete(`/history/zipfile/${id}`, config)
}

export const deleteAllArticleHistoryApi = (config: any) => {
  return blogReq.delete('/history/article/all', config)
}

export const deleteAllPostHistoryApi = (config: any) => {
  return blogReq.delete('/history/post/all', config)
}

export const deleteAllZipfileHistoryApi = (config: any) => {
  return blogReq.delete('/history/zipfile/all', config)
}
