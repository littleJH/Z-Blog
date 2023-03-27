import { blogReq } from '../request'

export const getSelfBoardApi = (
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/guestbook?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getUserBoardApi = (
  id: any,
  pageNum: number,
  pageSize: number,
  config: any
) => {
  return blogReq.get(
    `/guestbook/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const leaveMsgApi = (id: any, data: any, config: any) => {
  return blogReq.post(`/guestbook/${id}`, data, config)
}

export const updateMsgApi = (id: any, data: any, config: any) => {
  return blogReq.put(`/guestbook/${id}`, data, config)
}

export const deleteMsgApi = (id: any, data: any, config: any) => {
  return blogReq.delete(`/guestbook/${id}`, data, config)
}
