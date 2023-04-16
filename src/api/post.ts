import { chitchatReq } from '../request'

export const createPost = (data: any, config: any) => {
  return chitchatReq.post('/post', data, config)
}

export const updatePost = (id: any, data: any, config: any) => {
  return chitchatReq.put(`/post/${id}`, data, config)
}

export const getPostApi = (id: any, config: any) => {
  return chitchatReq.get(`/post/${id}`, config)
}

export const deletePost = (id: any, config: any) => {
  return chitchatReq.delete(`/post/${id}`, config)
}

export const getPostList = (config: any, pageNum = 1, pageSize = 20) => {
  return chitchatReq.get(
    `/post/pagelist?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}
