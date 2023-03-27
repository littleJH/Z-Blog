import { blogReq } from '../request'

export const searchArticleApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/search/article/${text}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchPostApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/search/post/${text}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchZipfileApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/search/zipfile/${text}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const searchArticleInterApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/article/inter/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchPostInterApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/post/inter/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchZipfileInterApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/zipfile/inter/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchArticleUnionApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/article/union/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchPostUnionApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/post/union/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}

export const searchZipfileUnionApi = (
  text: string,
  pageNum: number,
  pageSize: number,
  labels: string,
  config: any
) => {
  return blogReq.get(
    `/search/zipfile/union/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
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
    `/search/article/inter/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
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
    `/search/post/inter/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
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
    `/search/zipfile/inter/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
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
    `/search/article/union/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
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
    `/search/post/union/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
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
    `/search/zipfile/union/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    config
  )
}
