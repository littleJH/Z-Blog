import axios from 'axios'

export const chitchatReq = axios.create({
  baseURL: 'http://api_chitchat.mgaronya.com'
})

export const blogReq = axios.create({
  baseURL: 'http://api_blog.mgaronya.com'
})
