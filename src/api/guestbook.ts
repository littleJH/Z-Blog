import { blogReq } from '../request'

export const getSelfBoardApi = (config: any, pageNum = 1, pageSize = 20) => {
  return blogReq.get(
    `/guestbook?pageNum=${pageNum}&pageSize=${pageSize}`,
    config
  )
}

export const getUserBoardApi = (
  id: any,
  config: any,
  pageNum = 1,
  pageSize = 20
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

export const deleteMsgApi = (id: any, config: any) => {
  return blogReq.delete(`/guestbook/${id}`, config)
}
