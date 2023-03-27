import { blogReq } from '../request'

export const getArticleFavoritedApi = (id: any, config: any) => {
  return blogReq.get(`/article/favorite/show/${id}`, config)
}

export const createArticleFavApi = (id: any, config: any) => {
  return blogReq.put(`/article/favorite/create/${id}`, config)
}

export const deleteArticleFavApi = (id: any, config: any) => {
  return blogReq.delete(`/article/favorite/delete/${id}`, config)
}

export const getArticleFavListApi = (id: any, config: any) => {
  return blogReq.get(`/article/favorite/list/${id}`, config)
}

export const getAticleFavUserlistApi = (config: any) => {
  return blogReq.get(`/article/favorite/userlist`, config)
}

export const getPostFavoritedApi = (id: any, config: any) => {
  return blogReq.get(`/post/favorite/show/${id}`, config)
}

export const createPostFavApi = (id: any, config: any) => {
  return blogReq.put(`/article/favorite/create/${id}`, config)
}

export const deletePostFavApi = (id: any, config: any) => {
  return blogReq.delete(`/article/favorite/delete/${id}`, config)
}

export const getPostFavListApi = (id: any, config: any) => {
  return blogReq.get(`/post/favorite/list/${id}`, config)
}

export const getPostFavUserlistApi = (config: any) => {
  return blogReq.get('/post/favorite/userlist', config)
}

export const getThreadFavoritedApi = (id: any, config: any) => {
  return blogReq.get(`/thread/favorite/show/${id}`, config)
}

export const createThreadFavApi = (id: any, config: any) => {
  return blogReq.put(`/thread/favorite/create/${id}`, config)
}

export const deleteThreadFavApi = (id: any, config: any) => {
  return blogReq.delete(`/thread/favorite/delete/${id}`, config)
}

export const getThreadFavListApi = (id: any, config: any) => {
  return blogReq.get(`/thread/favorite/list/${id}`, config)
}

export const getThreadUserlistApi = (config: any) => {
  return blogReq.get('/thread/favorite/userlist', config)
}

export const getZipfileFavoritedApi = (id: any, config: any) => {
  return blogReq.get(`/zipfile/favorite/show/${id}`, config)
}

export const createZipfileFavApi = (id: any, config: any) => {
  return blogReq.put(`/zipfile/favorite/create/${id}`, config)
}

export const deleteZipfileFavApi = (id: any, config: any) => {
  return blogReq.delete(`/zipfile/favorite/delete/${id}`, config)
}

export const getZipfileFavListApi = (id: any, config: any) => {
  return blogReq.get(`/zipfile/favorite/list/${id}`, config)
}

export const getZipfileUserlistApi = (config: any) => {
  return blogReq.get('/zipfile/favorite/userlist', config)
}
