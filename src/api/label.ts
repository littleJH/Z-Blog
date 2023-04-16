import { blogReq } from '../request'

export const getArticleLabelApi = (id: any, config: any) => {
  return blogReq.get(`/article/label/show/${id}`, config)
}

export const createArticleLabelApi = (id: any, data: any, config: any) => {
  return blogReq.post(`/article/label/create/${id}`, data, config)
}

export const deleteArticleLabelApi = (id: any, label: any, config: any) => {
  return blogReq.delete(`/article/label/delete/${id}?label=${label}`, config)
}

export const getFileLabelApi = (id: any, config: any) => {
  return blogReq.get(`/file/label/show/${id}`, config)
}

export const createFileLabelApi = (id: any, data: any, config: any) => {
  return blogReq.post(`/file/label/create/${id}`, data, config)
}

export const deleteFileLabelApi = (id: any, label: any, config: any) => {
  return blogReq.delete(`/file/label/delete/${id}?label=${label}`, config)
}

export const getPostLabelApi = (id: any, config: any) => {
  return blogReq.get(`/post/label/show/${id}`, config)
}

export const createPostLabelApi = (id: any, data: any, config: any) => {
  return blogReq.post(`/post/label/create/${id}`, data, config)
}

export const deletePostLabelApi = (id: any, label: any, config: any) => {
  return blogReq.delete(`/post/label/delete/${id}?label=${label}`, config)
}

export const getUserLabelApi = (id: any, config: any) => {
  return blogReq.get(`/user/label/show/${id}`, config)
}

export const createUserLabelApi = (data: any, config: any) => {
  return blogReq.post(`/user/label/create`, data, config)
}

export const deleteSpecifiedUserLabelApi = (
  id: any,
  label: any,
  config: any
) => {
  return blogReq.delete(`/user/label/delete/${id}?label=${label}`, config)
}

export const deleteUserLabelApi = (label: any, config: any) => {
  return blogReq.delete(`/user/label/delete?label=${label}`, config)
}
