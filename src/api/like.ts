import { blogReq } from '../request'

export const getArticleLikedApi = (id: any, config: any) => {
  return blogReq.get(`/article/like/show/${id}`, config)
}

export const createArticleLikeApi = (id: any, config: any) => {
  return blogReq.put(`/article/like/create/${id}`, {}, config)
}

export const deleteArticleLikeApi = (id: any, config: any) => {
  return blogReq.delete(`/article/like/delete/${id}`, config)
}

export const getArticleLikeListApi = (id: any, config: any) => {
  return blogReq.get(`/article/like/list/${id}`, config)
}

export const getPostLikedApi = (id: any, config: any) => {
  return blogReq.get(`/post/like/show/${id}`, config)
}

export const createPostLikeApi = (id: any, config: any) => {
  return blogReq.put(`/post/like/create/${id}`, {}, config)
}

export const deletePostLikeApi = (id: any, config: any) => {
  return blogReq.delete(`/post/like/delete/${id}`, config)
}

export const getPostLikeListApi = (id: any, config: any) => {
  return blogReq.get(`/post/like/list/${id}`, config)
}

export const getThreadLikeApi = (id: any, config: any) => {
  return blogReq.get(`/thread/like/show/${id}`, config)
}

export const createThreadLikeApi = (id: any, config: any) => {
  return blogReq.put(`/thread/like/create/${id}`, {}, config)
}

export const deleteThreadLikeApi = (id: any, config: any) => {
  return blogReq.delete(`/thread/like/delete/${id}`, config)
}

export const getThreadLikeListApi = (id: any, config: any) => {
  return blogReq.get(`/thread/like/list/${id}`, config)
}

export const getFileLikedApi = (id: any, config: any) => {
  return blogReq.get(`/file/like/show/${id}`, config)
}

export const createFileLikeApi = (id: any, config: any) => {
  return blogReq.put(`/file/like/create/${id}`, {}, config)
}

export const deleteFileLikeApi = (id: any, config: any) => {
  return blogReq.delete(`/file/like/delete/${id}`, config)
}

export const getFileLikeListApi = (id: any, config: any) => {
  return blogReq.get(`/file/like/list/${id}`, config)
}

export const getCommentLikedApi = (id: any, config: any) => {
  return blogReq.get(`/comment/like/show/${id}`, config)
}

export const createCommentLikeApi = (id: any, config: any) => {
  return blogReq.put(`/comment/like/create/${id}`, {}, config)
}

export const deleteCommentLikeApi = (id: any, config: any) => {
  return blogReq.delete(`/comment/like/delete/${id}`, config)
}

export const getCommentLikeListApi = (id: any, config: any) => {
  return blogReq.get(`/comment/like/list/${id}`, config)
}
