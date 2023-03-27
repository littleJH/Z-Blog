import { blogReq } from '../request'

export const getArticleVisitTimeApi = (id: any, config: any) => {
  return blogReq.get(`/hot/article/visit/${id}`, config)
}

export const getPostVisitTimeApi = (id: any, config: any) => {
  return blogReq.get(`/hot/post/visit/${id}`, config)
}

export const getZipfileVisitTimeApi = (id: any, config: any) => {
  return blogReq.get(`/hot/zipfile/visit/${id}`, config)
}

export const getZipfileDownloadTimeApi = (id: any, config: any) => {
  return blogReq.get(`/hot/zipfile/download/${id}`, config)
}

export const getZipfileUseTimeApi = (id: any, config: any) => {
  return blogReq.get(`/hot/zipfile/use/${id}`, config)
}

export const getZipfileCommentTimeApi = (id: any, config: any) => {
  return blogReq.get(`/hot/zipfile/comment/${id}`, config)
}

export const getThreadPostTimeApi = (id: any, config: any) => {
  return blogReq.get(`/hot/post/thread/${id}`, config)
}

export const getArticleHotRankingApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/article?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getPostHotRankingApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/post?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getZipfileHotRankingApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/zipfile?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getUserHotRankingJApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/user?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getUserHotLevelApi = (id: any, config: any) => {
  return blogReq.get(`/hot/user/level/${id}`, config)
}

export const getSelfHotLevelApi = (config: any) => {
  return blogReq.get('/hot/user/level', config)
}

export const getSelfPptApi = (config: any) => {
  return blogReq.get('/hot/user/powerpoint', config)
}

export const getUserPptApi = (id: any, config: any) => {
  return blogReq.get(`/hot/user/powerpoint/${id}`, config)
}

export const getArticleRecommentApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/article/recomment?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getPostRecommentApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/post/recomment?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getZipfileRecommentApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/zipfile/recomment?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getUserRecommentApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/hot/user/recomment?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}
