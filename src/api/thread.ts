import { chitchatReq } from '../request'

export const createThread = (id: any, data: any, config: any) => {
  return chitchatReq.post(`/thread/${id}`, data, config)
}

export const updateThread = (id: any, data: any, config: any) => {
  return chitchatReq.put(`/thread/${id}`, data, config)
}

export const getThread = (id: any, config: any) => {
  return chitchatReq.get(`/thread/${id}`, config)
}

export const deleteThread = (id: any, config: any) => {
  return chitchatReq.delete(`/thread/${id}`, config)
}

export const getThreadListApi = (
  id: any,
  config: any,
  pageNum = 1,
  pageSize = 20
) => {
  return chitchatReq.get(
    `/thread/pagelist/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}
