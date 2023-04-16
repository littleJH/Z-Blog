import { blogReq } from '../request'

export const getFriendListApi = (config: any) => {
  return blogReq.get('/friend/show', config)
}

export const getFriendAppliedApi = (config: any) => {
  return blogReq.get('/friend/show/applied', config)
}

export const getFriendApplyingApi = (config: any) => {
  return blogReq.get('/friend/show/applying', config)
}

export const sendApplyingApi = (id: any, config: any) => {
  return blogReq.put(`/friend/applying/${id}`, {}, config)
}

export const acceptAppliedApi = (id: any, config: any) => {
  return blogReq.put(`/friend/applied/${id}`, {}, config)
}

export const refuseAppliedApi = (id: any, config: any) => {
  return blogReq.put(`/friend/refused/${id}`, {}, config)
}

export const deleteFriendApi = (id: any, config: any) => {
  return blogReq.delete(`/friend/delete/${id}`, config)
}

export const getFriendArticlesApi = (
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/friend/articles?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getFriendPostsApi = (config: any, pageNum = 1, pageSize = 20) => {
  return blogReq.get(
    `/friend/posts?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getFriendZipfilesApi = (
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/friend/zipfiles?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}
