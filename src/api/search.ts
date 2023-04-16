import { blogReq } from '../request'

export const searchArticleApi = (
  text: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/article/${text}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchPostApi = (
  text: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/post/${text}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchZipfileApi = (
  text: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/zipfile/${text}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchArticleInterApi = (
  text: string,
  labels: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/article/inter/$?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchPostInterApi = (
  text: string,
  labels: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/post/inter/$?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchZipfileInterApi = (
  text: string,
  labels: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/zipfile/inter/$?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchArticleUnionApi = (
  labels: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/article/union/$?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchPostUnionApi = (
  labels: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/post/union/$?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchZipfileUnionApi = (
  labels: string,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return blogReq.get(
    `/search/zipfile/union/$?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchUserArticleApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/search/article/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchUserPostApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/search/post/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchUserZipfileApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/search/zipfile/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchUserArticleInterApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/article/inter/$/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchUserPostInterApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/post/inter/$/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchUserZipfileInterApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/zipfile/inter/$/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchUserArticleUnionApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/article/union/$/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchUserPostUnionApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/post/union/$/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchUserZipfileUnionApi = (
  id: any,
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/zipfile/union/$/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}
