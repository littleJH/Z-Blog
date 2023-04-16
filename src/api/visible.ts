import { blogReq } from '../request'

export const setArticleLevelApi = (id: any, level: any, config: any) => {
  return blogReq.put(`/visible/article/${id}?Level=${level}`, {}, config)
}

export const setPostLevelApi = (id: any, level: any, config: any) => {
  return blogReq.put(`/visible/post/${id}?Level=${level}`, {}, config)
}

export const setZipfileLevelApi = (id: any, level: any, config: any) => {
  return blogReq.put(`/visible/zipfile/${id}?Level=${level}`, {}, config)
}

export const getArticleLevelApi = (id: any, config: any) => {
  return blogReq.get(`/visible/article/${id}`, config)
}

export const getPostLevelApi = (id: any, config: any) => {
  return blogReq.get(`/visible/post/${id}`, config)
}

export const getZipfileLevelApi = (id: any, config: any) => {
  return blogReq.get(`/visible/zipfile/${id}`, config)
}

export const setPostVisibleApi = (id: any, level: any, config: any) => {
  return blogReq.put(`/visible/post/thread/${id}?Level=${level}`, {}, config)
}

export const setCommentZipfileVisibleApi = (
  id: any,
  level: any,
  config: any
) => {
  return blogReq.put(
    `/visible/zipfile/comment/${id}?Level=${level}`,
    {},
    config
  )
}

export const getPostVisibleApi = (id: any, config: any) => {
  return blogReq.get(`/visible/post/thread/${id}`, config)
}

export const getCommentZipfileVisibleApi = (id: any, config: any) => {
  return blogReq.get(`/visible/zipfile/comment/${id}`, config)
}

export const setDownloadLevelApi = (id: any, level: any, config: any) => {
  return blogReq.put(`/zipfile/download/${id}?Level=${level}`, {}, config)
}

export const getWhetherThreadPostApi = (id: any, config: any) => {
  return blogReq.get(`/post/thread/can/${id}`, config)
}

export const getWhetherZipfileDownloadApi = (id: any, config: any) => {
  return blogReq.get(`/zipfile/can/${id}`, config)
}

export const getWhetherZipfileCommentApi = (id: any, config: any) => {
  return blogReq.get(`/zipfile/comment/can/${id}`, config)
}
