import { blogReq } from '../request'

export const getFriendListApi = (config: any) => {
  return blogReq.get('/friend/show', config)
}

export const getFriendAppliedApi = (config: any) => {
  return blogReq.get('/friend/show/applied', config)
}

export const sendApplyingApi = (id: any, config: any) => {
  return blogReq.get(`/friend/applying/${id}`, config)
}

export const acceptAppliedApi = (id: any, config: any) => {
  return blogReq.put(`/friend/applied/${id}`, config)
}

export const deleteFriendApi = (id: any, config: any) => {
  return blogReq.delete(`/friend/delete/${id}`, config)
}

export const getFriendArticlesApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/friend/articles?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getFriendPostsApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/friend/posts?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getFriendZipfilesApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/friend/zipfiles?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}
