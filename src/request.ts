import axios from 'axios'

export const chitchatUrl = "http://api_chitchat.mgaronya.com"
export const blogUrl = "http://api_blog.mgaronya.com"

export const chitchatReq = axios.create({
  baseURL: import.meta.env.DEV ? '/api_chitchat' : chitchatUrl,
})

export const blogReq = axios.create({
  baseURL: import.meta.env.DEV ? '/api_blog' : blogUrl,
})
