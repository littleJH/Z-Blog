import { defineStore } from 'pinia'
import Avatar from '../assets/avatar.svg'
import { getCurrentInstance } from 'vue'

// export interface City {
//   value: string
//   label: string
//   children?: Array<City>
// }

export interface Message {
  id: string
  user_id: string
  author: string
  content: string
  create_at: string
  userInfo: UserInfo
}

export interface User {
  Name: string
  Email: string
  Telephone: string
  Blog: string
  QQ: string
  Sex: boolean
  Hobby: string
  Address: string
  Icon: string
  ID: string
  HotLevel?: number
  Powerpoints?: Array<Powerpoint>
  Labels?: Array<string>
}

export interface Powerpoint {
  id: string
  user_id: string
  label: string
  score: number
  created_at: string
}

export interface UserInfo {
  label: string
  value: string | boolean
  color?: string
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
  level: string | number
  likeFlag: boolean
  likeNum: number
  favoriteFlag: boolean
  favNum: number
  // likeIcon?: string
  // favIcon?: string
}

export interface History {
  id: string
  user_id: string
  article_id?: string
  post_id?: string
  zipfile_id?: string
  created_at: string
  userInfo: User
  article?: Article
  post?: Post
  zipfile?: Zipfile
}

export interface Post extends Article {
  threadTime: number
}
export interface Thread extends Article {
  post_id: string
  post: Post
  authorIcon: string
}

export interface Zipfile {
  [key: string]: string
}

export interface obj {
  Score: number
  Member: string
}

export interface article {
  articles: Array<obj>
  articleList: Array<Article>
}

export interface post {
  posts: Array<obj>
  postList: Array<Post>
}

export interface user {
  users: Array<obj>
  userList: Array<User>
}

export const useStore = defineStore('store1', {
  state: () => {
    return {
      userInfo: null as User | null,
      articleList: [] as Array<Article>,
      theme: localStorage.getItem('theme'),
      articleRecommend: null as article | null,
      postRecommend: null as post | null,
      userRecommend: null as user | null,
      showCanvas: false
    }
  },
  actions: {},
  getters: {
    avatarUrl: state => {
      if (!state.userInfo) {
        return Avatar
      } else {
        return `http://icon.mgaronya.com/${state.userInfo.Icon}`
      }
    }
  }
})
