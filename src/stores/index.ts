import { defineStore } from 'pinia'
import Avatar from '../assets/avatar_male.svg'
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
interface City {
  value: string
  label: string
  children?: Array<City>
}

export interface User {
  [key: string]: string | boolean | Array<City>
}

export interface UserInfo {
  label: string
  value: string | boolean | Array<City>
  color: string
}

export interface Article {
  id: string
  user_id: string
  author: string
  title: string
  content: string
  briefContent: string
  res_long: string
  res_short: string
  visible: number
  created_at: string
  updated_at: string
  labels: Array<string>
  likeFlag: boolean
  likeSvgColor: string
  likeNum: number
  favoriteFlag: boolean
  favSvgColor: string
  favNum: number
  // likeIcon?: string
  // favIcon?: string
}

export interface Post extends Article {}
export interface Thread extends Article {
  post_id: string
  post: Post
  authorIcon: string
}

export const useStore = defineStore('store1', {
  state: () => {
    return {
      userInfo: null as User | null,
      articleList: [] as Array<Article>,
      theme: localStorage.getItem('theme')
    }
  },
  actions: {},
  getters: {
    infoList: state => {
      const userInfo = state.userInfo as User
      const infoList: UserInfo[] = []
      Object.keys(userInfo).forEach(key => {
        if (userInfo[key] === '') {
          infoList.push({
            label: key,
            value: '待完善',
            color: '#DC2626'
          })
        } else {
          infoList.push({
            label: key,
            value: userInfo[key],
            color: '#D1D5DB'
          })
        }
      })
      return infoList
    },
    avatarUrl: state => {
      if (!state.userInfo) {
        return Avatar
      } else {
        return `http://icon.mgaronya.com/${state.userInfo.Icon}`
      }
    }
  }
})
