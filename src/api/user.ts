import { chitchatReq } from '../request'

export const registApi = (data: any) => {
  return chitchatReq.post('/regist', data)
}

export const verifyApi = (id: any) => {
  return chitchatReq.get(`/verify/${id}`)
}

export const securityApi = (data: any) => {
  return chitchatReq.put('/security', data)
}

export const updatepassApi = (data: any) => {
  return chitchatReq.put('/updatepass', data)
}

export const loginApi = (data: any) => {
  return chitchatReq.post('/login', data)
}

export const personalGetApi = (config: any) => {
  return chitchatReq.get('/personal', config)
}

export const getArticlesApi = (config: any, pageNum = 1, pageSize = 20) => {
  return chitchatReq.get(
    `personal/articles?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getPostsApi = (config: any, pageNum = 1, pageSize = 20) => {
  return chitchatReq.get(
    `/personal/posts?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getThreadsApi = (config: any, pageNum = 1, pageSize = 20) => {
  return chitchatReq.get(
    `/personal/threads?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getUsersApi = (data: any) => {
  return chitchatReq.post('/personal/users', data)
}

export const setPersonalApi = (data: any, config: any) => {
  return chitchatReq.put('/personal', data, config)
}

export const iconApi = (data: any, config: any) => {
  return chitchatReq.put('/personal/icon', data, config)
}

export const showBackgroundApi = (config: any) => {
  return chitchatReq.get('/background/show', config)
}

export const updateBackgroundApi = (id: any, config: any) => {
  return chitchatReq.put(`/background/update/${id}`, config)
}

export const createBackgroundApi = (data: any, config: any) => {
  return chitchatReq.put('/background/create', data, config)
}

export const userinfoApi = (id: any, config: any) => {
  return chitchatReq.get(`/personal/${id}`, config)
}

export const userArticlesApi = (
  id: any,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return chitchatReq.get(
    `/personal/articles/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const userPostsApi = (
  id: any,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return chitchatReq.get(
    `/personal/posts/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const userThreadsApi = (
  id: any,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return chitchatReq.get(
    `/personal/threads/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}
