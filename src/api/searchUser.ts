import { blogReq } from '../request'

export const searchUserNameApi = (id: any, config: any) => {
  return blogReq.get(`/user/name/${id}`, config)
}

export const searchUserEmailApi = (id: any, config: any) => {
  return blogReq.get(`/user/email/${id}`, config)
}
